import * as actions from '../actions/lastfm.actions'
import isArray from 'lodash.isarray'
import uniqueId from 'lodash.uniqueid'
import some from 'lodash.some'
import without from 'lodash.without'
import filter from 'lodash.filter'
import moment from 'moment'

export default (state = { queue: [] }, action) => {
    switch (action.type) {

        case actions.LASTFM_SET_AUTHENTICATION_TOKEN:
            return {
                ...state,
                authenticationToken: action.payload
            }

        case actions.LASTFM_FETCH_SESSION_SUCCESS:
            return {
                ...state,
                session: action.payload.session
            }
        
        case actions.LASTFM_FETCH_RECENT_TRACKS_SUCCESS: 
            return {
                ...state,
                recentTracks: action.payload.recenttracks
            }

        case actions.LASTFM_CLEAR_QUEUE: 
            return {
                ...state,
                queue: []
            }
        
        case actions.LASTFM_ADD_TRACKS_TO_QUEUE: 
            return {
                ...state,
                queue: [...state.queue || []].concat(action.payload)
            }
    
        case actions.LASTFM_REMOVE_TRACKS_FROM_QUEUE: 
            return {
                ...state,
                queue: [...state.queue]
                    .filter(track => !some([...action.payload].map(x => x.uniqueId === track.uniqueId)))
            }

        case actions.LASTFM_CLEAR_STATE: 
            return { }

        default: return state
    }
}