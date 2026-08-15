import asyncHandler from 'express-async-handler'
import Playlist from '../models/playlistModel.js'
import Movie from '../models/movieModel.js'
import { sendJson } from '../utils/kafkaConnect.js'

// @desc    Get user playlists (with pagination)
// @route   GET /api/playlists
// @access  Private
const getUserPlaylists = asyncHandler(async (req, res) => {
  const itemsPerPage = Number(req.query.limit) || 20
  const startPage = Number(req.query.page) || 1

  const count = await Playlist.countDocuments({ user: req.user._id })

  const playlists = await Playlist.find({ user: req.user._id })
    .populate('user', 'email isAdmin userType')
    .populate('movies', 'title posterUrl releaseYear averageRating genres')
    .skip(itemsPerPage * (startPage - 1))
    .limit(itemsPerPage)
    .sort({ createdAt: -1 })
    .exec()

  res.status(200).json({
    success: true,
    data: playlists,
    total: count,
    itemsPerPage,
    startPage,
    lastPage: Math.ceil(count / itemsPerPage),
  })
})

// @desc    Get single playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
const getPlaylistById = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)
    .populate('user', 'email isAdmin userType')
    .populate('movies')

  if (!playlist) {
    res.status(404)
    throw new Error('Playlist not found')
  }

  // Authorization check: Only playlist owner or admin can view
  if (
    playlist.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403)
    throw new Error('Not authorized to access this playlist')
  }

  res.status(200).json({
    success: true,
    data: playlist,
  })
})

// @desc    Create a new playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, movies } = req.body

  if (!name) {
    res.status(400)
    throw new Error('Playlist name is required')
  }

  const playlist = await Playlist.create({
    name,
    description: description || '',
    user: req.user._id,
    movies: movies || [],
  })

  if (playlist) {
    // Publish playlist creation event to Kafka
    const kafkaPayload = {
      playlistId: playlist._id.toString(),
      userId: req.user._id.toString(),
      name: playlist.name,
      totalMovies: playlist.movies.length,
      createdAt: playlist.createdAt,
    }

    try {
      await sendJson('playlist-events', playlist._id.toString(), kafkaPayload)
    } catch (kafkaError) {
      console.error('Kafka send error (playlist-events):', kafkaError.message)
    }

    res.status(201).json({
      success: true,
      data: playlist,
    })
  } else {
    res.status(400)
    throw new Error('Invalid playlist data')
  }
})

// @desc    Update playlist details (name/description)
// @route   PATCH /api/playlists/:id
// @access  Private
const updatePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    res.status(404)
    throw new Error('Playlist not found')
  }

  // Authorization check
  if (
    playlist.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403)
    throw new Error('Only playlist owner or admin can edit this playlist')
  }

  playlist.name = req.body.name || playlist.name
  playlist.description =
    req.body.description !== undefined ? req.body.description : playlist.description

  const updatedPlaylist = await playlist.save()

  res.status(200).json({
    success: true,
    data: updatedPlaylist,
  })
})

// @desc    Delete a playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    res.status(404)
    throw new Error('Playlist not found')
  }

  // Authorization check
  if (
    playlist.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403)
    throw new Error('Only playlist owner or admin can delete this playlist')
  }

  await Playlist.deleteOne({ _id: req.params.id })

  res.status(200).json({
    success: true,
    message: 'Playlist deleted successfully',
  })
})

// @desc    Add a movie to a playlist
// @route   POST /api/playlists/:id/movies
// @access  Private
const addMovieToPlaylist = asyncHandler(async (req, res) => {
  const { movieId } = req.body

  if (!movieId) {
    res.status(400)
    throw new Error('movieId is required')
  }

  // Verify movie exists
  const movie = await Movie.findById(movieId)
  if (!movie) {
    res.status(404)
    throw new Error('Movie not found')
  }

  const playlist = await Playlist.findById(req.params.id)

  if (!playlist) {
    res.status(404)
    throw new Error('Playlist not found')
  }

  if (
    playlist.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403)
    throw new Error('Only playlist owner or admin can modify this playlist')
  }

  // Prevent duplicate additions
  const isMovieAlreadyAdded = playlist.movies.some(
    (id) => id.toString() === movieId.toString()
  )

  if (isMovieAlreadyAdded) {
    res.status(400)
    throw new Error('Movie is already in this playlist')
  }

  playlist.movies.push(movieId)
  await playlist.save()

  res.status(200).json({
    success: true,
    message: 'Movie added to playlist',
    data: playlist,
  })
})

// @desc    Remove a movie from a playlist
// @route   DELETE /api/playlists/:id/movies/:movieId
// @access  Private
const removeMovieFromPlaylist = asyncHandler(async (req, res) => {
  const { id, movieId } = req.params

  const playlist = await Playlist.findById(id)

  if (!playlist) {
    res.status(404)
    throw new Error('Playlist not found')
  }

  if (
    playlist.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403)
    throw new Error('Only playlist owner or admin can modify this playlist')
  }

  playlist.movies = playlist.movies.filter(
    (mId) => mId.toString() !== movieId.toString()
  )

  await playlist.save()

  res.status(200).json({
    success: true,
    message: 'Movie removed from playlist',
    data: playlist,
  })
})

export {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addMovieToPlaylist,
  removeMovieFromPlaylist,
}