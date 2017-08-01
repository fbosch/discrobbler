import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../../store'
import * as lastFmActions from '../../store/actions/lastfm.actions'
import * as pageActions from '../../store/actions/page.actions'

@Component({
    props: {
        queue: Array
    }
})
export default class ScrobblingQueue extends Vue {

    clearQueue() {
        store.dispatch(lastFmActions.clearQueue())
        store.dispatch(pageActions.showMessage('Your scrobbling queue was cleared'))
    }

    removeTrackFromQueue(track) {
        store.dispatch(lastFmActions.removeTracksFromQueue([track]))
    }

}