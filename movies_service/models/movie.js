import mongoose from 'mongoose'

const movieSchema = mongoose.Schema(
  {
    imdbId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    originalTitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    posterUrl: {
      type: String,
      trim: true,
    },
    genres: {
      type: [String],
      default: [],
      index: true,
    },
    releaseYear: {
      type: Number,
    },
    releaseDate: {
      type: String,
    },
    runtimeMinutes: {
      type: Number,
    },
    contentRating: {
      type: String,
      default: 'Not Rated',
    },
    countriesOfOrigin: {
      type: [String], // e.g. ["US"]
      default: [],
    },
    spokenLanguages: {
      type: [String], // e.g. ["en"]
      default: [],
    },
    averageRating: {
      type: Number, // Maps to "averageRating" (e.g., 8.1)
      default: 0,
    },
    numVotes: {
      type: Number, // Maps to "numVotes"
      default: 0,
    },
    isAdult: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

const Movie = mongoose.model('Movie', movieSchema)

export default Movie