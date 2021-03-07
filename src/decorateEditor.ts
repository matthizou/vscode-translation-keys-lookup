import { window, Range, Position, DecorationOptions, TextEditor } from 'vscode'
import { KEY_PATTERN, hasSeparator } from './constants'

const decorationType = window.createTextEditorDecorationType({})

type DecorateEditorConfig = {
  editor: TextEditor
  translations: Object
  color: string
  keyTemplate?: string
}

export function decorateEditor({
  editor,
  translations,
  color,
}: DecorateEditorConfig) {
  const sourceCode = editor.document.getText()
  const keyRegex: RegExp = new RegExp(`["'](${KEY_PATTERN})["']`)

  let decorationsArray: DecorationOptions[] = []
  const lines = sourceCode.split('\n')

  // console.log(
  //   '🐬 translations: ',
  //   Object.keys(translations).slice(0, 3).join(','),
  //   Object.values(translations).slice(0, 3).join(','),
  // )

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    let match: RegExpExecArray = keyRegex.exec(lines[lineNumber])
    if (match && match.length > 0) {
      let potentialKey = match[1]
      //console.log(match)

      // console.log(
      //   '🐦 potentialKey',
      //   potentialKey,
      //   'text:',
      //   translations[potentialKey],
      // )

      if (hasSeparator(potentialKey) && translations[potentialKey]) {
        const decoration = {
          renderOptions: {
            after: {
              contentText: translations[potentialKey],
              cursor: 'pointer',
              fontStyle: 'italic',
              margin: '0 0 0 1rem',
              color: color || 'green',
              dark: {},
            },
          },
          range: new Range(
            new Position(lineNumber, 1024),
            new Position(lineNumber, 1024),
          ),
        }
        decorationsArray.push(decoration)
      }
    }
  }

  editor.setDecorations(decorationType, decorationsArray)
}
