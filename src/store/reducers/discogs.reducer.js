import {
    DISCOGS_USER_RECEIVED,
    DISCOGS_COLLECTION_FOLDERS_RECEIVED,
    DISCOGS_COLLECTION_ITEMS_RECEIVED,
    DISCOGS_USER_COLLECTION_FETCH,
    DISCOGS_RELEASE_FETCH,
    DISCOGS_RELEASE_RECEIVED
} from '../actions/discogs.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case DISCOGS_USER_RECEIVED:
            return {
                ...state,
                user: action.payload,
                collection: []
            }

        case DISCOGS_COLLECTION_FOLDERS_RECEIVED:
            return {
                ...state,
                folders: action.payload.folders
            }

        case DISCOGS_USER_COLLECTION_FETCH:
            return {
                ...state,
                collection: [],
                collectionIsLoading: true
            }

        case DISCOGS_COLLECTION_ITEMS_RECEIVED:
            return {
                ...state,
                collection: [action.payload.releases].concat(state.collection)[0],
                collectionIsLoading: false,
                lastCollectionFetch: new Date()
            }

        case DISCOGS_RELEASE_FETCH:
            return {
                ...state,
                selectedRelease: null,
                selectedReleaseLoading: true
            }

        case DISCOGS_RELEASE_RECEIVED:
            return {
                ...state,
                selectedRelease: action.payload,
                selectedReleaseLoading: false
            }

        default: return state
    }
}