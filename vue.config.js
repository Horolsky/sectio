module.exports = {

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
    devtool: 'source-map'
  }
}