import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
// 导入全局样式表
import './assets/css/global.css';
Vue.config.productionTip = false
// 按需引入element-ui
import {
  Button,
  Select
} from 'element-ui';
/* Vue.component(Button.name, Button);
Vue.component(Select.name, Select); */

Vue.use(Button);
Vue.use(Select);
new Vue({
  render: h => h(App),
  router
}).$mount('#app')