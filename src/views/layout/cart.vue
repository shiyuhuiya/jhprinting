<template>
  <div class="cart">
    <van-nav-bar title="购物车"  left-arrow @click-left="$router.go(-1)" fixed />
    <div v-if="(numOfAll > 0)">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all">共<i>{{ numOfAll }}</i>件商品</span>
        <span class="edit" @click="edit()">
          <!-- 可以写函数，也可以直接写表达式 -->
          <van-icon name="edit" />
          编辑
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <!-- vant的组件，圆形的复选框，不是自己写的vue组件-->
          <van-checkbox :value="item.checked" @click="toggleCheck(item.goods_id)"></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
            <span class="bottom">
              <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
              <!-- 希望保留原本的默认传参，又希望传入自己的参数 -->
              <countbox :value="item.goods_num" @input="(e) => { changeCount(item.goods_id, e, item.goods_sku_id) }">
              </countbox>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div class="all-check">
          <!-- vant的组件，圆形的复选框，不是自己写的vue组件-->
          <van-checkbox icon-size="18" :value="isAllChecked" @click="toggleAllCheck()"></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price">
            <span>合计：</span>
            <span>¥ <i class="totalPrice">{{ sumPrice }}</i></span>
          </div>
          <div v-if="!isDel" class="goPay" :class="{ disabled: numOfChecked === 0 }" @click="goPay">结算({{ numOfChecked }})</div>
          <div v-else class="delete" :class="{ disabled: numOfChecked === 0 }" @click="deleteGoods">删除</div>
        </div>
      </div>
    </div>
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        您的购物车是空的, 快去逛逛吧
      </div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>
  </div>
</template>

<script>
import countbox from '@/components/Countbox.vue'
import { mapState, mapGetters } from 'vuex';
import loginConfirm from '@/mixins/loginConfirm';
import { Checkbox } from 'vant';
export default {
  name: 'CartPage',
  components: { countbox,[Checkbox.name]:Checkbox},
  mixins:[loginConfirm],
  created() {
    // console.log(this.$store)
    // console.log(mapState('cart', ['cartList'])['cartList'].toString())
    if (!this.loginConfirm()) {
      //发送请求，设置购物车列表，然后才可以进行渲染
      this.$store.dispatch('cart/getCartAction')
    }
  },
  data() {
    return {
      isDel: false
    }
  },
  //计算属性最好和data放一块，因为都是数据类型
  computed: {
    //获取vuex中的购物车列表
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', ['isAllChecked','numOfAll',"numOfChecked","sumPrice","selectedGoods"]),
  },
  methods: {
    //修改数据，委托给vuex中的方法
    toggleCheck(goods_id) {
      this.$store.commit('cart/toggleCheck', goods_id)
    },
    //点击全选按钮，触发此函数
    toggleAllCheck() {
      this.$store.commit('cart/toggleAllCheck', !this.isAllChecked)
    },
    //改变商品数量，处理子组件传递过来的事件委托
    changeCount(goodsId, goodsNum, goodsSkuId) {
      this.$store.dispatch('cart/changeCountAction', { goodsId, goodsNum, goodsSkuId })
    },
    //编辑商品，可以删除商品
    edit() {
      this.isDel = !this.isDel
      //切换到删除逻辑,isDel=true,就把所有商品的选中状态改为false，即！isDel
      //切换到结算逻辑,isDel=false,就把所有商品的选中状态改为true，即！isDel
      this.$store.commit('cart/toggleAllCheck', !this.isDel)
    },
    //删除操作
    deleteGoods() {
      //不需要传值，cart仓库中自行寻找checked为true的商品即可
      this.$store.dispatch('cart/deleteGoodsAction')
    },
    //订单确认
    goPay() {
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart',
          cartIds: this.selectedGoods
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;

  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;

    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }

    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }

    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;

        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;

          span {
            font-size: 16px;
          }
        }

        .count-box {
          display: flex;
          width: 110px;

          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }

          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;

    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;

    .price {
      font-size: 14px;
      margin-right: 10px;

      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay,
    .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;

      &.disabled {
        background-color: #ff9779;
      }
    }
  }

}

.empty-cart {
  padding: 80px 30px;

  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }

  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }

  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>