import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'vue-router-redux'

export default [
    thunk,
    // logger
]