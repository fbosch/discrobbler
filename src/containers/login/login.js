import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import router, { views } from '../../router'
import get from 'lodash.get'
import keys from '../../keys'
import lastfm from '../../api/lastfm'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import * as pageActions from '../../store/actions/page.actions'
import queryString from 'query-string'
import viewports from '../../viewports'

@Component
export default class Login extends Vue {
    discogsUser = Login.getDiscogsUser()
    discogsUsername = Login.getDiscogsUsername()
    lastfmSession = Login.getLastfmSession()

    static getLastfmSession = () => get(store.getState(), 'lastfm.session', null)
    static getDiscogsUser = () => get(store.getState(),'discogs.user', null)
    static getDiscogsUsername = () => get(store.getState(),'discogs.user.username', null)

    created() {
        if (router.currentRoute.name === 'logout') {
            this.unauthorize()
            store.dispatch(pageActions.showMessage("You've been successfully logged out"))                        
            requestAnimationFrame(() => router.push(views.login))   
        }
    }

    mounted() {
        const parsedQueryString = queryString.parse(location.search)
        if (router.currentRoute.name === 'authenticate' && parsedQueryString.token !== null) {
            switch (router.currentRoute.params.auth) {
                case 'lastfm':
                    store.dispatch(lastFmActions.setAuthenticationToken(parsedQueryString.token))
                    break
            }
        }
        const lastfmToken = store.getState().lastfm.authenticationToken
        const lastfmSession = store.getState().lastfm.session
        if (lastfmToken && !lastfmSession) store.dispatch(lastFmActions.getSession(lastfmToken))
        this.beforeDestroy = store.subscribe(() => {
            this.lastfmSession = Login.getLastfmSession()
            this.discogsUser = Login.getDiscogsUser()
            this.discogsUsername = Login.getDiscogsUsername()
        })
    }

    get isMobile() {
        return this.$currentViewport._windowWidth <= viewports.mobile
    }

    authorizeLastfm() {
        store.dispatch(pageActions.clearMessage())
        store.dispatch(lastFmActions.authenticateUser())
    }

    authorizeDiscogs() {
        store.dispatch(discogsActions.fetchUser(this.discogsUsername))
        .then(() => {
            store.dispatch(lastFmActions.getRecentTracks(store.getState().lastfm.session.name))
            router.push(views.home)
        })
    }

    unauthorize() {
        store.dispatch(discogsActions.clearState())
        store.dispatch(lastFmActions.clearState())
    }
}
