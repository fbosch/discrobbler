import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import store from '../../store'
import get from 'lodash.get'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import moment from 'moment'

@Component({
    props: {
        recentTracks: Object,
        queue: Array
    }
})
export default class ScrobblerBar extends Vue {
    @Watch('queue')
    onQueueUpdate = newVal => {
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
            if (moment() > timeOfScrobble.add({ minutes: 8 })) {
                return this.mostRecentTrack
            } else {
                return null
            }
        }
    }
}