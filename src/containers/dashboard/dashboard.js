import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection } from '../../store/actions/discogs.actions'
import get from 'lodash.get'
import moment from 'moment'

@Component
export default class Dashboard extends Vue {
    getCollection(state) { return get(state, 'discogs.collection', []) }
    getLastCollectionFetchDate(state) { return get(state, 'discogs.lastCollectionFetch', null) }
    fetchCollection() { store.dispatch(fetchUserCollection(store.getState().discogs.user.username)) }

    collection = this.getCollection(store.getState())
    collectionIsLoading = !this.collection

    mounted() {
        console.log(this)
        if (this.collection.length) {
            const lastFetchDate = this.getLastCollectionFetchDate(store.getState())
            if (lastFetchDate) {
                if (moment() > moment(lastFetchDate).add({ days: 1 })) {
                    this.fetchCollection()
                } 
            }
        } else {
            this.fetchCollection()
        }
        this.unsubcribe = store.subscribe(() => {
            const state = store.getState(),
                discogsCollection = this.getCollection(state)
            if (discogsCollection !== undefined || discogsCollection !== this.collection) {
                this.collection = discogsCollection
            }
            this.collectionIsLoading = state.discogs.collectionIsLoading
        })
    }

    beforeDestroy() {
        if (this.unsubscribe) this.unsubscribe()
    }

}