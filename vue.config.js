module.exports = {
    /*  pages: {
         index: {
             // page 的入口
             entry: 'src/main.js'
         }
     }, */
    lintOnSave: false, // 关闭语法检查
    /*  // 开启代理服务器(方式一)
     devServer: {
         proxy: 'http://localhost:8888'
     } */
    chainWebpack: config => {

        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            //entry找到默认的打包入口，调用clear则是删除默认的打包入口
            //add添加新的打包入口
            config.entry('app').clear().add('./src/main-prod.js')

            //使用externals设置排除项
            // 键为依赖包的名字。值为使用Window全局的某个对象。
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                moment: "moment",
                'vue-quill-editor': 'VueQuillEditor'
            })
            //使用插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = true
                return args
            })
        })

        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            //使用插件
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })
        })
    }
}