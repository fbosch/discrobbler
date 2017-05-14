import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection } from '../../store/actions/discogs.actions'

@Component
export default class Dashboard extends Vue {
    constructor() {
        super()
        store.dispatch(fetchUserCollection(store.getState().discogs.user.username))
    }
}