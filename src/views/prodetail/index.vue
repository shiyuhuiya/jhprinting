<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(image, index) in goodsImage" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ goodsId.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ comments.total }}条)</div>
        <div class="right" @click="showAllComments">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="(item, index) in comments.list" :key="index">
          <div class="top">
            <img :src="item.user.avatar_url || defaultPic" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="content" style=" word-wrap: break-word;">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
        <div style="text-align: center;border-top: 1px solid #ccc;line-height: 30px;" @click="up" v-show="flag">
          <van-icon name="arrow-up" />
          <div style="font-size: 12px;">收起</div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" @click="goToHome" />
        <span>首页</span>
      </div>
      <div class="icon-cart">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" @click="goToCart" />
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="addToCart">加入购物车</div>
      <div class="btn-buy" @click="buyNow">立刻购买</div>
    </div>
    <!-- 唤起弹窗 -->
    <!-- 为什么这里是v-model不是 v-if/v-show -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice">{{ detail.goods_price_min }}</span>
            </div>
            <div class="count">
              <span>库存</span>
              <span>{{ detail.stock_total }}</span>
            </div>
          </div>
        </div>
        <div class="num-box">
          <span>数量</span>
          <countbox v-model="addCount"></countbox>
          <!-- <countbox :value="addCount" @input="(e)=>{addCount=e}"></countbox> -->
        </div>
        <div class="showbtn" v-if="detail.stock_total > 0">
          <div class="btn" v-if="mode === 'cart'" @click="addCart">加入购物车</div>
          <div class="btn now" v-else @click="goBuyNow">立刻购买</div>
        </div>
        <div class="btn-none" v-else>该商品已抢完</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { getProComments, getProdetail } from '@/api/product';
import { addCart } from '@/api/cart';
import { ActionSheet ,Rate,Swipe,SwipeItem } from 'vant';
import Countbox from '@/components/Countbox.vue'
import loginConfirm from '@/mixins/loginConfirm'
//直接导入图片资源,根据图片大小被打包（这里是base64）
import defaultPic from '@/assets/default-avatar.png'
export default {
  name: 'ProDetail',
  components: {
    Countbox,[ActionSheet.name]:ActionSheet ,[Rate.name]:Rate,[Swipe.name]:Swipe,[SwipeItem.name]:SwipeItem
  },
  mixins:[loginConfirm],
  data() {
    return {
      flag: false,//控制展开组件显示
      current: 0,//用户选择的商品数目
      goodsImage: [],//轮播图图片
      detail: {},//详细信息对象
      comments: {},//评论信息对象
      defaultPic,//默认头像
      mode: 'cart',//弹窗模式
      showPannel: false,//弹窗显示隐藏状态
      addCount: 1, //需要购买的商品的数量
      cartTotal: 0//购物车内商品总数
    }
  },
  async created() {
    //根据商品id，发请求获取商品详细信息
    const res = await getProdetail(this.goodsId)
    const { data: { detail } } = res
    //更新商品详情
    this.detail = detail
    //商品图片
    this.goodsImage = detail.goods_images
    //发请求获取评论信息
    const res2 = await getProComments(this.goodsId, 3)
    //更新评论对象
    this.comments = res2.data
  },
  computed: {
    //商品id,用计算属性表示是为了简化代码，虽然id不会改变
    goodsId() {
      return this.$route.params.id
    }
  },
  methods: {
    addToCart() {
      //修改弹窗状态
      this.mode = 'cart'
      //显示弹窗
      this.showPannel = true
    },
    buyNow() {
      //修改弹窗状态
      this.mode = 'buyNow'
       //显示弹窗
      this.showPannel = true
    },
    goToCart() {
      //点击购物车图标跳转到购物车
      this.$router.push('/cart')
    },
    goToHome() {
      //点击主界面图标跳转到home
      this.$router.push('/home')
    },
    //展示全部评论
    async showAllComments() {
      const res3 = await getProComments(this.goodsId, this.comments.total)
      this.comments = res3.data
      this.flag = true
    },
    //收起评论
    async up() {
      const res4 = await getProComments(this.goodsId, 3)
      this.comments = res4.data
      this.flag = false
    },
    // 加入购物车
    async addCart() {
      //如果已经登录
      if (!this.loginConfirm()) {
        const res = await addCart(this.goodsId, this.addCount, this.detail.skuList[0].goods_sku_id)
        //加入的商品信息会同步到服务器，并更新购物车图标商品数目
        this.cartTotal = res.data.cartTotal
        //提示加入购物车成功
        this.$toast('加入购物车成功')
        //关闭弹窗
        this.showPannel = false
      }
    },
    // 立即购买
    goBuyNow() {
      if (!this.loginConfirm()) {
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'buyNow',
            goodsId: this.goodsId,
            goodsSkuId: this.detail.skuList[0].goods_sku_id,
            goodsNum: this.addCount
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  // vue3写成:deep(){}
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  img {
    display: block;
    width: 100%;
  }

  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }

  .desc {
    width: 100%;
    overflow: scroll;

    ::v-deep img {
      display: block;
      width: 100% !important;
    }
  }

  .info {
    padding: 10px;
  }

  .title {
    display: flex;
    justify-content: space-between;

    .now {
      color: #fa2209;
      font-size: 20px;
    }

    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }

    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }

  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }

  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;

    .left-words {
      span {
        margin-right: 10px;
      }

      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }

  .comment-title {
    display: flex;
    justify-content: space-between;

    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;

    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;

      img {
        width: 20px;
        height: 20px;
      }

      .name {
        margin: 0 10px;
      }
    }

    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .icon-home,
    .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      .van-icon {
        font-size: 24px;
      }
    }

    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }

    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}

// 弹框样式
.product {
  .product-title {
    display: flex;

    .left {
      img {
        width: 90px;
        height: 90px;
      }

      margin: 10px;
    }

    .right {
      flex: 1;
      padding: 10px;

      .price {
        font-size: 14px;
        color: #fe560a;

        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn,
  .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }

  .btn.now {
    background-color: #fe5630;
  }

  .btn-none {
    background-color: #cccccc;
  }
}

//显示购物车商品数量图标样式
.footer .icon-cart {
  position: relative;
  padding: 0 6px;

  .num {
    z-index: 999;
    position: absolute;
    top: -2px;
    right: 0;
    min-width: 16px;
    padding: 0 4px;
    color: #fff;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 50%;
  }
}
</style>