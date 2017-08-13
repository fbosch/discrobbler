<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import store from '../store'
import * as discogsActions from '../store/actions/discogs.actions'
import * as pageActions from '../store/actions/page.actions'
import moment from 'moment'
import Fuse from 'fuse.js'
import get from 'lodash.get'


@Component
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

    collection = Collection.getCollection
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
        if (this.searchState && this.searchState.length) {
            const fuse = new Fuse(this.collection, Collection.searchOptions)
            return fuse.search(this.searchState)
        } else {
            return [...this.collection]
        }
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
</script>
<template>
<section class="collection">
    <transition name="fade">
        <md-spinner :md-size="120" :md-stroke="1.5" md-indeterminate class="md-accent" v-if="collectionIsLoading"></md-spinner>
        <div v-else>
             <md-list class="album-list md-transparent" v-if="filteredCollection.length > 0" >
                <md-list-item v-for="item in filteredCollection" :key="item.id" v-lazy="item" class="md-triple-line album-item" tabindex="0">
                    <router-link :to="{name:'release', params: { id: item.id }}">
                        <md-avatar>
                            <img v-lazy="item.basic_information.thumb" v-if="item.basic_information.thumb">
                            <img src="https://res.cloudinary.com/discrobbler/image/upload/v1502580383/record_qbx3po.svg" v-else>
                        </md-avatar>
                        <div class="md-list-text-container">
                            <span>{{ item.basic_information.title }}</span>
                            <span>{{ item.basic_information.artists[0].name }}</span>
                            <p>{{ item.basic_information.formats[0].name }}</p>
                        </div>
                        <md-divider class="md-inset"></md-divider>
                    </router-link>
                </md-list-item>
              </md-list> 
             <div class="collection__no-results" v-else>
                <md-layout md-align="center">
                    <img src="https://res.cloudinary.com/discrobbler/image/upload/v1502580590/vinyls_q9rfc0.svg" alt="vinyls" class="collection__no-results-image">
                </md-layout>
                <md-layout md-align="center">
                    <span class="md-title">
                    No items in your collection matches the query <strong>'{{ searchState }}'</strong>
                </span>
                </md-layout>
              </div>     
        </div>
    </transition>
</section>
</template>
<style lang="scss" scoped>
.collection {
    .md-list-text-container {
        padding: 10px 0;
    }

    .md-avatar {
        height: 60px;
        width: 60px;
        min-width: 60px;
        background-image: url('https://res.cloudinary.com/discrobbler/image/upload/v1502580383/record_qbx3po.svg');
        position: relative;
        z-index: 1;
    }

    &__no-results {
        text-align: center;
        opacity: 0.5;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &__no-results-image {
        margin-bottom: 25px;
        max-height: 150px;
    }
}
</style>
