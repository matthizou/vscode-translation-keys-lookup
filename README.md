# translation-keys-lookup README

<img src="./resources/images/logo.png"/>

Visual Studio Code extension to see the texts associated to your i18n keys, without switching back and forth.  
It is simple, light, works everywhere. It does one thing and does it well.

![translation-keys-lookup preview](https://i.imgur.com/Adm2loZ.png)

## How should the i18n keys looks like?

In order differenciate potential keys from regular texts, please note the following points:

- A key name can only contains **alpha-numerical characters** and separator characters: \_ (underscore), .(dot), or -(dash)
- A key must have at least **6** characters
- At least one separator character is required (no matter where)

> Examples of 🔑  
>  ✅ _my-i18n-key_  
>  ✅ _MY_i18n_KEY_  
>  ✅ _myApp.my-I18N-key_  
>  ❌ _my-i18ns-key#3_ (invalid character)  
>  ❌ _myI18nKey_ _(no separators)_  
>  ❌ _i-key_ (too short)

## Configuration

The goal during development has been to provide an flexible and simple way to configure the extension to adapt it to your projects' needs.

- Open `Code` -> `Preferences` -> `Settings`
- Go to `Extensions` -> `Translation Keys Lookup`

The following settings are available:

- `Translations Filenames`  
  Filename(s) of the file(s) containing translations, separated by semicolumns.  
  Regular expressions are not supported yet.  
  Default values: `en.json;en.txt;en.yml`

- `Translations Folders`:  
  Path of the root folders to recursively search for translation files.<br/>They are relative to the workspace root.  
  Try to limit the number of files crawled (max: **5000**) by providing specific paths.  
  Default values: `src;packages;resources;translations`

- `Ignored Folders`  
  Folders ignored when the script is recursively looking for translation files
  Default values: `node_modules;public;dist;.git;__tests__`

- `Extensions`  
  Extensions of the files **consuming** the i18ns keys  
  Default values: `js;jsx;ts;tsx;rb`

- `color`  
  Color of the translation text (hex value or html color name)  
  _🤪 Write 'random' for a bit of crazyness . Or don't. That's not for everyone._
  Default values: `green`

### More

Be sure to understand that there are 2 kind of files the extension cares about:

1. The files **providing** the keys and translations
2. The files **consuming** them
