<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录头像区  -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        class="login_form"
      >
        <!-- 用户名 使用第三方的图标 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 使用element-ui中自带的图标 -->
        <!-- 
          用户在密码栏敲下回车,实现登录提交 
          https://cn.vuejs.org/v2/guide/components-custom-events.html
          你可能有很多次想要在一个组件的根元素上直接监听一个原生事件。这时，你可以使用 v-on 的 .native 修饰符：
        -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  naem: "Login",
  data() {
    return {
      // 登录表单的数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单数据
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 发送登录请求
    login() {
      // 验证参数信息是否通过验证
      this.$refs.loginFormRef.validate((valid) => {
        // console.log(valid);
        // 判断参数是否合法
        if (!valid) return;
        // { data: res }: 解构赋值
        this.$http.post("login", this.loginForm).then(({ data: res }) => {
          // console.log(res);
          if (res.meta.status != 200)
            return this.$message({
              showClose: true,
              message: res.meta.msg,
              type: "error",
            });
          // 登录成功
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: "success",
          });
          // 登录成功后的逻辑

          //  1. 将登录成功之后的token，保存到客户端的sessionStorage中
          // TODO token sessionStorage? or cookie?
          window.sessionStorage.setItem("token", res.data.token);
          //   2. 通过编程式路由导航跳转到后台主页，路由地址是'/home'
          this.$router.push('/home');
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.login_box {
  position: relative;
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    margin: -65px auto;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;

      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 10px;
  width: 100%;
  padding: 0 30px;
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

