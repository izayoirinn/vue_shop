<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        :closable="false"
        show-icon
        type="warning"
      >
      </el-alert>
      <!-- 商品分类选择 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类： </span>
          <el-cascader
            v-model="selectedCateKeys"
            :props="CategoryProps"
            :options="categoryList"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 分类参数与分类参数标签页 -->

      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            >添加参数</el-button
          >
          <!-- 动态参数表格展示 -->
          <el-table stripe border :data="manyTabData">
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <!-- 动态参数的编辑区域 -->
                <el-button
                  @click="openEditDialog(scoped.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="addDialogVisible = true"
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            >添加属性</el-button
          >
          <!-- 静态属性表格展示 -->
          <el-table stripe border :data="onlyTabData">
            <el-table-column type="expand"></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scoped">
                <!-- 静态属性的编辑区域 -->
                <el-button
                  @click="openEditDialog(scoped.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数和静态属性的对话框 -->
    <el-dialog
      :title="'添加' + computedAddTitle"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeAddDialog"
    >
      <!-- 表单数据 -->
      <el-form
        :model="addFormData"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="addFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数和静态属性的对话框 -->
    <el-dialog
      :title="'修改' + computedEditTitle"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="closeEditDialog"
    >
      <!-- 表单数据 -->
      <el-form
        :model="editFormData"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="attr_name">
          <el-input v-model="editFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      // 商品分类
      categoryList: [],
      // 级联配置对象
      CategoryProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 级联选择框双向绑定数组
      selectedCateKeys: [],

      activeTabName: "many",
      manyTabData: [],
      onlyTabData: [],
      // 添加对话框的状态
      addDialogVisible: false,
      // 添加属性或参数的数据
      addFormData: {
        attr_name: "",
      },
      // 添加属性或参数的规则
      addFormRules: {
        attr_name: [
          { required: true, message: "输入不能为空", trigger: "blur" },
        ],
      },
      /* ==== 修改分类参数 start ===== */
      editDialogVisible: false,
      editFormData: {},
      editFormRules: {
        attr_name: [
          { required: true, message: "输入不能为空", trigger: "blur" },
        ],
      },
      /* ==== 修改分类参数 end ===== */
    };
  },
  computed: {
    // 添加按钮是否被禁用
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    // 当前选择的分类id
    computedCateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return -1;
    },
    // 添加参数时对话框显示的标题
    computedAddTitle() {
      return this.activeTabName === "many" ? "动态参数" : "静态属性";
    },
    // 修改分类参数时对话框显示的标题
    computedEditTitle() {
      return this.activeTabName === "many" ? "动态参数" : "静态属性";
    },
  },
  mounted() {
    this.getCategroyList();
  },
  methods: {
    /* 获取表格展示的分类数据 */
    getCategroyList() {
      this.$http.get("categories").then(({ data: res }) => {
        console.log("categoryList:", res);
        if (res.meta.status != 200) {
          return this.$message.error("获取分类列表错误");
        }
        this.categoryList = res.data;
      });
    },
    /* 级联选择框变化会触发 */
    handleChange() {
      // 不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      this.getCategoryParams();
    },

    // 切换标签页触发的函数
    handleTabClick() {
      console.log(this.activeTabName);
      this.getCategoryParams();
    },
    /* ==== 添加分类参数 start ===== */

    // 获取分类参数信息
    getCategoryParams() {
      // 三级分类,获取该分类下的参数信息
      this.$http
        .get(`categories/${this.computedCateId}/attributes`, {
          params: { sel: this.activeTabName },
        })
        .then(({ data: res }) => {
          console.log("分类参数信息:", res);
          if (res.meta.status != 200) {
            return this.$message.error("获取分类参数信息错误");
          }
          // 保存返回得到的数据
          if (this.activeTabName === "many") {
            this.manyTabData = res.data;
          } else {
            this.onlyTabData = res.data;
          }
        });
    },
    // 监听添加对话框的关闭
    closeAddDialog() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮,添加参数函数
    addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          this.$http
            .post(`categories/${this.computedCateId}/attributes`, {
              attr_name: this.addFormData.attr_name,
              attr_sel: this.activeTabName,
            })
            .then(({ data: res }) => {
              if (res.meta.status != 201) {
                return this.$message.error("添加参数信息失败");
              }
              // 添加参数信息成功
              this.$notify.success({
                title: "成功",
                message: "添加新的参数信息成功",
              });
              // 重新刷新数据
              this.getCategoryParams();
              // 关闭对话框
              this.addDialogVisible = false;
            });
        }
      });
    },
    /* ==== 添加分类参数 end ===== */

    /* ==== 修改分类参数 start ===== */
    openEditDialog(param) {
      console.log("openEditDialog", param);
      let attrId = param.attr_id;
      // 发起ajax请求,获取分类数据
      this.$http
        .get(`categories/${this.computedCateId}/attributes/${attrId}`, {
          attr_sel: this.activeTabName,
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取参数信息失败");
          }
          this.editFormData = res.data;
          this.editDialogVisible = true;
        });
    },
    closeEditDialog() {
      console.log("closeEditDialog");
      // this.$refs.editFormRef.resetFields();
      this.editFormData = {};
    },
    editParams() {},
    /* ==== 修改分类参数 end ===== */
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>