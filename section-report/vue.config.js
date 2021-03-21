module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.thinreports.editor',
        productName: 'Thinreports Editor',
        publish: null,
        mac: {
          category: 'public.app-category.developer-tools',
          darkModeSupport: false
        },
        linux: {
          category: 'Development'
        },
        dmg: {
          icon: false
        }
      }
    }
  }
};
