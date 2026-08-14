import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure icon font styles are loaded
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // Options: 'light' | 'dark'
  },
})