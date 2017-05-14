import { combineReducers } from 'redux'
import { routerReducer as route } from 'vue-router-redux'
import discogs from './discogs.reducer'

export default combineReducers({
    route,
    discogs
})