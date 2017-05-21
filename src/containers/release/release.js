import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../../router'
import store from '../../store'
import get from 'lodash.get'
import { fetchRelease, clearSelectedRelease } from '../../store/actions/discogs.actions'
import { changeToolbarBackground, resetToolbarBackground } from '../../store/actions/page.actions'
import lastFm from '../../api/lastfm'
import Vibrant from 'node-vibrant'

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

    mounted() {
        const getReleaseLoadingState = state => get(state, 'discogs.selectedReleaseLoading', this.releaseIsLoading)
        const getRelease = state => get(state, 'discogs.selectedRelease', null)
        store.dispatch(fetchRelease(router.currentRoute.params.id))
        this.unsubscribe = store.subscribe(() => {
            const state = store.getState()
            this.releaseIsLoading = getReleaseLoadingState(state)
            if (!this.releaseIsLoading) {
                if (getRelease(state) !== this.release) {
                    this.release = getRelease(state)
                    lastFm.getAlbumInfo(this.release.artists[0].name, this.release.title)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                this.fallbackThumb = this.getFallbackThumb()
                            } else {
                                this.releaseCoverImage = data.album.image
                            }
                        })
                }
            }
        })
    }

    imageLoaded(event) {
        if (!this.artworkColor) {
            const toolbar = document.querySelector('.md-theme-default.md-toolbar')
            this.initialToolbarColor = getComputedStyle(toolbar).backgroundColor
            event.target.classList.add('loaded')
            Vibrant.from(event.target.src).getPalette((error, palette) => {
                if (!error) {
                    if (palette.Muted) {
                        store.dispatch(changeToolbarBackground(palette.Muted.getHex()))
                        this.artworkColor = palette.Muted.getHex()
                    }
                }
            })
        }
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
        const image = this.$el.querySelector('img[data-srcset]')
        if (image) image.setAttribute('srcset', image.getAttribute('data-srcset'))
    }

    beforeDestroy() {
        if (this.unsubscribe) this.unsubscribe()
        store.dispatch(resetToolbarBackground())
        store.dispatch(clearSelectedRelease())
    }



}