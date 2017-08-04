import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../../router'
import store from '../../store'
import get from 'lodash.get'
import trimEnd from 'lodash.trimend'
import hmsToSeconds from 'hms-to-seconds'

import { removeBrackets } from '../../utils'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as pageActions from '../../store/actions/page.actions'
import * as lastFmActions from '../../store/actions/lastfm.actions'

import vinylIcon from '../../static/vinyl.svg'
import cdIcon from '../../static/cd.svg'
import cassetteIcon from '../../static/cassette.svg'

@Component
export default class Release extends Vue {
    release = null
    albumInfo = null

    beforeRouteEnter(to, from, next) {
        store.dispatch(discogsActions.fetchRelease(to.params.id))
            .then(response => {
                store.dispatch(lastFmActions.getAlbumInfo(response.payload.artists[0].name, response.payload.title))
                next()
            })
    }

    get releaseCoverImage() {
        if (this.albumInfo) {
            return this.albumInfo.image 
        } else {
            return this.fallbackThumb
        }
    }

    get releaseCoverImageSrcSet() {
        if (this.releaseCoverImage) {
            return `${this.releaseCoverImage[0]['#text']} 50w, ${this.releaseCoverImage[1]['#text']} 100w, ${this.releaseCoverImage[2]['#text']} 300w, ${this.releaseCoverImage[3]['#text']} 450w, ${this.releaseCoverImage[4]['#text']} 500w`
        }
        return nulls
    }

    get lowestQualityCover() {
        if (this.releaseCoverImage) {
            return this.releaseCoverImage[0]['#text']
        } else {
            return this.fallbackThumb
        }
        return null
    }

    get fallbackThumb() {
        const collection = get(store.getState(), 'discogs.collection', null)
        if (collection && this.release) {
            const item = collection.find(item => item.id === this.release.id)
            if (item) {
                console.log('item', item)
                console.log(item.basic_information.cover_image)
                return item.basic_information.thumb
            }
            return null
        } 
        return null
    }

    get releaseFormatIcon() {
        switch (this.release.formats[0].name.toLowerCase()) {
            case 'vinyl':
                return vinylIcon
            case 'cd':
                return cdIcon
            case 'cassette':
                return cassetteIcon
            default:
                return null
        }
    }

    get artistName() {
        if (this.release) {
            return trimEnd(removeBrackets(this.release.artists[0].name))
        } else {
            return null
        }
    }

    mounted() {
        this.beforeDestroy = store.subscribe(() => {
            this.release = store.getState().discogs.latestRelease
            this.albumInfo = store.getState().lastfm.recentAlbumInfo
        })
    }

    search(query) {
        store.dispatch(pageActions.search(query))
    }

    addTrackToQueue(track) {
        store.dispatch(lastFmActions.addTracksToQueue([track]))
    }

    imageLoaded(event) {
        if (!event.target.classList.contains('loaded')) event.target.classList.add('loaded')
    }

    updated() {
        if (!this.release) {
            scroll(0, 0)
        }
        const image = this.$refs.albumCover
        if (image) {
            if (image.crossOrigin !== 'Anonymous') image.crossOrigin = 'Anonymous'
            image.setAttribute('srcset', image.getAttribute('data-srcset'))
            image.removeAttribute('data-srcset')
        }
    }

}