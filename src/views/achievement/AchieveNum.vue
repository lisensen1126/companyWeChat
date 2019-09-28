<template>
  <div class="index font-18">
    <div class="header">
      <div class="clearfix card-box" v-if="dailyMonth.performanceStat">
        <div class="font-12 card-item right-border bottom-border">
           <p class="number font-16">￥{{dailyMonth.performanceStat.sum}}</p>
           <p class="tips font-12">销售金额</p>
        </div>

        <div class="font-12 card-item">
           <p class="number font-16">￥{{dailyMonth.performanceStat.actual}}</p>
           <p class="tips font-12">实收金额</p>
        </div>

        <div class="font-12 card-item p-t-32 right-border bottom-border">
           <p class="number font-16">{{dailyMonth.performanceStat.count}}笔</p>
           <p class="tips font-12">订单数</p>
        </div>

        <div class="font-12 card-item p-t-32">
           <p class="number font-16">￥{{dailyMonth.performanceStat.ave}}</p>
           <p class="tips font-12">订单均价</p>
        </div>

        <div class="font-12 card-item p-t-32 right-border">
           <p class="number font-16">{{dailyMonth.performanceStat.inspect}}次</p>
           <p class="tips font-12">车检次数</p>
        </div>
      </div>
    </div>

    <div>
      <div class="container container-50">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">服务实收金额</span>
          <span class="font-14 font-Fu-me m-l-5 blue">¥{{servicesStatTotal}}</span>
        </div>
        <div v-if="servicesStat.length !== 0">
          <div class="salse-wrapper p-a-40" v-for="(item,index) in servicesDefaultList" :key="index">
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">{{item.category_name}}</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{item.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{item.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show" :style="'width:' + item.percentage"></span>
              </div>
            </div>
          </div>
          <div class="submit-btn p-a-40 flex" @click="showAllSerList">
            <div v-if="!isShowService" class="line-40">
              <span class="font-14 font-PC-re m-r-10">查看全部</span>
              <img src="../../assets/down-black.png" />
            </div>
            <div v-else class="line-40">
              <span class="font-14 font-PC-re m-r-10">收起</span>
              <img class="down-arrow" src="../../assets/down-black.png" />
            </div>
          </div>
        </div>
        <div v-else class="default_content">
          <img src="../../assets/default_Data.png" />
          <div class="font-PC-re font-12">暂无数据</div>
        </div>
      </div>

      <div class="container">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">商品实收金额</span>
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
                <span class="progress-box-show" :style="'width:' + item.percentage"></span>
              </div>
            </div>
          </div>
          <div class="submit-btn p-a-40 flex" @click="showAllGoodsList">
            <div v-if="!isShowGoods" class="line-40">
              <span class="font-14 font-PC-re m-r-10">查看全部</span>
              <img src="../../assets/down-black.png" />
            </div>
            <div v-else class="line-40">
              <span class="font-14 font-PC-re m-r-10">收起</span>
              <img class="down-arrow" src="../../assets/down-black.png" />
            </div>
          </div>
        </div>
        <div v-else class="default_content">
          <img src="../../assets/default_Data.png" />
          <div class="font-PC-re font-12">暂无数据</div>
        </div>
      </div>

      <div class="container" v-if="cardStatTotal">
        <div class="list-height p-a-40">
          <span class="font-PC-sd font-14 black m-r-20">养护卡实收金额</span>
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
                <span class="progress-box-show" :style="'width:' + cardStatTotal.boss.percentage"></span>
              </div>
            </div>
          </div>
          <div class="salse-wrapper p-a-40">
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">门店养护卡</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{cardStatTotal.store.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{cardStatTotal.store.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show" :style="'width:' + cardStatTotal.store.percentage"></span>
              </div>
            </div>
          </div>
          <div class="salse-wrapper p-a-40">
            <div class="flex">
              <div class="flex">
                <div class="title-container m-r-15 line-34 font-12 font-PC-sd gray2">门店次卡</div>
                <div class="price-container line-30 font-12 font-Fu-me black">¥{{cardStatTotal.number.sum}}</div>
              </div>
              <div class="precent-container line-30 font-12 font-Fu-me black">{{cardStatTotal.number.percentage}}</div>
            </div>
            <div class="progress-wrapper m-t-20">
              <div class="progress-box-bottom">
                <span class="progress-box-show" :style="'width:' + cardStatTotal.number.percentage"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/dailyApi";
export default {
  data() {
    return {
      servicesStat: [],
      goodsStat: [],
      registerStat: [],
      goodsStatTotal: "",
      cardStatTotal: "",
      servicesStatTotal: "",
      goodsStatDefaultList: [],
      servicesDefaultList: [],
      isShowService: false,
      isShowGoods: false,
      isShowModal: false,
      dailyMonth: {},   // 日报,月报数据
    };
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
          self.$loading.hide();
          if (res.code === 0) {
            self.dailyMonth = res.data
            self.servicesStat = res.data.servicesStat;
            self.goodsStat = res.data.goodsStat;
            self.servicesStatTotal = res.data.servicesStatTotal;
            self.goodsStatTotal = res.data.goodsStatTotal;
            self.cardStatTotal = res.data.card;
            if (self.servicesStat.length) {
              self.servicesDefaultList = self.servicesStat.slice(0, 4);
            }
            if (self.goodsStat.length) {
              self.goodsStatDefaultList = self.goodsStat.slice(0, 4);
            }
          } else {
            self.$router.replace({ path: "/error", query: {msg: res.message}});
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
          self.$loading.hide();
          if (res.code === 0) {
            self.dailyMonth = res.data
            self.servicesStat = res.data.servicesStat;
            self.goodsStat = res.data.goodsStat;
            self.servicesStatTotal = res.data.servicesStatTotal;
            self.goodsStatTotal = res.data.goodsStatTotal;
            self.cardStatTotal = res.data.card;
            if (self.servicesStat.length) {
              self.servicesDefaultList = self.servicesStat.slice(0, 4);
            }
            if (self.goodsStat.length) {
              self.goodsStatDefaultList = self.goodsStat.slice(0, 4);
            }
          } else {
            self.$router.replace({ path: "/error", query: {msg: res.message}});
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
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
  },

  mounted() {
    if (this.$route.query.type == 1) {
      document.title = this.$route.query.tip + '日线上业绩'
      this.fetchDailyInfo()
    }
    if (this.$route.query.type == 2) {
      document.title = this.$route.query.tip + '月线上业绩'
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
  .header {
    width: 100%;
    height: 560/100rem;
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
