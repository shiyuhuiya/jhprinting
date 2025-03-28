const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  css: {
    loaderOptions: { 
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            '@field-label-color': 'green',
            '@field-label-font-size': '24px',
            'text-color': '#111',
            'border-color': '#eee',
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          },
        },
      },
    },
  },
  devServer:{
    // proxy:"http://localhost:8081"
    proxy:{
      '/mamo':{
        changeOrign:true,
        target:"http://localhost:8081",
        pathRewrite:{'^/api':''}
      }
    }
  }
})