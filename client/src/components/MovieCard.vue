<template>
  <v-card
    class="movie-card mx-auto rounded-xl elevation-2 h-100 d-flex flex-column"
    hover
    max-width="400"
  >
    <!-- Image/Poster Area with Badges -->
    <v-img
      :src="movie.primaryImage || (movie.thumbnails && movie.thumbnails[2]?.url) || (movie.thumbnails && movie.thumbnails[1]?.url) || 'https://via.placeholder.com/380x562?text=No+Image+Available'"
      height="300"
      cover
      class="align-end text-white position-relative"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>

      <!-- Grade/Content Rating & Metascore Badges -->
      <div class="position-absolute top-3 left-3 d-flex flex-column ga-2">
        <v-chip
          v-if="movie.contentRating"
          color="black"
          variant="flat"
          size="small"
          class="font-weight-black elevation-2"
        >
          {{ movie.contentRating }}
        </v-chip>
        <v-chip
          v-if="movie.metascore"
          :color="getMetascoreColor(movie.metascore)"
          variant="flat"
          size="small"
          class="font-weight-black text-white elevation-2"
        >
          MS: {{ movie.metascore }}
        </v-chip>
      </div>

      <!-- Release Year Chip -->
      <div class="position-absolute top-3 right-3">
        <v-chip
          color="rgba(0,0,0,0.7)"
          size="small"
          class="text-white font-weight-bold"
        >
          {{ movie.startYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A') }}
        </v-chip>
      </div>

      <!-- Linear Gradient Overlay for title visibility if needed -->
      <div class="gradient-overlay fill-height w-100 position-absolute" />
    </v-img>

    <!-- Card Headers and Rating -->
    <v-card-item class="pt-4 pb-1">
      <div class="d-flex justify-space-between align-start ga-2 mb-1">
        <v-card-title class="text-h6 font-weight-bold line-clamp-1 py-0 my-0 text-wrap fill-width">
          {{ movie.primaryTitle || movie.originalTitle }}
        </v-card-title>
      </div>

      <div class="d-flex align-center ga-2 mt-1 flex-wrap">
        <!-- Average Rating -->
        <div class="d-flex align-center bg-amber-lighten-5 px-3 py-1 rounded-pill elevation-1" style="border: 1px solid #FFE082;">
          <v-icon icon="mdi-star" color="amber-darken-3" size="18" class="me-1" />
          <span class="text-subtitle-2 font-weight-bold text-amber-darken-4">
            {{ movie.averageRating?.toFixed(1) || 'N/A' }}
          </span>
          <span v-if="movie.numVotes" class="text-caption text-medium-emphasis ms-1">
            ({{ formatVotes(movie.numVotes) }})
          </span>
        </div>

        <!-- Runtime -->
        <div v-if="movie.runtimeMinutes" class="d-flex align-center text-grey-darken-1 text-caption font-weight-medium">
          <v-icon icon="mdi-clock-outline" size="16" class="me-1" />
          {{ formatRuntime(movie.runtimeMinutes) }}
        </div>
      </div>
    </v-card-item>

    <!-- Genre / Tags Section -->
    <v-card-text class="pb-1 pt-2 d-flex flex-wrap ga-1" style="min-height: 44px">
      <v-chip
        v-for="genre in getGenres"
        :key="genre"
        size="x-small"
        color="primary-lighten-4"
        variant="tonal"
        class="text-capitalize font-weight-semibold"
      >
        {{ genre }}
      </v-chip>
    </v-card-text>

    <!-- Plot Description -->
    <v-card-text class="text-body-2 text-medium-emphasis pb-1 pt-1 flex-grow-1">
      <p class="line-clamp-3">
        {{ movie.description || 'No plot description available for this film.' }}
      </p>
    </v-card-text>

    <!-- Budget & Gross Box Office info -->
    <v-card-text v-if="movie.budget || movie.grossWorldwide" class="pt-1 pb-3 text-caption border-t mt-2">
      <div class="d-flex justify-space-between align-center text-grey-darken-2">
        <span v-if="movie.budget" class="d-flex align-center">
          <v-icon icon="mdi-cash" size="14" class="me-1 color-primary" />
          Budget: <strong>{{ formatCurrency(movie.budget) }}</strong>
        </span>
        <span v-if="movie.grossWorldwide" class="d-flex align-center">
          <v-icon icon="mdi-earth" size="14" class="me-1 color-success" />
          Gross: <strong>{{ formatCurrency(movie.grossWorldwide) }}</strong>
        </span>
      </div>
    </v-card-text>

    <!-- Footer Action Buttons -->
    <v-divider class="mx-4" />

    <v-card-actions class="pa-4 pt-3 justify-space-between">
      <!-- IMDb Link Button -->
      <v-btn
        :href="movie.url || `https://www.imdb.com/title/${movie.id}/`"
        target="_blank"
        rel="noopener"
        variant="outlined"
        color="amber-darken-4"
        size="small"
        rounded="lg"
        prepend-icon="mdi-movie-open"
        class="text-capitalize font-weight-bold"
      >
        IMDb
      </v-btn>

      <!-- Watch Trailer Button -->
      <v-btn
        v-if="movie.trailer"
        :href="movie.trailer"
        target="_blank"
        rel="noopener"
        color="red-darken-2"
        variant="flat"
        size="small"
        rounded="lg"
        prepend-icon="mdi-play"
        class="text-capitalize font-weight-bold"
      >
        Watch Trailer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  ratingColor: {
    type: String,
    default: 'warning',
  },
})

// Extract or select logical genres list
const getGenres = computed(() => {
  if (props.movie.genres && props.movie.genres.length > 0) {
    return props.movie.genres
  }
  if (props.movie.interests && props.movie.interests.length > 0) {
    // Return first 3 interests as genres fallback
    return props.movie.interests.slice(0, 3)
  }
  return []
})

// Support currency formatting
const formatCurrency = (val) => {
  if (!val) return ''
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val)
}

// Convert runtime minutes to readable text
const formatRuntime = (mins) => {
  if (!mins) return ''
  const hrs = Math.floor(mins / 60)
  const m = mins % 60
  return hrs > 0 ? `${hrs}h ${m}m` : `${mins} min`
}

// Compact count formatting for votes
const formatVotes = (num) => {
  if (!num) return ''
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num
}

// Metascore background colors
const getMetascoreColor = (score) => {
  if (score >= 61) return 'success'
  if (score >= 40) return 'warning'
  return 'error'
}
</script>

<style scoped>
.movie-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  overflow: hidden;
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 4.5em; /* fixed height constraints for consistency */
}

.top-3 {
  top: 12px;
}

.left-3 {
  left: 12px;
}

.right-3 {
  right: 12px;
}

.gradient-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.85) 100%);
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.fill-width {
  width: 100%;
}
</style>
