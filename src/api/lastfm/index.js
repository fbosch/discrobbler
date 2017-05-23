import keys from '../../keys'

class LastFmApi {

    static url = `https://ws.audioscrobbler.com/2.0/?api_key=${keys.lastfm.key}&format=json&method=`

    getAlbumInfo(artist, album) {
        return fetch(`${LastFmApi.url}album.getinfo&artist=${artist}&album=${album}&autocorrect=1`)
    }

}

export default new LastFmApi()