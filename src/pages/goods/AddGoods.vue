<template>
  <div>
    <!-- 面包屑导航 -->
    <MyBreadCrumb :title="title" />
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提交区 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <el-row type="flex" justify="space-around">
        <el-col :span="20">
          <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          tab-position="left"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-row type="flex" justify="space-around" :gutter="10">
              <el-col :span="20">
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="categoryList"
                    :props="categoryProps"
                    clearable
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input type="number" v-model="addForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input type="number" v-model="addForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input type="number" v-model="addForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button style="float: right" type="primary" @click="nextTab">下一步</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-row type="flex" justify="space-around" :gutter="10">
              <el-col :span="20">
                <el-form-item
                  :label="item.attr_name"
                  :key="item.attr_id"
                  v-for="item in manyTableData"
                >
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox
                      border
                      size="mini"
                      :label="cb"
                      :key="index"
                      v-for="(cb, index) in item.attr_vals"
                    ></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button style="float: right" type="primary" @click="nextTab">下一步</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-row type="flex" justify="space-around" :gutter="10">
              <el-col :span="20">
                <el-form-item
                  :label="item.attr_name"
                  :key="item.attr_id"
                  v-for="item in onlyTableData"
                >
                  <el-input v-model="item.attr_vals" placeholder></el-input>
                </el-form-item>
                <!-- 下一步 -->
                <el-form-item>
                  <el-button style="float: right" type="primary" @click="nextTab">下一步</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-row type="flex" justify="space-around" :gutter="10">
              <el-col :span="20">
                <el-upload
                  ref="upload"
                  multiple
                  :on-success="handleSuccess"
                  :auto-upload="false"
                  :action="baseUrl"
                  :headers="uploadHeader"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <el-button
                    style="margin-left: 10px"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >上传到服务器</el-button>

                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- vue-quill-editor -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的模态框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import MyBreadCrumb from '../../components/MyBreadCrumb'

export default {
  name: 'AddGoods',
  components: {
    MyBreadCrumb,
  },
  data() {
    return {
      /* 导航栏 */
      title: {
        firstNav: '商品管理',
        secondNav: '商品添加',
      },
      /* 步骤条激活步骤 */
      activeIndex: '0',
      /* 添加商品数据 */
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        // 商品图片数组
        pics: [],
        // 商品介绍
        goods_introduce: '',
        attrs: [],
      },
      /* 添加商品规则 */
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      /* 基本分类数据,页面初始化时获取 */
      categoryList: [],
      /* 级联选择器配置 */
      categoryProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      /* 动态列表数据 */
      manyTableData: [],
      /* 静态参数列表数据 */
      onlyTableData: [],
      /* 上传图片的url地址 */
      baseUrl: this.baseURL + 'upload',
      // 上传文件携带的请求头信息
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 图片预览地址
      dialogImageUrl: '',
      // 图片预览对话框
      dialogVisible: false,
    }
  },
  mounted() {
    this.getCategoryList()
  },
  methods: {
    /* 获取表格展示的分类数据 */
    getCategoryList() {
      this.$http.get('categories').then(({ data: res }) => {
        console.log('categoryList:', res)
        if (res.meta.status !== 200) {
          this.$message.error('获取分类列表错误')
        }
        this.categoryList = res.data
      })
    },
    // 选择分类时的切换事件
    handleChange() {
      console.log('=========', this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    nextTab() {
      this.activeIndex = (parseInt(this.activeIndex) + 1).toString()
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log("activeName : ", activeName);
      // console.log("oldActiveName : ", oldActiveName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        this.activeIndex = '0'
        return false
      }
      if (activeName === '1') {
        this.getDynamicGoodsParams()
      } else if (activeName === '2') {
        this.getStaticGoodsParams()
      }
    },
    /* 监听标签页被点击选中 */
    tabClick() {},
    /* 获取动态商品参数信息 */
    getDynamicGoodsParams() {
      if (this.categoryId === null) {
        return
      }
      this.$http
        .get(`categories/${this.categoryId}/attributes`, {
          params: { sel: 'many' },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取动态分类参数信息错误')
          }
          console.log('@@', res)
          res.data.forEach((item) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })

          this.manyTableData = res.data
        })
    },
    /* 获取静态商品属性信息 */
    getStaticGoodsParams() {
      if (this.categoryId === null) {
        return
      }
      this.$http
        .get(`categories/${this.categoryId}/attributes`, {
          params: { sel: 'only' },
        })
        .then(({ data: res }) => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取静态分类参数信息错误')
          }
          console.log('static: ', res)
          this.onlyTableData = res.data
        })
    },
    /* 点击文件列表中已上传的文件时的钩子,
    可以用来实现图片预览 */
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /* 移除文件 */
    handleRemove(file) {
      console.log('handleRemove : ', file)
      if (file.response != null) {
        const filePath = file.response.data.tmp_path
        const index = this.addForm.pics.findIndex((x) => x.pic === filePath)
        this.addForm.pics.splice(index, 1)
      }
    },
    /* 手动提交上传文件 */
    submitUpload() {
      this.$refs.upload.submit()
    },
    /* 图片上传成功时处理的函数 */
    handleSuccess(response) {
      console.log('response', response)
      // 拼接得到一个图片信息对象
      // 将图片信息push到pics数组中。
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      // console.log(this.addForm);
    },
    /* 添加商品 */
    addGoods() {
      console.log('addGoods : ', this.addForm)
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单信息')
        }
        // 执行添加的业务逻辑
        // 深拷贝对象
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log('form:', form)
        // 发起请求，添加商品
        // 商品名称必须是唯一的
        this.$http.post('goods', form).then(({ data: res }) => {
          console.log('@res ', res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品失败')
          }
          this.$notify.success('添加商品成功')
          setTimeout(() => {
            // 编程式路由导航
            this.$router.push('/goods')
          }, 1000)
        })
      })
    },
  },
  computed: {
    /* 选中的商品id */
    categoryId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.btnAdd {
  margin-top: 20px;
}
</style>