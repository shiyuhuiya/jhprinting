<template>
  <div class="count-box">
    <button @click="handleSub" class="minus">-</button>
    <input :value="value" @change="handleChange" class="inp" type="text">
    <button @click="handleAdd" class="add">+</button>
  </div>
</template>
<script>
  export default{
    props:{
      value:{
        type:Number,
        default:1
      }
    },
    methods:{
      //只要数字变化，就触发input事件
      handleSub(){
        if(this.value<=1){
          return
        }
        this.$emit('input',this.value-1)
      },
      handleAdd(){
        this.$emit('input',this.value+1)
      },
      handleChange(e){
        if(+e.target.value<=0||isNaN(+e.target.value)){ 
          //如果输入的数字不正确或者不是数字
           e.target.value=this.value
           return
        }
        this.$emit('input',+e.target.value)
      }
    }
  }
</script>
<style lang="less" scoped>
.count-box {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
    text-align: center;
  }
}
</style>
