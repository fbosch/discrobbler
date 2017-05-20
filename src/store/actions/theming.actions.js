const prefix = 'theming/'

export const THEMING_CHANGE_TOOLBAR_BACKGROUND = prefix + 'CHANGE_TOOLBAR_BACKGROUND'

export function changeToolbarBackground(color) {
    return dispatch => dispatch({ type: THEMING_CHANGE_TOOLBAR_BACKGROUND, payload: color })
}

export const THEMING_RESET_TOOLBAR_BACKGROUND = prefix + 'RESET_TOOLBAR_BACKGROUND'

export function resetToolbarBackground() {
    return dispatch => dispatch({ type: THEMING_RESET_TOOLBAR_BACKGROUND })
}