export const getVideoUrl = (video) => {
  const url = video.VideoURLs[0].replace('iframe.', '')
  return url
}

export const getOriginalVideoUrl = (video) => {
  const url = video.VideoURLs[0]
  return url
}

export const getPlaybackIdFromUrl = (video) => {
  const url = video.VideoURLs[0]
  const playbackId = url.split('/').pop()
  return playbackId
}

export const getLivePeerPlaybackIdFromUrl = (url) => {
  const pathname = new URL(url).pathname
  console.log(pathname)
  const playbackId = pathname.split('/')[2]
  return playbackId
}