import store from './store'

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

export function handleSuccess (response, type) {
  if (response.status >= 400) {
    return promise.reject(new Error(response))
  } else {
    return response.json().then(payload => store.dispatch({ type, payload }))
  }
}


export function hmsToSeconds (string) {
  const split = string.split(':')
  let seconds = 0, minutes = 1
  while (split.length > 0) {
     seconds += minutes * parseInt(split.pop(), 10);
     minutes *= 60;
  }
  return seconds
}