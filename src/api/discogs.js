import keys from '../keys'

class DiscogsApi {

    apiUrl(method) {
        return `https://api.discogs.com/${method}?key=${keys.discogs.key}`
    }

    getUserDetails(username) {
        return fetch(this.apiUrl(`users/${username}`))
    }

    getCollectionFolders(username) {
        return fetch(this.apiUrl(`users/${username}/collection/folders`))
    }

    getCollectionItemsByFolderId(username, folderId) {
        return fetch(this.apiUrl(`users/${username}/collection/folders/${folderId}/releases`) + '&sort=artist&per_page=250')
    }

    getRelease(id) {
        return fetch(this.apiUrl(`releases/${id}`))
    }

}

export default new DiscogsApi()