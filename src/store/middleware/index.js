import logger from 'redux-logger'
import perfLogger from 'redux-perf-middleware'
import thunk from 'redux-thunk'

const middleware = [ thunk ]

if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger)
    middleware.push(perfLogger)
}

export default middleware