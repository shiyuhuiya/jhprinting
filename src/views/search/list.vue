<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search readonly shape="round" background="#ffffff" :value="search" show-action
      @click="$router.push('/search')">
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item">综合</div>
      <div class="sort-item">销量</div>
      <div class="sort-item">价格 </div>
    </div>

    <div class="goods-list">
      <!-- 写法1 -->
      <!-- <div v-for="item in goodsList" :key="item.goods_id">
        <GoodsItem :item="item"></GoodsItem>
      </div> -->
      <!-- 写法2 -->
      <GoodsItem v-for="item in goodsList" :key="item.goods_id" :item="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProducts } from '@/api/product.js'
import { Search } from 'vant';
export default {
  name: 'SearchIndex',
  components: {
    GoodsItem,[Search.name]:Search
  },
  data() {
    return {
      page: 1,
      goodsList: [],
      search: this.$route.query.search
    }
  },
  computed: {
    querySearch() {
      return this.$route.query.search
    },
    categoryId() {
      return this.$route.query.categoryId
    }
  },
  async created() {
    const res = await getProducts({ page: this.page, goodsName: this.querySearch, categoryId: this.categoryId })
    // console.log(res)
    const { data: { list: { data } } } = res
    // console.log(data)
    this.goodsList = data
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;

  ::v-deep .van-icon-arrow-left {
    color: #333;
  }

  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;

    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>