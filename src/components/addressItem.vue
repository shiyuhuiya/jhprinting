<template>
  <div class="body">
    <slot></slot>
    <div class="left">{{ item.name[0] }}</div>
    <div class="main">
      <span class="name">{{ item.name }}</span><span class="phone">{{ item.phone }}</span>
      <p class="address">{{ item.region.province }} {{ item.region.city}}  {{item.region.region}} {{ item.detail }}</p>
    </div>
    <div class="operate">
      <van-icon name="delete-o" v-if="this.isDel" @click="delAddress"/>
      <van-icon name="edit"  v-else @click="editAddress"/>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      
    }
  },
  props:{
    //接受地址对象
    item:{
      type:Object
    },
    //改变操作模式，编辑还是删除
    isDel:{
      type:Boolean
    }
    //接受地址对象的在数组中的下标
  },
  methods:{
    delAddress(){
      this.$emit('del',this.item.address_id)
    },
    editAddress(){
      // 直接把这个地址对象传过去，数据多，方便数据回写，发请求修改
      this.$router.replace(`/editAddress?item=${JSON.stringify(this.item)}`)
    }
  }
}
</script>

<style scoped lang="less">
.body{
  padding: 10px;
  display: flex;
}
.van-radio{
  margin-right:20px
}
.left{
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 25px;
  color: #fe5630;
  background-color: rgb(224, 181, 39);
  margin-right: 20px;
}
.main {
  flex: 4;
  p{
    font-size: 12px;
    margin-top: 5px;
  }
}
.operate{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>