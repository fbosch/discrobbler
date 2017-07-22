import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'vue-router-redux'

const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
}

export default middleware