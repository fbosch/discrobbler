import {
    LASTFM_SET_AUTHENTICATION_TOKEN,
    LASTFM_WEB_SESSION_RECEIVED,
    LASTFM_CLEAR_AUTHENTICATION_TOKEN,
    LASTFM_CLEAR_ALL_DATA,
    LASTFM_GET_RECENT_TRACKS_RECEIVED
} from '../actions/lastfm.actions'


export default (state = {}, action) => {
    switch (action.type) {

        case LASTFM_SET_AUTHENTICATION_TOKEN:
            return {
                ...state,
                authenticationToken: action.payload
            }

        case LASTFM_WEB_SESSION_RECEIVED:
            return {
                ...state,
                websession: action.payload.session
            }
        
        case LASTFM_GET_RECENT_TRACKS_RECEIVED: 
            return {
                ...state,
                recentTracks: action.payload
            }
        
        case LASTFM_CLEAR_ALL_DATA: 
            return { }

        default: return state
    }
}