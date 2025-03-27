import Vue from 'vue'
import VueRouter from 'vue-router'
import layout from '@/views/layout'
import login from '@/views/login'
import myorder from '@/views/myorder'
import pay from '@/views/pay'
import prodetail from '@/views/prodetail'
import search from '@/views/search'
import searchList from '@/views/search/list.vue'
import cart from '@/views/layout/cart.vue'
import category from '@/views/layout/category.vue'
import home from '@/views/layout/home.vue'
import user from '@/views/layout/user.vue'
import address from '@/views/address/myAddress.vue'
import addAddress from '@/views/address/addAddress.vue'
import editAddress from '@/views/address/editAddress.vue'
import selectAddress from '@/views/address/selectAddress.vue'
import store from '@/store/index'
//注册插件
Vue.use(VueRouter)

//创建路由器对象
const router = new VueRouter({
  mode:'history',
  routes: [
    {
      path: '/', component: layout,
      children: [
        { path: 'cart', component: cart },
        { path: 'category', component: category },
        { path: 'home', component: home,
          // beforeEnter:(to,from,next)=>{
          //   console.log(to,from,next)
          //   next()
          // } //可以在home组件内通过this.$route获取到这个路由对象
        },
        { path: 'user', component: user }
      ], redirect: '/home'
    },
    {
      path: '/login', component: login
    },
    {
      path: '/myorder', component: myorder
    },
    {
      path: '/pay', component: pay
    },
    {
      path: '/prodetail/:id', component: prodetail
    },
    {
      path: '/search', component: search,
    },
    {
      path: '/searchList', component: searchList
    },
    {
      path: '/address', component: address
    },
    {
      path: '/addAddress', component: addAddress
    },
    {
      path: '/editAddress', component: editAddress
    },
    {
      path: '/selectAddress', component: selectAddress
    }
  ]
})
const paths = ['/pay', '/myorder']
//导航守卫
router.beforeEach((to, from, next) => {
  //前两个是对象(和$route一样  是一个反应式的对象)，后一个是函数
  // console.log(to, from, next)
  // console.log(store.getters.token)
  //如果要访问的网站to对象的路径：path 不是'/pay', '/myorder'
  if (!paths.includes(to.path)) {
    next()//放行
  } else {
    if (store.getters['user/token']) {
      next()
    } else {
      //拦截到登录页面
      next('/login')
    }
  }
})
export default router
