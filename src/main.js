import Vue from 'vue'
//Vue是一个构造函数
import App from './App.vue'//App是一个被vue-loader解析后的js对象
// 导入router对象（会先把router文件夹里的index.js里的代码运行）
import router from './router'
// 导入store对象
import store from './store'
import '@/styles/common.css'
import './utils/vant-ui.js'
Vue.config.productionTip = false
const app = new Vue({
  router,
  store,
  render: h => h(App)//h是createElement函数，用来创建虚拟结点（VNode）, 返回这个 VNode，告诉 Vue 使用 App 组件作为根组件
}).$mount('#app')
// console.log(Vue.options.components); 
