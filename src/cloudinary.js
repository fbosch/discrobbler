import apiKeys from './keys'
import { Cloudinary } from 'cloudinary-core'

export default new Cloudinary({
  cloud_name: 'discrobbler',
  api_key: apiKeys.cloudinary.key,
  api_secret: apiKeys.cloudinary.secret
}).init()