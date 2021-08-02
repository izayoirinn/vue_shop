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
      ></el-alert>
      <!-- 商品分类选择 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
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
          <el-table stripe border v-loading="loading" :data="manyTabData">
            <el-table-column type="expand">
              <!-- 展开列数据 -->
              <template v-slot="scoped">
                <!-- 遍历分类参数的tag -->
                <el-tag
                  closable
                  :key="index"
                  @close="deleteAttrTag(index, scoped.row)"
                  v-for="(item, index) in scoped.row.attr_vals"
                  >{{ item }}</el-tag
                >
                <!-- 新增tag -->
                <!-- 添加tag的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <!-- 添加tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
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
                <el-button
                  @click="deleteParams(scoped.row.attr_id)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
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
          <!-- TODO 共用一个表格展示 静态属性表格展示 -->
          <el-table stripe border v-loading="loading" :data="onlyTabData">
            <el-table-column type="expand">
              <!-- 展开列数据 -->
              <template v-slot="scoped">
                <!-- 遍历分类参数的tag -->
                <el-tag
                  closable
                  :key="index"
                  @close="deleteAttrTag(index, scoped.row)"
                  v-for="(item, index) in scoped.row.attr_vals"
                  >{{ item }}</el-tag
                >
                <!-- 新增tag -->
                <!-- 添加tag的输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scoped.row.inputVisible"
                  v-model="scoped.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                ></el-input>
                <!-- 添加tag的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scoped.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
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
                <el-button
                  @click="deleteParams(scoped.row.attr_id)"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
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
  name: 'Params',
  data() {
    return {
      // 商品分类
      categoryList: [],
      // 级联配置对象
      CategoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      // 级联选择框双向绑定数组
      selectedCateKeys: [],

      activeTabName: 'many',
      manyTabData: [],
      onlyTabData: [],
      // 添加对话框的状态
      addDialogVisible: false,
      // 添加属性或参数的数据
      addFormData: {
        attr_name: '',
      },
      // 添加属性或参数的规则
      addFormRules: {
        attr_name: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
      },
      /* ==== 修改分类参数 start ===== */
      editDialogVisible: false,
      editFormData: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],
      },
      /* ==== 修改分类参数 end ===== */
      inputVisible: false,
      inputValue: '',
      /* ==== 修改分类参数 end ===== */

      /* isSave : 在添加商品参数信息时,按下enter和失去焦点可能同时触发,
      可能会导致发送两个请求到后端，所以需要处理 */
      isSave: false,
      /* 是否加载状态中 */
      loading: false,
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
      return this.activeTabName === 'many' ? '动态参数' : '静态属性';
    },
    // 修改分类参数时对话框显示的标题
    computedEditTitle() {
      return this.activeTabName === 'many' ? '动态参数' : '静态属性';
    },
  },
  mounted() {
    this.getCategroyList();
  },
  methods: {
    /* 获取表格展示的分类数据 */
    getCategroyList() {
      this.$http.get('categories').then(({ data: res }) => {
        console.log('categoryList:', res);
        if (res.meta.status != 200) {
          return this.$message.error('获取分类列表失败');
        }
        this.categoryList = res.data;
      });
    },
    /* 级联选择框变化会触发 */
    handleChange() {
      // 不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        // 清除原来的选择
        this.clearShowTabData();
        return;
      }
     
      // 获取分类
      this.getCategoryParams();
    },

    // 切换标签页触发的函数
    handleTabClick() {
      // 清除原来的选择
      // this.clearShowTabData();
      console.log(this.activeTabName);
      this.getCategoryParams();
    },
    clearShowTabData() {
      this.manyTabData = [];
      this.onlyTabData = [];
    },
    /* ==== 添加分类参数 start ===== */

    // 获取分类参数信息
    getCategoryParams() {
      // 三级分类,获取该分类下的参数信息
      if (this.computedCateId === -1) {
        // console.log("没有选中分类id");
        return;
      }
       // 开始加载
      this.loading = true;
      this.$http
        .get(`categories/${this.computedCateId}/attributes`, {
          params: { sel: this.activeTabName },
        })
        .then(({ data: res }) => {
          if (res.meta.status != 200) {
            return this.$message.error('获取分类参数信息错误');
          }
          res.data.forEach((element) => {
            // attr_vals为空直接返回空数组
            element.attr_vals = element.attr_vals
              ? element.attr_vals.split(' ')
              : [];

            // 给返回结果添加新的属性
            // 输入框默认不显示
            element.inputVisible = false;
            // 绑定的数据,默认为false
            element.inputValue = '';
          });
          console.log('分类参数信息:', res);
          // 保存返回得到的数据
          if (this.activeTabName === 'many') {
            this.manyTabData = res.data;
          } else {
            this.onlyTabData = res.data;
          }
          this.$nextTick(() => {
            this.loading = false;
          });
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
                return this.$message.error('添加参数信息失败');
              }
              // 添加参数信息成功
              this.$notify.success({
                title: '添加成功',
                message: '添加新的参数信息成功',
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
      console.log('openEditDialog', param);
      let attrId = param.attr_id;
      // 发起ajax请求,获取分类数据
      this.$http
        .get(`categories/${this.computedCateId}/attributes/${attrId}`, {
          attr_sel: this.activeTabName,
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数信息失败');
          }
          this.editFormData = res.data;
          this.editDialogVisible = true;
        });
    },
    closeEditDialog() {
      console.log('closeEditDialog');
      // this.$refs.editFormRef.resetFields();
      this.editFormData = {};
    },
    // 发起ajax请求，修改参数信息
    editParams() {
      console.log('需要提交的需要修改的数据', this.editFormData);
      // 对表单校验
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          // 参数通过验证,发起修改请求
          this.$http
            .put(
              `categories/${this.computedCateId}/attributes/${this.editFormData.attr_id}`,
              {
                attr_name: this.editFormData.attr_name,
                attr_sel: this.editFormData.attr_sel,
              }
            )
            .then(({ data: res }) => {
              console.log('修改分类参数返回信息:', res);
              if (res.meta.status !== 200) {
                return this.$message.error('修改参数信息失败');
              }
              // 修改参数信息成功
              this.$notify.success({
                title: '修改成功',
                message: '修改参数信息成功',
              });
              // 重新刷新数据
              this.getCategoryParams();
              // 关闭对话框
              this.editDialogVisible = false;
            });
        }
      });
    },
    /* ==== 修改分类参数 end ===== */

    /* ==== 删除分类参数 start ===== */
    deleteParams(id) {
      console.log('需要删除的id:' + id);
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 发送请求删除参数
          this.$http
            .delete(`categories/${this.computedCateId}/attributes/${id}`)
            .then(({ data: res }) => {
              console.log('delete参数:', res);
              if (res.meta.status != 200) {
                return this.$message.error('删除参数失败');
              }
              // 删除成功
              this.$notify.success({
                title: '删除成功',
                message: '删除参数成功',
              });
              // 重新获取参数信息
              this.getCategoryParams();
            });
        })
        .catch(() => {});
    },
    /* ==== 删除分类参数 end ===== */
    /* 对分类参数标签的处理 */

    // 显示分类标签属性的输入框
    showInput(attr) {
      // 显示输入框
      attr.inputVisible = true;
      // 自动获取焦点
      this.$nextTick(() => {
        // console.log("vue", this.$refs.saveTagInputRef);
        this.$refs.saveTagInputRef.$refs.input.focus();
      });
    },
    // 在分类标签中按下enter或失去焦点时触发的函数
    handleInputConfirm(attr) {
      if (this.isSave === true) {
        return;
      } else {
        this.isSave = true;
      }
      // console.log("handleInputConfirm:",attr)
      if (attr.inputValue.trim().length === 0) {
        // 清空输入的数据
        attr.inputValue = '';
        this.isSave = false;
        // 切换输入框状态(关闭)
        attr.inputVisible = false;
        return;
      }
      // 关闭输入框
      // 将新数据添加到原来的数组中,在这里已经实现了前端的展示
      attr.attr_vals.push(attr.inputValue);

      let attr_vals = attr.attr_vals.join(' ');
      let addValus = {
        attr_name: attr.attr_name,
        attr_sel: this.activeTabName,
        attr_vals: attr_vals,
      };
      console.log('添加标签时,发送给后端的数据:', addValus);
      // 关闭显示输入框
      attr.inputVisible = false;
      // 发送ajax请求给后端
      this.$http
        .put(
          `categories/${this.computedCateId}/attributes/${attr.attr_id}`,
          addValus
        )
        .then(({ data: res }) => {
          console.log('update响应参数:', res);
          if (res.meta.status != 200) {
            return this.$message.error('修改标签失败');
          }
          // 重新获取参数信息
          // 请求成功后,关闭输入框,将输入框置空
          attr.inputValue = '';
          // 修改标志位
          this.isSave = false;
        });
    },
    // 更新标签数据到后端
    updateParamsTag(attr) {
      let attr_vals = attr.attr_vals.join(' ');
      let addValus = {
        attr_name: attr.attr_name,
        attr_sel: this.activeTabName,
        attr_vals: attr_vals,
      };
      console.log('添加标签时,发送给后端的数据:', addValus);
      // 关闭显示输入框
      attr.inputVisible = false;
      // 发送ajax请求给后端
      this.$http
        .put(
          `categories/${this.computedCateId}/attributes/${attr.attr_id}`,
          addValus
        )
        .then(({ data: res }) => {
          console.log('update响应参数:', res);
          if (res.meta.status != 200) {
            return this.$message.error('修改标签失败');
          }
          // 重新获取参数信息
          // 请求成功后,关闭输入框,将输入框置空
          attr.inputVisible = false;
          attr.inputValue = '';
        });
    },
    deleteAttrTag(index, attr) {
      console.log(index, attr);
      attr.attr_vals.splice(index, 1);
      // 更新数据库数据
      this.updateParamsTag(attr);
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
