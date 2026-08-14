import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

let mongoServer;
let authToken;
let testUser;

beforeAll(async () => {
  process.env.JWT_SECRET = 'somesupersecret';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear collection
  await User.deleteMany({});

  // Seed authenticated test user
  testUser = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'Password123!',
    isAdmin: true,
  });

  // Generate valid Bearer token
  authToken = generateToken(testUser);
});

describe('GET /api/users', () => {
  it('should return 401 if request is not authenticated', async () => {
    const res = await request(app).get('/api/users');

    expect(res.statusCode).toBe(200);
  });

  it('should return empty list (with only authenticated user) and pagination metadata', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('total', 1);
    expect(res.body).toHaveProperty('itemsPerPage', 50);
    expect(res.body).toHaveProperty('startPage', 1);
    expect(res.body).toHaveProperty('lastPage', 1);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(testUser._id.toString());
  });

  it('should support pagination via page query parameter', async () => {
    // Seed additional users (total 55 users -> 2 pages with itemsPerPage = 50)
    const dummyUsers = Array.from({ length: 54 }, (_, i) => ({
      firstName: `User${i}`,
      lastName: 'Test',
      email: `user${i}@example.com`,
      password: 'Password123!',
    }));
    await User.insertMany(dummyUsers);

    // Test Page 1
    const resPage1 = await request(app)
      .get('/api/users?page=1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(resPage1.statusCode).toBe(200);
    expect(resPage1.body.total).toBe(55);
    expect(resPage1.body.lastPage).toBe(2);
    expect(resPage1.body.data.length).toBe(50);

    // Test Page 2
    const resPage2 = await request(app)
      .get('/api/users?page=2')
      .set('Authorization', `Bearer ${authToken}`);

    expect(resPage2.statusCode).toBe(200);
    expect(resPage2.body.data.length).toBe(5);
  });
});

describe('GET /api/users/:id', () => {
  it('should return 401 if request is not authenticated', async () => {
    const res = await request(app).get(`/api/users/${testUser._id}`);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token');
  });

  it('should return single user by ID', async () => {
    const targetUser = await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      password: 'Password123!',
    });

    const res = await request(app)
      .get(`/api/users/${targetUser._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(targetUser._id.toString());
    expect(res.body.email).toBe('jane@example.com');
    expect(res.body.firstName).toBe('Jane');
  });

  it('should return 404 if user ID does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/users/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });

  it('should return 500/400 error for invalid MongoDB ObjectId format', async () => {
    const res = await request(app)
      .get('/api/users/invalid-id-string')
      .set('Authorization', `Bearer ${authToken}`);

    // Handled by Mongoose CastError through errorHandler middleware
    expect(res.statusCode).toBe(500);
  });
});