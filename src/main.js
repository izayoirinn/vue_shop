import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 导入全局样式表
import './assets/css/global.css';
// 引入elementUI
import './element/index.js';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')