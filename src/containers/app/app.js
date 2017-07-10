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

    created() {
        const initialDiscogsUserState = store.getState().discogs.user
        if (initialDiscogsUserState && router.currentRoute.path === '/') {
            router.push(views.dashboard)
        }
    }

    mounted() {
        const observe = () => {
        const currentDiscogsUserState = store.getState().discogs.user
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
            if (store.getState().discogs.authenticated !== this.authenticated) {
                this.authenticated = store.getState().discogs.authenticated
            }
            if (!this.authenticated) {
                router.push(views.login)
            }
            const toolbarColor = store.getState().page.toolbarColor
            if (toolbarColor !== this.toolbarColor) {
                this.toolbarColor = toolbarColor
            }
        }
        observe()
        this.beforeDestroy = store.subscribe(observe)
    }

    @Watch('search')
    onSearchChanges = debounce(newVal => {
        if (router.currentRoute.name !== 'dashboard') {
            router.push(views.dashboard)
        }
        store.dispatch(search(newVal))
    }, 350)


    get currentRouteName() {
        return router.currentRoute.name
    }

    toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle()
    }
}