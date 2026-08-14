<template>
  <v-overlay
    v-if="overlay"
    :model-value="modelValue"
    persistent
    class="align-center justify-center text-center"
    scrim="rgba(2, 6, 23, 0.75)"
    z-index="9999"
  >
    <div class="d-flex flex-column align-center justify-center pa-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
      <!-- Circular Progress Spinner -->
      <v-progress-circular
        :size="size"
        :width="width"
        :color="color"
        indeterminate
        class="mb-4"
      />

      <!-- Dynamic Message / Slot -->
      <slot>
        <div class="text-subtitle-1 font-weight-bold text-slate-100">
          {{ text }}
        </div>
        <div v-if="subtext" class="text-caption text-slate-400 mt-1">
          {{ subtext }}
        </div>
      </slot>
    </div>
  </v-overlay>

  <!-- 2. Inline / Embedded Container Mode -->
  <div
    v-else-if="modelValue"
    class="d-flex flex-column align-center justify-center py-10 px-4 text-center w-100"
  >
    <v-progress-circular
      :size="size"
      :width="width"
      :color="color"
      indeterminate
      class="mb-3"
    />
    <slot>
      <div class="text-body-2 font-weight-semibold text-slate-200">
        {{ text }}
      </div>
      <div v-if="subtext" class="text-caption text-slate-400 mt-1">
        {{ subtext }}
      </div>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  // Controls visibility (v-model or :model-value)
  modelValue: {
    type: Boolean,
    default: true,
  },
  // Whether to show as a modal overlay or inline inside parent
  overlay: {
    type: Boolean,
    default: true,
  },
  // Primary message text
  text: {
    type: String,
    default: 'Loading, please wait...',
  },
  // Optional secondary helper text
  subtext: {
    type: String,
    default: '',
  },
  // Spinner color (Vuetify theme token or CSS color)
  color: {
    type: String,
    default: 'amber-darken-2',
  },
  // Spinner diameter in pixels
  size: {
    type: [Number, String],
    default: 56,
  },
  // Spinner stroke width in pixels
  width: {
    type: [Number, String],
    default: 4,
  },
})
</script>

<style scoped>
.bg-slate-900 {
  background-color: #0f172a !important;
}
.border-slate-800 {
  border: 1px solid #1e293b !important;
}
.text-slate-100 {
  color: #f1f5f9;
}
.text-slate-200 {
  color: #e2e8f0;
}
.text-slate-400 {
  color: #94a3b8;
}
</style>