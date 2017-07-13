import {
    DISCOGS_USER_RECEIVED,
    DISCOGS_COLLECTION_FOLDERS_RECEIVED,
    DISCOGS_COLLECTION_ITEMS_RECEIVED,
    DISCOGS_USER_COLLECTION_FETCH,
    DISCOGS_RELEASE_FETCH,
    DISCOGS_RELEASE_RECEIVED,
    DISCOGS_USER_FETCH,
    DISCOGS_USER_ERROR,
    DISCOGS_CLEAR_ALL_DATA
} from '../actions/discogs.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case DISCOGS_USER_FETCH:
        case DISCOGS_USER_ERROR:
            return {
                ...state,
                authenticated: false
            }

        case DISCOGS_USER_RECEIVED:
            return {
                ...state,
                user: action.payload,
                authenticated: true
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
                lastCollectionFetchDate: new Date(),
                lastCollectionFetchUserId: {...state}.user.id
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
        
        case DISCOGS_CLEAR_ALL_DATA: 
            return { }

        default: return state
    }
}