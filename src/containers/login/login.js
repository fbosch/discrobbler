import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser, DISCOGS_CLEAR_ALL_DATA } from '../../store/actions/discogs.actions'
import router, { views } from '../../router'
import get from 'lodash.get'
import keys from '../../keys'
import lastfm from '../../api/lastfm'
import { setLastfmAuthenticationToken, getWebSession, LASTFM_CLEAR_ALL_DATA } from '../../store/actions/lastfm.actions'
import queryString from 'query-string'

@Component
export default class Login extends Vue {
    discogsUsername = get(store.getState(),'discogs.user.username', null)
    lastfmSession = store.getState().lastfm.websession || null

    mounted() {
        const parsedQueryString = queryString.parse(location.search)
        if (router.currentRoute.name === 'authenticate' && parsedQueryString.token !== null) {
            switch (router.currentRoute.params.auth) {
                case 'lastfm':
                    store.dispatch(setLastfmAuthenticationToken(parsedQueryString.token))
                    window.location = location.origin + '/login'
                    break
            }
        }
        const lastfmToken = store.getState().lastfm.authenticationToken
        const lastfmSession = store.getState().lastfm.websession
        if (lastfmToken && !lastfmSession) store.dispatch(getWebSession(lastfmToken))

        let currentDiscogsUserValue = store.getState().discogs.user
        this.beforeDestroy = store.subscribe(() => {
            let previousUserValue = currentDiscogsUserValue
            currentDiscogsUserValue = store.getState().discogs.user
            if (previousUserValue !== currentDiscogsUserValue && currentDiscogsUserValue !== null) {
                router.push(views.dashboard)
            }
            this.lastfmSession = store.getState().lastfm.websession
        })
    }

    authorizeLastfm() {
        lastfm.authenticateUser()
    }

    unauthorize() {
        store.dispatch({ type: LASTFM_CLEAR_ALL_DATA })
        store.dispatch({ type: DISCOGS_CLEAR_ALL_DATA })
    }

    authorizeDiscogs() {
        store.dispatch(fetchUser(this.discogsUsername))
    }

}
