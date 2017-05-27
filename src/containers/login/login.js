import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser } from '../../store/actions/discogs.actions'
import router, { views } from '../../router'
import get from 'lodash.get'
import keys from '../../keys'
import lastfm from '../../api/lastfm'
import { setLastfmAuthenticationToken, getWebSession } from '../../store/actions/lastfm.actions'
import queryString from 'query-string'

@Component
export default class Login extends Vue {
    discogsUsername = null
    lastfmUsername = null
    lastfmPassword = null

    mounted() {
        const parsedQueryString = queryString.parse(location.search)
        if (router.currentRoute.name === 'authenticate' && parsedQueryString.token !== null) {
            switch (router.currentRoute.params.auth) {
                case 'lastfm':
                    store.dispatch(setLastfmAuthenticationToken(parsedQueryString.token))
                    window.location = location.origin + '/#/login'
                    break;
            }
        }

        const getUserFromState = () => get(store.getState(), 'discogs.user', undefined)

        const lastfmToken = get(store.getState(), 'lastfm.authenticationToken', undefined)
        const lastfmSession = get(store.getState(), 'lastfm.websession', undefined)
        if (lastfmToken && !lastfmSession) store.dispatch(getWebSession(lastfmToken))

        console.log(lastfmToken, lastfmSession)

        let currentUserValue = getUserFromState()
        const observer = () => {
            let previousUserValue = currentUserValue
            currentUserValue = getUserFromState()

            if (previousUserValue !== currentUserValue && currentUserValue !== null) {
                router.push(views.dashboard)
            }
        }

        this.beforeDestroy = store.subscribe(observer)
    }

    authorizeLastfm() {
        lastfm.authenticateUser()
    }

    authorizeDiscogs() {

    }

    getUser() {
        store.dispatch(fetchUser(this.discogsUsername))
    }

}
