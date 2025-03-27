<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar title="智慧商城" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      :style="searchObj.style"
      background="#f1f1f2"
      :placeholder="searchObj.params.placeholder"
      :v-model="search"
      @click="$router.push(`/search?${search}`)"
    />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item  v-for="item in wipeList" :key="item.imgUrl">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="item in navList" :key="item.imgUrl"
        :icon="item.imgUrl"
        :text="item.text"
        @click="$router.push('/category')"
      />
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img src="@/assets/main.png" alt="">
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">—— 猜你喜欢 ——</p>

      <div class="goods-list">
        <GoodsItem v-for="item in goodsList" :key="item.goods_id" :item="item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getDetail } from '@/api/home';
import { Search,Grid,GridItem,Swipe,SwipeItem } from 'vant'
export default {
  name: 'HomePage',
  components: {
    GoodsItem,[Search.name]:Search,[Grid.name]:Grid,[GridItem.name]:GridItem,[Swipe.name]:Swipe,[SwipeItem.name]:SwipeItem
  },
  data(){
    return {
      search:'',
      searchObj:{params:{placeholder:"请输入"},style:{}},
      wipeList:[],
      navList:[],
      goodsList:[]
    }
  },
  async created(){
    const {data:{pageData:{items}}} = await getDetail()
    this.searchObj=items[0]
    this.wipeList=items[1].data
    this.navList=items[3].data
    this.goodsList=items[6].data
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.home {
  padding-top: 100px;
  padding-bottom: 50px;
  // color: var(--text-color);
}
:root {
  --text-color: #000000;
}
// --text-color: #000000;
// .right{
//   background: #39a9ed;
// }
// 导航条样式定制
.van-nav-bar {
  z-index: 999;
  background-color: #c21401;
  ::v-deep .van-nav-bar__title {
    color: #fff;
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}

// 分类导航部分
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}

// 主会场
.main img {
  display: block;
  width: 100%;
}

// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>