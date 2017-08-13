<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import router, { routes, getRouteIcon } from '../router'
import { isLoggedIn } from '../utils'
import store from '../store'

@Component
export default class BottomNavigation extends Vue {
  routes = routes
  getRouteIcon = getRouteIcon
  isLoggedIn = isLoggedIn()

  get bottomBarItems() {
    if (this.$refs.bottomBar) {
      return this.$refs.bottomBar.$children
    }
    return null
  }

  mounted() {
    this.changeActiveRouteItem(router.currentRoute)
    this.beforeDestroy = store.subscribe(() => { this.isLoggedIn = isLoggedIn() })
  }

	displayRouteInBottomBar(route) {
		if (route.meta) {
			if (route.meta.requiresAuth && route.meta.showInBottomBar) {
				return isLoggedIn() && route.meta.showInBottomBar
			} else if (route.meta.hideWhenAuth) {
				return !isLoggedIn()
			}
			return route.meta.showInBottomBar
		}
		return false
  }

	bottomBarActiveChanged(index) {
		if (this.bottomBarItems) {
			router.push(this.bottomBarItems[index].$attrs.route)
		}
  }
  
  @Watch('$route')
  changeActiveRouteItem(route) {
    const itemToActivate = this.bottomBarItems.find(item => item.$attrs.route === route.path)
    if (itemToActivate) itemToActivate.setActive(true)
  }

}
</script>
<template>
<div class="bottom-navigation">
  <scrobbler-bar v-if="isLoggedIn"></scrobbler-bar>
  <md-bottom-bar class="md-shift" @change="bottomBarActiveChanged" ref="bottomBar">
    <md-bottom-bar-item v-for="route in routes" :key="route.path" v-if="displayRouteInBottomBar(route)" :md-icon="getRouteIcon(route)" :route="route.path">
      <span v-if="route.meta && route.meta.displayName">
          {{ route.meta.displayName | capitalize }}
      </span>
      <span v-else>
          {{ route.name | capitalize }}
      </span>
    </md-bottom-bar-item>
  </md-bottom-bar>
</div>
</template>
<style lang="scss" scoped>
.bottom-navigation {
	position: fixed;
	width: 100%;
  bottom: 0;
  z-index: 99;
}
</style>
