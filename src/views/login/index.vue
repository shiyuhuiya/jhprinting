<template>
  <div class="body">
    <van-nav-bar title="登录" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <!-- 点击图形验证码获取新的验证码 -->
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            <!-- 三元表达式 -->
            {{ second === totalSecond ? '获取验证码' : second + '秒后重新发送' }}
          </button>
        </div>
      </div>

      <div @click="login" class="login-btn">登录</div>
    </div>
  </div>
</template>

<script>
import { getMsgCode, getPicCode, msgLogin } from '@/api/login'
export default {
  name: 'myLogin',
  async created() {
    this.getPicCode()
  },
  destroyed() {
    //离开页面的时候关闭定时器
    clearInterval(this.timer)
  },
  data() {
    return {
      mobile: '',//电话号码
      picKey: '',//图形图形验证码唯一标识
      picCode: '',//用户输入的图形验证码
      second: 10,//设置的多久才能重新发送验证码
      totalSecond: 10,
      msgCode: '',//短信验证码
      picUrl: '',//图形验证码的url（base64格式）
      timer: null//定时器
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    async getPicCode() {
      const res = await getPicCode()
      this.picUrl = res.data.base64
      this.picKey = res.data.key
    },
    async getCode() {
      if (!this.isValid()) {
        return
      }
      if (this.timer) {
        return
      }
      const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
      this.$toast("短信已发送，请注意查收")
      //思考这里为什么不用延时器
      this.timer = setInterval(() => {
        this.second--
        if (this.second === 0) {
          clearInterval(this.timer)//在定时器内部关闭定时器
          this.timer=null//为了让多次获取验证码能成功
          this.second = this.totalSecond
        }
      }, 1000)
    },
    //手写表单验证
    isValid() {
      //手机号码格式验证
      if (this.mobile.length != 11) {
        this.$toast('请输入正确格式的手机号')
        return false
      }
      //图形验证码格式验证
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确格式的验证码')
        return false
      }
      return true
    },
    async login() {
      //验证手机号码，图形验证码格式
      if (!this.isValid()) {
        return
      }
      //验证短信验证码格式
      if (this.msgCode!=='246810') {
        this.$toast('请输入正确的验证码')
        return
      }
      const res = await msgLogin(this.mobile, this.msgCode)
      this.$toast("登录成功！")
      this.$store.commit('user/setUserInfo', res.data)
      const url = this.$route.query.backUrl || '/'
      //关闭当前页面，跳转到指定页面
      //如果是从某个页面跳转过来的，则回到原来的页面，如果不是，则回到首页
      this.$router.replace(url)
    }
  }
}
</script>

<style scoped lang="less">
.body {
  width: 400px;
  margin: 0 auto;
  margin-top: 30px;
}

.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;

    h3 {
      font-size: 26px;
      font-weight: normal;
    }

    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;

    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }

    img {
      width: 94px;
      height: 31px;
    }

    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>