import store from './store'

export function removeBrackets (input) {
  return input
    .replace(/{.*?}/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/<.*?>/g, '')
    .replace(/\(.*?\)/g, '')
}

export function handleResponse (response, success, error) {
  if (response.status >= 400) {
    store.dispatch({ type: error, payload: response })
    return Promise.reject(new Error(response))
  } else {
    return response.json().then(payload => store.dispatch({ type: success, payload}))
  }
}
