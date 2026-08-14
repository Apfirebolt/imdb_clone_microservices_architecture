<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4 rounded-lg pa-6 text-center">
          <v-card-item>
            <v-icon
              icon="mdi-home"
              size="48"
              color="primary"
              class="mb-3"
            />
            <v-card-title class="text-h4 font-weight-bold">
              Welcome to Home
            </v-card-title>
          </v-card-item>

          <v-card-text class="text-body-1 text-medium-emphasis">
            This is a basic Vue 3 page built with Vuetify.
          </v-card-text>

          <v-card-actions class="justify-center mt-2">
            <v-btn
              color="primary"
              variant="elevated"
              rounded="md"
              prepend-icon="mdi-arrow-right"
            >
              Get Started
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Component reactive state and logic goes here
</script>

<style scoped>
/* Scoped styles if needed */
</style>