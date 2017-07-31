import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import * as pageActions from '../../store/actions/page.actions'
import ifVisible from 'ifvisible.js'

@Component
export default class App extends Vue {
    lastfmSession = store.getState().lastfm.session || null
    discogsAuthenticated = false
    queue = store.getState().lastfm.queue || []
    recentTracks = store.getState().lastfm.recentTracks || null


    static getRecentTracks() {
        if (get(store.getState(), 'lastfm.session.name', false)) {
            store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
        }
    }

    mounted() {
        App.getRecentTracks() 
        setInterval(() => ifVisible.now() && App.getRecentTracks(), 24000)    
        this.beforeDestroy = store.subscribe(() => {
            const queueFromState = store.getState().lastfm.queue
            if (queueFromState !== this.queue)
                this.queue = queueFromState       
            
            this.recentTracks = store.getState().lastfm.recentTracks

            const currentLastfmWebsession = store.getState().lastfm.session 
            if (currentLastfmWebsession !== this.lastfmSession) {
                this.lastfmSession = currentLastfmWebsession
            }
        })
    }

    toggleSideNav() {
        store.dispatch(pageActions.toggleSideNav())
	}
			



}