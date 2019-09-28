<template>
  <div class="goods-record font-PC-re">
    <div class="order" v-for="(item, index) in detail.write_off_record" :key="index">
      <div class="order-item">
        <div class="order-title font-14">核销项目</div>
        <div class="order-goods flex" v-for="(v, i) in item.write_off_item " :key="i">
          <div class="order-goods-title font-14">{{v.item.item_title}}{{v.item.sku_attribute.toString()}}</div>
          <div class="order-num font-14">x{{v.write_off_count}}</div>
        </div>
      </div>
      <div class="order-item flex">
        <div class="order-title font-14">核销时间</div>
        <div class="order-name font-14">{{item.write_off_at}}</div>
        <!-- <div class="order-name font-14">{{item.write_off_at | date("yyyy/MM/dd hh:ss", "cn")}}</div> -->
      </div>
      <div class="order-item flex" v-if="item.write_off_store_name">
        <div class="order-title font-14">核销门店</div>
        <div class="order-name font-14">{{item.write_off_store_name}}</div>
      </div>
      <div class="order-item flex order-item-active">
        <div class="order-title font-14">核销人</div>
        <div class="order-name font-14">{{item.operator}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import { ChangeDateTime } from "../article/DateTimes.js";
export default {
  name: "GoodsRecord",
  components: {},
  data() {
    return {
      detail: {}
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
        _this.is_show_page = true;
        if (res.code === 0) {
          res.data.write_off_record.forEach(ele => {
            ele.write_off_at = ChangeDateTime(ele.write_off_at, "-")
          });
          this.detail = res.data;
        }
      });
    }
  },
  mounted() {
    this.fetchDetail();
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.goods-record {
  width: 100%;
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .order {
    margin-bottom: 0.2rem;
    background: #ffffff;
    .order-item {
      padding: 0.5rem 0.3rem;
      border-bottom: 1px solid #eeeeee;
    }
    .order-item-active {
      border-bottom: 0;
    }
  }
  .order-title {
    color: #8a92a2;
    max-width: 1.78rem;
  }
  .order-name {
    color: #000;
    max-width: 5.12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .order-goods {
    margin-top: 0.5rem;
    .order-goods-title {
      max-width: 5.98rem;
      overflow: hidden;
      color: #000;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
