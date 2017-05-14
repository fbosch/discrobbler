import api from '../../api/discogs'

// USER
export const DISCOGS_USER_FETCH = 'discogs/USER_FETCH'
export const DISCOGS_USER_ERROR = 'discogs/USER_ERROR'
export const DISCOGS_USER_RECEIVED = 'discogs/USER_RECEIVED'

export function fetchUser(username) {
    return dispatch => {
        dispatch({ type: DISCOGS_USER_FETCH })
        return api.getUserDetails(username)
            .then(response => {
                if (response.status >= 400) {
                    dispatch({ type: DISCOGS_USER_ERROR, payload: response.message })
                }
                return response.json()
            }).then(user => {
                return dispatch({ type: DISCOGS_USER_RECEIVED, payload: user })
            })
    }
}

