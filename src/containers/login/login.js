import Vue from 'vue'
import store from '../../store'
import { Component, Watch } from 'vue-property-decorator'
import { fetchUser } from '../../store/actions/discogs.actions'
import keycode from 'keycode'
import router, { views } from '../../router'

@Component
export default class Login extends Vue {
    discogsUserName = ''

    constructor() {
        super()
        const select = state => state.discogs.user
        let currentValue = select(store.getState())
        const handleChange = () => {
            let previousValue = currentValue
            currentValue = select(store.getState())
            if (previousValue !== currentValue && currentValue !== null) {
                router.push(views.dashboard.path)
            }
        }
        store.subscribe(handleChange)
    }

    getUser() {
        store.dispatch(fetchUser(this.discogsUserName))
    }

    getUserOnEnter(event) {
        if (keycode(event) === 'enter') this.getUser()
    }

}