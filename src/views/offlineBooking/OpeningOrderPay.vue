<template>
  <div class="index font-20" v-if="page_init">
    <div class="header">
      <div class="title font-16">
        向商家付款
        <div class="store-name pull-right">{{info.store_name}}</div>
      </div>
      <!-- 收款码 -->
      <div class="code-centent">
        <div class="money font-30">￥{{(info.total_amount / 100).toFixed(2)}}</div>
        <div class="code-info">
          <img :src="info.qr_code" alt="">
        </div>
        <div class="code-tips font-14">
          <img src="../../assets/application/wxpay.png" alt="">
          请使用微信付款
        </div>

        <!-- 支付成功 -->
        <div class="pay-success" v-show="show_msg">
          <div class="pay-img">
            <img src="../../assets/application/pay-success.png" alt="">
            <p class="font-14 success">支付成功</p>
            <p class="font-30 money1">￥{{(msg_info.final_amount / 100).toFixed(2)}}</p>
          </div>
          <div class="user-info font-12">
            <img :src="msg_info.avatar" alt="">
            {{msg_info.nick_name}}
          </div>
        </div>
      </div>
    </div>

    <!-- 买单项目 -->
    <div class="pay-order">
      <div class="title font-16">买单项目</div>
      <div class="list" v-for="(item, index) in info.item" :key="index">
        <div class="goods-name font-16">{{item.item_title}}</div>
        <div class="goods-num font-14">
          <div>数量：{{item.quantity}}</div>
          <div>￥{{(item.unit_price / 100).toFixed(2)}}</div>
        </div>
      </div>
      <div class="money-count font-16">
        合计：<span>￥{{(info.total_amount / 100).toFixed(2)}}</span>
      </div>
    </div>

    <!-- 收款总计 -->
    <div class="receivables" v-if="list.list && list.list.length > 0">
      <div class="title font-16">
        <div>收款总计</div>
        <div class="bold">￥{{(list.total_amount / 100).toFixed(2)}}</div>
      </div>
      <div class="list" v-for="(item, index) in list.list" :key="index">
        <div class="user-info font-14">
          <img :src="item.avatar" alt="">
          {{item.nick_name}}
        </div>
        <div class="pay-money">
          <p class="font-14">￥{{(item.final_amount / 100).toFixed(2)}}</p>
          <p class="font-12">优惠 <span>￥{{item.preferential_price / 100}}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
