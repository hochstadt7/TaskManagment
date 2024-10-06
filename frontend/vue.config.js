const fs = require('fs');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('../server.key'),
        cert: fs.readFileSync('../server.cert'),
      },
    },
    port: 8080
  }
})
