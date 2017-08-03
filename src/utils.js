import store from './store'
import get from 'lodash.get'

export function removeBrackets (input) {
  return input
    .replace(/{.*?}/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/<.*?>/g, '')
    .replace(/\(.*?\)/g, '')
}

export function handleResponse (response) {
  if (response.ok) {
    return response.json()
  } else {
    return Promise.reject(new Error(response.message))
  }
}

export const isLoggedIn = () => get(store.getState(), 'discogs.authenticated', false) && !!get(store.getState(), 'lastfm.session.key', false)
