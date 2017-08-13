<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import store from '../store'
import get from 'lodash.get'
import * as lastFmActions from '../store/actions/lastfm.actions'
import moment from 'moment'

@Component({
	props: {
		recentTracks: Object,
		queue: Array
	}
})
export default class ScrobblerBar extends Vue {
	@Watch('queue')
	onQueueUpdate = (newVal) => {
		if (newVal) {
			if (newVal.length === 0 && this.$refs.queueTable) {
				this.$refs.queueTable.close()
			}
			if (newVal.length !== 0 && this.$refs.queueTable && this.$refs.queueTable.active) {
				this.$refs.queueTable.open()
			}
		}
	}

	get mostRecentTrack() {
		if (this.recentTracks && this.recentTracks.track) {
			return this.recentTracks.track[0]
		} else {
			return null
		}
	}

	get nowScrobbling() {
		if (!this.mostRecentTrack) return false
		return !!get(this.mostRecentTrack, '@attr.nowplaying', false)
	}

	get trackBeingScrobbled() {
		if (!this.mostRecentTrack) return null
		if (this.nowScrobbling) {
			return this.mostRecentTrack
		} else if (this.mostRecentTrack.date) {
			const timeOfScrobble = moment(this.mostRecentTrack.date.uts, 'X')
			if (moment() < timeOfScrobble.add({ minutes: 8 })) {
				return this.mostRecentTrack
			} else {
				return null
			}
		}
	}
}
</script>
<template>
<md-toolbar class="scrobbler-bar md-dense">
  <div class="md-toolbar-container">
    <transition name="fade">
      <div class="scrobbler-bar__now-scrobbling" v-if="trackBeingScrobbled">
        <md-avatar class="scrobbler-bar__now-scrobbling__icon">
          <img :src="trackBeingScrobbled.image[2]['#text']" :alt="trackBeingScrobbled.album['#text']">
          <md-spinner :md-size="60" :md-stroke="3" md-indeterminate class="md-accent" v-if="nowScrobbling"></md-spinner>
        </md-avatar>
        <md-card-header class="scrobbler-bar__now-scrobbling__info">
          <div class="md-title scrobbler-bar__song-name">
            {{ trackBeingScrobbled.name }}
          </div>
          <div class="md-subhead scrobbler-bar__album-artist">
            {{ trackBeingScrobbled.album['#text'] }} - {{ trackBeingScrobbled.artist['#text'] }}
          </div>
        </md-card-header>
      </div>
    </transition>
    <div style="flex: 1"></div>
  </div>
</md-toolbar>
</template>
<style lang="scss" scoped>
.scrobbler-bar {
    background-color: #222;    
    width: 100%;
    padding: 0;

    &__song-name,
    &__album-artist {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
    }
    &__queue-count {
        z-index: 99;
        display: block;
        background: #f44336;
        color: white;
        font-weight: 900;
        height: 17px;
        width: 17px;
        position: absolute;
        bottom: -2px;
        left: -6px;
        text-align: center;
        font-size: 12px;
        padding-top: 3px;
        border-radius: 100%;
        font-family: 'Roboto';
        text-shadow: 0px 0px 3px rgba(0, 0, 0, 1);
    }
    &__now-scrobbling {
        &__icon {
            height: 50px;
            width: 50px;
            float: left;
            margin: 0 20px 0 20px;
            background-image: url('https://res.cloudinary.com/discrobbler/image/upload/v1502580383/record_qbx3po.svg')
        }
        &__info {
            width: 70vw;
        }
    }
}
</style>
