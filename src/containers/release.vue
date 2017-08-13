<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import router from '../router'
import store from '../store'
import get from 'lodash.get'
import trimEnd from 'lodash.trimend'
import hmsToSeconds from 'hms-to-seconds'

import { removeBrackets } from '../utils'
import * as discogsActions from '../store/actions/discogs.actions'
import * as pageActions from '../store/actions/page.actions'
import * as lastFmActions from '../store/actions/lastfm.actions'

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
        const cloudinaryPrefix = 'https://res.cloudinary.com/discrobbler/image/upload/'
        switch (this.release.formats[0].name.toLowerCase()) {
            case 'vinyl':
                return cloudinaryPrefix + 'v1502580048/vinyl_fqhrfw.svg'
            case 'cd':
                return cloudinaryPrefix + 'v1502580093/cd_x888r3.svg'
            case 'cassette':
                return cloudinaryPrefix + 'v1502580102/cassette_voki8m.svg'
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
</script>
<template>
<section class="release">
    <transition name="fade">
        <!-- <md-spinner :md-size="70" :md-stroke="1.5" md-indeterminate class="md-accent" v-if="!release"></md-spinner> -->
        <div class="release-item" >
            <md-card v-if="release">
                <md-card-media-cover md-solid>
                    <md-card-media md-ratio="1:1" class="release-item__cover" :style="{ backgroundImage: 'url(' + lowestQualityCover + ')' }">
                        <img v-if="releaseCoverImage" :src="lowestQualityCover" @load="imageLoaded" :data-srcset="releaseCoverImageSrcSet"
                            :style="{ backgroundImage: 'url(' + lowestQualityCover + ')' }" ref="albumCover">
                    </md-card-media>
                    <md-card-area>
                        <div class="container">
                            <md-card-header>
                                <div class="md-title">
                                    {{ release.title }}
                                </div>
                                <div class="md-subheading">
                                    <span v-on:click="search(release.artists[0].name)" class="clickable">
                                        {{ release.artists[0].name }}
                                    </span>
                                    <div class="md-subheading">
                                        <md-icon class="release-item__format-icon">
                                            <img :src="releaseFormatIcon" :alt="release.formats[0].name" v-if="releaseFormatIcon">
                                            <span v-else>
                                                music_note
                                            </span>
                                            <md-tooltip md-direction="right">{{ release.formats[0].name }}</md-tooltip>
                                        </md-icon>
                                    </div>
                                </div>
                            </md-card-header>
                            <md-card-actions class="release-item__genres">
                                <md-chip v-for="style in release.styles" :key="style">
                                    {{ style }}
                                </md-chip>
                            </md-card-actions>
                        </div>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>
            <div class="release-item__content container" v-if="release">
                <md-card>
                    <md-card-content>
                        <md-list>
                            <md-list-item v-for="track in release.tracklist" :key="track.title">
                                <span>{{ track.title }}</span>
                                <md-button class="md-icon-button md-list-action" @click.native="addTrackToQueue(track)"> 
                                    <md-icon>playlist_add</md-icon>
                                </md-button>
                            </md-list-item>
                        </md-list>
                    </md-card-content>
                </md-card>
            </div>
        </div>
    </transition>
</section>
</template>
<style  lang="scss">
.release-item {
    &__cover {
        user-select: none;
        max-height: 300px;
        min-height: 180px;
        height: 37vh;
        overflow: hidden;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: black;
        img {
            width: 100%;
            height: 100%;
            filter: blur(12px);
            opacity: 1;
            transform: scale(1.05);
            will-change: transform, filter;
            transition: transform .5s ease, filter 1s ease, opacity 1s linear .5s;
            position: relative;
            object-fit: cover;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            &.loaded {
                opacity: 1;
                filter: blur(0px);
                transform: scale(1);
            }
        }
    }
    &__thumb {
        filter: blur(20px);
    }
    &__content {
        margin-top: 15px;
    }
    &__genres {
        display: block !important;
        margin-bottom: 10px;
     
        .md-chip {
            margin-bottom: 2px;
        }
    }
    &__format-icon {
        padding-top: 5px;
        opacity: .6;
        transition: opacity .3s linear;
        will-change: opacity;
        &:hover {
            opacity: 1;
        }
    }
}</style>