import keys from '../keys'
import md5 from 'js-md5'

class LastFmApi {

    static methodUrl = `https://ws.audioscrobbler.com/2.0/?api_key=${keys.lastfm.key}&format=json&method=`

    getAlbumInfo(artist, album) {
        return fetch(`${LastFmApi.methodUrl}album.getinfo&artist=${artist}&album=${album}&autocorrect=1`)
    }

    authenticateUser() {
        window.location = `https://last.fm/api/auth/?api_key=${keys.lastfm.key}&cb=${window.location.origin}/authenticate/lastfm`
    }

    getWebSession(token) {
        const sig = md5(`api_key${keys.lastfm.key}methodauth.getSessiontoken${token}${keys.lastfm.secret}`)
        return fetch(`${LastFmApi.methodUrl}auth.getSession&api_sig=${sig}&token=${token}`)
    }

    getRecentTracks(username) {
        return fetch(`${LastFmApi.methodUrl}user.getrecenttracks&user=${username}&limit=3`)
    }

}

export default new LastFmApi()