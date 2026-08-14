<template>
  <v-footer class="bg-grey-darken-4 text-grey-lighten-1 d-flex flex-column py-10 px-4 px-sm-8 border-t">
    
    <!-- Top Content Grid -->
    <v-container fluid class="max-width-xl pa-0">
      <v-row justify="space-between" class="gy-6">
        
        <!-- Column 1: Brand & Bio -->
        <v-col cols="12" md="4" lg="3" class="pe-md-6">
          <router-link to="/" class="d-inline-flex align-center text-decoration-none text-white mb-3">
            <v-avatar color="primary" size="36" class="me-3 elevation-2">
              <v-icon icon="mdi-movie-open-star" size="20" color="white" />
            </v-avatar>
            <span class="text-h6 font-weight-bold tracking-tight text-white">
              Cine<span class="text-primary">Wave</span>
            </span>
          </router-link>

          <p class="text-body-2 text-grey-lighten-1 line-height-relaxed mb-4">
            Your definitive source for movies, TV series, celebrity filmographies, ratings, and curated community reviews.
          </p>

          <!-- Social Media Icons -->
          <div class="d-flex align-center ga-2">
            <v-btn
              v-for="social in socialLinks"
              :key="social.icon"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :icon="social.icon"
              variant="tonal"
              color="grey-lighten-2"
              size="small"
              rounded="circle"
              class="elevation-1"
            />
          </div>
        </v-col>

        <!-- Column 2: Quick Links / Navigation -->
        <v-col cols="6" sm="4" md="2">
          <div class="text-subtitle-2 font-weight-bold text-white mb-3 text-uppercase tracking-wider">
            Explore
          </div>
          <ul class="list-unstyled d-flex flex-column ga-2">
            <li v-for="item in exploreLinks" :key="item.title">
              <router-link
                :to="item.to"
                class="footer-link text-body-2 text-decoration-none text-grey-lighten-1"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- Column 3: Community & Legal -->
        <v-col cols="6" sm="4" md="2">
          <div class="text-subtitle-2 font-weight-bold text-white mb-3 text-uppercase tracking-wider">
            Company
          </div>
          <ul class="list-unstyled d-flex flex-column ga-2">
            <li v-for="item in companyLinks" :key="item.title">
              <router-link
                :to="item.to"
                class="footer-link text-body-2 text-decoration-none text-grey-lighten-1"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- Column 4: Newsletter / Updates -->
        <v-col cols="12" sm="4" md="4" lg="3">
          <div class="text-subtitle-2 font-weight-bold text-white mb-2 text-uppercase tracking-wider">
            Stay Updated
          </div>
          <p class="text-caption text-grey-lighten-1 mb-3">
            Get the latest trailers, movie news, and box-office highlights delivered weekly.
          </p>

          <v-form @submit.prevent="handleSubscribe">
            <v-text-field
              v-model="newsletterEmail"
              placeholder="Enter your email"
              variant="solo-filled"
              density="compact"
              bg-color="grey-darken-3"
              rounded="lg"
              hide-details
              class="mb-2"
              prepend-inner-icon="mdi-email-outline"
            >
              <template #append-inner>
                <v-btn
                  type="submit"
                  color="primary"
                  size="small"
                  variant="flat"
                  rounded="md"
                  icon="mdi-arrow-right"
                  :loading="subscribing"
                />
              </template>
            </v-text-field>
          </v-form>

          <span v-if="subscribed" class="text-caption text-success d-flex align-center mt-1">
            <v-icon icon="mdi-check-circle-outline" size="14" class="me-1" />
            Thanks for subscribing!
          </span>
        </v-col>

      </v-row>
    </v-container>

    <v-divider class="my-6 border-opacity-25 w-100" />

    <!-- Bottom Attribution & Copyright -->
    <v-container fluid class="max-width-xl pa-0">
      <div class="d-flex flex-column flex-sm-row align-center justify-space-between text-caption ga-3 text-grey">
        <div>
          &copy; {{ currentYear }} <span class="text-white font-weight-semibold">CineWave</span>, Inc. All rights reserved.
        </div>
        
        <div class="d-flex align-center ga-4">
          <router-link to="/privacy" class="footer-link text-caption text-decoration-none text-grey">
            Privacy Policy
          </router-link>
          <router-link to="/terms" class="footer-link text-caption text-decoration-none text-grey">
            Terms of Service
          </router-link>
          <router-link to="/cookies" class="footer-link text-caption text-decoration-none text-grey">
            Cookie Preferences
          </router-link>
        </div>
      </div>
    </v-container>

  </v-footer>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const newsletterEmail = ref('')
const subscribing = ref(false)
const subscribed = ref(false)

const handleSubscribe = async () => {
  if (!newsletterEmail.value) return

  subscribing.value = true
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800))
  subscribing.value = false
  subscribed.value = true
  newsletterEmail.value = ''
}

const exploreLinks = [
  { title: 'Top Rated Movies', to: '/movies?sort=top_rated' },
  { title: 'Popular Releases', to: '/movies?sort=popular' },
  { title: 'Upcoming Films', to: '/movies?sort=upcoming' },
  { title: 'TV & Web Shows', to: '/tv-shows' },
  { title: 'Celebrity Profiles', to: '/celebrities' },
]

const companyLinks = [
  { title: 'About Us', to: '/about' },
  { title: 'Help & FAQ', to: '/help' },
  { title: 'API Documentation', to: '/api-docs' },
  { title: 'Contact Support', to: '/contact' },
]

const socialLinks = [
  { icon: 'mdi-twitter', href: 'https://twitter.com' },
  { icon: 'mdi-youtube', href: 'https://youtube.com' },
  { icon: 'mdi-instagram', href: 'https://instagram.com' },
  { icon: 'mdi-github', href: 'https://github.com' },
]
</script>

<style scoped>
.max-width-xl {
  max-width: 1280px;
}

.list-unstyled {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.line-height-relaxed {
  line-height: 1.6;
}
</style>