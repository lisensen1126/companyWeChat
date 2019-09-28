<template>
  <div class="writeOffDetails font-PC-re" v-if="is_show_page">
    <div class="box">
      <!--订单详情-->
      <div class="order" v-for="(item, index) in detail.non_write_off_item" :key="index">
        <div class="order-info clearfix">
          <div class="left pull-left">
            <img v-if="item.item_type == 1" class="float-img" src="../../assets/img-goods.png" alt="">
            <img v-if="item.item_type == 2" class="float-img" src="../../assets/img-service.png" alt="">
            <img class="z-img" :src="item.image_url" alt="">
          </div>
          <div class="right pull-right">
            <div class="good-name font-13" v-if="item">{{item.item_title}}</div>
            <div class="good-attr font-13" v-if="item && item.sku_attribute.length > 0">{{item.sku_attribute.toString().replace(/,/g, ' ')}}</div>
            <div class="good-attr font-13" v-if="item && item.sku_attribute.length == 0">--</div>
            <div class="good-price clearfix">
              <span class="pull-left font-18">
                ￥{{item.unit_price/100}}
              </span>
            </div>
          </div>
        </div>
        <div class="order-info-bottom">
          <div class="order-info-bottom-title font-12">核销次数 (剩余{{item.non_write_off_quantity - item.value}}次)</div>
          <div class="single-card-right">
            <div class="reduc font-16" :class="item.value <= 0 ? 'active' : ''" @click="reduc(item)">
              <img src="../../assets/card/reduc.png" alt="">
            </div>
            <div type="number" v-text="item.value" class="number-input font-14"></div>
            <div class="add font-16" :class="item.value == item.non_write_off_quantity ? 'active' : ''" @click="add(item)">
              <img src="../../assets/card/add.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <again-confirm-item :list="confrim_item" @cancel="cancel" @confirm="sure" v-if="is_show_confirm"></again-confirm-item>
    <div class="button-box">
      <div class="button font-14" :class="is_show_active ? '' : 'active'" @click="confirm">
        确认核销
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import AgainConfirmItem from "./modal/AgainConfirmItem.vue";
export default {
  name: "ChooseItem",
  components: {
    AgainConfirmItem,
  },
  data() {
    return {
      is_code: this.$route.query.code,
      type: '',
      is_show_page: false,
      is_show_confirm: false,
      detail: {
        item: [],
        reserve: {},
        payment: {},
        customer: {},
        order: {},
      },
      confrim_item: [],
      is_show_active: false,
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
          let arr = res.data.non_write_off_item.filter(ele => ele.non_write_off_quantity != 0)
          if (arr.length === 1) {
            res.data.non_write_off_item.forEach(ele => {
              if (arr[0].item_id == ele.item_id && ele.non_write_off_quantity == 1) {
                ele.value = 1
                _this.is_show_active = true
              } else {
                ele.value = 0
              }
            })
          } else {
            res.data.non_write_off_item.forEach(ele => {
              ele.value = 0
            })
          }
          this.detail = res.data
        }
      });
    },
    // 二次确认弹框
    confirm() {
      if (!this.is_show_active) {
        return
      }
      let arr = this.detail.non_write_off_item.filter(ele => ele.value > 0)
      this.confrim_item = arr
      this.is_show_confirm = true
    },
    // 关闭二次确认弹框
    cancel() {
      this.is_show_confirm = false
    },
    add(item) {
      if (item.value == item.non_write_off_quantity) {
        return
      }
      item.value++
      let arr = this.detail.non_write_off_item.filter(ele => ele.value > 0)
      if (arr.length > 0) {
        this.is_show_active = true
      } else {
        this.is_show_active = false
      }
    },
    reduc(item) {
      if (item.value <= 0) {
        return
      }
      item.value--
      let arr = this.detail.non_write_off_item.filter(ele => ele.value > 0)
      if (arr.length > 0) {
        this.is_show_active = true
      } else {
        this.is_show_active = false
      }
    },
    sure() {
      let _this = this;
      let write_off_item = []
      _this.detail.non_write_off_item.forEach(ele => {
        if (ele.value > 0) {
          write_off_item.push({
            trade_order_item_id: ele.trade_order_item_id,
            write_off_count: ele.value,
          })
        }
      })
      _this.$loading.show("加载中");
      Api.setWriteOffApi({
        write_off_code: _this.$route.query.code,
        write_off_item: write_off_item,
      }).then(res => {
        _this.$loading.hide();
        if (res.code === 0 && res.data.write_off_record_id) {
          _this.$router.replace({
            name: 'WriteOffSuccess',
            query: {
              id: _this.detail.customer.customer_id,
              offId: res.data.write_off_record_id,
              reservation: _this.detail.purchase_type
            }
          });
        } else if(res.code === 41040) {
          _this.$toast.error(res.message)
        }
      });
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
  padding-bottom: 1.36rem;
  .order{
    width: 100%;
    height: auto;
    background-color: #ffffff;
    margin-bottom: 0.2rem;
    .order-info{
      width: 100%;
      padding: 0.3rem;
      height: auto;
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
        }
        .good-attr{
          line-height: 1.4;
          margin-top: 6/100rem;
          font-weight: bold;
          color: #000000;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .good-price{
          line-height: 1.1;
          margin-top: 43/100rem;
          span{
            font-weight:bold;
            color: #E50413;
          }
        }
      }
    }
    .order-info-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 1.2rem;
      padding: 0 0.3rem;
      .order-info-bottom-title{
        color: #3D424C;
        font-weight: 400;
      }
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
  .single-card-right{
    display: flex;
    align-items: center;
    width: auto;
    height: 0.56rem;
    border: 1px solid #F7F7F7;
    .reduc{
      width: 0.56rem;
      height: 0.56rem;
      position: relative;
      img{
        width: 0.2rem;
        height: 0.2rem;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
    }
    .add{
      width: 0.56rem;
      height: 0.56rem;
      position: relative;
      img{
        width: 0.2rem;
        height: 0.2rem;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
      }
    }
    .number-input{
      width: 0.96rem;
      height: 100%;
      background: #F7F7F7;
      color: #404040;
      border: none;
      line-height: 0.56rem;
      text-align: center;
    }
    .active{
      img{
        opacity: 0.25;
      }
    }
  }
  .button-box{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 0.3rem;
    background: #ffffff;
    z-index: 2;
    .button{
      width: 690/100rem;
      height: 76/100rem;
      line-height: 76/100rem;
      text-align: center;
      background-color: #5E7BFF;
      color: #ffffff;
      border-radius: 50/100rem;
      box-shadow: 0 2/100rem 20/100rem #5E7BFF;
      &.active{
        background: #AEB5C5;
        color: #ffffff;
        box-shadow: 0 0 0;
      }
    }
  }
}
</style>
