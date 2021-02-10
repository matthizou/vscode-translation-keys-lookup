export const MIN_KEY_SIZE = 5

export const getKeyTemplateInfo = (keyTemplate) => {
  let pattern = '0-9'
  let separator
  switch (keyTemplate) {
    case 'MY-I18N-KEY':
      pattern += 'A-Z'
      separator = '-'
      break
    case 'my_i18n_key':
      separator = '_'
      pattern += 'a-z'
      break
    case 'my-i18n-key':
      pattern += 'a-z'
      separator = '-'
      break
    default:
    case 'MY_I18N_KEY':
      pattern += 'A-Z'
      separator = '_'
      break
  }

  return {
    pattern: `[${pattern}${separator}]\{${MIN_KEY_SIZE},\}`,
    separator,
  }
}
