<template>
  <div class="writeOffDetails font-PC-re" v-if="is_show_page">
    <scroller class="scroller-box">
      <!--订单详情-->
      <div class="order">
        <p class="header font-14">订单项目</p>
        <div class="order-info clearfix" v-for="(data, index) in detail.item" :key="index">
          <div class="left pull-left">
            <img v-if="data.item_type == 1" class="float-img" src="../../assets/img-goods.png" alt="">
            <img v-if="data.item_type == 2" class="float-img" src="../../assets/img-service.png" alt="">
            <img class="z-img" :src="data.image_url" alt="">
          </div>
          <div class="right pull-right">
            <div class="good-name font-13" v-if="data">{{data.item_title}}</div>
            <div class="good-attr font-13" v-if="data && data.sku_attribute.length > 0">{{data.sku_attribute.toString().replace(/,/g, ' ')}}</div>
            <div class="good-attr font-13" v-if="data && data.sku_attribute.length == 0">&nbsp;</div>
            <div class="good-price clearfix">
              <span class="pull-left font-18" v-if="data">
                ￥{{data.activity_price/100}}
              </span>
              <span class="pull-right font-14" v-if="data">
                x {{data.quantity}}
              </span>
            </div>
          </div>
        </div>
        <div class="order-button" @click="goRecord">
          <div class="order-button-title font-12">查看核销记录</div>
          <div class="order-button-right">
            <img src="../../assets/arrow_right2.png" alt="">
          </div>
        </div>
      </div>
      <!--订单信息-->
      <div class="line">
        <p class="header font-14">订单信息</p>
        <div class="line-box">
          <div class="left pull-left font-14">订单编号</div>
          <div class="right pull-right font-14">{{detail.trade_order_no}}</div>
        </div>
        <div class="line-box">
          <!-- 1 商品服务订单，2 养护卡，3 线下买单 -->
          <div class="left pull-left font-14">订单类型</div>
          <div class="right pull-right font-14" v-show="detail.goods_type == 1">商品服务订单</div>
          <div class="right pull-right font-14" v-show="detail.goods_type == 2">养护卡订单</div>
          <div class="right pull-right font-14" v-show="detail.goods_type == 3">线下买单订单</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">下单时间 </div>
          <div class="right pull-right font-14">{{detail.created_at}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">下单门店 </div>
          <div class="right pull-right font-14">{{detail.store_name}}</div>
        </div>
      </div>
      <!--预约信息-->
      <div class="line" v-if="!Array.isArray(detail.reserve)">
        <p class="header font-14">预约信息</p>
        <div class="line-box">
          <div class="left pull-left font-14">预约门店</div>
          <div class="right pull-right font-14">{{detail.reserve.reserve_store_name}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">到店时间 </div>
          <div class="right pull-right font-14">{{detail.reserve.reserve_time}}</div>
        </div>
      </div>
      <!--支付信息-->
      <div class="line">
        <p class="header font-14">支付信息</p>
        <div class="line-box">
          <div class="left pull-left font-14">流水号</div>
          <div class="right pull-right font-14">{{detail.payment.third_payment_no}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">支付方式</div>
          <div class="right pull-right font-14" v-if="detail.payment_channel == 1">微信支付</div>
          <div class="right pull-right font-14" v-if="detail.payment_channel == 2">美团支付</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">支付时间</div>
          <div class="right pull-right font-14">{{detail.paid_at}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14" v-if="(detail.order_type === 3 || detail.order_type === 4) && detail.item[0].item_type === 1">商品原价</div>
          <div class="left pull-left font-14" v-if="(detail.order_type === 3 || detail.order_type === 4) && detail.item[0].item_type === 2">服务原价</div>
          <div class="left pull-left font-14" v-if="detail.order_type !== 3 && detail.order_type !== 4">订单总额</div>
          <div class="right pull-right font-14">￥{{detail.total_amount/100}}</div>
        </div>
        <div class="line-box" v-if="detail.order_type == 2 && detail.maintenance_fee > 0">
          <div class="left pull-left font-14">工时费用</div>
          <div class="right pull-right font-14">￥{{detail.maintenance_fee/100}}</div>
        </div>
        <div class="line-box" v-if="detail.random_coupon !== 0">
          <div class="left pull-left font-14">立减金</div>
          <div class="right pull-right font-14">-￥{{detail.random_coupon/100}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">优惠券</div>
          <div class="right pull-right font-14">-￥{{detail.preferential_price/100}}</div>
        </div>
        <div class="line-box">
          <div class="left pull-left font-14">实付款</div>
          <div class="right pull-right font-14 color-red">￥{{detail.final_amount/100}}</div>
        </div>
      </div>
    </scroller>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import {ChangeDateTime} from "../article/DateTimes.js"
export default {
  name: "WriteOffSuccess",
  data() {
    return {
      type: '',
      is_show_page: false,
      detail: {
        item: [],
        reserve: {},
        payment: {},
        customer: {},
        order: {},
      },
    };
  },
  methods: {
    // 获取订单详情
    fetchDetail() {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getAppointmentDetailApi({
        trade_order_no: _this.$route.query.id
      }).then(res => {
        _this.$loading.hide();
        _this.is_show_page = true
        if (res.code === 0) {
          res.data.created_at = ChangeDateTime(res.data.created_at, '-')
          res.data.paid_at = ChangeDateTime(res.data.paid_at, '-')
          this.detail = res.data
        }
      });
    },
    goRecord() {
      if (this.detail.write_off_record.length === 0) {
        this.$toast.error("暂无核销记录")
        return
      }
      this.$router.push({
        name: 'goods-record',
        query: {
          id: this.$route.query.id
        }
      })
    }
  },
  mounted() {
    this.type = this.$route.query.type
    this.fetchDetail()
  },
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.writeOffDetails{
  line-height: 1;
  width: 100%;
  height: 100vh;
  .header{
    padding-left: 16/100rem;
    border-left: 10/100rem solid #4B77B0;
  }
  .user{
    padding: 30/100rem;
    width: 100%;
    height: 222/100rem;
    background-color: #ffffff;
    margin-bottom: 20/100rem;
    .user-info{
      width: 100%;
      height: 100/100rem;
      margin-top: 30/100rem;
      .left{
        width: 100/100rem;
        height: 100/100rem;
        border-radius: 100/100rem;
        margin-right: 56/100rem;
        img{
          width: 100/100rem;
          height: 100/100rem;
          border-radius: 100/100rem;
        }
      }
      .right{
        height: 100/100rem;
        overflow: hidden;
        .name{
          color: #3D424C;
          font-weight: 600;
          padding-top: 12/100rem;
          // line-height: 1.2;
        }
        .phone{
          margin-top: 20/100rem;
          color: #8A92A2;
          line-height: 1;
        }
      }
    }
  }
  .order{
    width: 100%;
    height: auto;
    padding: 30/100rem 0 30/100rem 30/100rem;
    background-color: #ffffff;
    .order-info{
      width: 720/100rem;
      height: auto;
      padding-top: 0.3rem;
      padding-bottom: 30/100rem;
      padding-right: 30/100rem;
      border-bottom: 1px solid #EEEEEE;
      .left{
        width: 268/100rem;
        height: 168/100rem;
        position: relative;
        .z-img{
          width: 268/100rem;
          height: 168/100rem;
        }
        .float-img{
          position: absolute;
          top: 0;
          left: 0;
          width: 74/100rem;
          height: 74/100rem;
        }
      }
      .right{
        width: 392/100rem;
        height: auto;
        .good-name{
          line-height: 1.2;
          width: 100%;
          font-weight: bold;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
        .good-attr{
          line-height: 1.4;
          margin-top: 6/100rem;
          font-weight: bold;
          width: 100%;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .good-price{
          line-height: 1.1;
          margin-top: 43/100rem;
          span:first-child{
            font-weight:bold;
            color: #E50413;
          }
          span:last-child{
            color: #000000;
            padding-top: 8/100rem;
          }
        }
      }
    }
    .order-info:last-child{
      padding-bottom: 0;
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
    }
    .line-box:last-child{
      border-bottom: 1px solid #ffffff;
    }
  }
  .hr{
    width: 100%;
    height: 160/100rem;
  }
  .button{
    position: fixed;
    left: 30/100rem;
    bottom: 40/100rem;
    width: 690/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    text-align: center;
    background-color: #5E7BFF;
    color: #ffffff;
    border-radius: 50/100rem;
    box-shadow: 0 2/100rem 20/100rem #5E7BFF;
    z-index: 2;
  }
  .order-button{
    padding: 0.4rem 0.3rem 0.1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .order-button-title{
      color: #3D424C;
    }
    .order-button-right{
      img{
        width: 0.1rem;
        height: 0.2rem;
      }
    }
  }
  .pull-right{
    max-width: 5.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
