import Vue from 'vue'
import Component from 'vue-class-component'


import store from '../../store'
import * as discogsActions from '../../store/actions/discogs.actions'
import * as lastfmActions from '../../store/actions/lastfm.actions'
import router, { views } from '../../router'


@Component
export default class Logout extends Vue {

	created() {
		store.dispatch(discogsActions.clearState())
		store.dispatch(lastfmActions.clearState())
		router.push(views.login)
	}

}