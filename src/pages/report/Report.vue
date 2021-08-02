<template>
  <div>
    <!-- 面包屑 -->
    <MyBreadCrumb :title="title" />
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div ref="mainEcharts" id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import MyBreadCrumb from '@/components/MyBreadCrumb';
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  name: 'Report',
  components: {
    MyBreadCrumb,
  },
  data() {
    return {
      /* 面包屑导航标题 */
      title: {
        firstNav: '数据统计',
        secondNav: '数据报表',
      },
      /* echartOptions */
      commonOptions: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
      echartOption: {},
    };
  },
  mounted() {
    this.getEchartOption();
  },
  methods: {
    getEchartOption() {
      /* 加载过度 */
      let loadingInstance = this.$loading({
        target: this.$refs.mainEcharts,
      });
      this.$http.get('reports/type/1').then(({ data: res }) => {
        console.log('reports', res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取图表信息失败');
        }
        // this.echartOption = res.data;
        this.echartOption = _.merge(this.commonOptions, res.data);
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.mainEcharts);
        // 绘制图表
        myChart.setOption(this.echartOption);
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#main {
  margin: 20px auto;
}
</style>
