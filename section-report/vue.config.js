/* eslint no-template-curly-in-string: 0 */
module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.thinreports.${name}',
        productName: 'ThinreportsEditor-section',
        publish: null,
        mac: {
          artifactName: '${productName}-${version}-darwin.${ext}',
          category: 'public.app-category.developer-tools',
          darkModeSupport: false
        },
        linux: {
          artifactName: '${productName}-${version}-linux.${ext}',
          category: 'Development',
          target: 'AppImage'
        },
        win: {
          artifactName: '${productName}-${version}-win32.${ext}'
        },
        dmg: {
          icon: false
        }
      },
      nodeIntegration: true
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'ja',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
};
