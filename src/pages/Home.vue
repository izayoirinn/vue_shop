<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo-img" src="../assets/rinn.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧标栏 -->
      <el-aside width="200px">
        <!--  -->
        <el-menu
          default-active="110"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eef"
        >
          <!-- 一级导航 -->
          <el-submenu
            v-for="item in menuList"
            :index="item.id + ''"
            :key="item.id"
          >
            <!-- 一级导航的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span v-text="item.authName"></span>
            </template>
            <!-- 二级导航 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="subItem.id + ''"
              :key="subItem.id"
            >
              <!-- 二级导航模板区域 -->
              <template slot="title">
                <!-- 二级导航图标区域 -->
                <i class="el-icon-menu"></i>
                <!-- 二级导航文本区域 -->
                <span v-text="subItem.authName"></span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      /* 保存了菜单目录 */
      menuList: [],
      /* 保存图标 */
      iconList: {
        125: "el-icon-s-custom",
        103: "el-icon-s-operation",
        102: "el-icon-s-order",
        // 商品管理
        101: "el-icon-s-shop",
        145: "el-icon-s-data",
      },
    };
  },
  mounted() {
    // 获取所有的菜单
    this.getMenuList();
  },
  methods: {
    logout() {
      // TODO 删除后端token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    getMenuList() {
      this.$http.get("menus").then(({ data: res }) => {
        console.log("菜单列表:", res);
        if (res.meta.status !== 200) this.$message.error(res.meta.msg);
        this.menuList = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(84 92 100);
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(84 92 100);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.logo-img {
  height: 50px;
  border-radius: 50%;
}
</style>