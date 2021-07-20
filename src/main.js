import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 引入elementUI
import './element/index.js';

// 导入全局样式表
import './assets/css/global.css';

// 导入字体图标
import './assets/fonts/iconfont.css';
Vue.config.productionTip = false
// 引入 axios
import axios from 'axios';
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";
Vue.prototype.$http = axios;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')