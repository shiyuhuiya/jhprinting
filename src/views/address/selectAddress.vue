<template>
  <div class="main">

    <van-nav-bar title="我的地址" left-arrow @click-left="onClickLeft" />
    <!-- 简直无敌了 -->
    <!-- 利用插槽在组件中传入结构 -->
    <van-radio-group v-model="checked">
      <addressItem v-for="(item, index) in addressList" :key="item.address_id" :item="item" :isDel="isDel"
        @del="delAddress">
        <van-radio :name="index"></van-radio>
      </addressItem>
    </van-radio-group>

    <div class="footer">
      <div class="btn-add" @click="edit"><span v-if='!isDel'>管理</span><span v-else>退出管理</span></div>
      <div class="btn-buy" @click="add">+添加收获地址</div>
      <div class="confirm" @click="confirm">确认</div>
    </div>
  </div>
</template>

<script>
import addressItem from '@/components/addressItem.vue'
import { getAddressList, delAddress } from '@/api/address'
import { RadioGroup,Radio } from 'vant'
export default {
  components: { addressItem,[Radio.name]:Radio,[RadioGroup.name]:RadioGroup },
  data() {
    return {
      addressList: [],
      isDel: false,
      checked: this.$store.state.index
    }
  },
  async created() {
    //一加载页面就刷新地址列表，存储地址列表数组
    const res = await getAddressList()
    // console.log(res)
    this.addressList = res.data.list
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    add() {
      this.$router.push('/addAddress')
    },
    edit() {
      this.isDel = !this.isDel
    },
    //删除地址操作
    async delAddress(id) {
      this.addressList = this.addressList.filter(item => item.address_id != id)
      // const res = await delAddress(id)
      this.$toast.success('删除地址成功')
    },
    //确认
    confirm() {
      this.$store.commit('setIndex', this.checked)
      //选好地址后回退到订单页面
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
//如果子组件中也有.body，那这个样式也会影响到子组件
.main {
  padding-bottom: 55px;
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

  .btn-add {
    height: 36px;
    line-height: 36px;
    margin: 0 10px;
    flex: 1;
    border-radius: 18px;
    background-color: #ffa900;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }

  .btn-buy {
    margin: 0 10px;
    height: 36px;
    line-height: 36px;
    flex: 2;
    border-radius: 18px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background-color: #fe5630;
  }

  .confirm {
    margin: 0 10px;
    height: 36px;
    line-height: 36px;
    flex: 3;
    border-radius: 18px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background-color: #fe5630;
  }
}
</style>