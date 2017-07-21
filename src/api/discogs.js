import apiKeys from '../keys'

export class DiscogsApi {

    static userAgent = 'Discrobbler/1.0'
    static url = 'https://api.discogs.com/'

    static internalCall(method, params, requestMethod) {
        const array = []
        for (let param in params) {
            array.push(encodeURI(param) + '=' + encodeURIComponent(params[param]))
        }
        const url = DiscogsApi.url + method + '?' + array.join('&')
        return fetch(url, {
            method: requestMethod,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': DiscogsApi.userAgent
        })
    }

    constructor(key, secret) {
        this.key = key
        this.secret = secret
    }

    call(method, params, requestMethod) {
        params = params || {}
        requestMethod = requestMethod || 'GET'

        params.key = this.key
        params.secret = this.secret

        return DiscogsApi.internalCall(method, params, requestMethod)
    }

    getUserDetails(username) {
        return this.call(`users/${username}`)
    }

    getCollectionFolders(username) {
        return this.call(`users/${username}/collection/folders`)
    }

    getCollectionItemsByFolderId(username, folderId) {
        return this.call(`users/${username}/collection/folders/${folderId}/releases`, {
            sort: 'artist',
            per_page: 250
        })
    }

    getRelease(id) {
        return this.call(`releases/${id}`)
    }


}

export default new DiscogsApi(apiKeys.discogs.key, apiKeys.discogs.secret)