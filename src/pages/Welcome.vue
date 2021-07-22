<template>
  <div>
    <h2>Welcome,{{ username }}</h2>
    <div>欢迎使用本电商后台管理系统</div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      username: "izayoirinn",
    };
  },
  mounted(){
    window.sessionStorage.removeItem('activePath');
  }
};
</script>

<style lang="less" scoped>
</style>