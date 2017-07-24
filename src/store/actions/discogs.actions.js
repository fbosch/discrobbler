import api from '../../api/discogs'
import { handleResponse } from '../../utils'

export const DISCOGS_CLEAR_STATE = 'DISCOGS/CLEAR_STATE'
export function clearState () {
  return { type: DISCOGS_CLEAR_STATE }
}

export const DISCOGS_FETCH_USER_REQUEST = 'DISCOGS/FETCH_USER_REQUEST'
export const DISCOGS_FETCH_USER_FAILURE = 'DISCOGS/FETCH_USER_FAILURE'
export const DISCOGS_FETCH_USER_SUCCESS = 'DISCOGS/FETCH_USER_SUCCESS'

export const fetchUser = username => dispatch => {
  dispatch({ type: DISCOGS_FETCH_USER_REQUEST })
  return api.getUserDetails(username)
    .then(response => handleResponse(response, DISCOGS_FETCH_USER_SUCCESS, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
}

export const DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST = 'DISCOGS/FETCH_COLLECTION_FOLDERS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE = 'DISCOGS/FETCH_COLLECTION_FOLDERS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS = 'DISCOGS/FETCH_COLLECTION_FOLDERS_SUCCESS'

export const fetchCollectionFolders = username => dispatch => {
  dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST })
  return api.getCollectionFolders(username)
    .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS, DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE))
    .catch(error => console.error(error))
}

export const DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST = 'DISCOGS/FETCH_COLLECTION_ITEMS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE = 'DISCOGS/FETCH_COLLECTION_ITEMS_FAILURE'
export const DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS = 'DISCOGS/FETCH_COLLECTION_ITEMS_SUCCESS'

export const fetchCollectionItems = (username, folderId) => dispatch => {
  dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST })
  return api.getCollectionItemsByFolderId(username, folderId)
    .then(response => handleResponse(response, DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS, DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE))
    .catch(error => console.error(error))
}

export const DISCOGS_FETCH_USER_COLLECTION_REQUEST = 'DISCOGS/FETCH_USER_COLLECTION_REQUEST'
export const DISCOGS_FETCH_USER_COLLECTION_FAILURE = 'DISCOGS/FETCH_USER_COLLECTION_FAILURE'
export const DISCOGS_FETCH_USER_COLLECTION_SUCCESS = 'DISCOGS/FETCH_USER_COLLECTION_SUCCESS'

export const fetchUserCollection = username => (dispatch, getState) => {
  dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_REQUEST })
  return dispatch(fetchCollectionFolders(username))
    .then(() => getState().discogs.folders.map(folder => dispatch(fetchCollectionItems(username, folder.id))))
    .then(() => dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_SUCCESS }))
    .catch(error => console.error(error))
}

export const DISCOGS_FETCH_RELEASE_REQUEST = 'DISCOGS/FETCH_RELEASE_REQUEST'
export const DISCOGS_FETCH_RELEASE_FAILURE = 'DISCOGS/FETCH_RELEASE_FAILURE'
export const DISCOGS_FETCH_RELEASE_SUCCESS = 'DISCOGS/FETCH_RELEASE_SUCCESS'

export const fetchRelease = releaseId => dispatch => {
  dispatch({ type: DISCOGS_FETCH_RELEASE_REQUEST })
  return api.getRelease(releaseId)
    .then(response => handleResponse(response, DISCOGS_FETCH_RELEASE_SUCCESS, DISCOGS_FETCH_RELEASE_FAILURE))
    .catch(error => console.error(error))
}
