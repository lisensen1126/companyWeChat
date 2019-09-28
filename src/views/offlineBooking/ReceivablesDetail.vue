<template>
  <div class="index font-PC-re" v-if="page_init">
    <div class="order">
      <div class="name font-12">
        <img :src="info.avatar" alt="">
        {{info.nick_name}}
      </div>
      <div class="money font-30">￥{{info.final_amount / 100}}</div>
    </div>


    <div class="line">
      <div class="line-box">
        <div class="left pull-left font-14">应付金额</div>
        <div class="right pull-right font-14">￥{{info.total_amount / 100}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">优惠金额</div>
        <div class="right pull-right font-14">-￥{{info.preferential_price/100}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">收款类型</div>
        <div class="right pull-right font-14">{{info.order_type == 6 ? '门店收款码' : '开单收款码'}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">订单编号</div>
        <div class="right pull-right font-14 link-on" @click="goOrderDetail(info.trade_order_no)">{{info.trade_order_no}}</div>
      </div>
    </div>
    <div class="line">
      <div class="line-box">
        <div class="left pull-left font-14">所属门店</div>
        <div class="right pull-right font-14">{{info.store_name}}</div>
      </div>
      <div class="line-box" v-if="info.order_type == 7">
        <div class="left pull-left font-14">员工</div>
        <div class="right pull-right font-14">{{info.mem_user_name || '--'}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from '../../api/offlineBookingApi';
export default {
  name: "OpeningRecordDetail",
  data() {
    return {
      info: {},
      page_init: false
    };
  },
  methods: {
    // 获取列表
    fetchDetail () {
      let self = this;
      self.$loading.show("加载中");
      Api.getRecordDetailApi({
        trade_order_no: self.$route.query.id
      }).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.$loading.hide()
            self.info = res.data
            self.page_init = true
          } else {
            self.$loading.hide()
            self.$router.replace({ path: "/error", query: {msg: res.message}})
          }
        },
        err => {
          self.$loading.hide()
          self.$router.replace({ path: "/error", query: { msg: err } })
        }
      )
    },
    // 去订单详情
    goOrderDetail (id) {
      this.$router.push({
        name: "WriteOffDetails",
        query: {
          id: id,
          type: 3,
        }
      });
    }
  },
  mounted() {
    this.fetchDetail()
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  line-height: 1;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 136/100rem;
  .order{
    width: 100%;
    height: 300/100rem;
    background-color: #ffffff;
    padding-top: 60/100rem;
    .name{
      height: 50/100rem;
      width: 100%;
      line-height: 50/100rem;
      text-align: center;
      color: #000000;
      img{
        width: 50/100rem;
        height: 50/100rem;
        vertical-align: middle;
        border-radius: 50/100rem;
      }
    }
    .money{
      color: #000000;
      padding-top: 60/100rem;
      text-align: center;
      font-weight: bold;
    }
  }
  .line{
    width: 100%;
    height: auto;
    margin-top: 20/100rem;
    background-color: #ffffff;
    padding-top: 30/100rem;
    p{
      margin-left: 30/100rem;
    }
    .line-box{
      width: 100%;
      padding: 0 30/100rem;
      height: 132/100rem;
      position: relative;
      border-bottom: 1px solid #eeeeee;
      overflow: hidden;
      .left{
        line-height: 132/100rem;
        color: #8A92A2;
      }
      .right{
        line-height: 132/100rem;
        color: #000000;
      }
      .color-red{
        color: #E50413;
      }
      .link-on{
        color: #4B77B0;
        // text-decoration: underline;
      }
    }
    .line-box:last-child{
      border-bottom: 1px solid #ffffff;
    }
  }
  .hr{
    width: 100%;
    height: 160/100rem;
  }
  .pull-right{
    max-width: 5.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
