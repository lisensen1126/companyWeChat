<template>
  <div>
    <div class="blue-head">
      <div class="flex-around">
        <div class="flex-item">
          <div class="title">应付金额</div>
          <div class="value">￥{{info.offlineAllPerformanceStat.sum}}</div>
        </div>
        <div class="flex-item">
          <div class="title">实收金额</div>
          <div class="value">￥{{info.offlineAllPerformanceStat.actual}}</div>
        </div>
        <div class="flex-item">
          <div class="title">优惠金额</div>
          <div class="value">￥{{info.offlineAllPerformanceStat.preferential_sum}}</div>
        </div>
      </div>
      <div class="flex-around">
        <div class="flex-item">
          <div class="title">手续费</div>
          <div class="value">￥{{info.offlineAllPerformanceStat.rate_price_sum}}</div>
        </div>
        <div class="flex-item">
          <div class="title">订单数</div>
          <div class="value">{{info.offlineAllPerformanceStat.count}}笔</div>
        </div>
        <div class="flex-item">
          <div class="title">付款人数</div>
          <div class="value">{{info.offlineAllPerformanceStat.customer_count}}人</div>
        </div>
      </div>
    </div>

    <div class="detail-box">
      <div class="box-name">门店收款码</div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlinePerformanceStat.sum}}</div>
          <div class="title">应付金额</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlinePerformanceStat.actual}}</div>
          <div class="title">实付金额</div>
        </div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 without-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 without-bg"></div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlinePerformanceStat.preferential_sum}}</div>
          <div class="title">优惠金额</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlinePerformanceStat.rate_price_sum}}</div>
          <div class="title">手续费</div>
        </div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 without-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 without-bg"></div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">{{info.offlinePerformanceStat.count}}笔</div>
          <div class="title">订单数</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">{{info.offlinePerformanceStat.customer_count}}人</div>
          <div class="title">付款人数</div>
        </div>
      </div>
    </div>

    <div class="detail-box last-box">
      <div class="box-name">开单收款码</div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlineBillPerformanceStat.sum}}</div>
          <div class="title">应付金额</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlineBillPerformanceStat.actual}}</div>
          <div class="title">实付金额</div>
        </div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 without-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 without-bg"></div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlineBillPerformanceStat.preferential_sum}}</div>
          <div class="title">优惠金额</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">￥{{info.offlineBillPerformanceStat.rate_price_sum}}</div>
          <div class="title">手续费</div>
        </div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 without-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 with-bg"></div>
        <div class="flex-grow1 without-bg"></div>
      </div>
      <div class="flex-around">
        <div class="flex-grow1 item-box">
          <div class="value">{{info.offlineBillPerformanceStat.count}}笔</div>
          <div class="title">订单数</div>
        </div>
        <div class="split-verticle"></div>
        <div class="flex-grow1 item-box">
          <div class="value">{{info.offlineBillPerformanceStat.customer_count}}人</div>
          <div class="title">付款人数</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/dailyApi";
export default {
  name: "OfflinePerformance",
  data() {
    return {
      type: "",
      start_time: "",
      info: {}
    };
  },
  mounted() {
    this.type = this.$route.params.type;
    this.start_time = this.$route.params.start_time;
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$loading.show("加载中");
      let type = "getDailyInfoApi";
      if (this.type !== 1) {
        type = "getMonthlyInfoApi";
      }
      Api[type]({
        start_time: this.start_time
      }).then(
        res => {
          if (res.code === 0) {
            this.$loading.hide();
            this.info = res.data;
          }
        },
        err => {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.blue-head {
  font-size: 16px;
  background: url(../../assets/report-bg.png) center no-repeat;
  background-size: cover;
  height: 3rem;
  .flex-around {
    height: 50%;
    .flex-item {
      .title {
        line-height: 0.4rem;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
      }
      .value {
        font-weight: 500;
        font-size: 16px;
        line-height: 0.42rem;
        color: #fff;
        margin-top: 0.1rem;
      }
    }
  }
}
.flex-around {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
.flex-grow1 {
  flex: 1;
}
.detail-box {
  margin: 0.3rem 0.3rem 0.1rem 0.3rem;
  padding: 0.4rem 0.3rem 0.6rem 0.3rem;
  box-shadow: 0 6px 16px 0 rgba(35, 36, 46, 0.04);
  .box-name {
    color: #3d424c;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0.42rem;
  }
  font-size: 16px;
  background: #fff;
  .split-verticle {
    width: 1px;
    opacity: 0.05;
    background: #4b77b0;
    align-self: stretch;
    &::after {
      content: "";
    }
  }
  .item-box {
    text-align: center;
    height: 1.52rem;
    .value {
      margin-top: 0.28rem;
      line-height: 0.48rem;
      font-size: 18px;
      color: #3d424c;
      font-weight: bold;
    }
    .title {
      color: #8a92a2;
      font-size: 12px;
      margin-top: 0.06rem;
    }
  }
  .without-bg {
    height: 1px;
    background: #fff;
  }
  .with-bg {
    opacity: 0.05;
    height: 1px;
    background: #4b77b0;
  }
}
.last-box {
  margin-bottom: 0.3rem;
}
</style>
