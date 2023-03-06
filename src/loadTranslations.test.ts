import { loadTranslationFile } from './loadTranslations'

const KEYS = ['modals.create-file.title', 'common.cancel-button']
const VALUES = ['Create a new file', 'Cancel']

describe('loadTranslations', () => {
  describe('json file', () => {
    it('returns a key/value object', () => {
      const [key1, key2] = KEYS
      const [value1, value2] = VALUES
      const fileContent = `{
              "${key1}": "${value1}",
              "${key2}": "${value2}"
          }
          `
      const result = loadTranslationFile({
        filePath: './test_en.json',
        fileContent,
      })

      expect(Object.keys(result)).toHaveLength(2)
      expect(result[key1]).toBe(value1)
      expect(result[key2]).toBe(value2)
    })

    // NOT SUPPORTED FOR NOW
    // describe('when the key is not flat', () => {
    //     const value = 'Cancel'
    //     const fileContent = `{
    //         "common": {
    //             "cancel-button": "${value}"
    //         }
    //     }
    //         `
    //     const result = loadTranslationFile({
    //       filePath: './test_en.json',
    //       fileContent,
    //     })
    //     const fullKey = 'common.cancel-button'
    //     expect(Object.keys(result)).toHaveLength(1)
    //     expect(result[fullKey]).toBe(value)
    //   })
  })
})

describe('Default parser', () => {
  it('returns a key/value object', () => {
    const [key1, key2] = KEYS
    const [value1, value2] = VALUES
    const fileContent = `
                ${key1}: ${value1}
                ${key2}: ${value2}
            `
    const result = loadTranslationFile({
      filePath: './test_en.txt',
      fileContent,
    })

    expect(Object.keys(result)).toHaveLength(2)
    expect(result[key1]).toBe(value1)
    expect(result[key2]).toBe(value2)
  })
})
