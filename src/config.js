import apiKeys from './keys'
// import 'firebase/database'
// import 'firebase/auth'
import './cloudinary'
import firebase from 'firebase/app'
import WebFont from 'webfontloader'

WebFont.load({ google: {families: ['Roboto:300,400', 'Material Icons']} })

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => navigator.serviceWorker.register('dist/service-worker.js'))
}

firebase.initializeApp({
  apiKey: apiKeys.firebase.key,
  authDomain: 'discrobbler.firebaseapp.com',
  databaseURL: 'https://discrobbler.firebaseio.com',
  projectId: 'discrobbler',
  storageBucket: 'discrobbler.appspot.com',
  messagingSenderId: '659399864999'
})

