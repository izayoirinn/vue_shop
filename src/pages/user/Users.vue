<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card shadow="never">
      <!-- 搜素框与添加按钮 -->
      <el-row :gutter="20">
        <!-- 搜索用户 -->
        <el-col :span="8">
          <!-- 搜索文本框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            @keyup.enter.native="searchUserList"
            v-model="queryInfo.query"
            @clear="searchUserList"
          >
            <!-- 搜索点击按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserFormVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 渲染表格数据 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column
          label="邮箱"
          width="200px"
          prop="email"
        ></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 修改状态 -->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateUserForm(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
              :open-delay="800"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="openAssignRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的模态框 -->
    <el-dialog
      title="新增用户"
      @close="resetUserForm('userAddForm')"
      :visible.sync="addUserFormVisible"
    >
      <el-form
        :rules="userFormRules"
        ref="userAddForm"
        label-position="left"
        :model="addUserForm"
      >
        <el-form-item
          label="用户名"
          prop="username"
          :label-width="userformLabelWidth"
        >
          <el-input
            v-model="addUserForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :label-width="userformLabelWidth"
        >
          <el-input
            v-model="addUserForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :label-width="userformLabelWidth"
        >
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
          :label-width="userformLabelWidth"
        >
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的模态框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      @closed="resetUserForm('editUserFormRef')"
      width="30%"
    >
      <!-- 修改用户表单 -->
      <el-form
        :rules="userFormRules"
        ref="editUserFormRef"
        :model="editUserForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo('editUserFormRef')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色的模态框 -->
    <el-dialog
      title="分配角色"
      @close="setRoleDialogClosed"
      :visible.sync="roleDialogVisible"
      width="30%"
    >
      <!-- 分配用户角色 -->
      <div class="role-dialog">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="用户名">
            <el-input disabled v-model="userInfoForRole.username"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input disabled v-model="userInfoForRole.role_name"></el-input>
          </el-form-item>
          <el-form-item label="新角色">
            <el-select v-model="checkedRoleId" placeholder="新角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      var mobileReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!mobileReg.test(value)) {
        return callback(new Error("手机号格式错误"));
      }
      callback();
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 获取到的用户列表
      userList: [],
      // 用户总记录数
      total: 0,
      // 用户模态框是否打开
      addUserFormVisible: false,
      // 用户模态框表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      userformLabelWidth: "70px",
      // 用户表单规则
      userFormRules: {
        // 验证用户名参数
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "用户名长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码参数
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "密码长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        // 验证邮箱参数
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur"],
          },
        ],

        // 使用自定义手机验证
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      // 修改用户对话框
      editDialogVisible: false,
      // 查询到的用户信息对象
      editUserForm: {
        username: "",
        id: "",
        email: "",
        mobile: "",
        rid: "",
      },
      // 角色分配对话框状态显示
      roleDialogVisible: false,
      // 需要在分配角色时使用的用户信息
      userInfoForRole: {},

      // 角色信息
      roleList: [],
      checkedRoleId: "",
    };
  },
  mounted() {
    // 初始化获取用户列表
    this.getUserList();
  },
  methods: {
    // 获取用户列表信息
    getUserList() {
      this.$http
        .get("users", {
          params: this.queryInfo,
        })
        .then(({ data: res }) => {
          // console.log("@Users", res);
          if (res.meta.status != 200)
            return this.$message.error("获取用户列表失败!");
          this.userList = res.data.users;
          this.total = res.data.total;
          this.currentPage = res.data.pagenum;
        });
    },
    // 搜索显示用户信息,将页码置为1
    searchUserList() {
      // 每次搜索时,将页码置为1
      this.queryInfo.pagenum = 1;
      this.getUserList();
    },
    // 添加用户
    addUser() {
      // 获取表单数据
      console.log("addUser user表单ref:", this.$refs.userAddForm);
      this.$refs.userAddForm.validate((valid) => {
        if (!valid) return;
        // 通过表单验证
        console.log("表单验证成功");
        // 发送ajax请求
        this.$http.post("users", this.addUserForm).then(({ data: res }) => {
          if (res.meta.status != 201) {
            return this.$notify.error({
              title: "错误",
              message: "创建用户失败!",
            });
          }
          // 创建用户成功
          this.$notify.success({
            title: "成功",
            message: "创建用户成功!",
          });
          // 刷新页面数据
          this.getUserList();
          // 关闭模态框
          this.addUserFormVisible = false;
        });
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发送ajax请求
          this.$http.delete("/users/" + id).then(({ data: res }) => {
            if (res.meta.status != 200)
              return this.$message.error("删除用户失败");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新用户列表
            this.getUserList();
          });
        })
        .catch(() => {
          // this.$message.info("取消删除" + id);
        });
    },
    // 打开修改用户框
    openUpdateUserForm(id) {
      // this.$message.warning("获取到的主键id:" + id);
      // 通过id获取用户数据
      this.$http.get(`/users/${id}`).then(({ data: res }) => {
        if (res.meta.status !== 200)
          return this.$message.error("查询用户数据失败");
        this.editUserForm = res.data;
        // 将用户原本的数据
      });
      // 打开对话框
      this.editDialogVisible = true;
    },
    // 当分页大小发生改变时触发的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      // 页大小改变时,将当前页码置为1
      this.searchUserList();
    },
    // 当分页页码发生变化时触发的事件
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage;
      this.getUserList();
    },
    // 修改用户的状态
    changeUserState(user) {
      // 发送ajax请求
      this.$http
        .put(`users/${user.id}/state/${user.mg_state}`)
        .then(({ data: res }) => {
          // 响应结果不为200
          if (res.meta.status != 200) {
            this.$message.error("修改状态失败!");
            user.mg_state = !user.mg_state;
            return;
          }
          // 修改状态成功
          this.$message.success("修改状态成功!");
        });
    },
    // 重置用户的表单
    resetUserForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 提交修改用户请求
    editUserInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //预验证信息通过
          // 发送ajax请求修改数据
          this.$http
            .put(`users/${this.editUserForm.id}`, {
              email: this.editUserForm.email,
              mobile: this.editUserForm.mobile,
            })
            .then(({ data: res }) => {
              console.log("@@", res);
              if (res.meta.status != 200)
                return this.$message.error("修改用户失败");

              // 重新获取用户列表
              this.getUserList();
              // 关闭对话框
              this.editDialogVisible = false;
              // 提示用户
              this.$notify({
                title: "成功",
                message: "修改用户成功",
                type: "success",
              });
            });
        }
      });
    },
    // 打开角色分配的对话框
    openAssignRoleDialog(userInfo) {
      // 获取用户数据
      this.userInfoForRole = userInfo;
      // 获取角色信息
      this.$http.get("roles").then(({ data: res }) => {
        if (res.meta.status != 200) {
          return this.$message.error("获取角色信息失败");
        }
        this.roleList = res.data;
      });

      this.roleDialogVisible = true;
    },

    // 保存用户的新角色
    saveRoleInfo() {
      if (!this.checkedRoleId) {
        return this.$message.error("请选择要分配的角色");
      }

      this.$http
        .put(`users/${this.userInfoForRole.id}/role`, {
          rid: this.checkedRoleId,
        })
        .then(({ data: res }) => {
          console.log("分配新的角色响应体:", res);
          if (res.meta.status != 200) {
            return this.$message.error("分配角色失败");
          }
          // 分配角色成功
          // 刷新页面数据
          this.getUserList();
          // 关闭对话框
          this.roleDialogVisible = false;
        });
    },
    // 关闭分配角色的对话框
    setRoleDialogClosed() {
      this.checkedRoleId = "";
      this.userInfoForRole = {};
      this.roleList = [];
    },

    // 方法结束
  },
  // 暴露结束
};
</script>

<style lang="less" scoped>
.el-form-item {
  text-align: center;
}
.role-dialog {
  width: 50%;
}
</style>