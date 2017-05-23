const prefix = 'page/'

export const PAGE_CHANGE_TOOLBAR_BACKGROUND = prefix + 'CHANGE_TOOLBAR_BACKGROUND'

export function changeToolbarBackground(color) {
    return dispatch => dispatch({ type: PAGE_CHANGE_TOOLBAR_BACKGROUND, payload: color })
}

export const PAGE_RESET_TOOLBAR_BACKGROUND = prefix + 'RESET_TOOLBAR_BACKGROUND'

export function resetToolbarBackground() {
    return dispatch => dispatch({ type: PAGE_RESET_TOOLBAR_BACKGROUND })
}

export const PAGE_SEARCH = prefix + 'SEARCH'
export const PAGE_SEARCH_CLEAR = prefix + 'SEARCH_CLEAR'

export function search(query) {
    return dispatch => dispatch({ type: PAGE_SEARCH, payload: query })
}
