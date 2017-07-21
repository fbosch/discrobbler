import apiKeys from '../keys'
import md5 from './lastfm.api.md5'
import moment from 'moment'

export class LastFmApi {

  static url = 'https://ws.audioscrobbler.com/2.0/?format=json'

  static internalCall(params, requestMethod) {
    const array = []
    for (let param in params) {
      array.push(encodeURI(param) + '=' + encodeURIComponent(params[param]))
    }
    const url = LastFmApi.url + '&' + array.join('&').replace(/%20/g, '+')
    return fetch(url, {
      method: requestMethod,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    })
  }

  static getApiSignature(params) {
    const keys = Object.keys(params)
    let string = ''

    keys.sort()
    keys.forEach(key => string += key + params[key])
    string = unescape(encodeURI(string))

    return md5(string + apiKeys.lastfm.secret)
  }

  constructor(key, secret) {
    this.key = key
    this.secret = secret
  }

  call(method, params, requestMethod) {
    params = params || {}
    requestMethod = requestMethod || 'GET'

    params.method = method
    params.api_key = this.key

    return LastFmApi.internalCall(params, requestMethod)
  }

  signedCall(method, params, session, requestMethod) {
    params = params || {}
    requestMethod = requestMethod || 'GET'

    params.method = method
    params.api_key = this.key

    if (session && typeof (session.key) != 'undefined') {
      params.sk = session.key
    }
    params.api_sig = LastFmApi.getApiSignature(params)

    return LastFmApi.internalCall(params, requestMethod)
  }

  authenticateUser() {
    window.location = `https://last.fm/api/auth/?api_key=${this.key}&cb=${window.location.origin}/authenticate/lastfm`
  }

  getAlbumInfo(artist, album) {
    return this.call('album.getinfo', {
      artist,
      album,
      autocorrect: 1
    })
  }

  getWebSession(token) {
    return this.signedCall('auth.getSession', {
      token
    })
  }

  getRecentTracks(user) {
    return this.call('user.getrecenttracks', {
      user,
      limit: 3
    })
  }

  scrobbleTrack(artist, album, track, session) {
    return this.signedCall('track.scrobble', {
      artist,
      albumArtist: artist,
      album,
      track,
      autocorrect: 1,
      timestamp: moment().valueOf()
    }, session, 'POST')
  }

  updateNowPlaying(artist, album, track, session) {
    return this.signedCall('track.updateNowPlaying', {
      artist,
      ablumArtist: artist,
      album,
      track,
      autocorrect: 1,
      timestamp: moment().valueOf()
    }, session, 'POST')
  }

}

export default new LastFmApi(apiKeys.lastfm.key, apiKeys.lastfm.secret)