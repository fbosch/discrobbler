import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'

@Component
export default class App extends Vue {
    avatar = null
    username = null

    mounted() {
        const discogsUserSelect = state => get(state, 'discogs.user', undefined)
        store.subscribe(() => {
            let currentDiscogsUserState = discogsUserSelect(store.getState())
            if (currentDiscogsUserState) {
                if (this.avatar !== currentDiscogsUserState.avatar_url) {
                    this.avatar = currentDiscogsUserState.avatar_url
                    this.username = currentDiscogsUserState.name
                }
            }
        })
        const initialDiscogsUserState = discogsUserSelect(store.getState())
        if (initialDiscogsUserState) {
            this.avatar = initialDiscogsUserState.avatar_url
            this.username = initialDiscogsUserState.name
            router.push(views.dashboard)
        } else {
            router.push(views.login)
        }
    }
}