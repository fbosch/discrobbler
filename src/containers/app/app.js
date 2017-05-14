import Vue from 'vue'
import store from '../../store'
import { Component } from 'vue-property-decorator'
import router, { views } from '../../router'

@Component
export default class App extends Vue {
    constructor() {
        super()
        const discogsUserSelect = state => state.discogs.user
        const state = store.getState()
            console.log(router.currentRoute)

        if (!discogsUserSelect(state)) {
            router.push(views.login.path)
        }
    }
}