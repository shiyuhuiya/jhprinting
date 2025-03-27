<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active" >
      <van-tab name = "all" title="全部"></van-tab>
      <van-tab name = "payment" title="待支付"></van-tab>
      <van-tab name = "delivery" title="待发货"></van-tab>
      <van-tab name = "received" title="待收货"></van-tab>
      <van-tab name = "comment" title="待评价"></van-tab>
    </van-tabs>

    <OrderListItem v-for="item in orderList" :key = "item.order_id" :item="item"></OrderListItem>
  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem.vue'
import { getOrderList } from '@/api/order';
import { Tab ,Tabs} from 'vant';
export default {
  name: 'OrderPage',
  components: {
    OrderListItem,[Tab.name]:Tab,[Tabs.name]:Tabs
  },
  data () {
    return {
      active: this.$route.query.dataType ||'all',
      orderList:[]
    }
  },
  methods:{
    async getOrderList(){
      const res = await getOrderList(this.active,1)
      //手动添加一个总价属性，方便后续在小组件中渲染
      this.orderList = res.data.list.data
      this.orderList.forEach(item=>{
        item.total_num = item.goods.reduce((sum,cur)=>{
          return sum+cur.total_num
        },0)
      })
      // console.log(this.orderList)
    }
  },
  watch:{
    active:{
      //立即执行一次handler
      immediate:true,
      //active的值一改变，就发送请求刷新订单列表，相当于是添加了点击事件了，而且更简洁
      handler () {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
}
.van-tabs {
  position: sticky;
  top: 0;
}
</style>