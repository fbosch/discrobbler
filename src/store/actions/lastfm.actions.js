import api from '../../api/lastfm'
const prefix = 'lastfm/'


// TODO: move to utils
function handleResponse(response, dispatch, errorActionType) {
    if (response.status >= 400) {
        dispatch({ type: errorActionType, payload: response.message })
        return Promise.reject(new Error(response.message))
    } else {
        return response.json()
    }
}


export const LASTFM_SET_AUTHENTICATION_TOKEN = prefix + 'SET_AUTHENTICATION_TOKEN'

export function setLastfmAuthenticationToken(token) {
    return { type: LASTFM_SET_AUTHENTICATION_TOKEN, payload: token }
}

export const LASTFM_CLEAR_AUTHENTICATION_TOKEN = prefix + 'CLEAR_AUTHENTICATION_TOKEN'

export function clearLastfmAuthenticationToken() {
    return { type: LASTFM_CLEAR_AUTHENTICATION_TOKEN }
}

export const LASTFM_WEB_SESSION_FETCH = prefix + 'WEB_SESSION_FETCH'
export const LASTFM_WEB_SESSION_ERROR = prefix + 'WEB_SESSION_ERROR'
export const LASTFM_WEB_SESSION_RECEIVED = prefix + 'WEB_SESSION_RECEIVED'


export function getWebSession(token) {
    return (dispatch, getState) => {
        dispatch({ type: LASTFM_WEB_SESSION_FETCH })
        return api.getWebSession(getState().lastfm.authenticationToken)
            .then(response => handleResponse(response, dispatch, LASTFM_WEB_SESSION_ERROR))
            .then(websession => dispatch({ type: LASTFM_WEB_SESSION_RECEIVED, payload: websession }))
    }
}
