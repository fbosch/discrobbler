import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../../store'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import * as pageActions from '../../store/actions/page.actions'
import router, { views } from '../../router'

@Component
export default class Logout extends Vue {

  created () {
    store.dispatch(discogsActions.clearState())
    store.dispatch(lastFmActions.clearState())
    store.dispatch(pageActions.showMessage("You've been successfully logged out"))
    requestAnimationFrame(() => router.push(views.login))
  }

}
