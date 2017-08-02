import { combineReducers } from 'redux'
import discogs from './discogs.reducer'
import page from './page.reducer'
import lastfm from './lastfm.reducer'
import router from './router.reducer'

export default combineReducers({
    discogs,
    lastfm,
    page,
    router
})
