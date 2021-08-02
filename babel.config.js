// 这是项目发布阶段所需要用到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 移除控制台输出
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    // ["@babel/preset-env", { "modules": false }]
  ],
  /* 移除控制台的输出 */
  plugins: [...prodPlugins]

  /*  plugins: [
     [
       "component",
       {
         "libraryName": "element-ui",
         "styleLibraryName": "theme-chalk"
       }
     ]
   ] */
}

// 取消局部引入element-ui