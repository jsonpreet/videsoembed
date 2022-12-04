const truncate = (str, max, suffix = '...') =>
  str.length < max
    ? str
    : `${str.substring(
        0,
        str.substring(0, max - suffix.length).lastIndexOf(' ')
      )}${suffix}`

export default truncate