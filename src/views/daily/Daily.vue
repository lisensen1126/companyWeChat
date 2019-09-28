<template>
  <div class="daily">
    <div class="daily-header position-relative">
      <div class="topHeader">
        <div class="data-select text-center p-t-20 flex position-relative">
          <div class="arrow-left"
               style="margin-left:2.6rem">
            <img src="../../assets/arrow-white.png"
                 @click="prevDay" />
          </div>
          <div class="position-relative time-wrapper">
            <input class="date-component position-absolute"
                   type="date"
                   name="date"
                   id="date"
                   @change="selectTimeFun" />"
            <div class="font-12 font-Fu-me position-absolute"
                 style="width: 100%;height:100%; color: #fff; background: transparent">{{selectTime}}</div>
          </div>
          <div class="arrow-right"
               style="margin-right:2.6rem">
            <img v-if="isNext"
                 class="right-arrow"
                 src="../../assets/arrow-white.png"
                 @click="nextDay" />
          </div>
          <div class="look-daily font-12 position-absolute" @click="goMonthDaily">
            查看月报<img class="arrow-right" src="../../assets/arrow-right3.png" />
          </div>
        </div>
        <div class="user-statics m-b-40 m-t-10 p-l-40 p-r-40">
          <div class="line-user-title">
            <span class="font-14 white font-PC-sd m-r-20 line-40">线上用户</span>
            <img @click="showModal(1)"
                 src="../../assets/white.png" />
          </div>
          <div class="line-user-number p-t-20 flex">
            <div>
              <div class="line-40">
                <span class="whiteO font-12 font-PC-re show">打开次数</span>
              </div>
              <div class="line-52">
                <span class="white font-20 font-Fu-me show">{{userStat.open}}</span>
              </div>
            </div>
            <div>
              <div class="line-40">
                <span class="whiteO font-12 font-PC-re show">访问人数</span>
              </div>
              <div class="line-52">
                <span class="white font-20 font-Fu-me show">{{userStat.view}}</span>
              </div>
            </div>
            <div>
              <div class="line-40">
                <span class="whiteO font-12 font-PC-re show">新注册</span>
              </div>
              <div class="line-52">
                <span class="white font-20 font-Fu-me show">{{userStat.data_register}}</span>
              </div>
            </div>
            <div>
              <div class="line-40">
                <span class="whiteO font-12 font-PC-re show">总注册</span>
              </div>
              <div class="line-52">
                <span class="white font-20 font-Fu-me show">{{userStat.all_register}}</span>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="topContainer position-absolute m-l-30 m-r-30 p-l-30 p-t-40 p-r-30">
        <div class="line-user-title">
          <span class="font-14 font-PC-sd m-r-20">线上业绩</span>
          <img @click="showModal(2)"
               src="../../assets/gray.png" />
        </div>
        <div class="p-t-30 flex">
          <div class="clearfix item-data">
            <div class="pull-left clearfix item-left-data">
              <span class="pull-left black-3d font-12 m-r-20">线上销售金额</span>
              <span class="pull-left black-3d font-14 font-600">¥{{performanceStat.sum}}</span>
            </div>
            <div class="pull-left clearfix item-right-data">
              <span class="pull-left black-3d font-12 m-r-20 width-116">订单数</span>
              <span class="pull-left black-3d font-14 font-600">{{performanceStat.count}}</span>
            </div>
          </div>
        </div>
        <div class="p-t-30 flex">
          <div class="clearfix item-data">
            <div class="pull-left clearfix item-left-data">
              <span class="pull-left black-3d font-12 m-r-20">线上实收金额</span>
              <span class="pull-left black-3d font-14 font-600">¥{{performanceStat.actual}}</span>
            </div>
            <div class="pull-left clearfix item-right-data">
              <span class="pull-left black-3d font-12 m-r-20 width-116">订单均价</span>
              <span class="pull-left black-3d font-14 font-600">¥{{performanceStat.ave}}</span>
            </div>
          </div>
        </div>
        <div class="p-t-30 flex">
          <div class="clearfix item-data">
            <div class="pull-left clearfix item-left-data">
              <span class="pull-left black-3d font-12 m-r-20">车检数</span>
              <span class="pull-left black-3d font-14 font-600">{{performanceStat.inspect}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div style="height: 2.94rem"></div>
      <div class="container m-b-40">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">服务销售金额</span>
          <span class="font-14 font-Fu-me m-l-5 blue">¥{{servicesStatTotal}}</span>
        </div>
        <div v-if="servicesStat.length !== 0">
          <div class="salse-wrapper p-a-40"
               v-for="(item,index) in servicesDefaultList"
               :key=index>
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">{{item.category_name}}</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{item.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{item.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show"
                      :style="'width:' + item.percentage"></span>
              </div>
            </div>
          </div>
          <div class="submit-btn p-a-40 flex"
               @click="showAllSerList">
            <div v-if="!isShowService"
                 class="line-40">
              <span class="font-14 font-PC-re m-r-10">查看全部</span>
              <img src="../../assets/down-black.png" />
            </div>
            <div v-else
                 class="line-40">
              <span class="font-14 font-PC-re m-r-10">收起</span>
              <img class="down-arrow"
                   src="../../assets/down-black.png" />
            </div>
          </div>
        </div>
        <div v-else
             class="default_content">
          <img src="../../assets/default_Data.png" />
          <div class="font-PC-re font-12">暂无数据</div>
        </div>
      </div>
      <div class="container m-b-40">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">商品销售金额</span>
          <span class="font-14 font-Fu-me m-l-5 blue">¥{{goodsStatTotal}}</span>
        </div>
        <div v-if="goodsStat.length !== 0">
          <div class="salse-wrapper p-a-40"
               v-for="(item,index) in goodsStatDefaultList"
               :key=index>
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">{{item.category_name}}</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{item.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{item.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show"
                      :style="'width:' + item.percentage"></span>
              </div>
            </div>
          </div>
          <div class="submit-btn p-a-40 flex"
               @click="showAllGoodsList">
            <div v-if="!isShowGoods"
                 class="line-40">
              <span class="font-14 font-PC-re m-r-10">查看全部</span>
              <img src="../../assets/down-black.png" />
            </div>
            <div v-else
                 class="line-40">
              <span class="font-14 font-PC-re m-r-10">收起</span>
              <img class="down-arrow"
                   src="../../assets/down-black.png" />
            </div>
          </div>
        </div>
        <div v-else
             class="default_content">
          <img src="../../assets/default_Data.png" />
          <div class="font-PC-re font-12">暂无数据</div>
        </div>
      </div>
      <div class="container" v-if="cardStatTotal">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">养护卡销售金额</span>
          <span class="font-14 font-Fu-me m-l-5 blue">¥{{cardStatTotal.sum}}</span>
        </div>
        <div>
          <div class="salse-wrapper p-a-40">
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">壳牌养护卡</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{cardStatTotal.boss.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{cardStatTotal.boss.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show"
                      :style="'width:' + cardStatTotal.boss.percentage"></span>
              </div>
            </div>
          </div>
          <div class="salse-wrapper p-a-40">
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">门店自建卡</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{cardStatTotal.store.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{cardStatTotal.store.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show"
                      :style="'width:' + cardStatTotal.store.percentage"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chart m-l-30 m-r-30 m-t-30 p-a-30">
        <div class="line-40 m-b-30">
          <span class="font-14 font-PC-sd black">小程序打开次数</span>
        </div>
        <div>
          <xchart :id="id"
                  :option="OpenOption"
                  v-if="controlHicharsShow">
          </Xchart>
        </div>
      </div>
      <div class="chart m-l-30 m-r-30 m-t-30 m-b-30 p-a-30">
        <div class="line-40 m-b-30">
          <span class="font-14 font-PC-sd black">小程序注册人数</span>
        </div>
        <div>
          <xchart :id="Id"
                  :option="RegistOption"
                  v-if="controlHicharsShow">
          </Xchart>
        </div>
      </div>
    </div>
    <div class="modal-container"
         v-if="isShowModal"
         style="text-align: center;">
      <div class="p-a-60 m-t-max m-r-40 m-l-40 modal-content">
        <div class="text-center line-50 m-b-60">
          <span class="font-18 font-PC-sd black">{{title}}</span>
        </div>
        <div class="line-44 m-b-40 text-left"
             v-for="(item, index) in showInfo"
             :key=index>
          <div class="font-16 font-PC-re black letter-space">{{item.content}}</div>
        </div>
      </div>
      <img style="margin-top: 1.5rem;"
           src="../../assets/close.png"
           @click="cancel"
           alt="">
    </div>
  </div>
</template>
<script>
import Xchart from "../../components/charts/chart.vue";
import options from "../../components/charts/daily-open";
import LineOptions from "../../components/charts/daily-register";
import Api from "../../api/dailyApi";

export default {
  name: "daily",
  data() {
    let bar = options.bar;
    let line = LineOptions.line;
    return {
      userStat: {},
      performanceStat: {},
      servicesStat: [],
      goodsStat: [],
      openStat: [],
      registerStat: [],
      goodsStatTotal: "",
      cardStatTotal: "",
      servicesStatTotal: "",
      userInfo: [
        { content: "打开次数：当日访问小程序的总次数" },
        {
          content:
            "访问人数：当日访问小程序的总用户数，同一用户多次访问不重复计数"
        },
        { content: "新注册：当日访问小程序注册成功的用户数" },
        { content: "总注册：访问小程序注册成功的总用户数" }
      ],
      linePerformance: [
        { content: "线上销售金额：线上小程序当日的所有订单销售总额" },
        { content: "线上实收金额：线上小程序当日的所有订单实收总额" },
        { content: "订单数：当日成交订单数" },
        { content: "订单均价：平均每单销售金额" }
      ],
      title: "",
      selectTime: "",
      goodsStatDefaultList: [],
      servicesDefaultList: [],
      isShowService: false,
      isShowGoods: false,
      isShowModal: false,
      OpenOption: bar,
      RegistOption: line,
      id: "test",
      Id: "Test",
      showInfo: [],
      timestamp: "",
      controlHicharsShow: false,
      currTime: "",
      saveCurTime: "",
      maxDate: "",
      isNext: false,
      today: ""
    };
  },
  mounted() {
    var now = new Date();
    var str =
      now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    this.today = Date.parse(str) / 1000;
    this.timestamp = this.today;
    this.selectTime =
      now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate();
    this.saveCurTime = this.selectTime;
    var input = document.getElementById("date");
    input.addEventListener("input", function() {
      this.blur();
    });
    this.getInfo();
  },
  methods: {
    selectTimeFun(e) {
      var changeVal = e.target.value;
      if (changeVal == "") {
        this.selectTime = this.saveCurTime;
      } else {
        this.currTime = e.target.value.toString();
        console.log(this.currTime, "current");
        var now = new Date().getTime();
        if (now < new Date(this.currTime).getTime()) {
          console.log("go there");
          this.selectTime = this.saveCurTime;
          return;
        }
        this.changeCommonFun(new Date(this.currTime));
      }
    },
    /**
     * @method optDay 天操作 主要进行一天的加减，点击前一天或者后一天时触发   参数days配置可进行 点击前n天或者后n天时触发
     * @param {string} date 当前时间点 如：2018/08/28
     * @param {number} days 天数个数 表示每次加几天或者减几天
     * @param {sting} opt 表示加一天或者减一天标志
     * @return {Date}
     *      curTime  处理后的时间格式为时间格式可以直接使用
     * */
    optDay(date, opt) {
      var curTime = new Date(date);
      if (opt === "+") {
        var now = new Date();
        var str =
          now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
        var nowTime = Date.parse(str);

        if (nowTime <= curTime.getTime()) {
          return;
        }
        curTime.setDate(curTime.getDate() + 1);
      } else {
        curTime.setDate(curTime.getDate() - 1);
      }
      this.changeCommonFun(curTime);
    },
    changeCommonFun(curTime) {
      var str =
        curTime.getFullYear() +
        "/" +
        (curTime.getMonth() + 1) +
        "/" +
        curTime.getDate();
      this.timestamp = Date.parse(str) / 1000;
      if (this.timestamp == this.today || this.timestamp > this.today) {
        this.isNext = false;
        this.selectTime = this.saveCurTime;
      } else {
        this.isNext = true;
      }
      this.selectTime =
        curTime.getFullYear() +
        "." +
        (curTime.getMonth() + 1) +
        "." +
        curTime.getDate();
      this.saveCurTime = this.selectTime;
      this.getInfo();
    },
    prevDay() {
      var str = this.selectTime.replace(/\./g, "/");
      this.optDay(str, "-");
    },
    nextDay() {
      var str = this.selectTime.replace(/\./g, "/");
      this.optDay(str, "+");
    },
    // 获取信息
    getInfo() {
      var t = this;
      t.controlHicharsShow = false;
      t.$loading.show("加载中");
      Api.getDailyInfoApi({
        start_time: t.timestamp
      }).then(
        res => {
          console.log(res, "----dss");
          if (res.code === 0) {
            t.$loading.hide();
            t.userStat = res.data.userStat;
            t.performanceStat = res.data.performanceStat;
            t.servicesStat = res.data.servicesStat;
            t.goodsStat = res.data.goodsStat;
            t.servicesStatTotal = res.data.servicesStatTotal;
            t.goodsStatTotal = res.data.goodsStatTotal;
            t.cardStatTotal = res.data.card;
            t.OpenOption.xAxis.categories = res.data.openStat[0];
            t.OpenOption.series[0].data = res.data.openStat[1];
            t.RegistOption.xAxis.categories = res.data.registerStat[0];
            t.RegistOption.series[0].data = res.data.registerStat[1];
            t.controlHicharsShow = true;
            if (t.servicesStat.length) {
              t.servicesDefaultList = t.servicesStat.slice(0, 4);
            }
            if (t.goodsStat.length) {
              t.goodsStatDefaultList = t.goodsStat.slice(0, 4);
            }
          }
        },
        function(err) {
          t.$loading.hide();
          t.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    // 查看全部 && 收起
    showAllSerList() {
      this.isShowService = !this.isShowService;
      if (this.isShowService) {
        this.servicesDefaultList = this.servicesStat;
      } else {
        this.servicesDefaultList = this.servicesStat.slice(0, 4);
      }
    },
    showAllGoodsList() {
      this.isShowGoods = !this.isShowGoods;
      if (this.isShowGoods) {
        this.goodsStatDefaultList = this.goodsStat;
      } else {
        this.goodsStatDefaultList = this.goodsStat.slice(0, 4);
      }
    },
    showModal(type) {
      this.isShowModal = !this.isShowModal;
      type == 1
        ? (this.title = "线上用户") && (this.showInfo = this.userInfo)
        : (this.title = "线上业绩") && (this.showInfo = this.linePerformance);
    },
    cancel() {
      this.isShowModal = false;
    },
    goMonthDaily() {
      this.$router.push({
        path: "/monthly"
      });
    }
  },
  components: {
    Xchart
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.coverTime {
  line-height: 0.4rem;
  width: 1.34rem;
  top: 0.24rem;
  left: 3.08rem;
  color: #fff;
}
.line-user-title {
  display: flex;
  align-items: center;
  img {
    width: 0.28rem;
    height: 0.28rem;
  }
}
.look-daily {
  color: #fff;
  display: flex;
  align-items: center;
  right: 0.3rem;
  img {
    width: 0.15rem;
    margin-left: 0.1rem;
  }
}
</style>
