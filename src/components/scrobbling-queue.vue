<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import store from '../store'
import * as lastFmActions from '../store/actions/lastfm.actions'
import * as pageActions from '../store/actions/page.actions'

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
</script>
<template>
<div class="scrobbling-queue">
    <md-layout>
        <md-subheader>
            Scrobble Queue
        </md-subheader>
        <span style="flex: 1"></span>
        <md-button class="md-raised md-warn" @click.native="clearQueue">
            clear
        </md-button>
    </md-layout>
    <md-table v-if="queue">
        <md-table-header>
            <md-table-row>
                <md-table-cell>
                    Track
                </md-table-cell>
                <md-table-cell>
                    Duration
                </md-table-cell>
            </md-table-row>
        </md-table-header>
        <md-table-body>
            <md-table-row v-for="track in queue" :key="track.uniqueId">
                <md-table-cell>
                    {{ track.title }}
                </md-table-cell>
                <md-table-cell>
                    <span v-if="track.duration">
                    {{ track.duration }}
                    </span>
                    <span v-else>
                    --:--
                    </span>
                </md-table-cell>
                <md-table-cell>
                    <md-button class="md-icon-button" @click.native="removeTrackFromQueue(track)">
                        <md-icon>
                            remove_circle
                        </md-icon>
                    </md-button>
                </md-table-cell>
            </md-table-row>
        </md-table-body>
    </md-table>
</div>
</template>
