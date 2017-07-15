import api from '../../api/lastfm'
const prefix = 'lastfm/'

export const LASTFM_CLEAR_AUTHENTICATION_TOKEN = prefix + 'CLEAR_AUTHENTICATION_TOKEN'
export const LASTFM_CLEAR_ALL_DATA = prefix + 'CLEAR_ALL_DATA'
export const LASTFM_SET_AUTHENTICATION_TOKEN = prefix + 'SET_AUTHENTICATION_TOKEN'

// TODO: move to utils
function handleResponse (response, dispatch, errorActionType) {
  if (response.status >= 400) {
    dispatch({ type: errorActionType, payload: response.message })
    return Promise.reject(new Error(response.message))
  } else {
    return response.json()
  }
}

export function setLastfmAuthenticationToken (payload) {
  return { type: LASTFM_SET_AUTHENTICATION_TOKEN, payload }
}

export const LASTFM_WEB_SESSION_FETCH = prefix + 'WEB_SESSION_FETCH'
export const LASTFM_WEB_SESSION_ERROR = prefix + 'WEB_SESSION_ERROR'
export const LASTFM_WEB_SESSION_RECEIVED = prefix + 'WEB_SESSION_RECEIVED'

export function getWebSession (token) {
  return (dispatch, getState) => {
    dispatch({ type: LASTFM_WEB_SESSION_FETCH })
    return api.getWebSession(getState().lastfm.authenticationToken)
      .then(response => handleResponse(response, dispatch, LASTFM_WEB_SESSION_ERROR))
      .then(payload => dispatch({ type: LASTFM_WEB_SESSION_RECEIVED, payload }))
  }
}

export const LASTFM_GET_RECENT_TRACKS_FETCH = prefix + 'GET_RECENT_TRACKS_FETCH'
export const LASTFM_GET_RECENT_TRACKS_ERROR = prefix + 'GET_RECENT_TRACKS_ERROR'
export const LASTFM_GET_RECENT_TRACKS_RECEIVED = prefix + 'GET_RECENT_TRACKS_RECEIVED'

export function getRecentTracks() {
  return (dispatch, getState) => {
    dispatch({ type: LASTFM_GET_RECENT_TRACKS_FETCH })
    return api.getRecentTracks(getState().lastfm.websession.name)
      .then(response => handleResponse(response, dispatch, LASTFM_GET_RECENT_TRACKS_ERROR))
      .then(payload => dispatch({ type: LASTFM_GET_RECENT_TRACKS_RECEIVED, payload }))
  }
}