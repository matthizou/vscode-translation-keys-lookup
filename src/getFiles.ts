import { existsSync, statSync, readdirSync } from 'fs'
import { basename, join, extname } from 'path'

const IGNORED_FOLDERS = [
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
}

function walkRecur(fullPath, options: Options = {}, results = []) {
  try {
    const stat = statSync(fullPath)
    const isDirectory = stat.isDirectory()
    // DIRECTORY
    if (isDirectory) {
      let name = basename(fullPath)
      if (IGNORED_FOLDERS.includes(name)) {
        return results
      }
      // Continue recursion
      const children = readdirSync(fullPath)

      children.map((childName) =>
        walkRecur(join(fullPath, childName), options, results),
      )
    } else {
      // FILE
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
  if (!existsSync(path)) return []
  walkRecur(path, options, results)
  return results
}
