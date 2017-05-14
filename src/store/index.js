import Vue from 'vue'
import Revue from 'revue'
import { composeWithDevTools } from 'redux-devtools-extension'
import { sync } from 'vue-router-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import actions from './actions'
import middleware from './middleware'
import router from '../router'

const composeEnhancers = composeWithDevTools({})

const reduxStore = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)))

const store = new Revue(Vue, reduxStore, actions).store

// sync(store, router)

export default store
