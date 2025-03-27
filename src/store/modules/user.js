import { setUserInfo, getInfo, removeInfo } from '@/utils/storage'
export default {
  namespaced: true,
  state: {
    //页面刚加载完成，或者刷新，从本地存储中获取个人信息，更新info
    // 一旦 info 被初始化，后续对 info 的访问都是直接从 Vuex store 中获取已存储的值，不会再调用 getInfo 函数。
    info: getInfo()
  },
  getters:{
    token(state){
      return state.info.token
    }
  },
  mutations: {
    setUserInfo(state, info) {
      state.info = info
      //同步保存到本地
      setUserInfo(info)
    }
  }
}