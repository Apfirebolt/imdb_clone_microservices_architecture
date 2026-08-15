import express from 'express'
import {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
} from '../controllers/playlistController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8a123bc456def78901234"
 *         name:
 *           type: string
 *           example: "Favorite Sci-Fi Classics"
 *         description:
 *           type: string
 *           example: "A curated list of essential sci-fi films."
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "6a8088159a15ea6ca74fca32"
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             isAdmin:
 *               type: boolean
 *               example: false
 *             userType:
 *               type: string
 *               example: "member"
 *         movies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "64f8a999bc456def78905678"
 *               title:
 *                 type: string
 *                 example: "Spider-Man: Brand New Day"
 *               posterUrl:
 *                 type: string
 *                 example: "https://m.media-amazon.com/images/M/example.jpg"
 *               releaseYear:
 *                 type: integer
 *                 example: 2026
 *               averageRating:
 *                 type: number
 *                 example: 8.1
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-15T14:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-15T14:30:00.000Z"
 *     PlaylistInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Weekend Watchlist"
 *         description:
 *           type: string
 *           example: "Movies to binge this weekend"
 *         movies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64f8a999bc456def78905678"]
 *     MovieAddInput:
 *       type: object
 *       required:
 *         - movieId
 *       properties:
 *         movieId:
 *           type: string
 *           description: MongoDB _id of the Movie document
 *           example: "64f8a999bc456def78905678"
 */

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: User playlist management and movie curation
 */

/**
 * @swagger
 * /api/playlists:
 *   get:
 *     summary: Get all playlists for the authenticated user
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: List of user playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Playlist'
 *                 total:
 *                   type: integer
 *                   example: 4
 *                 itemsPerPage:
 *                   type: integer
 *                   example: 20
 *                 startPage:
 *                   type: integer
 *                   example: 1
 *                 lastPage:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Unauthorized - token missing or invalid
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistInput'
 *     responses:
 *       201:
 *         description: Playlist successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Missing required fields or invalid data
 *       401:
 *         description: Unauthorized
 */
router
  .route('/')
  .get(protect, getUserPlaylists)
  .post(protect, createPlaylist)

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Get a single playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist MongoDB ID
 *     responses:
 *       200:
 *         description: Detailed playlist data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       403:
 *         description: Forbidden - Not the playlist owner or admin
 *       404:
 *         description: Playlist not found
 *   patch:
 *     summary: Update playlist details (name/description)
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Playlist Name"
 *               description:
 *                 type: string
 *                 example: "Updated description text"
 *     responses:
 *       200:
 *         description: Playlist successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       403:
 *         description: Forbidden - Not authorized to modify
 *       404:
 *         description: Playlist not found
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist MongoDB ID
 *     responses:
 *       200:
 *         description: Playlist successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Playlist deleted successfully"
 *       403:
 *         description: Forbidden - Not authorized to delete
 *       404:
 *         description: Playlist not found
 */
router
  .route('/:id')
  .get(protect, getPlaylistById)
  .patch(protect, updatePlaylist)
  .delete(protect, deletePlaylist)

/**
 * @swagger
 * /api/playlists/{id}/movies:
 *   post:
 *     summary: Add a movie to a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist MongoDB ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieAddInput'
 *     responses:
 *       200:
 *         description: Movie added to playlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie added to playlist"
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Movie already in playlist or missing movieId
 *       403:
 *         description: Forbidden - Not authorized
 *       404:
 *         description: Playlist or Movie not found
 */
router
  .route('/:id/movies')
  .post(protect, addMovieToPlaylist)

/**
 * @swagger
 * /api/playlists/{id}/movies/{movieId}:
 *   delete:
 *     summary: Remove a movie from a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist MongoDB ID
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie MongoDB ID to remove
 *     responses:
 *       200:
 *         description: Movie removed from playlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Movie removed from playlist"
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       403:
 *         description: Forbidden - Not authorized
 *       404:
 *         description: Playlist not found
 */
router
  .route('/:id/movies/:movieId')
  .delete(protect, removeMovieFromPlaylist)

export default router