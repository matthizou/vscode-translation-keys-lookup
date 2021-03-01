import { extname } from 'path'
import { KEY_PATTERN, hasSeparator } from './constants'

function defaultParser(code) {
  const keyValueRegex: RegExp = new RegExp(
    `\\n\\s*(${KEY_PATTERN}):?\\s+(.+)`,
    'g',
  )

  const result = {}
  let match = keyValueRegex.exec(code)
  let key, value
  while (match) {
    key = match[1]
    value = match[2]

    if (hasSeparator(key) && !result.hasOwnProperty(key)) {
      result[key] = value
    }
    match = keyValueRegex.exec(code)
  }
  return { ...result }
}

type LoadTranslationFileConfig = {
  filePath: string
  fileContent: string
}

export function loadTranslationFile(config: LoadTranslationFileConfig): Object {
  const { filePath, fileContent } = config

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
