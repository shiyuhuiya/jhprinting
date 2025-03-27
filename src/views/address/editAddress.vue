<template>
  <div class="body">
    <van-nav-bar title="修改地址" left-arrow @click-left="onClickLeft" />
    <form action="">
      <div>地址信息</div>
      <van-cell-group>
        <van-field v-model="name" label="姓名" placeholder="请输入用户名" />
        <van-field v-model="phone" label="电话号码" placeholder="电话号码" />
        <van-field v-model="fieldValue" is-link readonly label="地区" placeholder="请选择所在地区" @click="show = true" />
        <van-popup v-model="show" round position="bottom">
          <van-cascader v-model="cascaderValue" title="请选择所在地区" :options="options" @close="show = false"
            @finish="onFinish" />
        </van-popup>
        <van-field v-model="detail" rows="2" autosize label="详细地址" type="textarea" maxlength="50" placeholder="请输入详细地址"
          show-word-limit />
      </van-cell-group>
    </form>
    <div class="footer">
      <div class="btn-buy" @click="editAddress">修改 </div>
    </div>
  </div>
</template>

<script>
import { addAddress, editAddress, getProvince } from '@/api/address.js'
import { Cell,CellGroup,Cascader,Field,Popup} from 'vant'
export default {
  data() {
    return {
      name: '',
      phone: '',
      detail: '',
      plist: [],
      // activeIndex1: 0,
      // activeIndex2: 0,

      show: false,
      fieldValue: '',
      cascaderValue: '',//没啥用
      selectedValues: [],
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [
        {
          text: '浙江省',
          value: '330000',
          children: [{ text: '杭州市', value: '330100' }],
        },
        {
          text: '江苏省',
          value: '320000',
          children: [{ text: '南京市', value: '320100' }],
        },
      ],
    }
  },
  components:{[Cell.name]:Cell,[CellGroup.name]:CellGroup,[Cascader.name]:Cascader,[Field.name]:Field,[Popup.name]:Popup},
  computed: {
    item() {
      return JSON.parse(this.$route.query.item)
    },
    // clist() {
    //   return this.plist.length !== 0 ? Object.values(this.plist[this.activeIndex1].city) : []
    // },
    // rlist() {
    //   return this.clist.length !== 0 ? Object.values(this.clist[this.activeIndex2].region) : []
    // }
  },
  async created() {
    this.name = this.item.name
    this.phone = this.item.phone
    this.detail = this.item.detail
    const res = await getProvince()
    // console.log(res)
    //处理成一个对象数组，方便渲o染
    this.plist = Object.values(res.data.list)
    // console.log(this.plist)
    this.options = this.process(this.plist, 1)
    // console.lg(this.options)
  },
  methods: {
    onClickLeft: function () {
      this.$router.back()
    },
    //我简直是超人，果然学过算法还是有用的啊
    process(list, level) {
      if (level == 3) {
        return list.map((item) => { return { text: item.name, value: item.id } })
      }
      return list.map((item) => { return { text: item.name, value: item.id, children: this.process(Object.values(item.city || item.region), level + 1) } })
    },
    //添加地址
    async editAddress() {
      const res = await editAddress(this.item.address_id, this.name, this.phone, this.selectedValues[0], this.selectedValues[1], this.selectedValues[2], this.detail)
      // console.log(res)
      this.$toast.success("修改地址成功")
      //1s后跳转
      setTimeout(() => {
        this.$router.replace('/address')
      }, 1000)
    },
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join('/');
      this.selectedValues = selectedOptions.map((option) => option.value)
      // console.log(this.selectedValues)
    },
  }
}
</script>

<style lang="less" scoped>
.body {
  form {
    div {
      padding: 20px;
    }

    .van-cell-group {
      padding: 0;
    }
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

  .btn-buy {
    margin: 0 10px;
    height: 36px;
    line-height: 36px;
    flex: 1;
    border-radius: 18px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background-color: #fe5630;
  }
}
</style>
