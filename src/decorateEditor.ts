import { window, Range, Position, DecorationOptions, TextEditor } from 'vscode'

const decorationType = window.createTextEditorDecorationType({})

export function decorateEditor(
  editor: TextEditor,
  translations: Object,
  color: string,
) {
  const sourceCode = editor.document.getText()
  const keyRegex: RegExp = /["']([A-Z0-9_]{5,})["']/

  let decorationsArray: DecorationOptions[] = []
  const lines = sourceCode.split('\n')
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    let match: RegExpExecArray = keyRegex.exec(lines[lineNumber])
    if (match) {
      let potentialKey = match[1]
      if (translations[potentialKey]) {
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
