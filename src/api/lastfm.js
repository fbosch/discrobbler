import API from '../keys'
import md5 from './lastfm.api.md5'
import moment from 'moment'

class LastFmApi {

  static apiUrl = 'https://ws.audioscrobbler.com/2.0/?format=json'

  static internalCall (params, requestMethod) {
    const array = []
    for (let param in params) {
        array.push(encodeURI(param) + '=' + encodeURIComponent(params[param]))
    }
    const url = LastFmApi.apiUrl + '&' + array.join('&').replace(/%20/g, '+')
    return fetch(url, 
    {
        method: requestMethod, 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
     })
  }

  static call (method, params, requestMethod) {
    params = params || {}
    requestMethod = requestMethod || 'GET'

    params.method = method
    params.api_key = API.lastfm.key

    return LastFmApi.internalCall(params, requestMethod)
  }

  static signedCall (method, params, session, requestMethod) {
    params = params || {}
    requestMethod = requestMethod || 'GET'

    params.method = method
    params.api_key = API.lastfm.key
    
    if (session && typeof (session.key) != 'undefined') {
      params.sk = session.key
    }
    params.api_sig = LastFmApi.getApiSignature(params)


    return LastFmApi.internalCall(params, requestMethod)
  }

  static getApiSignature (params) {
    const keys = Object.keys(params)
    let string = ''

    keys.sort()
    keys.forEach(key => string += key + params[key])
    string = unescape(encodeURI(string))

    return md5(string + API.lastfm.secret)
  }

  getAlbumInfo (artist, album) {
    return LastFmApi.call('album.getinfo', 
        {
            artist,
            album,
            autocorrect: 1
        })
  }

  authenticateUser () {
    window.location = `https://last.fm/api/auth/?api_key=${API.lastfm.key}&cb=${window.location.origin}/authenticate/lastfm`
  }

  getWebSession (token) {
    return LastFmApi.signedCall('auth.getSession', { token })
  }

  getRecentTracks (user) {
    return LastFmApi.call('user.getrecenttracks', { user, limit: 3 })
  }

  scrobbleTrack (artist, album, track, session) {
    return LastFmApi.signedCall('track.scrobble', {
        artist,
        albumArtist: artist,
        album,        
        track,
        timestamp: moment().valueOf()
    }, session, 'POST')
  }

  updateNowPlaying (artist, album, track, session) {
      return LastFmApi.signedCall('track.updateNowPlaying', {
          artist,
          ablumArtist: artist,
          album,
          track,
          timestamp: moment().valueOf()
      }, session, 'POST')
  }

}

export default new LastFmApi()
