import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import { saveState, loadState } from './localStorage'

// persist state to localstorage
store.subscribe(() => saveState(store.getState()))

Vue.use(VueMaterial)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})