import {
    LASTFM_SET_AUTHENTICATION_TOKEN,
    LASTFM_FETCH_SESSION_SUCCESS,
    LASTFM_CLEAR_AUTHENTICATION_TOKEN,
    LASTFM_CLEAR_STATE,
    LASTFM_FETCH_RECENT_TRACKS_SUCCESS
} from '../actions/lastfm.actions'


export default (state = {}, action) => {
    switch (action.type) {

        case LASTFM_SET_AUTHENTICATION_TOKEN:
            return {
                ...state,
                authenticationToken: action.payload
            }

        case LASTFM_FETCH_SESSION_SUCCESS:
            return {
                ...state,
                session: action.payload.session
            }
        
        case LASTFM_FETCH_RECENT_TRACKS_SUCCESS: 
            return {
                ...state,
                recentTracks: action.payload.recenttracks
            }
        
        case LASTFM_CLEAR_STATE: 
            return { }

        default: return state
    }
}