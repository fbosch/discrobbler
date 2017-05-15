import Vue from 'vue'
import Revue from 'revue'
import { composeWithDevTools } from 'redux-devtools-extension'
import { sync } from 'vue-router-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import actions from './actions'
import middleware from './middleware'
import router from '../router'
import { saveState, loadState } from '../localStorage'
import throttle from 'lodash.throttle'

const composeEnhancers = composeWithDevTools({})

const reduxStore = createStore(reducer, loadState(), composeEnhancers(applyMiddleware(...middleware)))

const store = new Revue(Vue, reduxStore, actions).store

store.subscribe(throttle(() => saveState(store.getState()), 1000))

export default store
