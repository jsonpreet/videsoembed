import { VIDEO_CDN_URL } from "./constants"

const sanitizeLvprUrl = (url) => {
  return url.replace('https://livepeercdn.com', VIDEO_CDN_URL)
}

export default sanitizeLvprUrl