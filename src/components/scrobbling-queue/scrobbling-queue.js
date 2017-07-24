import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../../store'
import get from 'lodash.get'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import moment from 'moment'

@Component({
    props: {
        queue: Array
    }
})
export default class ScrobblingQueue extends Vue {

    clearQueue() {
        store.dispatch(lastFmActions.clearQueue())
    }

    removeTrackFromQueue(track) {
        store.dispatch(lastFmActions.removeTracksFromQueue([track]))
    }

}