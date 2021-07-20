// 引入路由
import Vue from "vue";
import VueRouter from "vue-router";
// 1. 定义 (路由) 组件。
// 可以从其他文件 import 进来
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Welcome from '../pages/Welcome.vue';
import Users from '../pages/user/Users.vue';
Vue.use(VueRouter);
// 2. 定义路由

const routes = [
    // 路由规则
    {
        path: "/",
        // 重定向到登录页面
        redirect: "/login"
    },
    {
        name: 'login',
        path: '/login',
        component: Login,
        meta: {
            title: "登录"
        }
    },
    {
        name: 'home',
        path: '/home',
        component: Home,
        meta: {
            title: "主页"
        },
        redirect: "/welcome",
        children: [{
                name: "welcome",
                path: "/welcome",
                component: Welcome,
                meta: {
                    title: "欢迎"
                },
            },
            {
                name: "users",
                path: "/users",
                component: Users,
                meta: {
                    title: "用户管理"
                },
            }
        ]
    },

]
// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})
// 为路由对象,添加beforeEach导航守卫
router.beforeEach((to, from, next) => {
    // 如果用户访问的是登录页,直接放行
    if (to.path === "/login") return next();
    // 从sessionStorage中获取到的保存的token值
    const tokenStr = window.sessionStorage.getItem("token");
    // 没有token,强制跳转到登录页
    if (!tokenStr) return next("/login");
    // TODO 验证token?
    next();
});

// afterEach导航守卫 ,修改title
// eslint-disable-next-line no-unused-vars
router.afterEach((to, _from) => {
    document.title = to.meta.title;
});
export default router;