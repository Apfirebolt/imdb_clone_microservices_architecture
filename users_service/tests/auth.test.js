import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import User from '../models/user.js';

let mongoServer;

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

afterEach(async () => {
  // Clear collections between tests for complete isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('POST /api/auth/register', () => {
  const newUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'Password123!',
    userType: 'member',
  };

  it('should register a new user successfully and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(newUser.email);
    expect(res.body.firstName).toBe(newUser.firstName);
    expect(res.body.lastName).toBe(newUser.lastName);
    expect(res.body.isAdmin).toBe(false);
  });

  it('should return 400 if user with the same email already exists', async () => {
    // Seed initial user
    await User.create(newUser);

    const res = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      password: 'Password123!',
      isAdmin: false,
    });
  });

  it('should authenticate user with valid credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe('alice@example.com');
    expect(res.body.firstName).toBe('Alice');
  });

  it('should return 401 with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'WrongPassword!',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });
});

describe('GET /api/auth/profile (Protected Route)', () => {
  let authToken;
  let userRecord;

  beforeEach(async () => {
    userRecord = await User.create({
      firstName: 'Bob',
      lastName: 'Builder',
      email: 'bob@example.com',
      password: 'Password123!',
      isAdmin: true,
      userType: 'staff',
    });

    // Obtain token via login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'bob@example.com',
        password: 'Password123!',
      });

    authToken = loginRes.body.token;
  });

  it('should return 401 when no token is provided in headers', async () => {
    const res = await request(app).get('/api/auth/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, no token');
  });

  it('should return 401 when an invalid/malformed token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Not authorized, token failed');
  });

  it('should return user profile when valid token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(userRecord._id.toString());
    expect(res.body.email).toBe('bob@example.com');
    expect(res.body.firstName).toBe('Bob');
    expect(res.body.isAdmin).toBe(true);
    expect(res.body.userType).toBe('staff');
  });
});