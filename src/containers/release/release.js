import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../../router'
import store from '../../store'
import get from 'lodash.get'
import trimEnd from 'lodash.trimend'
import lastFm from '../../api/lastfm'
import Vibrant from 'node-vibrant'

import { removeBrackets } from '../../utils'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as pageActions from '../../store/actions/page.actions'
import * as lastFmActions from '../../store/actions/lastfm.actions'

import vinylIcon from '../../static/vinyl.svg'
import cdIcon from '../../static/cd.svg'
import cassetteIcon from '../../static/cassette.svg'

@Component
export default class Release extends Vue {
    releaseIsLoading = true
    release = null
    releaseCoverImage = null
    fallbackThumb = null
    artworkColor = null

    get releaseCoverImageSrcSet() {
        return `${this.releaseCoverImage[0]['#text']} 50w, ${this.releaseCoverImage[1]['#text']} 100w, ${this.releaseCoverImage[2]['#text']} 300w, ${this.releaseCoverImage[3]['#text']} 450w, ${this.releaseCoverImage[4]['#text']} 500w`
    }

    get lowestQualityCover() {
        if (this.releaseCoverImage) {
            return this.releaseCoverImage[0]['#text']
        } else {
            return this.getFallbackThumb()
        }
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

    created() {
        this.changeToolbarColorBasedOnCurrentCoverImage()
        store.dispatch(pageActions.searchClear())
        store.dispatch(discogsActions.fetchRelease(router.currentRoute.params.id))
            .then(response => {
                this.release = response.payload
                this.releaseIsLoading = false                
                const artistName = trimEnd(removeBrackets(this.release.artists[0].name))
                // TODO: Refactor to use redux actions
                lastFm.getAlbumInfo(artistName, this.release.title)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            this.fallbackThumb = this.getFallbackThumb()
                        } else {
                            this.releaseCoverImage = data.album.image
                        }
                        this.changeToolbarColorBasedOnCurrentCoverImage()
                    })
            })
    }

    changeToolbarColorBasedOnCurrentCoverImage() {
        if (!this.artworkColor && this.release) {
            const toolbar = document.querySelector('.md-theme-default.md-toolbar')
            this.initialToolbarColor = getComputedStyle(toolbar).backgroundColor
            Vibrant.from(this.lowestQualityCover)
                .getPalette((error, palette) => {
                    if (!error) {
                        if (palette.Muted) {
                            store.dispatch(pageActions.changeToolbarBackground(palette.Muted.getHex()))
                            this.artworkColor = palette.Muted.getHex()
                        }
                    }
                })
        }
    }

    updateNowPlaying(trackName) {
        console.log(this.release)
        store.dispatch(lastFmActions.updateNowPlaying(this.release.artists[0].name, this.release.title, trackName, store.getState().lastfm.session))
        .then(() => store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name)))
    }

    imageLoaded(event) {
        this.changeToolbarColorBasedOnCurrentCoverImage()
        if (!event.target.classList.contains('loaded')) event.target.classList.add('loaded')
    }

    getFallbackThumb() {
        const collection = get(store.getState(), 'discogs.collection', null)
        if (collection) {
            const item = collection.find(item => item.id === this.release.id)
            if (item) {
                return item.basic_information.thumb
            }
        }
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