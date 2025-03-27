import request from '@/utils/request'
// *思路分析：**这里的订单结算，有两种情况：
// 1. 购物车结算，需要两个参数
//    ① mode="cart"
//    ② cartIds="cartId, cartId"
// 2. 立即购买结算，需要三个参数
//    ① mode="buyNow"
//    ② goodsId="商品id" 
//    ③ goodsSkuId="商品skuId"

// 都需要跳转时将参数传递过来
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode,
      delivery: 10,
      couponId: 0,
      isUsePoints: 0,
      ...obj
    }
  })
}
//付款，提交订单
export const submitOrder = (mode, params) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10, // 物流方式  配送方式 (10快递配送 20门店自提)
    couponId: 0, // 优惠券 id
    payType: 10, // 余额支付
    isUsePoints: 0, // 是否使用积分
    ...params
  })
}
//
export const getOrderList = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page
    }
  })
}