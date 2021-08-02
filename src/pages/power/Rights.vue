<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card shadow="never">
      <!-- 权限列表表格 -->
      <el-table
        :data="rightList"
        v-loading="loading"
        border
        stripe
        height="750"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="权限路径"></el-table-column>

        <el-table-column label="权限等级">
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-tag v-if="scope.row.level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level === 1" type="success"
              >二级</el-tag
            >
            <el-tag v-else-if="scope.row.level === 2" type="warning"
              >三级</el-tag
            >
          </template>

          <!--  <template v-slot="scope">
              {{scope}}
         
          </template>-->
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      // 权限列表数据
      rightList: [],
      loading: true,
    };
  },
  mounted() {
    this.getRightList();
  },
  methods: {
    getRightList() {
       this.loading = true;
      this.$http.get('rights/list').then(({ data: res }) => {
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error('获取权限列表失败');
        this.rightList = res.data;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
