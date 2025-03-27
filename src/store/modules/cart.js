import { getCartList, changeCount, delSelect } from '@/api/cart'
const state = function(){
    return {
      cartList: []
    }
}
const mutations = {
  //设置state中的cartList
  setCartList(state, list) {
    list?.forEach(item=>{item.checked=true})
    state.cartList = list
  },
  //同步根据id修改某一行商品checke状态
  toggleCheck(state, goods_id) {
    const goods = state.cartList.find(item => item.goods_id == goods_id)
    //只需要传入goods_id，状态不需要传入，取反即可
    goods.checked = !goods.checked
  },
  //同步修改全部商品checked状态
  toggleAllCheck(state,flag) {
    state.cartList.forEach(item => { item.checked = flag })
  },
  //同步修改本地购物车某一商品数量
  //或者刷新，发送请求更新
  changeCount(state, obj) {
    const goods = state.cartList.find((item) => item.goods_id === obj.goodsId)
    goods.goods_num = obj.goodsNum
  }
}
const actions =  {
  //异步发送请求获取购物车列表
  async getCartAction(context) {
    const { data } = await getCartList()
    //保存数据到被本地购物车列表
    context.commit('setCartList', data.list)
  },
  //异步修改购物车某一商品数量（改）
  async changeCountAction(context, obj) {
    const { goodsId, goodsNum, goodsSkuId } = obj
    const res = await changeCount(goodsId, goodsNum, goodsSkuId)
    //如果服务端修改成功，同步到本地，也可通过请求更新数据
    if(res.status!=500){
       context.commit('changeCount', { goodsId, goodsNum })
    }
  },
  //异步删除购物车对象（删）
  async deleteGoodsAction(context) {
    //获得要删除的商品id列表 
    const delList = context.state.cartList.filter(item => item.checked).map(item => item.id)
    //异步删除商品
    const res = await delSelect(delList)
    //同步到本地（即便是通过发请求，目的也是为了修改内存中的cartList,不考虑后端商品数据的更新，手动修改即可）
    //也许这部分代码写在mutation更好？
    context.state.cartList = context.state.cartList.filter(item => !item.checked)
  }
}
const getters = {
  isAllChecked(state) {
    return state.cartList.every(item => item.checked)
  },
  numOfAll(state) {
    return state.cartList.reduce((sum, cur) => {
      return sum + cur.goods_num
    }, 0)
  },
  numOfChecked(state) {
    //对象数组也可以使用reduce来求某些和
    return state.cartList.reduce((sum, cur) => {
      if (cur.checked) {
        return sum + cur.goods_num
      } else {
        return sum
      }
    }, 0)
  },
  sumPrice(state) {
    return state.cartList.reduce((sum, cur) => {
      if (cur.checked) {
        return sum + cur.goods_num * cur.goods.goods_price_min
      } else {
        return sum
      }
    }, 0)
  },
  //返回所有选中的商品id数组，用于下单的时候生成订单
  selectedGoods(state) {
    return state.cartList.filter(item => item.checked).map(item => item.id).join(',')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
