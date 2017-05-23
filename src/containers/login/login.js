import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser } from '../../store/actions/discogs.actions'
import router, { views } from '../../router'
import get from 'lodash.get'
import keys from '../../keys'
import { Client as Discogs } from 'disconnect'
import md5 from 'js-md5'
import Lastfm from 'simple-lastfm'


@Component
export default class Login extends Vue {
    discogsUsername = null
    lastfmUsername = null
    lastfmPassword = null

    mounted() {
        const select = state => get(state, 'discogs.user', undefined)

        let currentValue = select(store.getState())
        const handleChange = () => {
            let previousValue = currentValue
            currentValue = select(store.getState())
            if (previousValue !== currentValue && currentValue !== null) {
                router.push(views.dashboard)
            }
        }
        this.unsubscribe = store.subscribe(handleChange)
        console.log(Discogs)
    }

    authorizeLastfm() {
        const lastfm = new Lastfm({
            api_key: keys.lastfm.key,
            api_secret: keys.lastfm.secret,
            username: this.lastfmUsername,
            password: this.lastfmPassword,
            authToken: md5(this.lastfmUsername + md5(this.lastfmPassword))
        })

        lastfm.scrobbleTrack({
            artist: 'Post Malone',
            track: 'Congratulations',
            callback: result => {
                console.log(result)
            }
        })
    }

    authorizeDiscogs() {
        // const oAuth = new Discogs().oauth();
        // oAuth.getRequestToken(
        //     keys.discogs.key,
        //     keys.discogs.secret,
        //     'https://github.com/fBosch/vue-discogs-scrobbler/callback',
        //     function(err, requestData) {
        //         console.log(err, requestData)
        //     }
        // )
    }

    getUser() {
        store.dispatch(fetchUser(this.discogsUsername))
    }

    beforeDestroy() {
        this.unsubscribe()
    }

}
