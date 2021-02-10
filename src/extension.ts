import {
  workspace,
  window,
  TextEditor,
  TextDocumentChangeEvent,
  ConfigurationChangeEvent,
  ExtensionContext,
} from 'vscode'
import { extname, basename, resolve } from 'path'
import { FileDataCache } from 'file-data-cache'
import { decorateEditor } from './decorateEditor'
import { loadTranslationFile } from './loadTranslations'
import { searchForTranslationsFiles } from './searchForTranslationsFiles'

// Check for new translation files
const SEARCH_FOR_TRANSLATIONS_FILES_INTERVAL = 60000
// Check to see if cache translations files haven't changed (using last modification date)
const CACHE_INTERVAL = 5000

const fileCache = new FileDataCache({
  loadFileData: (filePath, fileContent) =>
    loadTranslationFile({
      filePath,
      fileContent,
      keyTemplate: settings.keyTemplate,
    }),
  checkInterval: CACHE_INTERVAL,
  readFile: true,
})

let settings: ExtensionSettings
let showTranslationsTimeout
let lastSearchForI18nsFiles = 0
let allTranslations = {}

type ExtensionSettings = {
  extensions: string[]
  translationsFilenames: string[]
  translationsFolders?: string[]
  ignoredFolders?: string[]
  keyTemplate?: string
  verbose?: boolean
  color?: string
}

const toArray = (stringSettings = '') =>
  stringSettings
    .toLowerCase()
    .replace(/,/g, ';')
    .split(';')
    .filter((ext) => ext.length)

export function activate(context: ExtensionContext) {
  function loadSettings() {
    const workspaceRoot = getWorkspaceRootPath()
    const rawSettings = workspace.getConfiguration('translationKeysLookup')
    const res: ExtensionSettings = {
      ...rawSettings,
      translationsFilenames: toArray(rawSettings.translationsFilenames),
      extensions: toArray(rawSettings.extensions).map((ext) =>
        ext[0] === '.' ? ext : `.${ext}`,
      ),
      translationsFolders: toArray(
        rawSettings.translationsFolders,
      ).map((path) => resolve(workspaceRoot, path)),
      ignoredFolders: toArray(rawSettings.ignoredFolders),
    }
    settings = res
    log(`Extension Settings: ${JSON.stringify(settings)}`)
  }

  loadSettings()

  if (window.activeTextEditor) {
    showTranslations(window.activeTextEditor)
  }

  function log(text) {
    if (settings.verbose) {
      console.log(`[translation-keys-lookup] ${text}`)
    }
  }

  workspace.onDidChangeConfiguration(
    (e: ConfigurationChangeEvent) => {
      loadSettings()
      fileCache.map.clear()
      lastSearchForI18nsFiles = 0
    },
    null,
    context.subscriptions,
  )

  window.onDidChangeActiveTextEditor(
    (editor: TextEditor) => {
      log('Event: Editor changed')
      if (editor) {
        showTranslations(editor)
      }
    },
    null,
    context.subscriptions,
  )

  workspace.onDidChangeTextDocument(
    (event: TextDocumentChangeEvent) => {
      log('Event: Text changed')
      const activeEditor = window.activeTextEditor
      if (activeEditor && event.document === activeEditor.document) {
        showTranslations(activeEditor)
      }
    },
    null,
    context.subscriptions,
  )

  function showTranslations(editor: TextEditor) {
    const filePath = editor.document?.uri?.fsPath
    if (!filePath) return

    if (!settings.extensions.includes(extname(filePath).toLowerCase())) {
      log(`Ignored: ${basename(filePath)}`)
      return
    }

    showTranslationsTimeout && clearTimeout(showTranslationsTimeout)
    showTranslationsTimeout = setTimeout(() => {
      let hasChanged = false
      const now = Date.now()
      let i18nsFilePaths = fileCache.getPaths()
      if (
        now - lastSearchForI18nsFiles >=
        SEARCH_FOR_TRANSLATIONS_FILES_INTERVAL
      ) {
        // Recheck for new i18ns files
        i18nsFilePaths = searchForTranslationsFiles({
          filenames: settings.translationsFilenames,
          rootPaths: settings.translationsFolders,
          ignoredFolders: settings.ignoredFolders,
        })
        lastSearchForI18nsFiles = now
        fileCache.getEntries().forEach(({ path }) => {
          if (!i18nsFilePaths.includes(path)) {
            fileCache.map.delete(path)
          }
        })
      }
      // log('🐬 fileCache.map.size', fileCache.map.size)
      i18nsFilePaths.forEach((filePath) => fileCache.loadData(filePath))

      const cacheEntries = fileCache.getEntries()

      hasChanged = cacheEntries.some(({ lastCheck }) => lastCheck?.wasChanged)

      if (cacheEntries.length === 0) {
        allTranslations = {}
      } else {
        if (hasChanged) {
          allTranslations = fileCache
            .getValues()
            .reduce((result, keyValues) => ({ ...keyValues, ...result }), {})
          log(
            `i18ns file(s) changed. Translations count: ${
              Object.keys(allTranslations).length
            }`,
          )
        }
      }

      if (fileCache.map.get(filePath)) {
        // Translation files aren't decorated
        return
      }

      const color =
        settings.color === 'random' ? getRandomColor() : settings.color

      const keys = Object.keys(allTranslations)
      log(`translations.length: ${keys.length}`)
      log(`translations: ${keys.slice(0, 4).join(',')}`)
      decorateEditor({
        editor,
        translations: allTranslations,
        color,
        keyTemplate: settings.keyTemplate,
      })
    }, 200)
  }
  function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  function getWorkspaceRootPath() {
    const currentWorkspace = workspace.workspaceFolders?.length
      ? workspace.workspaceFolders[0]
      : undefined
    if (!currentWorkspace) {
      return ''
    }
    return currentWorkspace.uri.fsPath
  }
}

// var watcher = workspace.createFileSystemWatcher('**/*.json') //glob search string
// // watcher.ignoreChangeEvents = false

// watcher.onDidChange(() => {
//   //window.showInformationMessage('change applied!') //In my opinion this should be called
//   console.log('😺 CHANGE')
// })
