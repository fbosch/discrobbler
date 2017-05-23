import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser } from '../../store/actions/discogs.actions'
import router, { views } from '../../router'
import get from 'lodash.get'
import keys from '../../keys'
import { Client as Discogs } from 'disconnect'


@Component
export default class Login extends Vue {
    discogsUserName = null

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

    authorizeLastFM() {

    }

    authorizeDiscogs() {
        const oAuth = new Discogs().oauth();
        oAuth.getRequestToken(
            keys.discogs.key,
            keys.discogs.secret,
            'https://github.com/fBosch/vue-discogs-scrobbler/callback',
            function(err, requestData) {
                console.log(err, requestData)
            }
        )
    }

    getUser() {
        store.dispatch(fetchUser(this.discogsUserName))
    }

    beforeDestroy() {
        this.unsubscribe()
    }

}
