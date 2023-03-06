# translation-keys-lookup README

<img alt="logo" src="https://i.imgur.com/3KU6kIP.png"/>

Extension to see the texts associated to your i18n keys, without switching back and forth.  
Fast, simple and light, it works everywhere - no matter the framework or the language.

![translation-keys-lookup preview](https://i.imgur.com/peRk15g.jpg)

## 🔑 Keys

In order differenciate potential keys from regular texts, the keys need to respect 3 conditions:

- A key name can only contains **alpha-numerical characters** and separator characters: \_ (underscore), .(dot), or -(dash)
- A key must have at least **6** characters
- At least one separator character is required (no matter where)

> - Valid ✅
>   - _my-i18n-key_
>   - _MY_i18n_KEY_
>   - _myApp.my-I18N-key_
> - Invalid ❌
>   - _my-i18ns-key#3_&nbsp;&nbsp; _(invalid character)_
>   - _myI18nKey_&nbsp;&nbsp; _(no separator)_
>   - _i-key_ &nbsp;&nbsp; (too short)

---

## ⚙️ Configuration

In many cases, it will works straight out the box.  
But as there is no such thing as one-fit-all, a small sets of settings will give you the possibility to tailor-make it to your standard.

- Open `Code` -> `Preferences` -> `Settings`
- Go to `Extensions` -> `Translation Keys Lookup`

The following settings are available:

- `Translations Filenames`  
  Filename(s) of the file(s) **containing** translations, separated by semicolumns.  
  Regular expressions are not supported yet.  
  Default values: `en.json;en.txt;en.yml`

- `Extensions`  
  Extensions of the files **consuming** the i18ns keys  
  Default values: `js;jsx;ts;tsx;rb;py;java`

- `color`  
  Color of the translation text (hex value or html color name)  
  _🤪 Write 'random' for a bit of crazyness . Or don't. That's not for everyone._
  Default values: `green`

- `Translations Folders`  
  Path of the root folders to recursively search for translation files.<br/>They are relative to the workspace root.  
  Try to limit the number of files crawled (max: **5000**) by providing specific paths.  
  Default values: `src;packages;resources;translations`

- `Ignored Folders [optimization]`  
  Folders ignored when the script is recursively looking for translation files
  Default values: `node_modules;public;dist;.git;__tests__`

### Debugging

In order to debug or add new features, run the project locally using the Run and Debug view in vscode (Shift + Cmd + D).  
This will open a second instance of vscode (B) that you will be able to debug from your first instance (A).  
While you interact with (B), logs will appear in the Debug Console of (A).  
You can also set breakpoints in (A) directly from the Code Editor.

### More

Any suggestion, request or help for setting up, don't hesitate to drop me an email
