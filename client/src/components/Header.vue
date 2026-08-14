<template>
  <div>
    <!-- Main App Bar -->
    <v-app-bar
      flat
      border="b"
      class="px-2 px-sm-6 bg-surface"
      elevation="0"
    >
      <!-- Mobile Drawer Toggle Button -->
      <v-app-bar-nav-icon
        class="d-md-none me-2"
        variant="text"
        @click="drawer = !drawer"
      />

      <!-- Brand Logo / Title -->
      <router-link to="/" class="d-flex align-center text-decoration-none text-high-emphasis me-6">
        <v-avatar color="primary" size="36" class="me-3 elevation-2">
          <v-icon icon="mdi-movie-open-star" size="20" color="white" />
        </v-avatar>
        <span class="text-h6 font-weight-bold tracking-tight">
          Cine<span class="text-primary">Wave</span>
        </span>
      </router-link>

      <!-- Desktop Navigation Links -->
      <div class="d-none d-md-flex align-center ga-1">
        <v-btn
          v-for="item in navLinks"
          :key="item.title"
          :to="item.to"
          variant="text"
          rounded="lg"
          class="text-capitalize text-body-2 font-weight-medium px-4"
          :prepend-icon="item.icon"
        >
          {{ item.title }}
        </v-btn>
      </div>

      <v-spacer />

      <!-- Auth Action Buttons (Desktop) -->
      <div class="d-none d-sm-flex align-center ga-2">
        <v-btn
          to="/login"
          variant="text"
          rounded="lg"
          class="text-capitalize font-weight-semibold text-body-2 px-4"
        >
          Login
        </v-btn>

        <v-btn
          to="/register"
          color="primary"
          variant="flat"
          rounded="lg"
          class="text-capitalize font-weight-semibold text-body-2 px-5 elevation-1"
        >
          Register
        </v-btn>
      </div>

      <!-- Quick Theme / Search Icon Button (Optional utility) -->
      <v-btn
        icon="mdi-magnify"
        variant="text"
        size="small"
        class="ms-1 d-sm-none"
        to="/movies"
      />
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
      class="bg-surface pa-2"
    >
      <!-- Mobile Drawer Header -->
      <div class="d-flex align-center justify-space-between px-3 py-4">
        <div class="d-flex align-center">
          <v-avatar color="primary" size="32" class="me-2">
            <v-icon icon="mdi-movie-open-star" size="18" color="white" />
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">
            Cine<span class="text-primary">Wave</span>
          </span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="drawer = false"
        />
      </div>

      <v-divider class="mb-3" />

      <!-- Navigation Links List -->
      <v-list density="compact" nav class="px-2">
        <v-list-item
          v-for="item in navLinks"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
          class="mb-1 text-body-2 font-weight-medium"
          @click="drawer = false"
        />
      </v-list>

      <v-divider class="my-3" />

      <!-- Auth Actions in Drawer -->
      <div class="px-2 d-flex flex-column ga-2 mt-auto">
        <v-btn
          to="/login"
          variant="outlined"
          color="primary"
          block
          rounded="lg"
          class="text-capitalize font-weight-medium"
          @click="drawer = false"
        >
          Login
        </v-btn>

        <v-btn
          to="/register"
          color="primary"
          variant="flat"
          block
          rounded="lg"
          class="text-capitalize font-weight-medium"
          @click="drawer = false"
        >
          Register
        </v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)

const navLinks = [
  {
    title: 'Movies',
    to: '/movies',
    icon: 'mdi-filmstrip',
  },
  {
    title: 'About',
    to: '/about',
    icon: 'mdi-information-outline',
  },
]
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.025em;
}
</style>