import api from '../../api/discogs'

function handleReponse(response, dispatch, errorActionType) {
    if (response.status >= 400) {
        dispatch({ type: errorActionType, payload: response.message })
    }
    return response.json()
}

export const DISCOGS_USER_FETCH = 'discogs/USER_FETCH'
export const DISCOGS_USER_ERROR = 'discogs/USER_ERROR'
export const DISCOGS_USER_RECEIVED = 'discogs/USER_RECEIVED'

export function fetchUser(username) {
    return dispatch => {
        dispatch({ type: DISCOGS_USER_FETCH })
        return api.getUserDetails(username)
            .then(response => handleReponse(response, dispatch, DISCOGS_COLLECTION_FOLDERS_ERROR))
            .then(user => dispatch({ type: DISCOGS_USER_RECEIVED, payload: user }))
    }
}

export const DISCOGS_COLLECTION_FOLDERS_FETCH = 'discogs/COLLECTION_FOLDERS_FETCH'
export const DISCOGS_COLLECTION_FOLDERS_ERROR = 'discogs/COLLECTION_FOLDERS_ERROR'
export const DISCOGS_COLLECTION_FOLDERS_RECEIVED = 'discogs/COLLECTION_FOLDERS_RECEIVED'

export function fetchCollectionFolders(username) {
    return dispatch => {
        dispatch({ type: DISCOGS_COLLECTION_FOLDERS_FETCH })
        return api.getCollectionFolders(username)
            .then(response => handleReponse(response, dispatch, DISCOGS_COLLECTION_FOLDERS_ERROR))
            .then(collectionFolders => dispatch({ type: DISCOGS_COLLECTION_FOLDERS_RECEIVED, payload: collectionFolders }))
    }
}

export const DISCOGS_COLLECTION_ITEMS_FETCH = 'discogs/COLLECTION_ITEMS_FETCH'
export const DISCOGS_COLLECTION_ITEMS_ERROR = 'discogs/COLLECTION_ITEMS_ERROR'
export const DISCOGS_COLLECTION_ITEMS_RECEIVED = 'discogs/COLLECTION_ITEMS_RECEIVED'

export function fetchCollectionItems(username, folderId) {
    return dispatch => {
        dispatch({ type: DISCOGS_COLLECTION_ITEMS_FETCH })
        return api.getCollectionItemsByFolderId(username, folderId)
            .then(response => handleReponse(response, dispatch, DISCOGS_COLLECTION_ITEMS_ERROR))
            .then(collectionItems => dispatch({ type: DISCOGS_COLLECTION_ITEMS_RECEIVED, payload: collectionItems }))
    }
}

export const DISCOGS_USER_COLLECTION_FETCH = 'discogs/USER_COLLECTION_FETCH'
export const DISCOGS_USER_COLLECTION_ERROR = 'discogs/USER_COLLECTION_ERROR'
export const DISCOGS_USER_COLLECTION_RECEIVED = 'discogs/USER_COLLECTION_RECEIVED'

export function fetchUserCollection(username) {
    return (dispatch, getState) => {
        dispatch({ type: DISCOGS_USER_COLLECTION_FETCH })
        return dispatch(fetchCollectionFolders(username))
            .then(() => {
                const folders = getState().discogs.folders
                folders.forEach(folder => dispatch(fetchCollectionItems(username, folder.id)))
            })
    }
}