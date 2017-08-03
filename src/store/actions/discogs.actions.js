import api from '../../api/discogs'
import { handleResponse } from '../../utils'

export const DISCOGS_CLEAR_STATE = 'discogs/CLEAR_STATE'
export const clearState = () => ({ type: DISCOGS_CLEAR_STATE })

export const DISCOGS_FETCH_USER_REQUEST = 'discogs/FETCH_USER_REQUEST'
export const DISCOGS_FETCH_USER_SUCCESS = 'discogs/FETCH_USER_SUCCESS'
export const DISCOGS_FETCH_USER_FAILURE = 'discogs/FETCH_USER_FAILURE'

export const fetchUser = username => dispatch => {
  dispatch({ type: DISCOGS_FETCH_USER_REQUEST, payload: username })
  return api.getUserDetails(username)
    .then(handleResponse)
    .then(payload => dispatch({ type: DISCOGS_FETCH_USER_SUCCESS, payload}))
    .catch(error => dispatch({ type: DISCOGS_FETCH_USER_FAILURE, error}))
}

export const DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST = 'discogs/FETCH_COLLECTION_FOLDERS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS = 'discogs/FETCH_COLLECTION_FOLDERS_SUCCESS'
export const DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE = 'discogs/FETCH_COLLECTION_FOLDERS_FAILURE'

export const fetchCollectionFolders = username => dispatch => {
  dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_REQUEST, payload: username })
  return api.getCollectionFolders(username)
    .then(handleResponse)
    .then(payload => dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_SUCCESS, payload}))
    .catch(error => dispatch({ type: DISCOGS_FETCH_COLLECTION_FOLDERS_FAILURE, error}))
}

export const DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST = 'discogs/FETCH_COLLECTION_ITEMS_REQUEST'
export const DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS = 'discogs/FETCH_COLLECTION_ITEMS_SUCCESS'
export const DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE = 'discogs/FETCH_COLLECTION_ITEMS_FAILURE'

export const fetchCollectionItems = (username, folderId) => dispatch => {
  dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_REQUEST, payload: { username, folderId} })
  return api.getCollectionItemsByFolderId(username, folderId)
    .then(handleResponse)
    .then(payload => dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_SUCCESS, payload}))
    .catch(error => dispatch({ type: DISCOGS_FETCH_COLLECTION_ITEMS_FAILURE, error}))
}

export const DISCOGS_FETCH_USER_COLLECTION_REQUEST = 'discogs/FETCH_USER_COLLECTION_REQUEST'
export const DISCOGS_FETCH_USER_COLLECTION_SUCCESS = 'discogs/FETCH_USER_COLLECTION_SUCCESS'
export const DISCOGS_FETCH_USER_COLLECTION_FAILURE = 'discogs/FETCH_USER_COLLECTION_FAILURE'

export const fetchUserCollection = username => (dispatch, getState) => {
  dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_REQUEST, payload: username })
  return dispatch(fetchCollectionFolders(username))
    .then(response => Promise.all(response.payload.folders.map(folder => dispatch(fetchCollectionItems(username, folder.id)))))
    .then(payload => dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_SUCCESS, payload}))
    .catch(error => dispatch({ type: DISCOGS_FETCH_USER_COLLECTION_FAILURE, error}))
}

export const DISCOGS_FETCH_RELEASE_REQUEST = 'discogs/FETCH_RELEASE_REQUEST'
export const DISCOGS_FETCH_RELEASE_SUCCESS = 'discogs/FETCH_RELEASE_SUCCESS'
export const DISCOGS_FETCH_RELEASE_FAILURE = 'discogs/FETCH_RELEASE_FAILURE'

export const fetchRelease = releaseId => (dispatch, getState) => {
  dispatch({ type: DISCOGS_FETCH_RELEASE_REQUEST, payload: releaseId })
  if (getState().fetchedReleases && getState().fetchedReleases.filter(r => r.id === releaseId).length) {
      return Promise.resolve(dispatch({ type: DISCOGS_FETCH_RELEASE_SUCCESS, payload: getState().fetchedReleases.find(r => r.id === releaseId)}))
  }
  return api.getRelease(releaseId)
    .then(handleResponse)
    .then(payload => dispatch({ type: DISCOGS_FETCH_RELEASE_SUCCESS, payload}))
    .catch(error => dispatch({ type: DISCOGS_FETCH_RELEASE_FAILURE, error}))
}
