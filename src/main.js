import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import material from 'vue-material'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'

import 'firebase/auth'
import 'firebase/database'
import firebase from 'firebase/app'

var config = {
  apiKey: "AIzaSyBFIvEfsNsjaHfMmbQCadB8nWWegfXIIVo",
  authDomain: "discogs-scrobbler.firebaseapp.com",
  databaseURL: "https://discogs-scrobbler.firebaseio.com",
  projectId: "discogs-scrobbler",
  storageBucket: "discogs-scrobbler.appspot.com",
  messagingSenderId: "397731299445"
};
firebase.initializeApp(config);

Vue.use(material)
Vue.use(lazyload)
Vue.use(ProgressiveImage, {
  scale: true
});

Vue.material.registerTheme('default', {
  primary: 'red',
  accent: 'orange',
  warn: 'red',
  background: 'white'
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})