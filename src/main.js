import Vue from 'vue'
import App from './App.vue'

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
}).$mount('#app')