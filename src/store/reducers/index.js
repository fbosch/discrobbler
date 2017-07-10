import { combineReducers } from 'redux'
import { routerReducer as route } from 'vue-router-redux'
import discogs from './discogs.reducer'
import page from './page.reducer'
import lastfm from './lastfm.reducer'

export default combineReducers({
    route,
    discogs,
    lastfm,
    page
})
