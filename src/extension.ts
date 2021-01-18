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
import { loadTranslations, loadTranslationFile } from './loadTranslations'
import { searchForTranslationsFiles } from './searchForTranslationsFiles'

// Check for new translation files
const SEARCH_FOR_TRANSLATIONS_FILES_INTERVAL = 60000
// Check to see if cache translations files haven't changed (using last modification date)
const CACHE_INTERVAL = 5000

const fileCache = new FileDataCache({
  loadFileData: loadTranslationFile,
  checkInterval: CACHE_INTERVAL,
  readFile: true,
})

let showTranslationsTimeout
let lastSearchForI18nsFiles = 0

type ExtensionSettings = {
  extensions: string[]
  translationsFilenames: string[]
  translationsFolders?: string[]
  verbose?: boolean
  color?: string
}

const toArray = (stringSettings = '') =>
  stringSettings
    .toLowerCase()
    .split(';')
    .filter((ext) => ext.length)

export function activate(context: ExtensionContext) {
  let settings: ExtensionSettings

  function loadSettings() {
    const workspaceRoot = getWorkspaceRootPath()
    const rawSettings = workspace.getConfiguration('peekTranslations')
    const res: ExtensionSettings = {
      ...rawSettings,
      translationsFilenames: toArray(rawSettings.translationsFilenames),
      extensions: toArray(rawSettings.extensions).map((ext) =>
        ext[0] === '.' ? ext : `.${ext}`,
      ),
      translationsFolders: toArray(
        rawSettings.translationsFolders,
      ).map((path) => resolve(workspaceRoot, path)),
    }
    return res
  }

  settings = loadSettings()
  log(`Extension Settings: ${JSON.stringify(settings)}`)

  if (window.activeTextEditor) {
    // console.log('Editor', window.activeTextEditor.selectionHighlightBorder)
    showTranslations(window.activeTextEditor)
  }

  function log(text) {
    if (settings.verbose) {
      console.log(`[translation-keys-lookup] ${text}`)
    }
  }

  workspace.onDidChangeConfiguration(
    (e: ConfigurationChangeEvent) => {
      settings = loadSettings()
      lastSearchForI18nsFiles = 0
      log(`Extension Settings: ${JSON.stringify(settings)}`)
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
      const now = Date.now()
      if (
        !lastSearchForI18nsFiles ||
        now - lastSearchForI18nsFiles >= SEARCH_FOR_TRANSLATIONS_FILES_INTERVAL
      ) {
        // log(`🌲 Search root: ${rootPath}`)
        const i18nsPaths = searchForTranslationsFiles({
          filenames: settings.translationsFilenames,
          rootPaths: settings.translationsFolders,
        })

        i18nsPaths.forEach((path) => {
          if (!fileCache.map.has(path)) {
            log(`Add translation file: ${path}`)
            fileCache.map.set(path, {
              lastModified: 0,
              lastChecked: 0,
              values: [],
              fileExists: true,
            })
          }
        })
        lastSearchForI18nsFiles = now
      }
      const translations = loadTranslations({ fileCache })
      if (fileCache.map.get(filePath)) {
        return
      }
      log(`translations.length: ${Object.keys(translations).length}`)
      decorateEditor(editor, translations, settings.color)
    }, 200)
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
