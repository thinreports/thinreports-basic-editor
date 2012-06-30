# Contributing to i18n of ThinReportsEditor

## How to translate in your own language

Related files are as follows:

* **Translation file**
  * Windows: `INSTALLDIR\resources\core\locales\*.js`
  * Mac OS: `ThinReportsEditor.app/Contents/Resources/core/locales/*.js`
  * Linux: `INSTALLDIR/resources/core/locales/*.js`
* **Configuration script**
  * Windows: `INSTALLDIR\resources\core\app.js`
  * Mac OS: `ThinReportsEditor.app/Contents/Resources/core/app.js`
  * LInux: `INSTALLDIR/resources/core/app.js`
  
### Create a Translation file

Copy the `en.js`, create a translation file with a name like `xx.js` for your language

    % cp en.js xx.js

Modify the `xx.js` as follows:

```javascript
Thin.setLocale('<your language like "en", "ja">', '<best font-families in your language>') {
  toolbar_group_file: 'File', 
    :
});
```

Translate into your language

```javascript
  toolbar_group_file: '<translated text>', 
    :
```

### Enable your language

Add the following to your `app.js` (Configuration script):

```javascript
/**
 * Available locales
 */
Thin.LOCALES = {
  'ja': '日本語', 
  'en': 'English', 
  'xx': '<your language name>'
};
```

### Check the translations on Editor to switch to your language

1. Start the Editor
2. Open the preference dialog  
(You can find the preference button on the right side of the toolbar)
3. Select your language, press the OK button to apply

## How to send us your translation file

### Pull request

1. Fork [thinreports/thinreports-editor](https://github.com/thinreports/thinreports-editor) on github
2. Create your feature branch: `git checkout -b new-locale`
3. Add your translation file and add your language setting to `app.js`
4. Commit: `git commit -am 'added xx locale'`
5. Push to the branch: `git push origin new-locale`
6. Create new pull request

### Send as attachment of patch

Submit your translation file from [the official issue tracker](http://osc.matsukei.net/projects/thinreports-editor/issues/new)(login required)
