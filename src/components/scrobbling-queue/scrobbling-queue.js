import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../../store'
import * as lastFmActions from '../../store/actions/lastfm.actions'

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