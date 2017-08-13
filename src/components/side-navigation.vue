<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import * as pageActions from '../store/actions/page.actions'
import * as lastfmActions from '../store/actions/lastfm.actions'
import * as discogsActions from '../store/actions/discogs.actions'
import { routes } from '../router'
import store from '../store'
import get from 'lodash.get'
import { isLoggedIn } from '../utils'

@Component
export default class SideNavigation extends Vue {
	discogsUser = SideNavigation.getDiscogsUserState()
	opened = SideNavigation.getSideNavState() || false
	routes = routes

	mounted() {
		this.beforeDestroy = store.subscribe(() => {
			this.discogsUser = SideNavigation.getDiscogsUserState()
			this.opened = SideNavigation.getSideNavState()
		}) 
	}

	@Watch('opened')	
	onChange(newVal, oldVal) {
		if(newVal !== oldVal) {
			newVal ? this.$refs.sideNavigation.open() : this.$refs.sideNavigation.close()
		}
	}

	static getDiscogsUserState() {
		return get(store.getState(), 'discogs.user', null)
	}

	static getSideNavState() {
		return get(store.getState(), 'page.sideNavOpened', false)
	}

	get avatar() {
		return get(this.discogsUser, 'avatar_url', null)
	}


	displayRouteInSideNav(route) {
		if (route.meta) {
			if (route.meta.requiresAuth && route.meta.showInSideNav) {
				return isLoggedIn() && route.meta.showInSideNav
			} else if (route.meta.hideWhenAuth) {
				return !isLoggedIn()
			}
			return route.meta.showInSideNav
		}
		return false
	}

	open() {
		if (!this.opened) {
			store.dispatch(pageActions.openSideNav())
		}
	}

	close() {
		if (this.opened) {
			store.dispatch(pageActions.closeSideNav())
		}
	}

	openDiscogsProfile() {
			window.open(`https://www.discogs.com/user/${this.discogsUser.username}`, '_blank').focus()
	}

	openLastfmProfile() {
			window.open(`https://www.last.fm/user/${this.lastfmSession.name}`, '_blank').focus()
	}

	logout() {
		store.dispatch(discogsActions.clearState())
		store.dispatch(lastfmActions.clearState())
	}
}
</script>
<template>
<div class="side-navigation">
	<md-sidenav class="md-left md-fixed" ref="sideNavigation" @open="open" @close="close">
		<md-toolbar class="md-account-header" :class="{ 'md-large': discogsUser }" >
			<h1 class="md-title">Discrobbler</h1>			
			<md-list class="md-transparent">
				<md-list-item class="md-avatar-list">
						<md-avatar md-menu-trigger class="md-large">
							<img :src="avatar" v-if="avatar">
						</md-avatar>
				</md-list-item>
				<md-list-item v-if="discogsUser">
					<div class="md-list-text-container">
						<span>{{ discogsUser.name }}</span>
						<span>{{ discogsUser.email }}</span>
					</div>
					<md-menu md-align-trigger>
						<md-button class="md-icon-button md-list-action" md-menu-trigger>
							<md-icon class="md-warn">arrow_drop_down</md-icon>
						</md-button>
						<md-menu-content>
							<md-menu-item @click.native="openLastfmProfile">
								<span>Last.fm Profile</span>
								<md-icon>
									<img src="https://res.cloudinary.com/discrobbler/image/upload/v1502580430/lastfm-logo-dark_l28bfe.svg" alt="Last.fm">
								</md-icon>
							</md-menu-item>
							<md-menu-item @click.native="openDiscogsProfile">
								<span>Discogs Profile</span>
								<md-icon>
									<img src="https://res.cloudinary.com/discrobbler/image/upload/v1502580383/record_qbx3po.svg" alt="Discogs">
								</md-icon>
							</md-menu-item>
						</md-menu-content>
					</md-menu>
				</md-list-item>
			</md-list>
		</md-toolbar>
		<md-list>
			<md-list-item v-for="route in routes" :key="route.path" v-if="displayRouteInSideNav(route)">
				<router-link :to="route.path" exact>
					<md-icon v-if="route.meta && route.meta.icon">
						{{ route.meta.icon }}
					</md-icon>
					<md-icon v-else>
						{{ route.name }}
					</md-icon>
					<span class="side-navigation__route-name" v-if="route.meta && route.meta.displayName">
						{{ route.meta.displayName | capitalize }}
					</span>
					<span class="side-navigation__route-name" v-else>
						{{ route.name | capitalize }}
					</span>
				</router-link>
			</md-list-item>
			<md-divider></md-divider>
		</md-list>
	</md-sidenav>
</div>
</template>
