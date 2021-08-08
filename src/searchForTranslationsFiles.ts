import { basename } from 'path'
import { existsSync } from 'fs'
import { findFiles } from 'find-files-recur'

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
  let totalFilesSearched = 0
  const lowerCaseFilenames = filenames.map((f) => f.toLowerCase())
  const allI18nsPaths: string[] = rootPaths.reduce((res, rootPath) => {
    if (!existsSync(rootPath)) return res
    let i18nsPaths = []
    try {
      i18nsPaths = findFiles(rootPath, {
        ignoredFolderNames: ignoredFolders,
        filter: ({ name }) => {
          totalFilesSearched++
          const currentFilename = name.toLowerCase()
          return lowerCaseFilenames.includes(currentFilename)
        },
        detailedResults: false,
      })
    } catch (e) {
      console.log('💥', e)
    }
    return i18nsPaths.length ? [...i18nsPaths, ...res] : res
  }, [])

  // DEBUG: uncomment those line to debug
  console.log('🔍 🔍 Count of searched files:', totalFilesSearched, rootPaths)
  // console.log('💡 I18ns files found:', allI18nsPaths.map((f) => basename(f)).join(' ; '))
  return allI18nsPaths
}
