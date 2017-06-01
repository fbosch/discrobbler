import keys from '../keys'
import md5 from 'js-md5'
import { Client as Discogs } from 'disconnect'

class DiscogsApi {
    userAgent = 'Discrobbler/1.0'
    constructor() {
        // this.getRequestToken()
    }

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

    getRequestToken() {
        var oAuth = new Discogs(this.userAgent).oauth();
        oAuth.getRequestToken(
            keys.discogs.key,
            keys.discogs.secret,
            location.origin + '/authentication/discogs',
            function (err, requestData) {
                console.log(err, requestData)
            }
        )
    }


}

export default new DiscogsApi()