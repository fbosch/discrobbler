import * as actions from '../actions/page.actions'

export default (state = {}, action) => {
    switch (action.type) {

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

        default: return state
    }
}