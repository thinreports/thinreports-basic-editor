# Contributing to Translation

## Translating in your own language

### Preparation

1. Fork [thinreports/thinreports-editor](https://github.com/thinreports/thinreports-editor) on github
2. Clone your forked repository
3. Create your locale branch: `git switch -c new-locale`
4. Change `basic-editor/` directory: `cd basic-editor/`

### Creating a Translation file

There are translation files in `app/locales/*.js`.

Copy the `en.js` and create a translation file with a name like `xx.js` for your language code:

    % cp en.js xx.js

Note: Please refer to [this site](https://developers.google.com/+/web/api/supported-languages) for language code.

Modify the `xx.js` as follows:

```javascript
App.addLocale({
  id: '<your language code>', name: '<your language name>', font_family: "'<best font-families in your language>'",
  default_settings: {
    // Available values: break-word, none
    // This settings will be used in 'Text Block'.
    text_word_wrap: '<your language text wrapping>'
  },
  messages: {
      :
  }
});
```

Translate in your language:

```javascript
  messages: {
    toolbar_group_file: '<translated text>',
      :
  }
```

### Add your language

Modify the your `app/index.html` as follows:

```html
<!DOCTYPE html>
  <html class="splash">
    <head>
      <title>Thinreports Editor</title>
      <meta charset="UTF-8">
      <script src="index.js"></script>
      <script src="locales/ja.js"></script>
      <script src="locales/en.js"></script>
      <script src="locales/xx.js"></script>
        :
```

### Check your language

1. Launch the Editor: `npm start`
2. Open the preference dialog
(You can find the preference button on the right side of the toolbar)
3. Select your language, press the OK button to apply

## Sending your translation file

1. Commit: `git commit -am 'added xx locale'`
2. Push to your branch: `git push origin new-locale`
3. Create new pull request
