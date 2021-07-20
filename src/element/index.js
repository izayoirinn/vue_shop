import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Main,
    Aside,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup
} from 'element-ui'
/* 登录页面 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
/* 主体home页面新加 */
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
/* 侧边栏 */
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.prototype.$message = Message