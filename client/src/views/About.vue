<!-- views/About.vue -->
<template>
  <v-container fluid class="pa-0">
    
    <!-- Hero Section -->
    <section class="hero-section py-16 px-4 px-sm-8 text-center position-relative">
      <v-container class="max-width-lg">
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          rounded="lg"
          class="font-weight-bold text-uppercase tracking-wider mb-4 px-3"
        >
          About CineWave
        </v-chip>

        <h1 class="text-h3 text-sm-h2 font-weight-extrabold text-white tracking-tight mb-4">
          The Next-Gen Cinema & Entertainment Hub
        </h1>

        <p class="text-body-1 text-sm-h6 text-grey-lighten-1 max-width-text mx-auto line-height-relaxed mb-8 font-weight-regular">
          CineWave is a modern, community-driven IMDb alternative built to help movie lovers discover critically acclaimed films, track trending TV shows, explore box office records, and share ratings seamlessly.
        </p>

        <div class="d-flex justify-center align-center ga-3 flex-wrap">
          <v-btn
            to="/movies"
            color="primary"
            size="large"
            rounded="lg"
            variant="flat"
            class="text-capitalize font-weight-bold px-6"
            prepend-icon="mdi-filmstrip"
          >
            Explore Movies
          </v-btn>

          <v-btn
            to="/register"
            size="large"
            rounded="lg"
            variant="outlined"
            color="grey-lighten-2"
            class="text-capitalize font-weight-bold px-6 border"
            prepend-icon="mdi-account-plus-outline"
          >
            Join the Community
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- Key Features Grid -->
    <section class="py-16 px-4 px-sm-8 bg-surface">
      <v-container class="max-width-xl">
        <div class="text-center mb-12">
          <h2 class="text-h4 font-weight-bold text-high-emphasis tracking-tight mb-2">
            Why Movie Buffs Choose CineWave
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            Everything you need to stay on top of the world of entertainment.
          </p>
        </div>

        <v-row>
          <v-col
            v-for="feature in features"
            :key="feature.title"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="elevation-2 rounded-xl pa-6 h-100 border transition-swing"
              variant="elevated"
            >
              <v-avatar
                :color="feature.color"
                size="48"
                variant="tonal"
                class="rounded-lg mb-4"
              >
                <v-icon :icon="feature.icon" size="24" :color="feature.color" />
              </v-avatar>

              <h3 class="text-h6 font-weight-bold text-high-emphasis mb-2">
                {{ feature.title }}
              </h3>

              <p class="text-body-2 text-medium-emphasis line-height-relaxed">
                {{ feature.description }}
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Tech Stack / Architecture Section -->
    <section class="py-16 px-4 px-sm-8 bg-grey-lighten-4">
      <v-container class="max-width-lg">
        <div class="text-center mb-10">
          <h2 class="text-h4 font-weight-bold text-slate-800 tracking-tight mb-2">
            Under the Hood
          </h2>
          <p class="text-body-2 text-grey-darken-1">
            Engineered with a modern, reactive full-stack architecture for blazing fast discovery.
          </p>
        </div>

        <v-row justify="center" class="ga-3 flex-wrap">
          <v-col
            v-for="tech in techStack"
            :key="tech.name"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="elevation-1 rounded-xl pa-4 text-center border h-100 bg-white">
              <v-icon :icon="tech.icon" size="36" color="primary" class="mb-2" />
              <div class="text-subtitle-1 font-weight-bold text-slate-800">{{ tech.name }}</div>
              <div class="text-caption text-grey-darken-1">{{ tech.role }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Banner -->
    <section class="py-16 px-4 text-center bg-grey-darken-4 text-white border-t">
      <v-container class="max-width-md">
        <v-icon icon="mdi-movie-open-star" size="48" color="primary" class="mb-3" />
        <h2 class="text-h4 font-weight-bold mb-3">
          Ready to discover your next favorite movie?
        </h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">
          Create a free account to track your watchlist and contribute ratings.
        </p>
        <v-btn
          to="/register"
          color="primary"
          size="large"
          rounded="lg"
          variant="flat"
          class="text-capitalize font-weight-bold px-8"
        >
          Get Started for Free
        </v-btn>
      </v-container>
    </section>

  </v-container>
</template>

<script setup>
const features = [
  {
    title: 'Top 250 & Box Office Data',
    description: 'Explore historical rankings, worldwide box office gross numbers, and curated all-time top 250 masterpieces.',
    icon: 'mdi-trophy-outline',
    color: 'warning',
  },
  {
    title: 'Instant Search & Discovery',
    description: 'Fast, fuzzy query search filters across titles, release years, age certifications, and localized regional releases.',
    icon: 'mdi-magnify-scan',
    color: 'primary',
  },
  {
    title: 'Ratings & Community Reviews',
    description: 'Compare critical ratings side-by-side with verified audience scores and community sentiment breakdown.',
    icon: 'mdi-star-half-full',
    color: 'amber-darken-2',
  },
  {
    title: 'Upcoming Releases by Country',
    description: 'Filter regional upcoming theatrical debuts and streaming premieres by country codes worldwide.',
    icon: 'mdi-earth',
    color: 'info',
  },
  {
    title: 'Personal Watchlists & Profiles',
    description: 'Keep track of films you’ve watched, bookmark titles for later, and organize your favorite directors.',
    icon: 'mdi-bookmark-multiple-outline',
    color: 'purple',
  },
  {
    title: 'Responsive & Fast UI',
    description: 'Designed with Material Design principles for fluid browsing across mobile, tablet, and widescreen setups.',
    icon: 'mdi-devices',
    color: 'success',
  },
]

const techStack = [
  { name: 'Vue 3 & Vuetify 3', role: 'Reactive Frontend & Material UI', icon: 'mdi-vuejs' },
  { name: 'Node & Express.js', role: 'RESTful API & Middlewares', icon: 'mdi-nodejs' },
  { name: 'MongoDB & Mongoose', role: 'Document Database & Schemas', icon: 'mdi-database-outline' },
  { name: 'Swagger / OpenAPI', role: 'Interactive API Documentation', icon: 'mdi-api' },
]
</script>

<style scoped>
.hero-section {
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 1));
}

.max-width-xl {
  max-width: 1280px;
}

.max-width-lg {
  max-width: 960px;
}

.max-width-md {
  max-width: 680px;
}

.max-width-text {
  max-width: 760px;
}

.line-height-relaxed {
  line-height: 1.7;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}
</style>