<template>
  <div>
    <!-- 面包屑导航区 -->
    <MyBreadCrumb :title="title"/>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索/添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="searchGoodsList"
              @keyup.enter.native="searchGoodsList"
          >
            <el-button
                slot="append"
                @click="searchGoodsList"
                icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名"></el-table-column>
        <el-table-column prop="goods_price" width="160px" label="商品价格">
        </el-table-column>
        <el-table-column prop="goods_weight" width="140px" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" width="200px" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
            ></el-button>
            <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeById(scope.row.goods_id)"
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
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import MyBreadCrumb from "@/components/MyBreadCrumb";

export default {
  name: "GoodsList",
  data() {
    return {
      title: {
        firstNav: "商品管理",
        secondNav: "商品列表",
      },
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总记录条数
      total: 0,
    };
  },
  components: {
    MyBreadCrumb,
  },
  mounted() {
    // 页面加载完毕后请求商品列表
    this.getGoodList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    getGoodList() {
      this.$http
          .get("/goods", {
            params: this.queryInfo,
          })
          .then(({data: res}) => {
            if (res.meta.status !== 200) {
              return this.$message.error("获取商品信息错误");
            }
            // console.log(res);
            this.goodsList = res.data.goods;
            this.total = res.data.total;
          });
    },
    // 搜索商品列表,需要对当前页进行置1处理
    searchGoodsList() {
      this.queryInfo.pagenum = 1;
      this.getGoodList();
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodList();
    },
    removeById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http.delete("/goods/" + id).then(({data: res}) => {
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
        });
        // 删除成功
        this.$message.success("删除成功");
        // 刷新列表
        setTimeout(() => {
          this.getGoodList();
        }, 500)

      }).catch(() => {
      });
    },
    /* 去添加页面 */
    goAddPage() {
      this.$router.push('/goods/add');
    }
  },
};
</script>

<style lang="less" scoped>
</style>
