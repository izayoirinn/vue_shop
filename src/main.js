import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 局部引入element-ui
// import './element/index.js';
// 全局导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
// 导入全局样式表
import './assets/css/global.css';

// 导入字体图标
import './assets/fonts/iconfont.css';
Vue.config.productionTip = false
/* 引入树形表格 */
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable);

// 引入 axios
import axios from 'axios';
// axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// 拦截器为请求头添加token属性
axios.interceptors.request.use(config => {
  // console.log('@', config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})

Vue.prototype.$http = axios;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')