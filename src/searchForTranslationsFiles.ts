import { basename } from 'path'
import { getFiles } from './getFiles'

type SearchForTranslationsFilesOptions = {
  filenames: string[]
  rootPaths: string[]
  ignoredFolders: string[]
}

export function searchForTranslationsFiles({
  filenames,
  rootPaths,
  ignoredFolders,
}: SearchForTranslationsFilesOptions) {
  // console.log(`👨🏻‍💻 Check for new i18ns files`)
  const lowerCaseFilenames = filenames.map((f) => f.toLowerCase())
  const allI18nsPaths: string[] = rootPaths.reduce((res, rootPath) => {
    const paths = getFiles(rootPath, {
      ignoredFolders,
      filter: ({ fullPath }) => {
        const currentFilename = basename(fullPath).toLowerCase()
        return lowerCaseFilenames.includes(currentFilename)
      },
    })
    return paths.length ? [...paths, ...res] : res
  }, [])

  // console.log('files:', allI18nsPaths.map((f) => basename(f)).join(' ; '))
  return allI18nsPaths
}
