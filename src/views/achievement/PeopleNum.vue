<template>
  <div class="index font-18">
    <div class="header">
      <div class="clearfix card-box" v-if="dailyMonth.userStat">
        <div class="font-12 card-item right-border bottom-border">
           <p class="number font-16">{{dailyMonth.userStat.open}}次</p>
           <p class="tips font-12">打开次数</p>
        </div>
        <div class="font-12 card-item">
           <p class="number font-16">{{dailyMonth.userStat.view}}人</p>
           <p class="tips font-12">访问人数</p>
        </div>
        <div class="font-12 card-item p-t-32 right-border">
           <p class="number font-16">{{dailyMonth.userStat.data_register}}人</p>
           <p class="tips font-12">新注册</p>
        </div>
        <div class="font-12 card-item p-t-32">
           <p class="number font-16">{{dailyMonth.userStat.all_register}}人</p>
           <p class="tips font-12">总注册</p>
        </div>
      </div>
    </div>

    <div class="chart m-l-30 m-r-30 p-a-30 first-chart">
      <div class="line-40 m-b-30">
        <span class="font-14 font-PC-sd black">小程序打开次数</span>
      </div>
      <div>
        <xchart :id="id" :option="OpenOption" v-if="controlHicharsShow"></Xchart>
      </div>
    </div>
    <div class="chart m-l-30 m-r-30 m-t-30 m-b-30 p-a-30">
      <div class="line-40 m-b-30">
        <span class="font-14 font-PC-sd black">小程序注册人数</span>
      </div>
      <div>
        <xchart :id="Id" :option="RegistOption" v-if="controlHicharsShow"></Xchart>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/dailyApi";
import Xchart from "../../components/charts/chart.vue";
import options from "../../components/charts/daily-open";
import LineOptions from "../../components/charts/daily-register";
export default {
  data() {
    let bar = options.bar;
    let line = LineOptions.line;
    return {
      OpenOption: bar,
      RegistOption: line,
      id: "test",
      Id: "Test",
      controlHicharsShow: false,
      dailyMonth: {},   // 日报,月报数据
    };
  },
  components: {
    Xchart
  },
  methods: {
    // 获取日报数据
    fetchDailyInfo() {
      var self = this;
      self.controlHicharsShow = false;
      self.$loading.show("加载中");
      Api.getDailyInfoApi({
        start_time: self.$route.query.time
      }).then(
        res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.dailyMonth = res.data
            self.OpenOption.xAxis.categories = res.data.openStat[0];
            self.OpenOption.series[0].data = res.data.openStat[1];
            self.RegistOption.xAxis.categories = res.data.registerStat[0];
            self.RegistOption.series[0].data = res.data.registerStat[1];
            self.controlHicharsShow = true;
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },

    // 获取月报数据
    fetchMonthInfo() {
      let self = this
      self.$loading.show("加载中");
      Api.getMonthlyInfoApi({
        start_time: self.$route.query.time
      }).then(
        res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.dailyMonth = res.data
            self.OpenOption.xAxis.categories = res.data.openStat[0];
            self.OpenOption.series[0].data = res.data.openStat[1];
            self.RegistOption.xAxis.categories = res.data.registerStat[0];
            self.RegistOption.series[0].data = res.data.registerStat[1];
            self.controlHicharsShow = true;
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  },

  mounted() {
    if (this.$route.query.type == 1) {
      document.title = this.$route.query.tip + '日线上用户'
      this.fetchDailyInfo()
    }
    if (this.$route.query.type == 2) {
      document.title = this.$route.query.tip + '月线上用户'
      this.fetchMonthInfo()
    } 
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  background: #F7F8FA;
  width: 100%;
  height: 100vh;
  .header {
    width: 100%;
    height: 406/100rem;
    background: url(../../assets/bluebg.png) no-repeat center;
    background-size: cover;
    background-color: #4B77B0;
  }
  .card-box {
    width: 690/100rem;
    margin: 0 auto;
    margin-bottom: 40/100rem;
    padding-bottom: 40/100rem;
    padding-top: 40/100rem;
    .card-item {
      width: 345/100rem;
      height: 152/100rem;
      float: left;
      .number {
        text-align: center;
        line-height: 48/100rem;
        font-weight: bold;
        color: #ffffff;
      }
      .tips {
        text-align: center;
        line-height: 36/100rem;
        color: #C3D7F2;
      }
    }
    .p-t-32 {
      padding-top: 32/100rem;
    }
    .right-border {
      position: relative;
    }
    .right-border:after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 152/100rem;
      width: 1px;
      background-color: rgba(195, 215, 242, 0.05);
    }
    .bottom-border {
      position: relative;
    }
    .bottom-border:before {
      content: '';
      position: absolute;
      right: -174/100rem;
      bottom: 0;
      height: 1px;
      width: 348/100rem;
      background-color: rgba(195, 215, 242,0.05);
    }
  }
  .first-chart {
    margin-top: -60/100rem;
  }
}
</style>
