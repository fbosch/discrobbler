const prefix = 'page/'

export const PAGE_CHANGE_TOOLBAR_BACKGROUND = prefix + 'CHANGE_TOOLBAR_BACKGROUND'

export function changeToolbarBackground (payload) {
  return { type: PAGE_CHANGE_TOOLBAR_BACKGROUND, payload } 
}

export const PAGE_RESET_TOOLBAR_BACKGROUND = prefix + 'RESET_TOOLBAR_BACKGROUND'

export const PAGE_SEARCH = prefix + 'SEARCH'
export const PAGE_SEARCH_CLEAR = prefix + 'SEARCH_CLEAR'

export function search (payload) {
  return { type: PAGE_SEARCH, payload }
}
