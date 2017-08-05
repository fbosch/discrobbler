import './polyfills'
import './config'
import viewports from './viewports'
import invert from 'lodash.invert'

import Vue from 'vue'
import App from './containers/app/app.vue'
import router from './router'
import store from './store'
import VueMaterial from 'vue-material'
import VueViewports from 'vue-viewports'
import lazyload from 'vue-lazyload'
import ProgressiveImage from 'progressive-image/dist/vue'
import VueRouter from 'vue-router'
import { MediaQueries } from 'vue-media-queries'
import Vue2Filters from 'vue2-filters'

import SearchBox from './components/search-box/search-box.vue'
import ScrobblerBar from './components/scrobbler-bar/scrobbler-bar.vue'
import ScrobblingQueue from './components/scrobbling-queue/scrobbling-queue.vue'
import SideNavigation from './components/side-navigation/side-navigation.vue'
import BottomNavigation from './components/bottom-navigation/bottom-navigation.vue'

const mediaQueries = new MediaQueries()
Vue.use(mediaQueries)
Vue.use(Vue2Filters)
Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(lazyload)
Vue.use(ProgressiveImage, { scale: true })
Vue.use(VueViewports, invert(viewports))

Vue.component('search-box', SearchBox)
Vue.component('scrobbler-bar', ScrobblerBar)
Vue.component('scrobbling-queue', ScrobblingQueue)
Vue.component('side-navigation', SideNavigation)
Vue.component('bottom-navigation', BottomNavigation)

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
  mediaQueries,
  render: h => h(App)
})
