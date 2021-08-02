#环境准备
1. 搭建vue-cli
2. 下载依赖(Vue-route,element-ui,axios)
3. 版本管理git/github
    git remote add origin https://github.com/izayoirinn/vue_shop.git
    git push -u origin main
    // 创建一个新的分支
    git checkout -b login
    // 查看所有分支
    git branch
4. less下载
    npm install less --save-dev
    //这里需要指定版本，不能太高，如果太高后续容易报错。
    npm install less-loader@6.0.0 --save-dev

#git 基本命令
    创建新分支: git checkout -b login
    查看分支: git branch
    切换分支: git checkout 分支名
    合并分支: 在主分支执行 git merge login 表示将 login分支合并到主分支
    推送到远程仓库: git push
    第一次推送其他分支到远程仓库: git push -u origin login
使用第三方树形表格:
    npm i vue-table-with-tree-grid
    https://github.com/MisterTaki/vue-table-with-tree-grid
