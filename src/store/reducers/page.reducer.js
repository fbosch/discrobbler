import * as actions from '../actions/page.actions'

export default (state = {
    sideNavOpened: false
}, action) => {
    switch (action.type) {

        case actions.PAGE_OPEN_SIDENAV:
            return {
                ...state,
                sideNavOpened: true
            }

        case actions.PAGE_CLOSE_SIDENAV: 
            return {
                ...state,
                sideNavOpened: false
            }

        case actions.PAGE_TOGGLE_SIDENAV:
            return {
                ...state,
                sideNavOpened: !state.sideNavOpened
            }

        case actions.PAGE_SEARCH:
            return {
                ...state,
                search: action.payload
            }
            
        case actions.PAGE_SEARCH_CLEAR:
            return {
                ...state,
                search: null
            }
        
        case actions.PAGE_SHOW_MESSAGE:
            return {
                ...state,
                message: action.payload
            }
        
        case actions.PAGE_CLEAR_MESSAGE:
            return {
                ...state,
                message: null
            }

        default: return state
    }
}