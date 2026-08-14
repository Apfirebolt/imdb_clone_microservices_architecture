<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        
        <!-- Login Card -->
        <v-card class="elevation-8 rounded-xl pa-4 pa-sm-6" border>
          
          <!-- Header -->
          <v-card-item class="text-center pb-2">
            <div class="d-inline-flex align-center justify-center bg-primary-lighten-5 rounded-circle pa-3 mb-3">
              <v-icon icon="mdi-shield-lock-outline" size="36" color="primary" />
            </div>
            <v-card-title class="text-h5 font-weight-bold text-slate-800">
              Welcome back
            </v-card-title>
            <v-card-subtitle class="text-body-2 mt-1">
              Please enter your credentials to sign in
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-4">
            
            <!-- Error Alert -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              density="compact"
              class="mb-4"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Form -->
            <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleLogin">
              
              <!-- Email Field -->
              <div class="text-subtitle-2 font-weight-medium text-grey-darken-2 mb-1">Email Address</div>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                placeholder="name@company.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                color="primary"
                type="email"
                autocomplete="email"
                class="mb-2"
                required
              />

              <!-- Password Field -->
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-subtitle-2 font-weight-medium text-grey-darken-2">Password</span>
                <a 
                  href="#" 
                  class="text-caption text-primary font-weight-medium text-decoration-none"
                  @click.prevent="forgotPassword"
                >
                  Forgot password?
                </a>
              </div>
              
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showPassword = !showPassword"
                placeholder="••••••••"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                color="primary"
                autocomplete="current-password"
                class="mb-2"
                required
              />

              <!-- Remember Me Checkbox -->
              <v-checkbox
                v-model="rememberMe"
                label="Remember this device"
                density="compact"
                color="primary"
                hide-details
                class="mb-4"
              />

              <!-- Submit Button -->
              <v-btn
                type="submit"
                block
                color="primary"
                size="large"
                variant="flat"
                rounded="lg"
                class="text-capitalize font-weight-bold"
                :loading="isLoading"
                :disabled="!isFormValid || isLoading"
              >
                Sign In
              </v-btn>
            </v-form>

            <!-- Divider -->
            <div class="d-flex align-center my-6">
              <v-divider />
              <span class="text-caption text-medium-emphasis px-3">OR</span>
              <v-divider />
            </div>

            <!-- Social Login Alternative -->
            <v-btn
              block
              variant="outlined"
              size="large"
              rounded="lg"
              class="text-capitalize font-weight-medium text-grey-darken-3 border"
              prepend-icon="mdi-google"
              @click="loginWithGoogle"
            >
              Sign in with Google
            </v-btn>

          </v-card-text>

          <!-- Footer / Registration link -->
          <v-card-actions class="justify-center pt-0 pb-4">
            <span class="text-body-2 text-medium-emphasis">
              Don't have an account?
              <a href="/register" class="text-primary font-weight-bold text-decoration-none ms-1">
                Sign up
              </a>
            </span>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form States
const formRef = ref(null)
const isFormValid = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

// Model Fields
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Validation Rules
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
]

// Handlers
const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Replace with your Pinia auth store action or API call:
    // await authStore.login({ email: email.value, password: password.value, remember: rememberMe.value })
    
    // Simulating API network call
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    // Redirect on success
    router.push('/')
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const forgotPassword = () => {
  router.push('/forgot-password')
}

const loginWithGoogle = () => {
  // Trigger OAuth redirect
}
</script>

<style scoped>
.bg-primary-lighten-5 {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>