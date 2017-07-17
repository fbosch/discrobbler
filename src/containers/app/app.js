import Vue from 'vue'
import store from '../../store'
import router, { views } from '../../router'
import Component from 'vue-class-component'
import get from 'lodash.get'
import { Watch } from 'vue-property-decorator'
import { PAGE_RESET_TOOLBAR_BACKGROUND } from '../../store/actions/page.actions'
import { getRecentTracks } from '../../store/actions/lastfm.actions'

@Component
export default class App extends Vue {
    avatar = null
    discogsName = null
    discogsUsername = null
    lastfmUsername = null
    toolbarColor = null
    discogsAuthenticated = false
    nowScrobbling = false
    trackBeingScrobbled = null

    created() {
        const initialDiscogsUserState = store.getState().discogs.user
        if (initialDiscogsUserState && router.currentRoute.path === '/') {
            router.push(views.dashboard)
        }
        setInterval(App.getRecentTracks, 12000)         
    }

    mounted() {
        App.getRecentTracks()
        this.updateViewStateFromStore()
        this.beforeDestroy = store.subscribe(this.updateViewStateFromStore)
        if (router.currentRoute.name !== 'release') {
            App.resetToolbarColor()
        }
    }

    get currentRouteName() {
        return router.currentRoute.name
    }

    static resetToolbarColor() {
        store.dispatch({ type: PAGE_RESET_TOOLBAR_BACKGROUND })
    }

    static getRecentTracks() {
        if (store.getState().lastfm.websession.name) {
            store.dispatch(getRecentTracks(store.getState().lastfm.websession.name))       
        }
    }
    
    updateViewStateFromStore() {
        const currentDiscogsUserState = store.getState().discogs.user
        if (currentDiscogsUserState) {
            if (this.avatar !== currentDiscogsUserState.avatar_url) {
                this.avatar = currentDiscogsUserState.avatar_url
                this.discogsName = currentDiscogsUserState.name
                this.discogsUsername = currentDiscogsUserState.username
            }
        }
        if (store.getState().discogs.authenticated !== this.discogsAuthenticated) {
            this.discogsAuthenticated = store.getState().discogs.authenticated
        }

        const currentLastfmWebsession = store.getState().lastfm.websession 
        if (currentLastfmWebsession) {
            this.lastfmUsername = currentLastfmWebsession.name
        }
        
        if (!this.discogsAuthenticated || !currentLastfmWebsession) {
            router.push(views.login)
        }

        const toolbarColor = store.getState().page.toolbarColor
        if (toolbarColor !== this.toolbarColor) {
            this.toolbarColor = toolbarColor
        }

        const recentTracks = store.getState().lastfm.recentTracks
        if (recentTracks) {
            this.recentTracks = recentTracks
            this.nowScrobbling = get(recentTracks.track[0], '@attr.nowplaying', false)
            this.trackBeingScrobbled = this.nowScrobbling ? recentTracks.track[0] : null
        }
    }

    toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle()
    }

    openDiscogsProfile() {
        window.open(`https://www.discogs.com/user/${this.discogsUsername}`, '_blank').focus()
   }

   openLastfmProfile() {
       window.open(`https://www.last.fm/user/${this.lastfmUsername}`, '_blank').focus()
   }
}