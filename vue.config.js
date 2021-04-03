module.exports = {
  lintOnSave: false,

  pages: {
    popup: {
      template: 'public/popup.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },
  },

  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js',
        },
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-script.js',
            ],
          },
        },
      },
    },
  },

  transpileDependencies: [
    'vuetify',
  ],
};
