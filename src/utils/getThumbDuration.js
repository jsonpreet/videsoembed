export const getThumbDuration = (duration) => {
  const seconds = Math.round(duration)
  const second = (duration > 10) ? 10 : (duration > 5) ? 5 : (duration > 1) ? 1 : 0
 return `${second}s`
}