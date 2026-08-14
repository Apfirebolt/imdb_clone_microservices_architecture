<template>
  <v-container fluid class="fill-height bg-info d-flex align-center justify-center pa-4">
    <v-card class="elevation-4 rounded-xl pa-4 pa-sm-6 w-100 max-width-container" color="surface">
      
      <!-- Page Header -->
      <v-card-item class="text-center pt-8 pb-2">
        <v-card-title class="text-h4 font-weight-extrabold text-primary mb-2">
          Movies
        </v-card-title>
        <v-card-subtitle class="text-body-1 text-medium-emphasis text-wrap mx-auto max-width-text">
          Welcome to the Movies section! Explore a wide variety of films from around the world.
          Discover top-rated blockbusters, popular hits, and critically acclaimed cinema.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="pt-4">
        <!-- Navigation Tabs -->
        <v-tabs
          v-model="selectedTab"
          color="primary"
          align-tabs="start"
          show-arrows
          density="comfortable"
          class="border-b mb-6"
        >
          <v-tab value="topRated" class="text-capitalize font-weight-medium">Top Rated</v-tab>
          <v-tab value="upcomingMovies" class="text-capitalize font-weight-medium">Upcoming Movies</v-tab>
          <v-tab value="lowestRated" class="text-capitalize font-weight-medium">Lowest Rated</v-tab>
          <v-tab value="top250" class="text-capitalize font-weight-medium">Top 250</v-tab>
          <v-tab value="mostPopular" class="text-capitalize font-weight-medium">Most Popular</v-tab>
          <v-tab value="searchMovie" class="text-capitalize font-weight-medium">Search Movie</v-tab>
          <v-tab value="topBoxOffice" class="text-capitalize font-weight-medium">Top Box Office</v-tab>
        </v-tabs>

        <!-- Tab Content Windows -->
        <v-window v-model="selectedTab">

          <!-- 1. Top Rated Movies -->
          <v-window-item value="topRated">
            <v-row>
              <v-col
                v-for="movie in topRatedMovies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="warning" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 2. Lowest Rated Movies -->
          <v-window-item value="lowestRated">
            <v-row>
              <v-col
                v-for="movie in lowestRatedMovies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="error" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 3. Top 250 Movies -->
          <v-window-item value="top250">
            <v-row>
              <v-col
                v-for="movie in top250Movies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="warning" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 4. Most Popular Movies -->
          <v-window-item value="mostPopular">
            <v-row>
              <v-col
                v-for="movie in mostPopularMovies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="warning" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 5. Top Box Office -->
          <v-window-item value="topBoxOffice">
            <v-row>
              <v-col
                v-for="movie in topBoxOfficeMovies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="success" />
              </v-col>
            </v-row>
          </v-window-item>

          <!-- 6. Search Movies -->
          <v-window-item value="searchMovie">
            <div class="mb-6">
              <v-row no-gutters class="ga-2">
                <v-col>
                  <v-text-field
                    v-model="searchQuery"
                    placeholder="Search for movies..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    rounded="lg"
                    @keyup.enter="searchMovies"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    variant="flat"
                    rounded="lg"
                    size="large"
                    class="text-capitalize px-6"
                    :disabled="!searchQuery.trim() || loading"
                    :loading="loading"
                    @click="searchMovies"
                  >
                    Search
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Results Grid -->
            <v-row v-if="movieResults && movieResults.length > 0">
              <v-col
                v-for="movie in movieResults"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="info" />
              </v-col>
            </v-row>

            <!-- Empty Search State -->
            <div
              v-else-if="searchQuery && !loading"
              class="text-center py-12 text-medium-emphasis"
            >
              <v-icon icon="mdi-movie-search-outline" size="48" class="mb-2" />
              <p class="text-body-1">No movies found for "{{ searchQuery }}"</p>
            </div>
          </v-window-item>

          <!-- 7. Upcoming Movies -->
          <v-window-item value="upcomingMovies">
            <div class="mb-6">
              <v-row no-gutters class="ga-2">
                <v-col>
                  <v-text-field
                    v-model="countryCode"
                    placeholder="Enter country code (e.g., US, UK, IN)..."
                    prepend-inner-icon="mdi-earth"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    rounded="lg"
                    @keyup.enter="getUpcomingMovies"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    variant="flat"
                    rounded="lg"
                    size="large"
                    class="text-capitalize px-6"
                    :disabled="!countryCode.trim() || loading"
                    :loading="loading"
                    @click="getUpcomingMovies"
                  >
                    Get Movies
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Upcoming Results Grid -->
            <v-row v-if="upComingMovies && upComingMovies.length > 0">
              <v-col
                v-for="movie in upComingMovies"
                :key="movie.id"
                cols="12"
                sm="6"
                lg="4"
              >
                <MovieCard :movie="movie" rating-color="purple" />
              </v-col>
            </v-row>

            <!-- Empty Upcoming State -->
            <div
              v-else-if="countryCode && !loading"
              class="text-center py-12 text-medium-emphasis"
            >
              <v-icon icon="mdi-movie-remove-outline" size="48" class="mb-2" />
              <p class="text-body-1">No upcoming movies found for country code "{{ countryCode }}"</p>
            </div>
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>

    <Loader v-if="loading" />
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useMovieStore } from "../stores/movies";
import httpClient from "../plugins/interceptor";
import axios from "axios";
import Loader from "../components/Loader.vue";
import MovieCard from "../components/MovieCard.vue";

const movieStore = useMovieStore();
const searchQuery = ref("");
const countryCode = ref("");
const movieResults = computed(() => movieStore.getSearchMovies);
const topRatedMovies = computed(() => movieStore.getTopRatedMovies);
const lowestRatedMovies = computed(() => movieStore.getLowestRatedMovies);
const top250Movies = computed(() => movieStore.getTop250Movies);
const mostPopularMovies = computed(() => movieStore.getMostPopularMovies);
const upComingMovies = computed(() => movieStore.getUpcomingMovies);    
const topRatedEnglishMovies = computed(
  () => movieStore.getTopRatedEnglishMovies
);
const topBoxOfficeMovies = computed(() => movieStore.getTopBoxOfficeMovies);
const loading = computed(() => movieStore.isLoading);
const selectedTab = ref("topRated");

const changeTab = (tab) => {
  selectedTab.value = tab;
};

const searchMovies = async () => {
  await movieStore.getSearchMoviesAction(searchQuery.value);
};

const getUpcomingMovies = async () => {
  if (countryCode.value.trim()) {
    await movieStore.getUpcomingMoviesByCountryAction(countryCode.value);
  }
};

onMounted(() => {
  movieStore.getTopRatedAction();
  movieStore.getLowestRatedAction();
  movieStore.getTop250Action();
  movieStore.getMostPopularAction();
  movieStore.getTopBoxOfficeMoviesAction();
  movieStore.getUpcomingMoviesByCountryAction('US')
});
</script>

<style scoped>
.max-width-container {
  max-width: 1280px;
}

.max-width-text {
  max-width: 720px;
}

.object-cover {
  object-fit: cover;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>