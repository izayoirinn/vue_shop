<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ title.firstNav }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ title.secondNav }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: ['title'],
}
</script>

<style>
</style>