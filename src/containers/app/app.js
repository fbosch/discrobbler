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
    snackbarDuration = 1200
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
        const getLastFmSession = () => get(store.getState(), 'lastfm.session', null)
        const getRecentTracks = () => get(store.getState(), 'lastfm.recentTracks', null)
        const getQueue = () => get(store.getState(), 'lastfm.queue', [])
        const getMessage = () => get(store.getState(), 'page.message', null)

        App.getRecentTracks() 
        setInterval(() => ifVisible.now() && App.getRecentTracks(), 24000)    
        this.beforeDestroy = store.subscribe(() => {
            const queueFromState = getQueue()
            if (queueFromState !== this.queue)
                this.queue = queueFromState   

            this.recentTracks = getRecentTracks()

            const currentLastfmWebsession = getLastFmSession()
            if (currentLastfmWebsession !== this.lastfmSession) 
                this.lastfmSession = currentLastfmWebsession
            
            if (this.snackbarMessage !== getMessage()) 
                this.snackbarMessage = getMessage()
            
        })
    }

    onSnackbarClose() {
        store.dispatch(pageActions.clearMessage())
    }

    toggleSideNav() {
        store.dispatch(pageActions.toggleSideNav())
	}

}