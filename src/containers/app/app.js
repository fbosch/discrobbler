import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import { Watch } from 'vue-property-decorator'
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
    snackbarDuration = 2500
    snackbarMessage = null

    static getRecentTracks() {
        if (get(store.getState(), 'lastfm.session.name', false)) {
            store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
        }
    }

    @Watch('snackbarMessage') 
    onMessageChange(newVal) {
        if(this.$refs.snackbar) {
            if(newVal !== null) {
                this.$refs.snackbar.open()
            } else {
                this.$refs.snackbar.close()
            }
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
            if (currentLastfmWebsession !== this.lastfmSession) 
                this.lastfmSession = currentLastfmWebsession
            
            if (this.snackbarMessage !== store.getState().page.message) 
                this.snackbarMessage = store.getState().page.message
            
        })
    }

    onSnackbarClose() {
        store.dispatch(pageActions.clearMessage())
    }

    toggleSideNav() {
        store.dispatch(pageActions.toggleSideNav())
	}

}