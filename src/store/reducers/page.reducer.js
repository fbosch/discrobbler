import {
    PAGE_CHANGE_TOOLBAR_BACKGROUND,
    PAGE_RESET_TOOLBAR_BACKGROUND,
    PAGE_SEARCH
} from '../actions/page.actions'

export default (state = {}, action) => {
    switch (action.type) {

        case PAGE_CHANGE_TOOLBAR_BACKGROUND:
            return {
                ...state,
                toolbarColor: action.payload
            }

        case PAGE_RESET_TOOLBAR_BACKGROUND:
            return {
                ...state,
                toolbarColor: null
            }

        case PAGE_SEARCH:
            return {
                ...state,
                search: action.payload
            }

        default: return state
    }
}