import api from '../../api/lastfm'
import { handleResponse } from '../../utils'

export const LASTFM_CLEAR_AUTHENTICATION_TOKEN = 'lastfm/CLEAR_AUTHENTICATION_TOKEN'
export function clearAuthenticationToken() {
  return { type: LASTFM_CLEAR_AUTHENTICATION_TOKEN }
}

export const LASTFM_CLEAR_STATE = 'lastfm/CLEAR_STATEa'
export function clearState() {
  return { type: LASTFM_CLEAR_STATE }
}

export const LASTFM_SET_AUTHENTICATION_TOKEN = 'lastfm/SET_AUTHENTICATION_TOKEN'
export function setAuthenticationToken (payload) {
  return { type: LASTFM_SET_AUTHENTICATION_TOKEN, payload}
}

export const LASTFM_FETCH_SESSION_REQUEST = 'lastfm/FETCH_SESSION_REQUEST'
export const LASTFM_FETCH_SESSION_FAILURE = 'lastfm/FETCH_SESSION_FAILURE'
export const LASTFM_FETCH_SESSION_SUCCESS = 'lastfm/FETCH_SESSION_SUCCESS'

export function getSession (token) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_SESSION_REQUEST })
    return api.getSession(token)
      .then(response => handleResponse(response, LASTFM_FETCH_SESSION_SUCCESS, LASTFM_FETCH_SESSION_FAILURE))
  }
}

export const LASTFM_FETCH_RECENT_TRACKS_REQUEST = 'lastfm/FETCH_RECENT_TRACKS_REQUEST'
export const LASTFM_FETCH_RECENT_TRACKS_FAILURE = 'lastfm/FETCH_RECENT_TRACKS_FAILURE'
export const LASTFM_FETCH_RECENT_TRACKS_SUCCESS = 'lastfm/FETCH_RECENT_TRACKS_SUCCESS'

export function getRecentTracks (username) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_RECENT_TRACKS_REQUEST })
    return api.getRecentTracks(username)
      .then(response => handleResponse(response, LASTFM_FETCH_RECENT_TRACKS_SUCCESS, LASTFM_FETCH_RECENT_TRACKS_FAILURE))
  }
}

export const LASTFM_SCROBBLE_TRACK_REQUEST = 'lastfm/SCROBBLE_TRACK_REQUEST'
export const LASTFM_SCROBBLE_TRACK_FAILURE = 'lastfm/SCROBBLE_TRACK_FAILURE'
export const LASTFM_SCROBBLE_TRACK_SUCCESS = 'lastfm/SCROBBLE_TRACK_SUCCESS'

export function scrobbleTrack (artist, album, track, session) {
  return dispatch => {
    dispatch({ type: LASTFM_FETCH_RECENT_TRACKS_REQUEST })
    return api.scrobbleTrack(artist, album, track, session)
      .then(response => handleResponse(response, LASTFM_SCROBBLE_TRACK_SUCCESS, LASTFM_SCROBBLE_TRACK_FAILURE))
  }
}

export const LASTFM_UPDATE_NOW_PLAYING_REQUEST = 'lastfm/UPDATE_NOW_PLAYING_REQUEST'
export const LASTFM_UPDATE_NOW_PLAYING_FAILURE = 'lastfm/UPDATE_NOW_PLAYING_FAILURE'
export const LASTFM_UPDATE_NOW_PLAYING_SUCCESS = 'lastfm/UPDATE_NOW_PLAYING_SUCCESS'

export function updateNowPlaying (artist, album, track, session) {
  return dispatch => {
    dispatch({ type: LASTFM_UPDATE_NOW_PLAYING_REQUEST })
    return api.updateNowPlaying(artist, album, track, session)
      .then(response => handleResponse(response, LASTFM_UPDATE_NOW_PLAYING_SUCCESS, LASTFM_UPDATE_NOW_PLAYING_FAILURE))
  }
}