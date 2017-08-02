import './polyfills'
import apiKeys from './keys'
import viewports from './viewports'
import invert from 'lodash.invert'

import 'firebase/database'
import 'firebase/auth'
import firebase from 'firebase/app'

import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import VueViewports from 'vue-viewports'
import { reduxStorePlugin } from 'redux-vue-connect'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'

import SearchBox from './components/search-box/search-box.vue'
import ScrobblerBar from './components/scrobbler-bar/scrobbler-bar.vue'
import ScrobblingQueue from './components/scrobbling-queue/scrobbling-queue.vue'
import SideNavigation from './components/side-navigation/side-navigation.vue'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('dist/service-worker.js')
      .then(registration => console.log('ServiceWorker registration successful with scope: ', registration.scope)
        ,error => console.log('ServiceWorker registration failed: ', error))})
}

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
Vue.use(VueViewports, invert(viewports))

Vue.component('search-box', SearchBox)
Vue.component('scrobbler-bar', ScrobblerBar)
Vue.component('scrobbling-queue', ScrobblingQueue)
Vue.component('side-navigation', SideNavigation)

Vue.material.registerTheme('default', {
  primary: 'black',
  accent: 'red',
  warn: 'grey',
  background: 'white'
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
