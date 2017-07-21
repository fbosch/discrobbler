
export const PAGE_CHANGE_TOOLBAR_BACKGROUND = 'page/CHANGE_TOOLBAR_BACKGROUND'

export function changeToolbarBackground (payload) {
  return { type: PAGE_CHANGE_TOOLBAR_BACKGROUND, payload } 
}

export const PAGE_RESET_TOOLBAR_BACKGROUND = 'page/RESET_TOOLBAR_BACKGROUND'

export function resetToolbarBackground() {
  return { type: PAGE_RESET_TOOLBAR_BACKGROUND }
}

export const PAGE_SEARCH = 'page/SEARCH'
export function search (payload) {
  return { type: PAGE_SEARCH, payload }
}

export const PAGE_SEARCH_CLEAR = 'page/SEARCH_CLEAR'
export function searchClear() {
  return { type: PAGE_SEARCH_CLEAR }
}