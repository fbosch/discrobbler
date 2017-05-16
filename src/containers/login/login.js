import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser } from '../../store/actions/discogs.actions'
import router, { views } from '../../router'
import get from 'lodash.get'

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
        store.subscribe(handleChange)
    }

    getUser() {
        store.dispatch(fetchUser(this.discogsUserName))
    }

}
