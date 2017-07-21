import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'
import keys from './keys'

import SearchBox from './components/search-box/search-box.vue'
import ScrobblerBar from './components/scrobbler-bar/scrobbler-bar.vue'

import 'firebase/database'
import 'firebase/auth'
import firebase from 'firebase/app'

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('../dist/service-worker.js')
}

Vue.use(VueMaterial)
Vue.use(lazyload)
Vue.use(ProgressiveImage, { scale: true });

var config = {
  apiKey: keys.firebase.key,
  authDomain: "discrobbler.firebaseapp.com",
  databaseURL: "https://discrobbler.firebaseio.com",
  projectId: "discrobbler",
  storageBucket: "discrobbler.appspot.com",
  messagingSenderId: "659399864999"
}
firebase.initializeApp(config)

Vue.material.registerTheme('default', {
  primary: 'black',
  accent: 'red',
  warn: 'red',
  background: 'white'
})

Vue.component('search-box', SearchBox)
Vue.component('scrobbler-bar', ScrobblerBar)

new Vue({
  el: '#app',
  router,
  components: {},
  render: h => h(App)
})