// import Vant from 'vant'
// import 'vant/lib/index.css'
import Vue from 'vue'
import { NavBar,Button,Toast, Icon} from 'vant'
import {Dialog} from 'vant'
//console.log(Vue.options.components); 可以发现这些组件被全局挂载了
Vue.use(Dialog)
Vue.use(Button)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Toast)
