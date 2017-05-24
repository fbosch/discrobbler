import './polyfills'
import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import material from 'vue-material'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'
import keys from './keys'

import 'firebase/database'
import 'firebase/auth'
import firebase from 'firebase/app'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../dist/service-worker.js');
}
var config = {
    apiKey: keys.firebase.key,
    authDomain: "discrobbler.firebaseapp.com",
    databaseURL: "https://discrobbler.firebaseio.com",
    projectId: "discrobbler",
    storageBucket: "discrobbler.appspot.com",
    messagingSenderId: "659399864999"
  }
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