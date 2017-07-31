import './polyfills'

import 'firebase/database'
import 'firebase/auth'
import firebase from 'firebase/app'

import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import { reduxStorePlugin } from 'redux-vue-connect'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'
import apiKeys from './keys'

import SearchBox from './components/search-box/search-box.vue'
import ScrobblerBar from './components/scrobbler-bar/scrobbler-bar.vue'
import ScrobblingQueue from './components/scrobbling-queue/scrobbling-queue.vue'

// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
//   runtime.register()
// }

var config = {
  apiKey: apiKeys.firebase.key,
  authDomain: 'discrobbler.firebaseapp.com',
  databaseURL: 'https://discrobbler.firebaseio.com',
  projectId: 'discrobbler',
  storageBucket: 'discrobbler.appspot.com',
  messagingSenderId: '659399864999'
}
firebase.initializeApp(config)

Vue.use(reduxStorePlugin)
Vue.use(VueMaterial)
Vue.use(lazyload)
Vue.use(ProgressiveImage, { scale: true })

Vue.component('search-box', SearchBox)
Vue.component('scrobbler-bar', ScrobblerBar)
Vue.component('scrobbling-queue', ScrobblingQueue)

Vue.material.registerTheme('default', {
  primary: 'black',
  accent: 'red',
  warn: 'red',
  background: 'white'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
