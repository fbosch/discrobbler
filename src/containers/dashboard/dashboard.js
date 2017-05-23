import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection, resetTool, clearSelectedRelease } from '../../store/actions/discogs.actions'
import get from 'lodash.get'
import moment from 'moment'
import Fuse from 'fuse.js'

@Component
export default class Dashboard extends Vue {

    static searchOptions = {
        shouldSort: true,
        tokenize: true,
        threshold: 0.2,
        minMatchCharLength: 3,
        matchAllTokens: true,
        keys: ['basic_information.title', 'basic_information.artists.name', 'basic_information.formats.name']
    }

    static getCollection() { return get(store.getState(), 'discogs.collection', []) }
    static getLastCollectionFetchDate() { return get(store.getState(), 'discogs.lastCollectionFetchDate', null) }
    static getLastCollectionFetchUserId() { return get(store.getState(), 'discogs.lastCollectionFetchUserId', null) }
    static getCurrentUserId() { return get(store.getState(), 'discogs.user.id', null) }

    static fetchCollection() { store.dispatch(fetchUserCollection(store.getState().discogs.user.username)) }

    collection = Dashboard.getCollection(store.getState())
    filteredCollection = [...this.collection]
    collectionIsLoading = !this.collection

    mounted() {
        if (this.collection.length) {
            const lastFetchDate = Dashboard.getLastCollectionFetchDate(),
                lastFetchUserId = Dashboard.getLastCollectionFetchUserId()
                
            if (lastFetchDate) {
                if (lastFetchUserId !== Dashboard.getCurrentUserId()) {
                    Dashboard.fetchCollection()
                } else if (moment() > moment(lastFetchDate).add({ days: 1 })) {
                    Dashboard.fetchCollection()
                }
            }
        } else {
            Dashboard.fetchCollection()
        }
        this.unsubcribe = store.subscribe(() => {
            const discogsCollection = Dashboard.getCollection()
            if (discogsCollection !== undefined || discogsCollection !== this.collection) {
                this.collection = discogsCollection
            }
            this.collectionIsLoading = store.getState().discogs.collectionIsLoading
            this.evaluateSearchQuery()
        })
    }

    evaluateSearchQuery() {
        const searchState = store.getState().page.search
        if (searchState && searchState.length) {
            var fuse = new Fuse(this.collection, Dashboard.searchOptions)
            this.filteredCollection = fuse.search(searchState)
        } else {
            this.filteredCollection = [...this.collection]
        }
    }

    beforeDestroy() {
        if (this.unsubscribe) this.unsubscribe()
    }
}