# Contributing to Translation

## How to translate in your own language

### Preparation

1. Fork [thinreports/thinreports-editor](https://github.com/thinreports/thinreports-editor) on github
2. Clone your forked repository (**Note:** [How to clone the source of the Editor](https://github.com/thinreports/thinreports-editor#how-to-clone-the-source-of-the-editor))
3. Create your locale branch: `git checkout -b new-locale`

### Create a Translation file

There are translation files in `src\locales\*.js`.

Copy the `en.js` and create a translation file with a name like `xx.js` for your language:

    % cp en.js xx.js

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

### Enabling your language

Add the following to your `src\app.html`:

```html
<!DOCTYPE html>
  <html class="splash">
    <head>
      <title>Thinreports Editor</title>
      <meta charset="UTF-8">
      <script src="app.js"></script>
      <script src="locales/ja.js"></script>
      <script src="locales/en.js"></script>
      <script src="locales/xx.js"></script>
        :
```

### Check the translations on Editor to switch to your language

1. Launch the Editor with referring to [How to launch development version of the Editor](https://github.com/thinreports/thinreports-editor#how-to-launch-development-version-of-the-editor)
2. Open the preference dialog
(You can find the preference button on the right side of the toolbar)
3. Select your language, press the OK button to apply

## How to send us your translation file

### Pull request

1. See [Preparation](https://github.com/thinreports/thinreports-editor/blob/master/doc/TRANSLATION.md#preparation)
2. Add your translation file and add your translation file path in `app.html`
3. Commit: `git commit -am 'added xx locale'`
4. Push to the branch: `git push origin new-locale`
5. Create new pull request
