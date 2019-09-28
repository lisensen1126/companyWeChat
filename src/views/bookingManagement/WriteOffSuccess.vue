<template>
  <div class="box-wirte">
    <div class="writeOffDetails">
      <div class="success">
        <p>{{success_text}}</p>
      </div>
      <div class="footer clearfix"
           v-if="card_list.length === 0 || reservation_type == 2 || $route.query.type === 'coupon'">
        <div class="pull-left left font-14"
             @click="goHome">返回首页</div>
        <div class="pull-left right font-14"
             @click="showWriteOffModal">继续核销</div>
      </div>
      <div class="modal"
           v-if="showModal">
        <div class="modal-box">
          <div class="close"
               @click="showWriteOffModal"></div>
          <div class="title font-16">选择核销方式</div>
          <div class="clearfix code">
            <div class="left pull-left"
                 @click="showPhoto">
              <span class="font-12">二维码</span>
            </div>
            <div class="right pull-left">
              <span class="font-12"
                    @click="showInput">核销码</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal"
           v-if="showModalInput">
        <div class="modal-box h-380">
          <div class="close"
               @click="showInput"></div>
          <div class="title font-16">请输入核销码</div>
          <input type="text"
                 placeholder="请输入核销码"
                 v-model="writeoffcode"
                 maxlength="8"
                 autofocus="autofocus">
          <div class="button-sure font-14"
               v-if="writeoffcode.length == 8"
               @click="writeOffSure">立即核销</div>
        </div>
      </div>
    </div>
    <div class="hr"
         v-if="(card_list.length !== 0 && reservation_type == 1) || (card_list.length !== 0 && $route.query.type === 'coupon')"></div>
    <div class="cus-card"
         v-if="(card_list.length !== 0 && reservation_type == 1) || (card_list.length !== 0 && $route.query.type === 'coupon')">
      <div class="cus-card-left">
        <div class="cus-card-thumb">
          <img src="../../assets/card/card-sure.png"
               alt="">
        </div>
        <div class="cus-card-text font-12">用户有保养卡可核销</div>
      </div>
      <div class="go-make-sure"
           @click="goWriteOffCardSure">
        <img src="../../assets/card/card-go.png"
             alt="">
        <div class="font-10">立即核销</div>
      </div>
    </div>
    <div class="hr"
         v-if="reservation_type == 1"></div>
    <div class="line"
         v-if="!is_wirte && reservation_type == 1">
      <div class="header-box">
        <div>
          <p class="header">
            <span class="title">里程录入</span>
            <span>( 非必填 )</span>
          </p>
          <p>完善里程信息，便于提醒车主下次服务</p>
        </div>
        <div>
          <input type="button"
                 value="保存"
                 class="car-btn font-12"
                 @click="saveMileage">
        </div>
      </div>
      <div class="line-box car-info-box">
        <div class="left pull-left font-16">车辆信息</div>
        <div class="right pull-right font-16 back">
          <img v-if="car"
               :src="car.logo"
               alt="">
          <span v-if="!car || typeof car === 'string'"
                style="color: #757575">请选择车辆信息</span>
          <span v-if="car && typeof car !== 'string'">{{car.license_plate}}</span>
          <select name=""
                  id=""
                  class="font-16"
                  v-model="car">
            <option>请选择</option>
            <option :value="item"
                    v-for="(item, index) in car_list"
                    :key="index">
              <img src="item.logo"
                   v-if="item.logo">
              {{item.license_plate}}
            </option>
          </select>
        </div>
      </div>
      <div class="car-info-box">
        <div class="line-box"
             style="border: none">
          <div class="left pull-left font-16">上次保养里程</div>
          <div class="right pull-right font-16">
            <input type="number"
                   placeholder="请输入里程数"
                   class="font-16"
                   v-model="mileage"
                   oninput="if(value.length>8)value=value.slice(0,8)">
            KM
          </div>
        </div>
      </div>
    </div>
    <div class="car-info"
         v-if="is_wirte && reservation_type == 1">
      <p class="font-13">车辆信息</p>
      <div class="car-num">
        <img :src="car.logo">
        <span class="font-14">{{car.license_plate}}</span>
        <span class="font-14 num fl">{{car.mileage}}KM</span>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import CusApi from "../../api/customerApi.js";
