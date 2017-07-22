import * as actions from '../actions/discogs.actions'

export default (state = {}, action) => {
    switch (action.type) {
        
        case actions.DISCOGS_FETCH_USER_REQUEST:
        case actions.DISCOGS_FETCH_USER_FAILURE:
            return {
                ...state,
                authenticated: false
            }

        case actions.DISCOGS_FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                authenticated: true
            }

        case actions.DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS:
            return {
                ...state,
                folders: action.payload.folders
            }

        case actions.DISCOGS_FETCH_USER_COLLECTION_REQUEST:
            return {
                ...state,
                collection: [],
                collectionIsLoading: true
            }

        case actions.DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS:
            return {
                ...state,
                collection: [action.payload.releases].concat(state.collection)[0],
                collectionIsLoading: false,
                lastCollectionFetchDate: new Date(),
                lastCollectionFetchUserId: {...state}.user.id
            }
        
        case actions.DISCOGS_CLEAR_STATE: 
            return { }

        default: return state
    }
}