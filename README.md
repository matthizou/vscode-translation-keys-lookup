# translation-keys-lookup README

Visual Studio Code extension to see the texts associated to your i18n keys  
  

![translation-keys-lookup preview](https://i.imgur.com/Adm2loZ.png)

## Configuration

The goal during development has been to provide an flexible and simple way to configure the extension to adapt it to your projects' needs.

  - Open `Code` -> `Preferences` -> `Settings`
  - Go to `Extensions` -> `Translation Keys Lookup`

The following settings are available:

| Setting Name | Default value | Description|
| ---------------------- | ------------------------------------------- | ----- |
| key Template           | MY_I18N_KEY                                 | How do the i18n keys looks like? <br/>Note the following restrictions: <br/>_ A key name can only contains **alpha-numerical characters** and separator characters ( \_ or - ) <br/>_ A key must have at least **5** characters <br/>\* At least one separator character is required (no matter where) |
| Translations Filenames | en.json;en.txt;en.yml                       | Filename(s) of the file(s) containing translations, separated by semicolumns. <br/>Regular expressions are not supported yet                                                                                                                                                                           |
| Translations Folders   | src;packages;resources                      | Path of the root folders to recursively search for translation files.<br/>They are relative to the workspace root.<br/>Try to limit the number of files crawled (max: **5000**) by providing specific paths.                                                                                           |
| Ignored Folders        | node_modules;public;dist;.git;\_\_tests\_\_ | Folders ignored when the script is recursively looking for translation files                                                                                                                                                                                                                           |
| Extensions             | js;jsx;ts;tsx;rb                            | Extensions of the files **consuming** the i18ns keys                                                                                                                                                                                                                                                   |
| color                  | green | Color of the translation text (hex value or html color name)  <br/>🤪  _Write 'random' for a bit of crazyness . Or don't. That's not for everyone._|                                                                                                                                                             |

---

### More

Be sure to understand that there are 2 kind of files the extension cares about:

1. The files **providing** the keys and translations
2. The files **consuming** them

