import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import * as pageActions from '../../store/actions/page.actions'
import * as lastfmActions from '../../store/actions/lastfm.actions'
import * as discogsActions from '../../store/actions/discogs.actions'
import { routes } from '../../router'
import store from '../../store'
import get from 'lodash.get'
import { isLoggedIn } from '../../utils'

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