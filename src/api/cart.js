import request from '@/utils/request'
//添加商品到购物车的信息也要保存到服务器
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}
//获取购物车信息
//因为headers里已经携带了token，就知道要查询的是哪个用户的购物车信息
export const getCartList = () => {
  return request.get('/cart/list')
}
//更新购物车信息
export const changeCount = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}
//删除购物车内的商品
export const delSelect = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}