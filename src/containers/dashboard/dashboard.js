import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection } from '../../store/actions/discogs.actions'
import { readonly } from 'core-decorators'
import get from 'lodash.get'

@Component
export default class Dashboard extends Vue {

    getCollection(state) { return get(state, 'discogs.collection', []) }
    
    collection = this.getCollection(store.getState()) || []

    mounted() {
        store.dispatch(fetchUserCollection(store.getState().discogs.user.username))
        store.subscribe(() => {
            const discogsCollection = this.getCollection(store.getState())
            if (discogsCollection !== undefined && discogsCollection !== this.collection) {
                this.collection = discogsCollection
            }
        })
    }
}