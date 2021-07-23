<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- TODO 回到首页时清空左侧栏的激活状态 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button @click="openAddRoleDialog" type="primary"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区 -->
      <el-table 
      v-loading="loading" 
      :data="roleList" 
      border stripe
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['vcenter', 'bdbottom', index1 === 0 ? 'bdtop' : '']"
              :key="item1.id"
              v-for="(item1, index1) in scope.row.children"
            >
              <!-- 展示一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 展示二级,三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="['vcenter', index2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="openEditRoleDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              @click="openSetRightDialog(scope.row)"
              size="small"
              type="warning"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        default-expand-all
        node-key="id"
        show-checkbox
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      @close="closeAddRoleDialog"
      width="40%"
    >
      <!-- 添加角色的表单 -->
      <el-form
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        :model="addRoleFormData"
        label-width="80px"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRoleFormData.roleName"></el-input>
        </el-form-item>

        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="addRoleFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleToBack">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      @close="closeEditRoleDialog"
      width="40%"
    >
      <!-- 添加角色的表单 -->
      <el-form
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        :model="editRoleFormData"
        label-width="80px"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="editRoleFormData.roleName"></el-input>
        </el-form-item>

        <el-form-item prop="roleDesc" label="角色描述">
          <el-input v-model="editRoleFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleToBack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 表格加载中
      loading: true,
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 属性空间的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的权限id
      defKeys: [],
      // 添加权限时选中的角色id
      roleId: "",

      /*==== 添加新角色 数据 start ====*/

      // 添加角色模态框打开关闭切换状态
      addRoleDialogVisible: false,
      // 添加的角色数据
      addRoleFormData: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色的验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },

      /*==== 添加新角色 数据 end ====*/

      /*==== 修改角色 数据 start ====*/
      // 修改角色模态框打开关闭切换状态
      editRoleDialogVisible: false,
      // 修改角色的准备数据
      editRoleFormData: {
        roleName: "",
        roleDesc: "",
      },
      // 修改角色的验证规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 编辑角色时的id
      editRoleId: "",
      /*==== 修改角色 数据 end ====*/
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    /* 获取角色列表信息 */
    getRoleList() {
      this.$http.get("roles").then(({ data: res }) => {
        console.log("roleData:", res);
        if (res.meta.status != 200)
          return this.$message.error("获取权限角色列表失败!");
        this.loading = false;
        this.roleList = res.data;
      });
    },
    // 根据id删除对应权限
    removeRightById(role, rightId) {
      // console.log("role:", role);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发起ajax请求
          this.$http
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then(({ data: res }) => {
              console.log("delteRolesRes:", res);
              if (res.meta.status != 200) {
                return this.$message.error("删除权限失败");
              }

              this.$message.success("删除权限成功");
              // 页面完全刷新
              // this.getRoleList();
              // TODO 理解这个局部刷新的原理
              role.children = res.data;
            });
        })
        .catch(() => {});
    },
    // 打开分配权限的对话框
    openSetRightDialog(role) {
      this.roleId = role.id;
      // 获取全部的权限信息
      this.$http.get("rights/tree").then(({ data: res }) => {
        if (res.meta.status != 200)
          return this.$$message.error("获取权限列表失败");
        this.rightsList = res.data;
      });
      console.log("@Role", role);
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys);
      // 打开对话框
      this.setRightDialogVisible = true;
    },
    // 关闭分配权限的对话框调用的函数
    setRightDialogClosed() {
      this.roleId = "";
      this.defKeys = [];
    },

    // 通过递归获取第三级的权限id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) => {
        this.getLeafKeys(element, arr);
      });
    },
    // 提交添加权限请求
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      //console.log(keys);
      const idStr = keys.join(",");
      this.$http
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then(({ data: res }) => {
          if (res.meta.status != 200) {
            return this.$message.error("添加权限失败");
          }
          // 提示用户操作成功
          this.$notify({
            title: "成功",
            message: "添加权限成功",
            type: "success",
          });
          // 重新请求角色数据
          this.getRoleList();
          // 关闭对话框
          this.setRightDialogVisible = false;
        });
    },

    /*==== 添加新角色 方法 start ==== */
    // 打开添加角色的对话框
    openAddRoleDialog() {
      this.addRoleDialogVisible = true;
    },
    // 关闭添加角色的对话框
    closeAddRoleDialog() {
      // 重置添加角色表单的数据
      // console.log(this);
      this.$refs["addRoleFormRef"].resetFields();
    },
    // 提交请求给后端,新增用户
    addRoleToBack() {
      // 参数验证
      this.$refs["addRoleFormRef"].validate((valid) => {
        if (valid) {
          // 通过验证,发送ajax请求
          this.$http
            .post("roles", this.addRoleFormData)
            .then(({ data: res }) => {
              console.log("addRoleToBack:", res);
              if (res.meta.status != 201) {
                return this.$message.error("创建角色失败");
              }
              // 创建角色成功
              this.$notify.success({
                title: "成功",
                message: "创建角色成功",
              });
              // 刷新页面数据
              this.getRoleList();
              // 关闭对话框
              this.addRoleDialogVisible = false;
            });
        }
      });
    },
    /* ==== 添加新角色 方法 end ==== */

    /*==== 修改角色基本信息 方法 start ==== */
    // 打开修改角色的对话框
    openEditRoleDialog(role) {
      this.editRoleFormData = {
        roleName: role.roleName,
        roleDesc: role.roleDesc,
      };
      this.editRoleId = role.id;
      // 打开对话框
      this.editRoleDialogVisible = true;
    },
    // 关闭修改角色的对话框
    closeEditRoleDialog() {
      // 重置表单
      this.editRoleFormData = {
        roleName: "",
        roleDesc: "",
      };
      // this.$refs["editRoleFormRef"].resetFields();
      // console.log("this.editRoleFormData:", this.editRoleFormData);
      // 将选择的修改id清空
      this.editRoleId = "";
    },
    // 发送请求到后端修改角色信息
    editRoleToBack() {
      // 参数信息验证
      this.$refs["editRoleFormRef"].validate((valid) => {
        if (valid) {
          this.$http
            .put("roles/" + this.editRoleId, this.editRoleFormData)
            .then(({ data: res }) => {
              console.log("delteRolesRes:", res);
              if (res.meta.status != 200) {
                return this.$message.error("修改角色信息失败");
              }
              this.$message.success("修改角色信息成功");
              // 刷新页面数据
              this.getRoleList();
              // 关闭对话框
              this.editRoleDialogVisible = false;
            });
        }
      });
    },
    /*==== 修改角色基本信息 方法 end ==== */

    /*==== 删除角色 方法 start ==== */
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发送ajax请求
          this.$http.delete("/roles/" + id).then(({ data: res }) => {
            // 删除返回结果
            console.log("deleteRole:", res);
            if (res.meta.status != 200)
              return this.$message.error("删除角色失败");

            this.$message.success("删除成功!");
            // 刷新角色列表
            this.getRoleList();
          });
        })
        .catch(() => {});
    },

    /*==== 删除角色 方法 end ==== */
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
  cursor: default;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>