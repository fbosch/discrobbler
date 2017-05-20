import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'

@Component
export default class App extends Vue {
    avatar = null
    username = null
    toolbarColor = null

    selectToolbarColor = state => get(state, 'theming.toolbarColor', undefined)
    selectDiscogsUser = state => get(state, 'discogs.user', undefined)

    constructor() {
        super()
        const initialDiscogsUserState = this.selectDiscogsUser(store.getState())
        if (initialDiscogsUserState) {
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
        store.subscribe(() => {
            const currentDiscogsUserState = this.selectDiscogsUser(store.getState())
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
            const toolbarColor = this.selectToolbarColor(store.getState())
            if (toolbarColor !== this.toolbarColor) {
                this.toolbarColor = toolbarColor
            }
        })
    }
}