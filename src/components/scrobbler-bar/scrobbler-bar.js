import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../../store'
import get from 'lodash.get'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import moment from 'moment'
import ifVisible from 'ifvisible.js'

@Component
export default class ScrobblerBar extends Vue {
    nowScrobbling = false
    trackBeingScrobbled = null

    static getRecentTracks() {
        if (get(store.getState(), 'lastfm.session.name', false)) {
            store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
        }
    }

    created() {
        setInterval(() => {
            if (ifVisible.now())
                ScrobblerBar.getRecentTracks()
        }, 12000)
    }

    mounted() {
        ScrobblerBar.getRecentTracks()
        this.beforeDestroy = store.subscribe(() => {
            const recentTracks = store.getState().lastfm.recentTracks
            if (recentTracks) {
                this.recentTracks = recentTracks
                this.nowScrobbling = get(recentTracks.track[0], '@attr.nowplaying', false)
                const mostRecentTrack = recentTracks.track[0]
                if(this.nowScrobbling) {
                    this.trackBeingScrobbled = mostRecentTrack
                }
                else if(mostRecentTrack.date) {
                    const timeOfScrobble = moment(mostRecentTrack.date.uts, 'X')
                    if (moment() < timeOfScrobble.add({ minutes: 5 })) {
                        this.trackBeingScrobbled = mostRecentTrack
                    }
                }
            } else {
                this.nowScrobbling = false                
                this.recentTracks = []
                this.trackBeingScrobbled = null
            }
        })
    }

}