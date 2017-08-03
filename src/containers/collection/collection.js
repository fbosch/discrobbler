import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../../store'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as pageActions from '../../store/actions/page.actions'
import moment from 'moment'
import Fuse from 'fuse.js'
import get from 'lodash.get'


@Component({
    
})
export default class Collection extends Vue {
    
    static searchOptions = {
        shouldSort: true,
        tokenize: false, 
        threshold: 0.3,
        minMatchCharLength: 3,
        matchAllTokens: false,
        keys: ['basic_information.title', 'basic_information.artists.name', 'basic_information.formats.name']
    }
    static getLastFetchDate = () => get(store.getState(), 'discogs.lastCollectionFetchDate', null)
    static getLastFetchUserId = () => get(store.getState(), 'discogs.lastCollectionFetchUserId', null)
    static getDiscogsUserId = () => get(store.getState(), 'discogs.user.id')
    static getCollection = () => get(store.getState(), 'discogs.collection', [])
    static fetchCollection = () => store.dispatch(discogsActions.fetchUserCollection(get(store.getState(), 'discogs.user.username', null)))

    collection = store.getState().discogs.collection || []
    collectionIsLoading = !this.collection
    searchState = store.getState().page.search || null

    beforeRouteEnter(to, from, next) {
        const lastFetchDate = Collection.getLastFetchDate()
        const lastFetchUserId = Collection.getLastFetchUserId()
        const currentCollection = Collection.getCollection()

        const isNewUser = lastFetchUserId !== Collection.getDiscogsUserId()
        const isOld = moment() > moment(lastFetchDate).add({ days: 1})

        if (!currentCollection.length || (lastFetchDate && (isNewUser || isOld))) {
            Collection.fetchCollection().then(next)
        } else {
            next()
        }
    }

    get filteredCollection() {
        // if (this.searchState && this.searchState.length) {
        //     const fuse = new Fuse(this.collection, Collection.searchOptions)
        //     return fuse.search(this.searchState)
        // } else {
        //     return [...this.collection]
        // }
        return [...this.collection]
    }

    mounted() {
        this.beforeDestroy = store.subscribe(() => {
            const discogsCollection = Collection.getCollection()
            if (discogsCollection !== undefined || discogsCollection !== this.collection) {
                this.collection = discogsCollection
            }
            this.collectionIsLoading = store.getState().discogs.collectionIsLoading
            const searchState = store.getState().page.search
            if (searchState !== this.searchState) {
                this.searchState = searchState
            }
        })
    }


}