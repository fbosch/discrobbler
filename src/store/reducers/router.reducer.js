import * as actions from '../actions/router.actions'

export default (state = {}, action) => {
    switch (action.type) {

		case actions.ROUTE_CHANGE_CURRENT_LOCATION: 
			return {
				...state,
				previousRoute: { ...state.currentRoute },
				currentRoute: { 
					name: action.payload.name,
					path: action.payload.path,
					params: action.payload.params
				} 
			}
			
        default: return state
    }
}