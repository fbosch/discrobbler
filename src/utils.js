import store from './store'

export function removeBrackets (input) {
  return input
    .replace(/{.*?}/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/<.*?>/g, '')
    .replace(/\(.*?\)/g, '')
}

export function handleResponse (response, type) {
  if (response.status >= 400) {
    store.dispatch({ type, payload: response.message })
    return Promise.reject(new Error(response.message))
  } else {
    return response.json()
  }
}
