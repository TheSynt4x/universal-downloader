module.exports = {
  lintOnSave: false,

  pages: {
    popup: {
      template: 'public/popup.html',
      entry: './src/popup/main.js',
      title: 'Popup',
    },

    options: {
      template: 'public/options.html',
      entry: './src/options/main.js',
      title: 'Options',
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
            'content-script': ['src/content-script.js'],
          },
        },
      },
    },
  },

  transpileDependencies: ['vuetify'],
};
