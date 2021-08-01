<template>
  <div>
    <!-- 面包屑导航区 -->
    <MyBreadCrumb :title="title"></MyBreadCrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="openAddCategoryDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- TODO 表格 -->
      <tree-table
        class="tree-table"
        :data="categoryList"
        :columns="columns"
        show-index
        border
        children-prop="children"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i v-if="scope.row.cat_deleted === false" style="color: green" class="el-icon-success"></i>
          <i v-else style="color: red" class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:option="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="openEditDialog(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCategory(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <!--  分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      @close="closeAddCategoryDialog"
      width="40%"
    >
      <el-form
        :model="addCategoryData"
        :rules="addCategoryRules"
        ref="addCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectdKeys"
            :options="parentCategoryList"
            :props="parentCategoryProps"
            filterable
            clearable
            @change="parentCategoryChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryToBack">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCategoryDialogVisible"
      @close="closeEditDialog"
      width="40%"
    >
      <el-form
        :model="editCategoryData"
        :rules="editCategoryRules"
        ref="editCategoryRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryToBack">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadCrumb from '@/components/MyBreadCrumb'
export default {
  name: 'Category',
  components: {
    MyBreadCrumb,
  },
  data() {
    return {
      title: {
        firstNav: '商品管理',
        secondNav: '商品分类',
      },
      /* 分页条件 */
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      /* 基本分类数据,页面初始化时获取 */
      categoryList: [],
      /* 总记录数 */
      total: 0,
      /* 定义表格的列属性 */
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order',
        },

        {
          label: '操作',
          type: 'template',
          template: 'option',
        },
      ],

      /* ==== 添加分类 start ===== */
      // 添加分类对话框展示状态
      addCategoryDialogVisible: false,
      // 添加分类数据
      addCategoryData: {
        cat_name: '',
        /* 父级分类的id */
        cat_pid: 0,
        /* 分类的等级,默认要添加的是1级分类 */
        cat_level: 0,
      },
      // 分类规则
      addCategoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      /* 父级分类列表 */
      parentCategoryList: [],
      /* 选中的父级分类id */
      selectdKeys: [],
      /* 级联框的配置属性 */
      parentCategoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        expandTrigger: 'hover',
        children: 'children',
        checkStrictly: true,
      },

      /* ==== 添加分类 end ===== */

      /* ==== 修改分类 start ===== */
      editCategoryDialogVisible: false,
      // 添加分类数据
      editCategoryId: '',
      editCategoryData: {
        cat_name: '',
      },
      // 分类规则
      editCategoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      /* ==== 修改分类 end ===== */
    }
  },

  mounted() {
    this.categoryList = this.getCategroyList()
  },
  methods: {
    /* 获取表格展示的分类数据 */
    getCategroyList() {
      this.$http
        .get('categories', {
          params: this.queryInfo,
        })
        .then(({ data: res }) => {
          console.log('categoryList:', res)
          if (res.meta.status != 200) {
            this.$message.error('获取分类列表错误')
          }
          this.categoryList = res.data.result
          this.total = res.data.total
          this.queryInfo.pagenum = res.data.pagenum + 1
        })
    },
    /* 监听页大小改变事件 */
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getCategroyList()
    },
    /* 监听当前页改变事件 */
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCategroyList()
    },
    /* ==== 添加分类 start ===== */
    // 打开对话框
    openAddCategoryDialog() {
      this.getParentCategoryList()
      this.addCategoryDialogVisible = true
    },
    getParentCategoryList() {
      this.$http
        .get('categories', {
          params: {
            type: 2,
          },
        })
        .then(({ data: res }) => {
          console.log('parentCategoryList:', res)
          if (res.meta.status != 200) {
            this.$message.error('获取父级分类列表错误')
          }
          this.parentCategoryList = res.data
        })
    },
    // 切换级联数据时
    parentCategoryChanged() {
      let keys = this.selectdKeys
      console.log('parentCategoryChanged', keys)
      if (keys.length > 0) {
        /* 父级id  */
        this.addCategoryData.cat_pid = keys[keys.length - 1]
        /* 分类等级 */
        this.addCategoryData.cat_level = keys.length
      } else {
        /* 父级id  */
        this.addCategoryData.cat_pid = 0
        /* 分类等级 */
        this.addCategoryData.cat_level = 0
      }
    },
    // 提交添加分类请求给后端
    addCategoryToBack() {
      console.log('addCategoryToBack:', this.addCategoryData)
      // 关闭对话框
      this.$refs.addCategoryRef.validate((valid) => {
        if (valid) {
          // 发送ajax请求
          this.$http
            .post('categories', this.addCategoryData)
            .then(({ data: res }) => {
              console.log('categories add', res)
              if (res.meta.status != 201) {
                return this.$message.error('添加分类失败')
              }

              this.$notify.success({
                title: '成功',
                message: '添加商品分类成功',
              })
              /* 刷新数据 */
              this.getCategroyList()
              /* 关闭对话框 */
              this.addCategoryDialogVisible = false
            })
        }
      })
      //
    },
    // 关闭添加分类的对话框
    closeAddCategoryDialog() {
      this.$refs.addCategoryRef.resetFields()
      this.selectdKeys = []
      this.addCategoryData.cat_level = 0
      this.addCategoryData.cat_pid = 0
    },
    /* ==== 添加分类 end ===== */

    /* ==== 编辑分类 start ===== */
    // 打开编辑框
    openEditDialog(category) {
      let id = category.cat_id
      this.$http.get('categories/' + id).then(({ data: res }) => {
        if (res.meta.status != 200) {
          return this.$message.error('获取分类数据失败')
        }
        this.editCategoryId = id
        this.editCategoryData.cat_name = res.data.cat_name
      })
      this.editCategoryDialogVisible = true
    },
    // 关闭编辑框
    closeEditDialog() {
      this.editCategoryId = ''
      this.$refs.editCategoryRef.resetFields()
    },
    // 发送请求给后端
    editCategoryToBack() {
      this.$refs.editCategoryRef.validate((valid) => {
        if (valid) {
          // 发送ajax请求
          this.$http
            .put('categories/' + this.editCategoryId, this.editCategoryData)
            .then(({ data: res }) => {
              console.log('categories edit', res)
              if (res.meta.status != 200) {
                return this.$message.error('添加分类失败')
              }
              this.$notify.success({
                title: '成功',
                message: '修改分类信息成功',
              })
              /* 刷新数据 */
              this.getCategroyList()
              /* 关闭对话框 */
              this.editCategoryDialogVisible = false
            })
        }
      })
    },
    /* ==== 编辑分类 end ===== */

    /* ==== 删除分类 start ===== */
    deleteCategory(category) {
      let id = category.cat_id
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 发送ajax请求删除数据
          this.$http.delete('categories/' + id).then(({ data: res }) => {
            if (res.meta.status != 200) {
              return this.$message.error('删除分类失败')
            }
            this.$notify.success({
              title: '成功',
              message: '删除商品分类成功',
            })
            /* 刷新数据 */
            this.getCategroyList()
          })
        })
        .catch(() => {})
    },
    /* ==== 删除分类 end ===== */
  },
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>