import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})