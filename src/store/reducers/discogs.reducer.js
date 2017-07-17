import {
    DISCOGS_FETCH_USER_SUCCESS,
    DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS,
    DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS,
    DISCOGS_FETCH_USER_COLLECTION_REQUEST,
    DISCOGS_FETCH_RELEASE_REQUEST,
    DISCOGS_FETCH_RELEASE_SUCCESS,
    DISCOGS_FETCH_USER_REQUEST,
    DISCOGS_FETCH_USER_FAILURE,
    DISCOGS_CLEAR_STATE
} from '../actions/discogs.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case DISCOGS_FETCH_USER_REQUEST:
        case DISCOGS_FETCH_USER_FAILURE:
            return {
                ...state,
                authenticated: false
            }

        case DISCOGS_FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                authenticated: true
            }

        case DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS:
            return {
                ...state,
                folders: action.payload.folders
            }

        case DISCOGS_FETCH_USER_COLLECTION_REQUEST:
            return {
                ...state,
                collection: [],
                collectionIsLoading: true
            }

        case DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS:
            return {
                ...state,
                collection: [action.payload.releases].concat(state.collection)[0],
                collectionIsLoading: false,
                lastCollectionFetchDate: new Date(),
                lastCollectionFetchUserId: {...state}.user.id
            }

        case DISCOGS_FETCH_RELEASE_REQUEST:
            return {
                ...state,
                selectedRelease: null,
                selectedReleaseLoading: true
            }

        case DISCOGS_FETCH_RELEASE_SUCCESS:
            return {
                ...state,
                selectedRelease: action.payload,
                selectedReleaseLoading: false
            }
        
        case DISCOGS_CLEAR_STATE: 
            return { }

        default: return state
    }
}