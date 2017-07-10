import {
    LASTFM_SET_AUTHENTICATION_TOKEN,
    LASTFM_WEB_SESSION_RECEIVED,
    LASTFM_CLEAR_AUTHENTICATION_TOKEN
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
        
        case LASTFM_CLEAR_AUTHENTICATION_TOKEN:
            return {
                ...state, 
                websession: null,
                authenticationToken: null
            }
            

        default: return state
    }
}