import {
    DISCOGS_USER_RECEIVED,
    DISCOGS_COLLECTION_FOLDERS_RECEIVED,
    DISCOGS_COLLECTION_ITEMS_RECEIVED,
    DISCOGS_USER_COLLECTION_FETCH,
} from '../actions/discogs.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case DISCOGS_USER_RECEIVED:
            return {
                ...state,
                user: action.payload,
            }

        case DISCOGS_COLLECTION_FOLDERS_RECEIVED:
            return {
                ...state,
                folders: action.payload.folders
            }

        case DISCOGS_USER_COLLECTION_FETCH:
            return {
                ...state,
                collection: []
            }

        case DISCOGS_COLLECTION_ITEMS_RECEIVED:
            return {
                ...state,
                collection: [...state.collection, action.payload.releases]
            }

        default: return state
    }
}