import api from '../../api/discogs'
const prefix = 'discogs/'

export const DISCOGS_CLEAR_SELECTED_RELEASE = prefix + 'CLEAR_SELECTED_RELEASE'
export const DISCOGS_CLEAR_ALL_DATA = prefix + 'CLEAR_ALL_DATA'

function handleResponse (response, dispatch, errorActionType) {
  if (response.status >= 400) {
    dispatch({ type: errorActionType, payload: response.message })
  }
  return response.json()
}

export const DISCOGS_USER_FETCH = prefix + 'USER_FETCH'
export const DISCOGS_USER_ERROR = prefix + 'USER_ERROR'
export const DISCOGS_USER_RECEIVED = prefix + 'USER_RECEIVED'

export function fetchUser (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_USER_FETCH })
    return api.getUserDetails(username)
      .then(response => handleResponse(response, dispatch, DISCOGS_COLLECTION_FOLDERS_ERROR))
      .then(payload => dispatch({ type: DISCOGS_USER_RECEIVED, payload }))
  }
}

export const DISCOGS_COLLECTION_FOLDERS_FETCH = prefix + 'COLLECTION_FOLDERS_FETCH'
export const DISCOGS_COLLECTION_FOLDERS_ERROR = prefix + 'COLLECTION_FOLDERS_ERROR'
export const DISCOGS_COLLECTION_FOLDERS_RECEIVED = prefix + 'COLLECTION_FOLDERS_RECEIVED'

export function fetchCollectionFolders (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_COLLECTION_FOLDERS_FETCH })
    return api.getCollectionFolders(username)
      .then(response => handleResponse(response, dispatch, DISCOGS_COLLECTION_FOLDERS_ERROR))
      .then(payload => dispatch({ type: DISCOGS_COLLECTION_FOLDERS_RECEIVED, payload }))
  }
}

export const DISCOGS_COLLECTION_ITEMS_FETCH = prefix + 'COLLECTION_ITEMS_FETCH'
export const DISCOGS_COLLECTION_ITEMS_ERROR = prefix + 'COLLECTION_ITEMS_ERROR'
export const DISCOGS_COLLECTION_ITEMS_RECEIVED = prefix + 'COLLECTION_ITEMS_RECEIVED'

export function fetchCollectionItems (username, folderId) {
  return dispatch => {
    dispatch({ type: DISCOGS_COLLECTION_ITEMS_FETCH })
    return api.getCollectionItemsByFolderId(username, folderId)
      .then(response => handleResponse(response, dispatch, DISCOGS_COLLECTION_ITEMS_ERROR))
      .then(payload => dispatch({ type: DISCOGS_COLLECTION_ITEMS_RECEIVED, payload }))
  }
}

export const DISCOGS_USER_COLLECTION_FETCH = prefix + 'USER_COLLECTION_FETCH'
export const DISCOGS_USER_COLLECTION_ERROR = prefix + 'USER_COLLECTION_ERROR'
export const DISCOGS_USER_COLLECTION_RECEIVED = prefix + 'USER_COLLECTION_RECEIVED'

export function fetchUserCollection (username) {
  return (dispatch, getState) => {
    dispatch({ type: DISCOGS_USER_COLLECTION_FETCH })
    return dispatch(fetchCollectionFolders(username))
      .then(() => getState().discogs.folders.map(folder => dispatch(fetchCollectionItems(username, folder.id))))
      .then(() => dispatch({ type: DISCOGS_USER_COLLECTION_RECEIVED }))
  }
}

export const DISCOGS_RELEASE_FETCH = prefix + 'RELEASE_FETCH'
export const DISCOGS_RELEASE_ERROR = prefix + 'RELEASE_ERROR'
export const DISCOGS_RELEASE_RECEIVED = prefix + 'RELEASE_RECEIVED'

export function fetchRelease (releaseId) {
  return dispatch => {
    dispatch({ type: DISCOGS_RELEASE_FETCH })
    return api.getRelease(releaseId)
      .then(response => handleResponse(response, dispatch, DISCOGS_RELEASE_ERROR))
      .then(payload => dispatch({ type: DISCOGS_RELEASE_RECEIVED, payload }))
  }
}
