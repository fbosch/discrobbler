<script>
import Vue from 'vue'
import store from '../store'
import router, { views, routes, getRouteIcon } from '../router'
import { Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import get from 'lodash.get'
import * as lastFmActions from '../store/actions/lastfm.actions'
import * as pageActions from '../store/actions/page.actions'
import ifVisible from 'ifvisible.js'
import { isLoggedIn } from '../utils'

@Component
export default class App extends Vue {
	lastfmSession = store.getState().lastfm.session || null
	discogsAuthenticated = false
	queue = store.getState().lastfm.queue || []
	recentTracks = store.getState().lastfm.recentTracks || null
	snackbarDuration = 2400
	snackbarMessage = null
	routes = routes
	getRouteIcon = getRouteIcon

	static getRecentTracks() {
		if (get(store.getState(), 'lastfm.session.name', false)) {
			store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
		}
	}

	@Watch('snackbarMessage')
	onMessageChange(newVal) {
		if (this.$refs.snackbar) {
			if (newVal !== null) {
				this.$refs.snackbar.open()
			} else {
				this.$refs.snackbar.close()
			}
		}
	}

	mounted() {
		console.log(this)
		const getLastFmSession = () => get(store.getState(), 'lastfm.session', null)
		const getRecentTracks = () => get(store.getState(), 'lastfm.recentTracks', null)
		const getQueue = () => get(store.getState(), 'lastfm.queue', [])
		const getMessage = () => get(store.getState(), 'page.message', null)

		App.getRecentTracks()
		setInterval(() => ifVisible.now() && App.getRecentTracks(), 24000)
		this.beforeDestroy = store.subscribe(() => {
			const queueFromState = getQueue()
			if (queueFromState !== this.queue) this.queue = queueFromState

			this.recentTracks = getRecentTracks()

			const currentLastfmWebsession = getLastFmSession()
			if (currentLastfmWebsession !== this.lastfmSession) this.lastfmSession = currentLastfmWebsession

			if (this.snackbarMessage !== getMessage()) this.snackbarMessage = getMessage()
		})
	}

	onSnackbarClose() {
		setTimeout(() => store.dispatch(pageActions.clearMessage()), 100)
	}

	toggleSideNav() {
		store.dispatch(pageActions.toggleSideNav())
	}
}
</script>
<template>
<div>
  <md-toolbar class="md-dense">
    <md-button class="md-icon-button" @click.native="toggleSideNav" aria-label="Menu">
      <md-icon>menu</md-icon>
    </md-button>
    <span style="flex:1">
        <img class="small-logo" src="https://res.cloudinary.com/discrobbler/image/upload/q_100/v1501939195/small-logo.svg">          
    </span>
    <search-box ref="sideNavigation"></search-box>
  </md-toolbar>
  <side-navigation></side-navigation>
  <main class="main-content">
    <router-view></router-view>
  </main>
  <md-snackbar md-position="bottom right" @close="onSnackbarClose" :md-duration="snackbarDuration" ref="snackbar">
    <span>
        {{ snackbarMessage }}
    </span>
    <span style="flex: 1"></span>
    <md-icon>
      info
    </md-icon>
  </md-snackbar>
  <bottom-navigation></bottom-navigation>
</div>
</template>
<style lang="scss">
@import '~vue-material/dist/vue-material.css';

html {
  background: #000;
  &:not(.wf-active) * {
    font-family: sans-serif !important;
  }
  &:not(.wf-materialicons-n4-active) {
    .material-icons {
      color: transparent;
    }
  }
  .material-icons img {
    vertical-align: unset;
  }
}

body {
  background: #f5f5f5;
}

.main-content {
  margin: 0 auto;
  padding-bottom: 70px;
}

.clickable {
  cursor: pointer;
}

img:not([src]),
img[src=""] {
  display: none;
}

.small-container, .container {
  margin: 0 auto;
}

.container {
  max-width: 1200px;
}

.small-container {
  max-width: 700px;  
}

.equalizer-icon {
  display: block;
  max-width: 200px;
  transform: translate(-50%, -50%);
  top: 50%;
  position: relative;
  left: 50%;
}

.search-box-container {
  width: 50%;
  max-width: 500px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  will-change: opacity;
  opacity: 0;
}

.md-toolbar {
  overflow: hidden;
}

.md-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.md-menu-content .md-list {
  z-index: 99;
}

.md-theme-default,
.md-fab {
  transition: background-color .3s ease-in-out;
  will-change: background-color;
}

img[lazy] {
  transition: opacity .3s linear;
}

img[lazy="loading"] {
  opacity: 0;
}

img[lazy="loaded"] {
  opacity: 1;
}
</style>
