import { existsSync, statSync, readdirSync } from 'fs'
import { basename, join, extname } from 'path'

export const IGNORED_FOLDERS = [
  'node_modules',
  '.git',
  'tmp',
  'temp',
  'public',
  'bower_components',
  '__tests__',
]

type Options = {
  extensions?: string[]
  ignoredFolders?: string[]
  filter?: Function
  __count__?: number
}

const MAX_SEARCHED_FILES = 5000

function walkRecur(fullPath, options: Options = {}, results = []) {
  try {
    const stat = statSync(fullPath)
    const isDirectory = stat.isDirectory()
    // DIRECTORY
    if (isDirectory) {
      if (options.__count__ >= MAX_SEARCHED_FILES) {
        console.log('⚠️ Too many files')
        return results
      }

      let name = basename(fullPath)
      if ((options.ignoredFolders || IGNORED_FOLDERS).includes(name)) {
        return results
      }
      // Continue recursion
      const children = readdirSync(fullPath)

      children.map((childName) =>
        walkRecur(join(fullPath, childName), options, results),
      )
    } else {
      // FILE
      options.__count__++
      if (options.extensions) {
        const extension = extname(fullPath).replace(/^\./, '').toLowerCase()

        if (!options.extensions.includes(extension)) {
          return results
        }
      }

      if (options.filter && Boolean(options.filter({ fullPath })) === false) {
        return results
      }
      results.push(fullPath)
    }
    return results
  } catch (ex) {
    console.error(`walkRecur() error when processing: ${fullPath}`)
    console.error(`${ex.message}`)
    return
  }
}

/**
 *
 * @param {string} path
 * @param {Object} options
 * @param {Array} options.extensions
 * @param {Array} options.ignoredFolders
 * @param {Array} options.filter
 */
export function getFiles(path, options: Options = {}) {
  const results = []
  options.__count__ = 0
  console.log('😺 ignored', options.ignoredFolders.join(';'))
  if (!existsSync(path)) return []
  walkRecur(path, options, results)
  console.log('🔍 Count of searched files:', options.__count__)
  return results
}
