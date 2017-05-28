import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import { Watch } from 'vue-property-decorator'
import { search } from '../../store/actions/page.actions'
import { setLastfmAuthenticationToken } from '../../store/actions/lastfm.actions'
import queryString from 'query-string'
import debounce from 'lodash.debounce'

@Component
export default class App extends Vue {
    avatar = null
    username = null
    toolbarColor = null
    search = null
    authenticated = false
    isOnDashboard = false

    constructor() {
        super()
        const initialDiscogsUserState = store.getState().discogs.user
        // if (initialDiscogsUserState) {
        //     this.authenticated = this.selectAuthenticationState()
        //     this.avatar = initialDiscogsUserState.avatar_url
        //     this.username = initialDiscogsUserState.name
        //     if (router.currentRoute.name === views.login.name || !router.currentRoute.name) {
        //         router.push(views.dashboard)
        //     }
        // } else {
        //     router.push(views.login)
        // }
    }

    mounted() {
        this.beforeDestroy = store.subscribe(() => {
            const currentDiscogsUserState = store.getState().discogs.user
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
            if (this.selectAuthenticationState() !== this.authenticated) {
                this.authenticated = !!store.getState().discogs.authenticated
            }
            const toolbarColor = store.getState().page.toolbarColor
            if (toolbarColor !== this.toolbarColor) {
                this.toolbarColor = toolbarColor
            }
        })
    }

    @Watch('search')
    onSearchChanges = debounce(newVal => {
        store.dispatch(search(newVal))
    }, 350)


    get currentRouteName() {
        return router.currentRoute.name
    }

    toggleLeftSidenav() {
        requestAnimationFrame(() => this.$refs.leftSidenav.toggle())
    }
}