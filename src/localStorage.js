const localStorageKey = `state_discrobbler-${process.env.VERSION}`

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(localStorageKey)
        if (serializedState === null) {
            return undefined
        }
        return JSON.parse(serializedState)
    } catch (e) {
        return undefined
    }
}

export const saveState = state => {
    try {
        const serializedState = JSON.stringify(state)
        localStorage.setItem(localStorageKey, serializedState)
    } catch (e) {
        console.warn('state could not be serialized and/or persisted to localstorage')
    }
}