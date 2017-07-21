import api from '../../api/discogs'
import { handleResponse } from '../../utils'

const prefix = 'discogs/'

export const DISCOGS_CLEAR_STATE = 'discogs/CLEAR_STATE'
export function clearState() {
  return { type: DISCOGS_CLEAR_STATE }
}

export const DISCOGS_FETCH_USER_REQUEST = 'discogs/FETCH_USER_REQUEST'
export const DISCOGS_FETCH_USER_FAILURE = 'discogs/FETCH_USER_FAILURE'
export const DISCOGS_FETCH_USER_SUCCESS = 'discogs/FETCH_USER_SUCCESS'

export function fetchUser (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_USER_REQUEST })
    return api.getUserDetails(username)
      .then(response => handleResponse(response, DISCOGS_FETCH_USER_SUCCESS, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
  }
}

export const DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST = 'discogs/FETCH_COLLECTION_FOLDERS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE = 'discogs/FETCH_COLLECTION_FOLDERS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS = 'discogs/FETCH_COLLECTION_FOLDERS_SUCCESS'

export function fetchCollectionFolders (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST })
    return api.getCollectionFolders(username)
      .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
      .catch(error => console.error(error))      
  }
}

export const DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST = 'discogs/FETCH_COLLECTION_ITEMS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE = 'discogs/FETCH_COLLECTION_ITEMS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS = 'discogs/FETCH_COLLECTION_ITEMS_SUCCESS'

export function fetchCollectionItems (username, folderId) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST })
    return api.getCollectionItemsByFolderId(username, folderId)
      .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS, DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE))
      .catch(error => console.error(error))
  }
}

export const DISCOGS_FETCH_USER_COLLECTION_REQUEST = 'discogs/FETCH_USER_COLLECTION_REQUEST'
export const DISCOGS_FETCH_USER_COLLECTION_FAILURE = 'discogs/FETCH_USER_COLLECTION_FAILURE'
export const DISCOGS_FETCH_USER_COLLECTION_SUCCESS = 'discogs/FETCH_USER_COLLECTION_SUCCESS'

export function fetchUserCollection (username) {
  return (dispatch, getState) => {
    dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_REQUEST })
    return dispatch(fetchCollectionFolders(username))
      .then(() => getState().discogs.folders.map(folder => dispatch(fetchCollectionItems(username, folder.id))))
      .then(() => dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_SUCCESS }))
      .catch(error => console.error(error))
  }
}

export const DISCOGS_FETCH_RELEASE_REQUEST = 'discogs/FETCH_RELEASE_REQUEST'
export const DISCOGS_FETCH_RELEASE_FAILURE = 'discogs/FETCH_RELEASE_FAILURE'
export const DISCOGS_FETCH_RELEASE_SUCCESS = 'discogs/FETCH_RELEASE_SUCCESS'

export function fetchRelease (releaseId) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_RELEASE_REQUEST })
    return api.getRelease(releaseId)
      .then(response => handleResponse(response, DISCOGS_FETCH_RELEASE_SUCCESS, DISCOGS_FETCH_RELEASE_FAILURE))
      .catch(error => console.error(error))
  }
}
