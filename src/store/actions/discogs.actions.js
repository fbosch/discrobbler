import api from '../../api/discogs'
import { handleResponse } from '../../utils'

const prefix = 'discogs/'

export const DISCOGS_CLEAR_SELECTED_RELEASE = prefix + 'CLEAR_SELECTED_RELEASE'
export const DISCOGS_SELECT_RELEASE = prefix + 'SELECT_RELEASE'
export const DISCOGS_CLEAR_STATE = prefix + 'CLEAR_ALL_DATA'

export const DISCOGS_FETCH_USER_REQUEST = prefix + 'FETCH_USER_REQUEST'
export const DISCOGS_FETCH_USER_FAILURE = prefix + 'FETCH_USER_FAILURE'
export const DISCOGS_FETCH_USER_SUCCESS = prefix + 'FETCH_USER_SUCCESS'

export function fetchUser (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_USER_REQUEST })
    return api.getUserDetails(username)
      .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
      .then(payload => dispatch({ type: DISCOGS_FETCH_USER_SUCCESS, payload}))
  }
}

export const DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST = prefix + 'FETCH_COLLECTION_FOLDERS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE = prefix + 'FETCH_COLLECTION_FOLDERS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS = prefix + 'FETCH_COLLECTION_FOLDERS_SUCCESS'

export function fetchCollectionFolders (username) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST })
    return api.getCollectionFolders(username)
      .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
      .then(payload => dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS, payload}))
  }
}

export const DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST = prefix + 'FETCH_COLLECTION_ITEMS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE = prefix + 'FETCH_COLLECTION_ITEMS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS = prefix + 'FETCH_COLLECTION_ITEMS_SUCCESS'

export function fetchCollectionItems (username, folderId) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST })
    return api.getCollectionItemsByFolderId(username, folderId)
      .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE))
      .then(payload => dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS, payload}))
  }
}

export const DISCOGS_FETCH_USER_COLLECTION_REQUEST = prefix + 'FETCH_USER_COLLECTION_REQUEST'
export const DISCOGS_FETCH_USER_COLLECTION_FAILURE = prefix + 'FETCH_USER_COLLECTION_FAILURE'
export const DISCOGS_FETCH_USER_COLLECTION_SUCCESS = prefix + 'FETCH_USER_COLLECTION_SUCCESS'

export function fetchUserCollection (username) {
  return (dispatch, getState) => {
    dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_REQUEST })
    return dispatch(fetchCollectionFolders(username))
      .then(() => getState().discogs.folders.map(folder => dispatch(fetchCollectionItems(username, folder.id))))
      .then(() => dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_SUCCESS }))
  }
}

export const DISCOGS_FETCH_RELEASE_REQUEST = prefix + 'FETCH_RELEASE_REQUEST'
export const DISCOGS_FETCH_RELEASE_FAILURE = prefix + 'FETCH_RELEASE_FAILURE'
export const DISCOGS_FETCH_RELEASE_SUCCESS = prefix + 'FETCH_RELEASE_FAILURE'

export function fetchRelease (releaseId) {
  return dispatch => {
    dispatch({ type: DISCOGS_FETCH_RELEASE_REQUEST })
    return api.getRelease(releaseId)
      .then(response => handleResponse(response, DISCOGS_FETCH_RELEASE_FAILURE))
      .then(payload => dispatch({ type: DISCOGS_FETCH_RELEASE_SUCCESS, payload}))
  }
}
