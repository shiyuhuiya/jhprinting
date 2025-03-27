<template>
  <div id="box">
    <!-- index属于一级路由对应的组件，如果始终在这个页面上，它包裹的二级组件确实能因为keep-alive被缓存，
    但是切到其他一级组件后，它会连同它缓存的二级组件被销毁 -->
    <keep-alive ><router-view></router-view></keep-alive>
    <van-tabbar route active-color="pink">
      <van-tabbar-item icon="wap-home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar,TabbarItem } from 'vant';
export default {
  name:'myIndex',
  components:{[Tabbar.name]:Tabbar,[TabbarItem.name]:TabbarItem}
}
</script>

<style>

</style>