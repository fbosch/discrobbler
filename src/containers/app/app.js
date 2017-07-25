import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import { Watch } from 'vue-property-decorator'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import * as pageActions from '../../store/actions/page.actions'
import ifVisible from 'ifvisible.js'

@Component
export default class App extends Vue {
    lastfmSession = store.getState().lastfm.session || null
    discogsAuthenticated = false
    queue = store.getState().lastfm.queue || []
    recentTracks = store.getState().lastfm.recentTracks || null
    discogsUser = store.getState().discogs.user || null


    static getRecentTracks() {
        if (get(store.getState(), 'lastfm.session.name', false)) {
            store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
        }
    }

    created() {
        const initialDiscogsUserState = store.getState().discogs.user
        if (initialDiscogsUserState && router.currentRoute.path === '/') {
            router.push(views.dashboard)
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
            const currentDiscogsUserState = store.getState().discogs.user
            if (currentDiscogsUserState !== this.discogsUser) {
                this.discogsUser = currentDiscogsUserState
            }
            if (store.getState().discogs.authenticated !== this.discogsAuthenticated) {
                this.discogsAuthenticated = store.getState().discogs.authenticated
            }

            const currentLastfmWebsession = store.getState().lastfm.session 
            if (currentLastfmWebsession !== this.lastfmSession) {
                this.lastfmSession = currentLastfmWebsession
            }
            
            if ((!this.discogsAuthenticated || !this.lastfmSession) && router.currentRoute.name !== 'authenticate') {
                router.push(views.login)
            }
        })
    }

    get currentRouteName() {
        return router.currentRoute.name
    }

    get avatar() {
        if (this.discogsUser) {
            return this.discogsUser.avatar_url
        } else {
            return null
        }
    }

    toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle()
    }

    openDiscogsProfile() {
        window.open(`https://www.discogs.com/user/${this.discogsUser.username}`, '_blank').focus()
   }

   openLastfmProfile() {
       window.open(`https://www.last.fm/user/${this.lastfmSession.name}`, '_blank').focus()
   }
}