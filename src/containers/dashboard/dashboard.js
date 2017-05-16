import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection } from '../../store/actions/discogs.actions'
import get from 'lodash.get'

@Component
export default class Dashboard extends Vue {
    getCollection(state) { return get(state, 'discogs.collection', []) }

    collection = this.getCollection(store.getState()) || []
    collectionIsLoading = true

    mounted() {
        store.dispatch(fetchUserCollection(store.getState().discogs.user.username))
        store.subscribe(() => {
            const state = store.getState(),
                discogsCollection = this.getCollection(state)
            if (discogsCollection !== undefined && discogsCollection !== this.collection) {
                this.collection = discogsCollection
            }
            this.collectionIsLoading = state.discogs.collectionIsLoading
        })
    }
}