export default {
  data() {
    return {
      info: {}, // 详情信息
      msg_info: {}, // 获取支付通知消息
      list: {},
      page_init: false,
      show_msg: false, // 支付成功弹框
      message_time_out: "",
      order_time_out: ""
    };
  },
  methods: {
    // 获取订单详情
    fetchDetail() {
      let self = this;
      self.$loading.show("加载中");
      Api.getOrderDetailApi({
        quick_order_id: self.$route.query.id,
        get_qr_code: 1
      }).then(
        res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.info = res.data;
            self.page_init = true;
          } else {
            self.$loading.hide();
            self.$router.replace({
              path: "/error",
              query: { msg: res.message }
            });
          }
        },
        err => {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },

    // 快速开单支付成功通知
    getMessage() {
      let self = this;
      Api.getOrderMsgApi({ quick_order_id: self.$route.query.id }).then(
        res => {
          if (res.code === 0) {
            if (res.data.total_amount) {
              self.msg_info = res.data;
              self.show_msg = true;
            }
            self.message_time_out = setTimeout(() => {
              self.show_msg = false;
              self.getMessage();
            }, 6000);
          } else {
            // self.$router.replace({ path: "/error", query: {msg: res.message}})
            console.error("开单支付成功通知-getMessage", res.message);
          }
        },
        err => {
          console.error("开单支付成功通知-getMessage", err);
          // self.$router.replace({ path: "/error", query: { msg: err } })
        }
      );
    },

    // 获取支付成功列表
    fetchPayList() {
      let self = this;
      Api.getPayListApi({
        order_type: 7,
        quick_order_id: self.$route.query.id
      }).then(
        res => {
          if (res.code === 0) {
            self.list = res.data;
            self.order_time_out = setTimeout(() => {
              self.fetchPayList();
            }, 6000);
          } else {
            console.error("支付成功列表-fetchPayList", res.message);
            // self.$router.replace({ path: "/error", query: {msg: res.message}})
          }
        },
        err => {
          console.error("支付成功列表-fetchPayList", err);
          // self.$router.replace({ path: "/error", query: { msg: err } })
        }
      );
    }
  },

  mounted() {
    this.fetchDetail();
    this.fetchPayList();
    this.getMessage();
  },

  beforeDestroy() {
    clearInterval(this.order_time_out);
    clearInterval(this.message_time_out);
  },
  destroyed() {
    this.$router.push({
      name: "OpeningOrderList"
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20/100rem;
  .header {
    width: 100%;
    height: 722/100rem;
    background-color: #ffffff;
    .title {
      width: 100%;
      padding: 50/100rem 30/100rem;
      line-height: 1;
      color: #8a92a2;
      border-bottom: 1px solid #eeeeee;
      .store-name {
        color: #000000;
        width: 430/100rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
      }
    }
    .code-centent {
      width: 100%;
      height: 588/100rem;
      position: relative;
      .money {
        color: #000000;
        padding: 52/100rem 0;
        text-align: center;
        line-height: 1;
        font-weight: bold;
      }
      .code-info {
        width: 300/100rem;
        height: 300/100rem;
        margin: 0 auto;
        img {
          width: 300/100rem;
          height: 300/100rem;
        }
      }
      .code-tips {
        img {
          width: 32/100rem;
          height: 28/100rem;
          vertical-align: middle;
        }
        color: #8a92a2;
        padding-top: 40/100rem;
        text-align: center;
        line-height: 1;
      }
      .pay-success {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 588/100rem;
        background-color: rgba(255, 255, 255, 0.98);
        padding-top: 124/100rem;
        .pay-img {
          text-align: center;
          img {
            width: 88/100rem;
            height: 88/100rem;
          }
        }
        .success {
          color: #000;
          font-weight: bold;
        }
        .money1 {
          color: #000;
          padding-top: 38/100rem;
          text-align: center;
        }
        .user-info {
          text-align: center;
          color: #000;
          padding-top: 58/100rem;
          img {
            width: 50/100rem;
            height: 50/100rem;
            vertical-align: middle;
            border-radius: 50/100rem;
          }
        }
      }
    }
  }
  .pay-order {
    .title {
      padding: 40/100rem 30/100rem 20/100rem 30/100rem;
      color: #8a92a2;
    }
    .list {
      padding: 40/100rem 30/100rem;
      background-color: #ffffff;
      border-bottom: 1px solid #eeeeee;
      .goods-name {
        color: #000000;
      }
      .goods-num {
        margin-top: 20/100rem;
        color: #8a92a2;
        display: flex;
        justify-content: space-between;
      }
    }
    .money-count {
      padding: 30/100rem;
      text-align: right;
      color: #404040;
      background-color: #ffffff;
      span {
        color: #000;
        font-weight: bold;
      }
    }
  }
  .receivables {
    background-color: #ffffff;
    margin-top: 20/100rem;
    padding: 0 30/100rem;
    .title {
      padding: 40/100rem 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eeeeee;
      .bold {
        font-weight: bold;
      }
    }
    .list {
      display: flex;
      justify-content: space-between;
      padding: 40/100rem 0;
      border-bottom: 1px solid #eeeeee;
      .user-info {
        color: #2c3039;
        max-width: 460/100rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        img {
          width: 80/100rem;
          height: 80/100rem;
          border-radius: 80/100rem;
          vertical-align: middle;
          margin-right: 20/100rem;
        }
      }
      .pay-money {
        color: #8a92a2;
        text-align: right;
        span {
          color: #dd1d21;
        }
      }
    }
  }
}
</style>
