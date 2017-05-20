import {
    THEMING_CHANGE_TOOLBAR_BACKGROUND,
    THEMING_RESET_TOOLBAR_BACKGROUND
} from '../actions/theming.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case THEMING_CHANGE_TOOLBAR_BACKGROUND:
            return {
                ...state,
                toolbarColor: action.payload
            }

        case THEMING_RESET_TOOLBAR_BACKGROUND:
            return {
                ...state,
                toolbarColor: null
            }

        default: return state
    }
}