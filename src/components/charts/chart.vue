<template>
  <div class="">
    <div class="x-bar"
         :id="id" :style="{height: high ? high : '120px'}"></div>
  </div>
</template>
<script>
import HighCharts from "highcharts";
export default {
  // 验证类型
  props: ["option", "id", "high"],
  data() {
    return {
      charts: null
    };
  },
  mounted() {
    setTimeout(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      this.chart = HighCharts.chart(this.id, this.option);
      this.chart.reflow();
    },
  }
};
</script>
<style lang="less" scoped>
.x-bar {
  width: 100%;
}
</style>
