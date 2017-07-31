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
  if (response.status >= 400) {
    return new Error(response.message)
  } else {
    return response.json()
  }
}

export const isLoggedIn = () => get(store.getState(), 'discogs.authenticated', false) && !!get(store.getState(), 'lastfm.session.key', false)
