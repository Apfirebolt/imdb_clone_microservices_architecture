<template>
  <v-app>
    <!-- Header containing v-app-bar and v-navigation-drawer -->
    <Header />

    <!-- Main content area where routed components will be displayed -->
    <v-main class="overflow-hidden">
      <router-view v-slot="{ Component, route }">
        <transition name="slide-left" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </v-main>

    <!-- Footer containing v-footer -->
    <Footer />
  </v-app>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style>
/* Smooth slide transition */
.slide-left-enter-active {
  animation: slide-left-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-leave-active {
  animation: slide-left-out 0.25s cubic-bezier(0.7, 0, 0.84, 0);
}

@keyframes slide-left-in {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-left-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}
</style>