import api from '../../api/lastfm'
import { handleResponse } from '../../utils'
const prefix = 'lastfm/'

export const LASTFM_CLEAR_AUTHENTICATION_TOKEN = prefix + 'CLEAR_AUTHENTICATION_TOKEN'
export const LASTFM_CLEAR_STATE = prefix + 'CLEAR_ALL_DATA'
export const LASTFM_SET_AUTHENTICATION_TOKEN = prefix + 'SET_AUTHENTICATION_TOKEN'

export function setLastfmAuthenticationToken (payload) {
  return { type: LASTFM_SET_AUTHENTICATION_TOKEN, payload}
}

export const LASTFM_FETCH_WEBSESSION_REQUEST = prefix + 'FETCH_WEBSESSION_REQUEST'
export const LASTFM_FETCH_WEBSESSION_FAILURE = prefix + 'FETCH_WEBSESSION_FAILURE'
export const LASTFM_FETCH_WEBSESSION_SUCCESS = prefix + 'FETCH_WEBSESSION_SUCCESS'

export function getWebSession (token) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_WEBSESSION_REQUEST })
    return api.getWebSession(token)
      .then(response => handleResponse(response, LASTFM_FETCH_WEBSESSION_FAILURE))
      .then(payload => dispatch({ type: LASTFM_FETCH_WEBSESSION_SUCCESS, payload}))
  }
}

export const LASTFM_FETCH_RECENT_TRACKS_REQUEST = prefix + 'FETCH_RECENT_TRACKS_REQUEST'
export const LASTFM_FETCH_RECENT_TRACKS_FAILURE = prefix + 'FETCH_RECENT_TRACKS_FAILURE'
export const LASTFM_FETCH_RECENT_TRACKS_SUCCESS = prefix + 'FETCH_RECENT_TRACKS_SUCCESS'

export function getRecentTracks (username) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_RECENT_TRACKS_REQUEST })
    return api.getRecentTracks(username)
      .then(response => handleResponse(response, LASTFM_FETCH_RECENT_TRACKS_FAILURE))
      .then(payload => dispatch({ type: LASTFM_FETCH_RECENT_TRACKS_SUCCESS, payload}))
  }
}

export const LASTFM_SCROBBLE_TRACK_REQUEST = prefix + 'SCROBBLE_TRACK_REQUEST'
export const LASTFM_SCROBBLE_TRACK_FAILURE = prefix + 'SCROBBLE_TRACK_FAILURE'
export const LASTFM_SCROBBLE_TRACK_SUCCESS = prefix + 'SCROBBLE_TRACK_SUCCESS'

export function scrobbleTrack (artist, album, track, sessionKey, token) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_RECENT_TRACKS_REQUEST })
    return api.scrobbleTrack(artist, album, track, sessionKey, token)
      .then(response => handleResponse(response, LASTFM_SCROBBLE_TRACK_FAILURE))
      .then(payload => dispatch({ type: LASTFM_SCROBBLE_TRACK_SUCCESS, payload}))
  }
}
