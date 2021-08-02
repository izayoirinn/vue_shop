<template>
  <div>
    <!-- 面包屑导航 -->
    <MyBreadCrumb :title="title" />
    <!--卡片视图区域-->
    <el-card>
      <!-- TODO 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @keyup.enter.native="searchOrderList"
            @clear="searchOrderList"
          >
            <el-button slot="append" @click="searchOrderList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{
            scope.row.create_time | dateFormat
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="showBox(scope.row)" size="mini" icon="el-icon-edit"></el-button>
            <el-button
              type="success"
              size="mini"
              @click="showProgessBox(scope.row)"
              icon="el-icon-location"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addDialogVisible" @close="closeAddDialog" width="40%">
      <!-- 表单数据 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 快递信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressDialogVisible" width="40%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadCrumb from '../../components/MyBreadCrumb'
import citydata from '@/assets/js/citydata'
import progressInfo from '@/pages/order/progressInfo'
export default {
  name: 'Order',
  components: {
    MyBreadCrumb,
  },
  data() {
    return {
      title: {
        firstNav: '订单管理',
        secondNav: '订单列表',
      },
      /* 查询条件 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      /* 数据信息 */
      total: 0,
      orderList: [],
      /* 修改地址对话框 */
      addDialogVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择地址', trigger: 'change' },
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      cityData: citydata,
      progressDialogVisible: false,
      progressInfo: progressInfo,
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$http
        .get('orders', {
          params: this.queryInfo,
        })
        .then(({ data: res }) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取订单信息失败')
          }
          // 获取到订单信息,进行页面渲染
          this.orderList = res.data.goods
          this.total = res.data.total
        })
    },
    // 搜索订单列表,需要对当前页进行置1处理
    searchOrderList() {
      this.queryInfo.pagenum = 1
      this.getOrderList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.searchOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    /* 显示修改地址的对话框 */
    showBox(order) {
      console.log(order)
      this.addDialogVisible = true
    },
    /* 关闭修改地址的对话框 */
    closeAddDialog() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgessBox(order) {
      console.log(order)
      /*  this.$http
        .get(`/kuaidi/1106975712662`)
        .then(({ data: res }) => {
          console.log('@@ res : ', res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取物流信息错误')
          }
        })
        .catch(() => {}) */

      this.progressDialogVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
