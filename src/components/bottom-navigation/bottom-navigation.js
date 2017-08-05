import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import router, { routes, getRouteIcon } from '../../router'
import { isLoggedIn } from '../../utils'

@Component
export default class BottomNavigation extends Vue {
  routes = routes
  getRouteIcon = getRouteIcon

  get bottomBarItems() {
    if (this.$refs.bottomBar) {
      return this.$refs.bottomBar.$children
    }
    return null
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
  onRouteChange(route) {
    const itemToActivate = this.bottomBarItems.find(item => item.$attrs.route === route.path)
    if (itemToActivate) itemToActivate.setActive(true)
  }

}
