
const vueConfig = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    disableHostCheck: true,
    host: '127.0.0.1',
    port: 7008,
    open: true,
    proxy: {
      '/api/my/': {
        target: 'http://172.16.97.194:3000',
        changeOrigin: true,
      },
      '/api/': {
        target: 'http://172.16.97.194:7008',
        changeOrigin: true,
      },
    },
    watchOptions: {
      ignored: ['**/node_modules', '**/.#*']
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
}

module.exports = vueConfig
