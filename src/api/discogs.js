import keys from '../keys'

class DiscogsService {

    apiUrl(method)  {
        return `https://api.discogs.com/${method}?key=${keys.discogs.key}&secret=${keys.discogs.secret}`
    }

    getUserDetails(username) {
        return fetch(this.apiUrl(`users/${username}`))
    }

}

export default new DiscogsService()