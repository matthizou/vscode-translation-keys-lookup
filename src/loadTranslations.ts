import { extname } from 'path'
import { getKeyTemplateInfo } from './getKeyTemplateInfo'

function defaultParser(code, keyTemplate) {
  const { pattern: keyPattern, separator } = getKeyTemplateInfo(keyTemplate)
  const keyValueRegex: RegExp = new RegExp(
    `\\n\\s*(${keyPattern}):?\\s+(.+)`,
    'g',
  )

  const result = {}
  let match = keyValueRegex.exec(code)
  let key, value
  while (match) {
    key = match[1]
    value = match[2]
    if (key.indexOf(separator) !== -1 && !result.hasOwnProperty(key)) {
      result[key] = value
    }
    match = keyValueRegex.exec(code)
  }
  return { ...result }
}

type LoadTranslationFileConfig = {
  filePath: string
  fileContent: string
  keyTemplate?: string
}
export function loadTranslationFile(config: LoadTranslationFileConfig): Object {
  const { filePath, fileContent, keyTemplate } = config

  const extension = extname(filePath).toLowerCase()

  let result: Object = {}
  try {
    switch (extension) {
      case '.json':
        result = JSON.parse(fileContent)
        break
      default:
        result = defaultParser(fileContent, keyTemplate)
    }
  } catch (e) {}
  // console.log('Load Translation file', extension, Object.keys(result).length)
  return result
}
