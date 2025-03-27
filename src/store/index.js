import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import cart from '@/store/modules/cart'
//注册插件
Vue.use(Vuex)
//Store显然是一个构造器
export default new Vuex.Store({
  state: {
    //默认地址下标/选中的地址下标
    //主要是方便同级别组件通信啦，在selectAddress组件修改要渲染的地址，
    //点击确认修改index，然后返回订单页面，地址就会同时改变了
    index: 0
  },
  mutations: {
    setIndex: (state, index) => {
      state.index = index
    }
  },
  modules: {
    user, cart
  }
})
