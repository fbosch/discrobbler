import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../../router'
import store from '../../store'
import get from 'lodash.get'
import trimEnd from 'lodash.trimend'

import { removeBrackets, hmsToSeconds } from '../../utils'
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

    get releaseCoverImage() {
        if (this.albumInfo) {
            return this.albumInfo.image 
        } else {
            return this.fallbackThumb
        }
    }

    get releaseCoverImageSrcSet() {
        return `${this.releaseCoverImage[0]['#text']} 50w, ${this.releaseCoverImage[1]['#text']} 100w, ${this.releaseCoverImage[2]['#text']} 300w, ${this.releaseCoverImage[3]['#text']} 450w, ${this.releaseCoverImage[4]['#text']} 500w`
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
        if (collection) {
            const item = collection.find(item => item.id === this.release.id)
            if (item) {
                return item.basic_information.thumb
            }
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

    created() {
        store.dispatch(pageActions.searchClear())
        store.dispatch(discogsActions.fetchRelease(router.currentRoute.params.id))
            .then(response => { this.release = response.payload })
            .then(() => store.dispatch(lastFmActions.getAlbumInfo(this.artistName, this.release.title)))
            .then(response => { if(!response.payload.error) { this.albumInfo = response.payload.album }})
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
        const image = this.$el.querySelector('img[data-srcset]')
        if (image) {
            image.setAttribute('srcset', image.getAttribute('data-srcset'))
            image.removeAttribute('data-srcset')
        }
    }

}