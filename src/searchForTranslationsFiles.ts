import { basename, extname } from 'path'
import { getFiles } from './getFiles'

type SearchForTranslationsFilesOptions = {
  filenames: string[]
  rootPaths: string[]
}

let count
export function searchForTranslationsFiles(
  options: SearchForTranslationsFilesOptions,
) {
  const { filenames, rootPaths } = options
  console.log(`👨🏻‍💻 Check for new i18ns files`)
  const lowerCaseFilenames = filenames.map((f) => f.toLowerCase())
  count = 0
  const allI18nsPaths: string[] = rootPaths.reduce((res, rootPath) => {
    const paths = getFiles(rootPath, {
      filter: ({ fullPath }) => {
        count++
        const currentFilename = basename(fullPath).toLowerCase()
        return lowerCaseFilenames.includes(currentFilename)
      },
    })
    return paths.length ? [...paths, ...res] : res
  }, [])

  console.log(`Looked in ${count} files`, allI18nsPaths)
  console.log('files:', allI18nsPaths.map((f) => basename(f)).join(' ; '))
  return allI18nsPaths
}
