import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import { Watch } from 'vue-property-decorator'
import { search } from '../../store/actions/page.actions'


@Component
export default class App extends Vue {
    avatar = null
    username = null
    toolbarColor = null
    search = null
    authenticated = false
    isOnDashboard = false

    selectToolbarColor = () => get(store.getState(), 'page.toolbarColor', undefined)
    selectDiscogsUser = () => get(store.getState(), 'discogs.user', undefined)
    selectAuthenticationState = () => get(store.getState(), 'discogs.authenticated', false)

    constructor() {
        super()
        const initialDiscogsUserState = this.selectDiscogsUser(store.getState())
        if (initialDiscogsUserState) {
            this.authenticated = this.selectAuthenticationState()
            this.avatar = initialDiscogsUserState.avatar_url
            this.username = initialDiscogsUserState.name
            if (router.currentRoute.name === views.login.name || !router.currentRoute.name) {
                router.push(views.dashboard)
            }
        } else {
            router.push(views.login)
        }
    }

    mounted() {
        this.unsubscribe = store.subscribe(() => {
            const currentDiscogsUserState = this.selectDiscogsUser()
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
            if (this.selectAuthenticationState() !== this.authenticated) {
                this.authenticated = this.selectAuthenticationState()
            }
            const toolbarColor = this.selectToolbarColor()
            if (toolbarColor !== this.toolbarColor) {
                this.toolbarColor = toolbarColor
            }
        })
    }

    @Watch('search')
    onSearchChanges(newVal, oldVal) {
        store.dispatch(search(newVal))
    }

    @Watch('$route', { immediate: true, deep: true })
    checkCurrentPage(newVal, oldVal) {
        this.isOnDashboard = newVal.name === 'dashboard'
    }

    toggleLeftSidenav() {
        requestAnimationFrame(() => this.$refs.leftSidenav.toggle())
    }



    beforeDestroy() {
        if (this.unsubscribe) this.unsubscribe()
    }
}