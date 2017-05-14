import {
    DISCOGS_USER_RECEIVED
} from '../actions/discogs.actions'

export default (state = { }, action) => {
    switch (action.type) {

        case DISCOGS_USER_RECEIVED:
            return {
                ...state,
                user: action.payload
            }

        default: return state
    }
}