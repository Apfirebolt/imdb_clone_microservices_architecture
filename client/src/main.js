import { createApp } from 'vue'
import './style.css'
import router from './routes'
import vuetify from './plugins/vuetify'
import App from './App.vue'


createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')