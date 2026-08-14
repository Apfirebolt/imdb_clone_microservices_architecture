<template>
  <v-container class="fill-height justify-center" fluid>
    <!-- Background Gradient Glow -->
    <div class="glow-bg" />

    <v-card
      class="register-card pa-6 pa-sm-8"
      elevation="12"
      rounded="xl"
      max-width="540"
      width="100%"
    >
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="avatar-badge mx-auto mb-3">
          <v-icon icon="mdi-account-plus-outline" size="28" color="amber-darken-1" />
        </div>
        <h2 class="text-h5 font-weight-bold text-white tracking-tight">Create an Account</h2>
        <p class="text-caption text-grey-lighten-1 mt-1">
          Join to start tracking and analyzing your expenses
        </p>
      </div>

      <!-- Alert for Server Errors -->
      <v-alert
        v-if="serverError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        closable
        @click:close="serverError = ''"
      >
        {{ serverError }}
      </v-alert>

      <!-- Register Form -->
      <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleRegister">
        <v-row dense>
          <!-- First Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formData.firstName"
              label="First Name"
              placeholder="e.g. John"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required]"
              color="amber-darken-2"
              class="mb-1"
            />
          </v-col>

          <!-- Last Name -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="formData.lastName"
              label="Last Name"
              placeholder="e.g. Doe"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required]"
              color="amber-darken-2"
              class="mb-1"
            />
          </v-col>

          <!-- Username -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.username"
              label="Username"
              placeholder="Choose a unique username"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-at"
              :rules="[rules.required, rules.minUsername]"
              color="amber-darken-2"
              class="mb-1"
            />
          </v-col>

          <!-- Email -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              :rules="[rules.required, rules.email]"
              color="amber-darken-2"
              class="mb-1"
            />
          </v-col>

          <!-- Password -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="At least 6 characters"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showPassword = !showPassword"
              :rules="[rules.required, rules.minPassword]"
              color="amber-darken-2"
              class="mb-1"
            />
          </v-col>

          <!-- Confirm Password -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password"
              placeholder="Re-enter password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-check-outline"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              :rules="[rules.required, rules.matchPassword]"
              color="amber-darken-2"
              class="mb-2"
            />
          </v-col>
        </v-row>

        <!-- Submit Button -->
        <v-btn
          type="submit"
          block
          size="large"
          rounded="lg"
          class="register-btn mt-3 text-none font-weight-bold"
          :loading="isLoading"
          :disabled="!isFormValid || isLoading"
        >
          Create Account
        </v-btn>
      </v-form>

      <!-- Footer Link -->
      <div class="text-center mt-6">
        <span class="text-caption text-grey">Already have an account? </span>
        <router-link
          to="/login"
          class="text-caption font-weight-bold text-amber-accent-2 text-decoration-none hover-underline"
        >
          Sign In
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// import { useAuth } from '../store/auth'; // Connect to your Pinia auth store if needed

const router = useRouter();
// const auth = useAuth();

const formRef = ref(null);
const isFormValid = ref(false);
const isLoading = ref(false);
const serverError = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const formData = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// Validation rules
const rules = {
  required: (v) => !!v || 'This field is required',
  email: (v) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(v) || 'Enter a valid email address';
  },
  minUsername: (v) => (v && v.length >= 3) || 'Username must be at least 3 characters',
  minPassword: (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
  matchPassword: (v) => v === formData.password || 'Passwords do not match',
};

const handleRegister = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  serverError.value = '';

  try {
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    // Example with Express backend API / auth store:
    // await auth.register(payload);
    // OR
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register account');
    }

    // Redirect on success
    router.push('/');
  } catch (error) {
    serverError.value = error.message || 'An unexpected error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background-color: #020617; /* slate-950 */
  position: relative;
  overflow: hidden;
}

.glow-bg {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 400px;
  background: radial-gradient(circle, rgba(234, 88, 12, 0.15), rgba(245, 158, 11, 0.08), transparent 70%);
  filter: blur(50px);
}

.register-card {
  background-color: rgba(15, 23, 42, 0.85) !important; /* slate-900 */
  border: 1px solid rgba(154, 52, 18, 0.3) !important; /* orange-900/30 */
  backdrop-filter: blur(16px);
  position: relative;
  z-index: 2;
}

.avatar-badge {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background-color: rgba(2, 6, 23, 0.8);
  border: 1px solid rgba(245, 158, 11, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-btn {
  background: linear-gradient(to right, #dc2626, #ea580c, #f59e0b) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 25px -5px rgba(234, 88, 12, 0.4);
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.register-btn:hover {
  opacity: 0.95;
}

.hover-underline:hover {
  text-decoration: underline !important;
}
</style>