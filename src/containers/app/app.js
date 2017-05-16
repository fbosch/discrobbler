import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import { readonly } from 'core-decorators'

@Component
export default class App extends Vue {
    avatar = null
    username = null

    @readonly
    selectDiscogsUser = state => get(state, 'discogs.user', undefined)
   
    constructor() {
        super()
        const initialDiscogsUserState = this.selectDiscogsUser(store.getState())
        if (initialDiscogsUserState) {
            this.avatar = initialDiscogsUserState.avatar_url
            this.username = initialDiscogsUserState.name
            router.push(views.dashboard)
        } else {
            router.push(views.login)
        }
    }

    mounted() {
        store.subscribe(() => {
            let currentDiscogsUserState = this.selectDiscogsUser(store.getState())
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
        })
    }
}