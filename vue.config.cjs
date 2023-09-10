const path = require('path');

module.exports = {

  chainWebpack: (config) => {
    config.resolve.alias.set('vue-notification', '@kyvg/vue3-notification')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 3
            }
          }
        }
      })
  },

  // for GitHub Pages hosting
  publicPath: process.env.NODE_ENV === "production" ? "/sectio-js/" : "/",

  "transpileDependencies": [
    "vuetify"
  ],

  runtimeCompiler: true,

  pwa: {
    name: 'Sectio Canonis',
    themeColor: '#5D016F'
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve:
    {
      alias: {
        '@assets': path.resolve(__dirname, 'public/assets/'),
        '@core': path.resolve(__dirname, 'src/core/'),
        '@util': path.resolve(__dirname, 'src/util/'),
        '@components': path.resolve(__dirname, 'src/components/'),

        '@store': path.resolve(__dirname, 'src/store/'),
        '@plugins': path.resolve(__dirname, 'src/plugins/'),
        '@mixins': path.resolve(__dirname, 'src/global-mixins/'),
      }
    }
  }
}