import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import { fetchUserCollection, resetTool, clearSelectedRelease } from '../../store/actions/discogs.actions'
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

    static fetchCollection() { store.dispatch(fetchUserCollection(store.getState().discogs.user.username)) }

    collection = store.getState().discogs.collection
    filteredCollection = [...this.collection]
    collectionIsLoading = !this.collection

    mounted() {
        const state = store.getState()
        if (this.collection.length) {
            const lastFetchDate = state.discogs.lastCollectionFetchDate,
                lastFetchUserId = state.discogs.lastCollectionFetchUserId

            if (lastFetchDate) {
                if (lastFetchUserId !== state.discogs.user.id) {
                    Dashboard.fetchCollection()
                } else if (moment() > moment(lastFetchDate).add({ days: 1 })) {
                    Dashboard.fetchCollection()
                }
            }
        } else {
            Dashboard.fetchCollection()
        }
        this.beforeDestroy = store.subscribe(() => {
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

}