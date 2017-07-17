import keys from '../keys'
import md5 from 'js-md5'
import moment from 'moment'

class LastFmApi {

  static method (requestString) {
    const baseUrl = `https://ws.audioscrobbler.com/2.0/?api_key=${keys.lastfm.key}&format=json&method=`
    return baseUrl + requestString
  }

  static signature (token, method) {
    return md5(`api_key${keys.lastfm.key}${method}token${token}${keys.lastfm.secret}`)
  }

  getAlbumInfo (artist, album) {
    return fetch(LastFmApi.method(`album.getinfo&artist=${artist}&album=${album}&autocorrect=1`))
  }

  authenticateUser () {
    window.location = `https://last.fm/api/auth/?api_key=${keys.lastfm.key}&cb=${window.location.origin}/authenticate/lastfm`
  }

  getWebSession (token) {
    return fetch(LastFmApi.method(`auth.getSession&api_sig=${LastFmApi.signature(token, 'auth.getSession')}&token=${token}`))
  }

  getRecentTracks (username) {
    return fetch(LastFmApi.method(`user.getrecenttracks&user=${username}&limit=3`))
  }

  scrobbleTrack (artist, album, track, sessionKey, token) {
    const timeStamp = moment().valueOf() // unix time
    return fetch(LastFmApi.method(`track.scrobble
        &artist=${artist}
        &track=${track}
        &album=${album}
        &timestamp=${timeStamp}
        &sk=${sessionKey}
        &api_sig=${LastFmApi.signature(token, 'track.scrobble')}`),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
  }

}

export default new LastFmApi()
