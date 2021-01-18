import { extname } from 'path'

const keyRegex: RegExp = /([A-Z0-9_]{5,})/
const keyValueRegex = /([A-Z0-9_]{5,}):?\s+(.+)/g

function defaultParser(code) {
  const i18nsMap = {}
  let match = keyValueRegex.exec(code)
  let key, value
  while (match) {
    key = match[1]
    value = match[2]
    if (!i18nsMap.hasOwnProperty(key)) {
      i18nsMap[key] = value
    }
    match = keyValueRegex.exec(code)
  }
  return { ...i18nsMap }
}

export function loadTranslationFile(filePath, fileContent): Object {
  const extension = extname(filePath).toLowerCase()
  let result: Object = {}
  try {
    switch (extension) {
      case '.json':
        result = JSON.parse(fileContent)
        break
      default:
        result = defaultParser(fileContent)
    }
  } catch (e) {}
  // console.log('Load Translation file', extension, Object.keys(result).length)
  return result
}

export function loadTranslations({ fileCache }) {
  const keys: string[] = Array.from(fileCache.map.keys())
  return keys.reduce((result, filePath) => {
    const fileI18ns = fileCache.loadData(filePath)
    if (!fileI18ns) return result
    return {
      ...fileI18ns,
      ...result,
    }
  }, {})
}