export default {
  name: "writeOffSuccess",
  data() {
    return {
      showModal: false,
      showModalInput: false,
      writeoffcode: "",
      car_list: [],
      car: null,
      mileage: "",
      is_wirte: false,
      success_text: "订单核销成功",
      card_list: [],
      reservation_type: null
    };
  },
  methods: {
    // 显示核销弹框
    showWriteOffModal() {
      this.showModal = !this.showModal;
    },
    // 获取用户可核销的养护卡
    getCusCardList() {
      let self = this;
      self.$loading.show("加载中");
      CusApi.getCusCardListApi({
        customer_id: self.$route.query.id
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.card_list = res.data;
        }
      });
    },
    // 核销养护卡
    goWriteOffCardSure() {
      this.$router.replace({
        name: "writeOffCardSure",
        query: {
          customer_id: this.$route.query.id,
          offId: this.$route.query.offId,
          reservation: this.$route.query.reservation
            ? this.$route.query.reservation
            : ""
        }
      });
    },
    // 调起企业微信扫一扫
    showPhoto() {
      let _this = this;
      this.showWriteOffModal(); // 调起企业微信扫一扫的同时关闭选择核销方式弹框
      wx.scanQRCode({
        desc: "scanQRCode desc",
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        // success: function(res) {
        //   _this.writeoffcode = res.resultStr;
        //   _this.$loading.show("加载中");
        //   Api.getAppointmentDetail({
        //     write_off_code: _this.writeoffcode
        //   }).then(res => {
        //     _this.$loading.hide();
        //     if (res.code === 0) {
        //       _this.goWriteOffSure();
        //     } else if (res.code === 100000) {
        //       _this.$toast.error(res.message);
        //     }
        //   });
        // },
        success: function(res) {
          _this.writeoffcode = res.resultStr;
          _this.writeOffSure();
        },
        error: function(res) {
          if (res.errMsg.indexOf("function_not_exist") > 0) {
            console.log("版本过低请升级");
          }
        }
      });
    },
    // 输入核销码
    showInput() {
      this.showModal = false;
      this.showModalInput = !this.showModalInput;
      this.writeoffcode = "";
    },
    /**
     * 输入核销码验证是否存在
     * @flag flag = true; 标志扫码进入
     */
    writeOffSure() {
      let _this = this;
      _this.showModalInput = false;
      _this.$loading.show("加载中");
      if (_this.writeoffcode.substr(0, 2) == "01") {
        Api.getAppointmentDetailApi({
          write_off_code: _this.writeoffcode
        }).then(res => {
          _this.$loading.hide();
          if (res.code === 0) {
            _this.goWriteOffSure();
          } else if (res.code === 100000) {
            _this.$toast.error(res.message);
          }
        });
      } else if (_this.writeoffcode.substr(0, 2) == "02") {
        Api.getCouponDetailApi({
          coupon_code: this.writeoffcode
        }).then(res => {
          _this.$loading.hide();
          if (res.code === 0) {
            this.$router.push({
              name: "WriteOffSure",
              query: {
                id: this.writeoffcode,
                type: "coupon"
              }
            });
          } else {
            _this.$toast.error(res.message, 4000);
          }
        });
      } else {
        _this.$loading.hide();
        _this.$toast.error("请输入正确的核销码");
      }
    },
    // 去往确认核销页面
    goWriteOffSure() {
      this.$router.replace({
        name: "WriteOffSure",
        query: {
          id: this.writeoffcode,
          type: this.tabState
        }
      });
    },
    // 获取客户车辆列表
    fetchList() {
      let _this = this;
      Api.getCustomerCarListApi({
        customer_id: _this.$route.query.id
      }).then(res => {
        if (res.code === 0) {
          this.car_list = res.data;
        }
      });
    },
    // 添加车辆里程
    saveMileage() {
      if (
        (!this.car && this.car_list.length > 0) ||
        typeof this.car === "string"
      ) {
        this.$toast.error("请选择车辆信息！");
        return false;
      }
      if (this.car_list.length === 0) {
        this.$toast.error("该车主在系统中暂无车辆！");
        return false;
      }
      if (!this.mileage) {
        this.$toast.error("请填写车辆里程！");
        return false;
      }
      console.log(typeof this.car);
      this.car.mileage = this.mileage;
      this.car.write_off_record_id = this.$route.query.offId;
      Api.addCarMileage(this.car).then(res => {
        if (res.code === 0) {
          this.is_wirte = true;
        }
      });
    },
    // 返回首页
    goHome() {
      this.$router.replace({
        name: "bookingList"
      });
    }
  },
  mounted() {
    if (this.$route.query.type) {
      if (this.$route.query.type === "coupon") {
        this.success_text = "优惠券核销成功";
      } else {
        this.success_text = "养护卡核销成功";
      }
    }
    // reservation: 购买方式：1 门店，2 平台，3 第三方
    if (this.$route.query.reservation) {
      this.reservation_type = Number(this.$route.query.reservation);
    }
    this.getCusCardList(); // 获取用户可核销的养护卡
    this.fetchList(); // 获取客户车辆列表
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.box-wirte {
  height: 100vh;
  background: #f7f8fa;
  width: 100%;
}
.writeOffDetails {
  line-height: 1;
  width: 100%;
  background: #ffffff;
  padding: 0 0.3rem 0;
  .success {
    width: 100%;
    height: 416/100rem;
    background: url("../../assets/write-success.png") no-repeat center;
    background-size: 180/100rem;
    background-position-y: 70/100rem;
    background-color: #ffffff;
    p {
      padding-top: 280/100rem;
      font-size: 0.36rem;
      font-weight: bold;
      text-align: center;
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3;
    .modal-box {
      width: 630/100rem;
      height: 324/100rem;
      background-color: #ffffff;
      margin-top: 298/100rem;
      margin-left: 60/100rem;
      position: relative;
      .title {
        padding-top: 50/100rem;
        color: #3d424c;
        text-align: center;
        padding-bottom: 40/100rem;
      }
      .close {
        position: absolute;
        top: 26/100rem;
        right: 30/100rem;
        width: 52/100rem;
        height: 52/100rem;
        background: url("../../assets/close-img.png") no-repeat center;
        background-size: 52/100rem;
        z-index: 5;
      }
      .code {
        width: 100%;
        height: 186/100rem;
        text-align: center;
        span {
          display: block;
          color: #8a92a2;
          padding-top: 120/100rem;
        }
        .left {
          height: 186/100rem;
          width: 50%;
          background: url("../../assets/img-code.png") no-repeat center;
          background-size: 86/100rem;
          background-position-y: 10/100rem;
        }
        .right {
          height: 186/100rem;
          width: 50%;
          background: url("../../assets/img-tiao.png") no-repeat center;
          background-size: 86/100rem;
          background-position-y: 10/100rem;
        }
      }
      input {
        width: 438/100rem;
        height: 80/100rem;
        background-color: #f9f9f9;
        margin: 0 auto;
        margin-left: 96/100rem;
        text-align: center;
      }
      .button-sure {
        width: 216/100rem;
        height: 76/100rem;
        line-height: 76/100rem;
        text-align: center;
        background-color: #5e7bff;
        color: #ffffff;
        display: block;
        margin: 0 auto;
        border-radius: 76/100rem;
        margin-top: 50/100rem;
      }
    }
    .h-380 {
      height: 380/100rem;
    }
  }
}
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 130/100rem;
  font-size: 0.24rem;
  .header {
    margin-bottom: 20/100rem;
    padding-left: 16/100rem;
    border-left: 10/100rem solid #4b77b0;
    .title {
      font-size: 0.32rem;
      color: #000;
    }
  }
  .car-btn {
    margin-right: 30/100rem;
    width: 140/100rem;
    height: 60/100rem;
    line-height: 66/100rem;
    text-align: center;
    background-color: #ffffff;
    color: #5e7bff;
    border: 1px solid #5e7bff;
    border-radius: 76/100rem;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding-bottom: 70/100rem;
  .left {
    width: 320/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    text-align: center;
    background-color: #ffffff;
    color: #5e7bff;
    border-radius: 76/100rem;
    border: 1px solid #5e7bff;
    font-size: 0.28rem;
  }
  .right {
    width: 320/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    text-align: center;
    background-color: #5e7bff;
    color: #ffffff;
    border-radius: 76/100rem;
    font-size: 0.28rem;
  }
}
.line {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  padding-top: 30/100rem;
  padding-bottom: 50/100rem;
  p {
    margin-left: 30/100rem;
    color: #8a92a2;
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
    .back {
      background: url("../../assets/arrow_right.png") no-repeat center;
      background-position-x: 372/100rem;
      background-size: 23/100rem 30/100rem;
    }
    .right {
      line-height: 132/100rem;
      color: #000000;
      position: relative;
      width: 400/100rem;
      text-align: right;
      img {
        width: 60/100rem;
        height: 60/100rem;
        vertical-align: middle;
        margin-right: 20/100rem;
        visibility: hidden;
      }
      span {
        margin-right: 38/100rem;
      }
      select {
        position: absolute;
        right: 0;
        top: 0;
        width: 175/100rem;
        height: 132/100rem;
        opacity: 0;
      }
      input {
        width: 300/100rem;
        text-align: right;
      }
    }
    .color-red {
      color: #e50413;
    }
  }
  .line-box:last-child {
    border-bottom: 1px solid #ffffff;
  }
}
.box-wirte {
  width: 100%;
  min-height: 100vh;
  // background-color: #ffffff;
}
.hr {
  width: 100%;
  height: 30/100rem;
  background-color: #f7f8fa;
}
.car-info {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  padding-bottom: 50/100rem;
  p {
    padding-left: 30/100rem;
    padding-top: 40/100rem;
    padding-bottom: 36/100rem;
    font-weight: bold;
    color: #000000;
  }
  .car-num {
    width: 100%;
    height: 60/100rem;
    line-height: 60/100rem;
    color: #000000;
    vertical-align: middle;
    img {
      width: 60/100rem;
      height: 60/100rem;
      vertical-align: middle;
      margin-left: 30/100rem;
      margin-right: 20/100rem;
    }
    span {
      vertical-align: middle;
    }
    .num {
      color: #8a92a2;
      float: right;
      margin-right: 30/100rem;
    }
  }
}
.cus-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0.26rem 0.6rem;
  width: 100%;
  height: 1.28rem;
  box-sizing: border-box;
  // border: 1px solid #eeeeee;
  background: #ffffff;
  .cus-card-left {
    display: flex;
    align-items: center;
    .cus-card-text {
      color: #404040;
      font-weight: 400;
      margin-left: 0.2rem;
    }
  }
  .cus-card-thumb {
    width: 0.76rem;
    height: 0.76rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .go-make-sure {
    text-align: center;
    img {
      width: 0.4rem;
      height: 0.4rem;
    }
    .font-10 {
      color: #5e7bff;
      margin-top: 0.06rem;
      line-height: 1;
    }
  }
}
.car-info-box .font-16 {
  font-size: 0.28rem;
}
</style>
