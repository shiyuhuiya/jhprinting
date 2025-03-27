<template>
  <div>
    <van-nav-bar title="收获地址" left-arrow @click-left="onClickLeft"/>
  </div>
</template>

<script>
export default {
  methods:{
    onClickLeft(){
      this.$router.back()
    }
  }
}
</script>

<style>

</style>