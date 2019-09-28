<template>
  <div class="writeOffDetails font-PC-re"
       v-if="is_show_page">
    <div class="scroller-box">
      <div class="user"
           v-if="type !== 'coupon'">
        <p class="header font-14">用户信息</p>
        <div class="user-info">
          <div class="left pull-left">
            <img v-if="detail.customer"
                 :src="detail.customer.avatar">
          </div>
          <div class="right pull-left">
            <div class="name font-16"
                 v-if="detail.customer">{{detail.customer.nick_name}}</div>
            <div class="phone font-10"
                 v-if="detail.customer">手机号：{{detail.customer.mobile}}</div>
          </div>
        </div>
      </div>
      <div class="user coupon"
           v-if="detail.customer_info && type === 'coupon'">
        <p class="header font-14">用户信息</p>
        <div class="user-info">
          <div class="left pull-left">
            <img v-if="detail.customer_info"
                 :src="detail.customer_info.avatar">
          </div>
          <div class="right pull-left">
            <div class="name font-16"
                 v-if="detail.customer_info">{{detail.customer_info.nick_name}}</div>
            <div class="phone font-10"
                 v-if="detail.customer_info">手机号：{{detail.customer_info.mobile}}</div>
            <div class="phone font-10"
                 v-if="detail.customer_info">车牌号：{{detail.customer_info.license_plate}}</div>
          </div>
        </div>
      </div>
      <div v-if="type !== 'coupon'">
        <!--订单详情-->
        <div class="order">
          <p class="header font-14 m-b-30">订单项目</p>
          <div class="order-info clearfix"
               v-for="(data, index) in detail.item"
               :key="index">
            <div class="left pull-left">
              <img v-if="data.item_type == 1"
                   class="float-img"
                   src="../../assets/img-goods.png"
                   alt="">
              <img v-if="data.item_type == 2"
                   class="float-img"
                   src="../../assets/img-service.png"
                   alt="">
              <img class="z-img"
                   :src="data.image_url"
                   alt="">
            </div>
            <div class="right pull-right">
              <div class="good-name font-13"
                   v-if="data">
                {{data.item_title}}
              </div>
              <div class="good-attr font-13"
                   v-if="data && data.sku_attribute.length > 0">{{data.sku_attribute.toString().replace(/,/g, ' ')}}</div>
              <div class="good-attr font-13"
                   v-if="data && data.sku_attribute.length == 0">&nbsp;</div>
              <div class="good-price clearfix">
                <span class="pull-left font-18"
                      v-if="data">
                  ￥{{data.unit_price/100}}
                </span>
                <span class="pull-right font-14"
                      v-if="data">
                  x {{data.quantity}}
                </span>
              </div>
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
            <div class="right pull-right font-14"
                 v-show="detail.goods_type == 1">商品服务订单</div>
            <div class="right pull-right font-14"
                 v-show="detail.goods_type == 2">养护卡订单</div>
            <div class="right pull-right font-14"
                 v-show="detail.goods_type == 3">线下买单订单</div>
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
        <div class="line"
             v-if="!Array.isArray(detail.reserve)">
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
            <div class="right pull-right font-14"
                 v-if="detail.payment_channel == 1">微信支付</div>
            <div class="right pull-right font-14"
                 v-if="detail.payment_channel == 2">美团支付</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">支付时间</div>
            <div class="right pull-right font-14">{{detail.paid_at}}</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14"
                 v-if="(detail.order_type === 3 || detail.order_type === 4) && detail.item[0].item_type === 1">商品原价</div>
            <div class="left pull-left font-14"
                 v-if="(detail.order_type === 3 || detail.order_type === 4) && detail.item[0].item_type === 2">服务原价</div>
            <div class="left pull-left font-14"
                 v-if="detail.order_type !== 3 && detail.order_type !== 4">订单总额</div>
            <div class="right pull-right font-14">￥{{detail.total_amount/100}}</div>
          </div>
          <div class="line-box"
               v-if="detail.order_type == 2 && detail.payment.maintenance_fee > 0">
            <div class="left pull-left font-14">工时费用</div>
            <div class="right pull-right font-14">￥{{detail.payment.maintenance_fee/100}}</div>
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
        <div class="hr"></div>
      </div>
      <div class="coupon-box"
           v-if="detail.coupon_detail && type === 'coupon'">
        <div class="line">
          <p class="header font-14">优惠券信息</p>
          <div class="line-box">
            <div class="left pull-left font-14">优惠券名称</div>
            <div class="right pull-right font-14 coupon-name">{{detail.coupon_detail.coupon_name}}</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">优惠券金额</div>
            <div class="right pull-right font-14"
                 v-if="detail.coupon_detail.coupon_type != 4">￥{{detail.coupon_detail.discount_amount / 100}}</div>
            <div class="right pull-right font-14"
                 v-else>{{detail.coupon_detail.discount_amount / 100}}折</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">优惠券类型</div>
            <div class="right pull-right font-14">{{formatCouponType(detail.coupon_detail.coupon_type)}}</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">适用范围</div>
            <div class="right pull-right font-14">{{formatCouponUseType(detail.coupon_detail.coupon_use_type)}}</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">有效期</div>
            <div class="right pull-right font-14"
                 v-if="detail.coupon_detail.end_time != 0">{{detail.coupon_detail.start_time}}至{{detail.coupon_detail.end_time}}</div>
            <div class="right pull-right font-14"
                 v-else>永久</div>
          </div>
          <div class="line-box">
            <div class="left pull-left font-14">适用条件</div>
            <div class="right pull-right font-14">{{formatConditionValue(detail.coupon_detail.condition_value)}}</div>
          </div>
        </div>
        <div class="hr"></div>
      </div>
    </div>
    <again-confirm @cancel="cancel"
                   @confirm="sure"
                   v-if="is_show_confirm">
    </again-confirm>
    <div class="box"
         v-if="type !== 'coupon'">
      <div class="button font-14"
           @click="chooseItem">
        选择核销项目
      </div>
    </div>
    <div class="box bg"
         v-else>
      <div class="button font-14"
           @click="couponConfirm">
        确认核销
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import AgainConfirm from "./modal/AgainConfirm.vue";
import { ChangeDateTime, ChangeDateTime2 } from "../article/DateTimes.js";
export default {
  name: "writeOffSure",
  components: {
    AgainConfirm
  },
  data() {
    return {
      is_code: this.$route.query.code,
      is_show_page: false,
      is_show_confirm: false,
      detail: {},
      type: null // 详情类型 coupon为兑换券
    };
  },
  methods: {
    // 获取订单详情
    fetchDetail() {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getAppointmentDetailApi({
        write_off_code: _this.$route.query.id
      }).then(res => {
        _this.$loading.hide();
        _this.is_show_page = true;
        if (res.code === 0) {
          res.data.created_at = ChangeDateTime(res.data.created_at, "-");
          res.data.paid_at = ChangeDateTime(res.data.paid_at, "-");
          _this.detail = res.data;
        }
      });
    },
    // 二次确认弹框
    confirm() {
      this.is_show_confirm = true;
    },
    chooseItem() {
      if (
        this.detail.is_effective === 2 ||
        this.detail.non_write_off_item.length === 0
      ) {
        this.$toast.error("订单已完成核销");
        return;
      }
      this.$router.push({
        name: "choose-item",
        query: {
          id: this.detail.trade_order_no,
          code: this.$route.query.id
        }
      });
    },
    // 确认优惠券核销
    couponConfirm() {
      this.$loading.show("加载中");
      Api.setCouponWriteOffApi({
        coupon_code: this.$route.query.id
      }).then(res => {
        this.$loading.hide();
        if (res.code == 0) {
          this.$router.replace({
            name: "WriteOffSuccess",
            query: {
              // id: this.detail.customer_info.customer_id,
              id: res.data.customer_id,
              type: "coupon"
            }
          });
        } else {
          this.$toast.error(res.message);
        }
      });
    },
    // 关闭二次确认弹框
    cancel() {
      this.is_show_confirm = false;
    },
    sure() {
      let _this = this;
      _this.$loading.show("加载中");
      Api.setWriteOffApi({
        write_off_code: _this.$route.query.id
      }).then(res => {
        _this.$loading.hide();
        if (res.code === 0 && res.data.write_off_id) {
          _this.$router.replace({
            name: "WriteOffSuccess",
            query: {
              id: _this.detail.customer.customer_id,
              offId: res.data.write_off_id,
              reservation: _this.detail.purchase_type
            }
          });
        } else if (res.code === 41040) {
          _this.$toast.error(res.message);
        }
      });
    },
    // 格式化使用条件
    formatConditionValue(value) {
      let text = null;
      if (!value) {
        text = "不限制";
      } else {
        text = `满${value / 100}元可用`;
      }
      return text;
    },
    // 格式化优惠券类型
    formatCouponType(type) {
      let text = null;
      switch (type) {
        case 1:
          text = "代金券";
          break;
        case 2:
          text = "兑换券";
          break;
        case 3:
          text = "满减券";
          break;
        case 4:
          text = "折扣券";
          break;
      }
      return text;
    },
    // 使用范围
    formatCouponUseType(type) {
      let text = null;
      switch (type) {
        case 0:
          text = "--";
          break;
        case 1:
          text = "通用";
          break;
        case 2:
          text = "指定分类";
          break;
        case 3:
          text = "指定商品/服务";
          break;
        case 4:
          text = "指定养护卡";
          break;
      }
      return text;
    },
    // 获取优惠券详情
    getCouponDetail() {
      Api.getCouponDetailApi({
        coupon_code: this.$route.query.id
      }).then(res => {
        this.$loading.hide();
        this.is_show_page = true;
        if (res.code === 0) {
          res.data.coupon_detail.start_time = ChangeDateTime2(
            res.data.coupon_detail.start_time,
            "-"
          );
          res.data.coupon_detail.end_time = ChangeDateTime2(
            res.data.coupon_detail.end_time,
            "-"
          );
          this.detail = res.data;
        } else {
          this.$toast.error(res.message, 4000);
        }
      });
    }
  },
  mounted() {
    this.type = this.$route.query.type;
    if (this.$route.query.type === "coupon") {
      this.getCouponDetail();
    } else {
      this.fetchDetail();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.writeOffDetails {
  line-height: 1;
  width: 100%;
  height: 100vh;
  .header {
    padding-left: 16/100rem;
    border-left: 10/100rem solid #4b77b0;
  }
  .user {
    padding: 30/100rem;
    width: 100%;
    height: 222/100rem;
    background-color: #ffffff;
    margin-bottom: 20/100rem;
    &.coupon {
      height: 246/100rem;
      .user-info .right {
        height: 140/100rem;
      }
    }
    .user-info {
      width: 100%;
      height: 100/100rem;
      margin-top: 20/100rem;
      .left {
        width: 100/100rem;
        height: 100/100rem;
        border-radius: 100/100rem;
        margin-right: 56/100rem;
        img {
          width: 100/100rem;
          height: 100/100rem;
          border-radius: 100/100rem;
        }
      }
      .right {
        height: 100/100rem;
        overflow: hidden;
        .name {
          color: #3d424c;
          font-weight: bold;
          padding-top: 12/100rem;
          // line-height: 1.2;
        }
        .phone {
          margin-top: 20/100rem;
          color: #8a92a2;
          line-height: 1;
        }
      }
    }
  }
  .order {
    width: 100%;
    height: auto;
    padding: 30/100rem 0 30/100rem 30/100rem;
    background-color: #ffffff;
    .order-info {
      width: 720/100rem;
      height: auto;
      padding: 30/100rem 30/100rem 30/100rem 0;
      border-bottom: 1px solid #eeeeee;
      .left {
        width: 268/100rem;
        height: 168/100rem;
        position: relative;
        .z-img {
          width: 268/100rem;
          height: 168/100rem;
        }
        .float-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 74/100rem;
          height: 74/100rem;
        }
      }
      .right {
        width: 392/100rem;
        height: auto;
        .good-name {
          line-height: 1.2;
          width: 100%;
          font-weight: bold;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .good-attr {
          line-height: 1.4;
          margin-top: 6/100rem;
          font-weight: bold;
          color: #000000;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .good-price {
          line-height: 1.1;
          margin-top: 43/100rem;
          span:first-child {
            font-weight: bold;
            color: #e50413;
          }
          span:last-child {
            color: #000000;
            padding-top: 8/100rem;
          }
        }
      }
    }
    .order-info:nth-of-type(1) {
      padding-top: 0;
    }
    .order-info:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
  }
  .line {
    width: 100%;
    height: auto;
    margin-top: 20/100rem;
    background-color: #ffffff;
    padding-top: 30/100rem;
    p {
      margin-left: 30/100rem;
    }
    .line-box {
      width: 100%;
      padding: 0 30/100rem;
      height: 132/100rem;
      position: relative;
      border-bottom: 1px solid #eeeeee;
      overflow: hidden;
      .left {
        line-height: 132/100rem;
        color: #8a92a2;
      }
      .right {
        line-height: 132/100rem;
        color: #000000;
      }
      .color-red {
        color: #e50413;
      }
    }
    .line-box:last-child {
      border-bottom: 1px solid #ffffff;
    }
  }
  .hr {
    width: 100%;
    height: 160/100rem;
  }
  .box {
    width: 100%;
    height: auto;
    padding: 0.3rem;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9;
    background: #ffffff;
    &.bg {
      background: #f0eff5;
    }
  }
  .button {
    width: 690/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    text-align: center;
    background-color: #5e7bff;
    color: #ffffff;
    border-radius: 50/100rem;
    box-shadow: 0 2/100rem 20/100rem #5e7bff;
  }
  .coupon-box {
    .coupon-name {
      width: 480/100rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
    }
  }
}
</style>
