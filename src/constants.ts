export const MIN_KEY_SIZE = 6
export const KEY_PATTERN = `[a-zA-Z0-9._-]{${MIN_KEY_SIZE},}`

export const hasSeparator = (key) =>
  key.indexOf('_') !== -1 || key.indexOf('-') !== -1 || key.indexOf('.') !== -1
