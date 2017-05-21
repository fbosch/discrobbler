import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import material from 'vue-material'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'

Vue.use(material)
Vue.use(lazyload)
Vue.use(ProgressiveImage, {
  scale: true
});

Vue.material.registerTheme('default', {
  primary: 'blue-grey',
  accent: 'red',
  warn: 'red',
  background: 'white'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})