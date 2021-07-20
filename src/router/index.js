// 引入路由
import Vue from "vue";
import VueRouter from "vue-router";
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import Login from '../pages/Login.vue';

Vue.use(VueRouter);
// 2. 定义路由

const routes = [
    // 路由规则
    {
        path:"/",
        // 重定向到登录页面
        redirect:"/login"
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
        meta: {
            title: "登录"
        }
    }

]
// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

// eslint-disable-next-line no-unused-vars
router.afterEach((to, _from) => {
    document.title = to.meta.title;
})
export default router;