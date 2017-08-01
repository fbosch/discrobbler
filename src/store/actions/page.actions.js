export const PAGE_CHANGE_TOOLBAR_BACKGROUND = 'page/CHANGE_TOOLBAR_BACKGROUND'
export const changeToolbarBackground = payload => ({ type: PAGE_CHANGE_TOOLBAR_BACKGROUND, payload})

export const PAGE_RESET_TOOLBAR_BACKGROUND = 'page/RESET_TOOLBAR_BACKGROUND'
export const resetToolbarBackground = () => ({ type: PAGE_RESET_TOOLBAR_BACKGROUND })

export const PAGE_SEARCH = 'page/SEARCH'
export const search = payload => ({ type: PAGE_SEARCH, payload})

export const PAGE_SEARCH_CLEAR = 'page/SEARCH_CLEAR'
export const searchClear = () => ({ type: PAGE_SEARCH_CLEAR })

export const PAGE_OPEN_SIDENAV = 'page/OPEN_SIDENAV'
export const openSideNav = () => ({ type: PAGE_OPEN_SIDENAV })

export const PAGE_CLOSE_SIDENAV = 'page/CLOSE_SIDENAV'
export const closeSideNav = () => ({ type: PAGE_CLOSE_SIDENAV })

export const PAGE_TOGGLE_SIDENAV = 'page/TOGGLE_SIDENAV'
export const toggleSideNav = () => ({ type: PAGE_TOGGLE_SIDENAV })

export const PAGE_SHOW_MESSAGE = 'page/SHOW_MESSAGE'
export const showMessage = payload => ({ type: PAGE_SHOW_MESSAGE, payload})

export const PAGE_CLEAR_MESSAGE = 'page/CLEAR_MESSAGE'
export const clearMessage = () => ({ type: PAGE_CLEAR_MESSAGE })
