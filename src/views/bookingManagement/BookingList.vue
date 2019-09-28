<template>
  <div class="bookingList font-PC-re">
    <div class="header">
      <div class="search"
           @click="goSearch">
        <span class="blod"></span>
        <span class="font-13 search-phone">手机号</span>
      </div>
      <div class="tab">
        <div class="left font-13"
             :class="{'active': item.id == tabState}"
             v-for="(item, index) in tabList"
             @click="tabClick(item)"
             :key="index">
          {{item.name}}
          <span></span>
        </div>
      </div>
    </div>
    <div class="pos">
      <scroller ref="myscroller"
                :on-infinite="infinite"
                v-if="artList.length && artList.length > 0">
        <div class="list">
          <template v-for="(item,index) in artList">
            <div class="list-item"
                 :key="index"
                 @click.stop="goDetail(item.trade_order_no)">
              <div class="item-oder">
                <div class="left pull-left font-12">
                  订单编号: {{item.trade_order_no}}
                </div>
                <div class="right pull-right font-12">
                  <span v-if="item.status == 2">待核销</span>
                  <span v-else
                        class="default">已核销</span>
                </div>
              </div>
              <div class="user-info">
                <div class="left pull-left">
                  <img :src="item.customer.avatar"
                       alt="">
                </div>
                <div class="right pull-left">
                  <div class="name font-18">{{item.customer.real_name}}</div>
                  <div class="phone font-12">手机号：{{item.customer.mobile}}</div>
                </div>
              </div>
              <div class="line-item"
                   v-if="tabState == 2 || tabState == 4">
                <div class="left pull-left font-14">预约时间</div>
                <div class="right pull-right font-14">{{item.reserve_time}}</div>
              </div>
              <div class="line-item"
                   v-if="tabState == 2 || tabState == 4">
                <div class="left pull-left font-14">预约门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div>
              <div class="line-item"
                   v-if="tabState == 3">
                <div class="left pull-left font-14">核销时间</div>
                <div class="right pull-right font-14">{{item.write_off_at}}</div>
              </div>
              <!-- <div class="line-item" v-if="tabState == 3">
                <div class="left pull-left font-14">核销门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div> -->
              <div class="line-item"
                   v-if="tabState == 3 && item.operator">
                <div class="left pull-left font-14">核销人</div>
                <div class="right pull-right font-14">{{item.operator}}</div>
              </div>
              <div class="line-item"
                   v-if="tabState == 1">
                <div class="left pull-left font-14">下单时间</div>
                <div class="right pull-right font-14">{{item.created_at}}</div>
              </div>
              <div class="line-item"
                   v-if="tabState == 1">
                <div class="left pull-left font-14">下单门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div>
            </div>
          </template>
        </div>
      </scroller>
      <div class="empty"
           v-if="artList.length === 0 && init">
        <span class="font-12">暂无数据～</span>
      </div>
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
               maxlength="13"
               autofocus="autofocus">
        <div class="button-sure font-14"
             v-if="writeoffcode.length >= 8"
             @click="writeOffSure">立即核销</div>
      </div>
    </div>
    <div class="button font-14"
         @click="showWriteOffModal"
         v-if="authority.YYHXO && authority.YYHXO.hasPermission == 1">
      去核销
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
import cusApi from "../../api/customerApi.js";
import AppConfig from "../../app.config.js";
export default {
  name: "BookingList",
  data() {
    return {
      page: 1,
      pageSize: 20,
      showData: false,
      showModal: false,
      showModalInput: false,
      writeoffcode: "",
      init: false,
      tabList: [
        {
          name: "已预约",
          id: 2
        },
        {
          name: "未预约",
          id: 1
        },
        {
          name: "已核销",
          id: 3
        },
        {
          name: "预约过期",
          id: 4
        }
      ],
      artList: [],
      tabState: 2,
      authority: {} // 权限
    };
  },
  methods: {
    // 获取列表数据
    getList(done) {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getAppointmentList({
        page: _this.page,
        per_page: _this.pageSize,
        reserve_status: _this.tabState
      }).then(res => {
        _this.$loading.hide();
        _this.init = true;
        if (res.code === 0) {
          if (res.meta) {
            if (res.meta.current_page == 1) {
              _this.artList = res.data;
              done && done();
            } else if (res.meta.current_page !== 1) {
              res.data.forEach(element => {
                _this.artList.push(element);
              });
              // _this.$refs.myscroller.resize();
            }
            if (res.meta.current_page == res.meta.last_page) {
              _this.showData = true;
              done && done();
            } else {
              done && done();
            }
          }
        }
      });
    },
    // 上拉加载
    infinite(done) {
      if (this.showData) {
        done(true);
        return;
      }
      this.page++;
      this.getList(done);
    },
    // tab切换
    tabClick(params) {
      this.init = false;
      this.tabState = params.id;
      this.artList = [];
      this.page = 1;
      this.showData = false;
      this.pageSize = 20;
      this.getList();
    },
    // 显示核销弹框
    showWriteOffModal() {
      this.showModal = !this.showModal;
    },
    // 调起企业微信扫一扫
    showPhoto() {
      let _this = this;
      this.showWriteOffModal(); // 调起企业微信扫一扫的同时关闭选择核销方式弹框
      wx.scanQRCode({
        desc: "scanQRCode desc",
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
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
    // 去往订单详情
    goDetail(id) {
      this.$router.push({
        name: "WriteOffDetails",
        query: {
          id: id,
          type: this.tabState
        }
      });
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
            _this.$toast.error(res.message, 4000);
          } else {
            _this.$toast.error(res.message, 4000);
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
      } else if (
        (_this.writeoffcode.substr(0, 2) == "03" &&
          _this.writeoffcode.toLocaleUpperCase().indexOf("VIP") === -1) ||
        _this.writeoffcode.toLocaleUpperCase().indexOf("VIP") !== -1
      ) {
        cusApi
          .getWriteCardOffApi({
            upkeep_no:
              _this.writeoffcode.toLocaleUpperCase().indexOf("VIP") !== -1
                ? _this.writeoffcode
                : "VIP" + _this.writeoffcode
          })
          .then(res => {
            _this.$loading.hide();
            if (res.code === 0) {
              _this.goWriteOffCard();
            } else {
              _this.$toast.error(res.message, 4000);
            }
          });
      } else {
        _this.$loading.hide();
        _this.$toast.error("请输入正确的核销码/卡号");
      }
    },

    // 去往确认核销页面
    goWriteOffSure() {
      this.$router.push({
        name: "WriteOffSure",
        query: {
          id: this.writeoffcode,
          type: this.tabState
        }
      });
    },
    goWriteOffCard() {
      this.$router.push({
        name: "writeOffCard",
        query: {
          id: this.writeoffcode
        }
      });
    },
    // 去搜索页面
    goSearch() {
      this.$router.push({
        name: "WriteOffSearch",
        query: {
          type: this.tabState
        }
      });
    }
  },
  mounted() {
    this.authority = AppConfig.user.permission;
    this.getList();
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.bookingList {
  line-height: 1;
  width: 100%;
  height: 100vh;
  position: relative;
  .pos {
    width: 100%;
    min-height: 80vh;
    position: relative;
    .list {
      padding: 0 30/100rem;
      .list-item {
        margin-top: 20/100rem;
        width: 100%;
        height: auto;
        background-color: #ffffff;
        border-radius: 4/100rem;
        .item-oder {
          height: 104/100rem;
          padding: 30/100rem 30/100rem 0 30/100rem;
          .left {
            color: #8a92a2;
          }
          .right {
            span {
              color: #5e7bff;
            }
            .default {
              color: #8a92a2;
            }
          }
        }
        .user-info {
          width: 100%;
          height: 100/100rem;
          padding-left: 30/100rem;
          margin-bottom: 20/100rem;
          .left {
            width: 100/100rem;
            height: 100/100rem;
            border-radius: 100/100rem;
            background-color: #5e7bff;
            margin-right: 30/100rem;
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
              max-width: 5.1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              // line-height: 1.2;
            }
            .phone {
              margin-top: 20/100rem;
              color: #8a92a2;
              line-height: 1;
            }
          }
        }
        .line-item {
          line-height: 100/100rem;
          height: 100/100rem;
          position: relative;
          padding: 0 30/100rem;
          &:after {
            .Pseudo-border-before(#f0f0f0);
          }
          .left {
            color: #3d424c;
          }
          .right {
            color: #8a92a2;
          }
        }
      }
    }
  }
  .header {
    width: 100%;
    height: 200/100rem;
    background-color: #ffffff;
    border-top: 1/100rem solid transparent;
    .search {
      width: 690/100rem;
      height: 70/100rem;
      line-height: 70/100rem;
      margin: 0 auto;
      margin-top: 20/100rem;
      border: 1px solid #3d424c;
      border-radius: 4/100rem;
      background: url("../../assets/search-img.png") no-repeat center;
      background-position-x: 20/100rem;
      background-size: 28/100rem 26/100rem;
      .blod {
        margin-left: 66/100rem;
        float: left;
        height: 22/100rem;
        width: 1px;
        margin-top: 22/100rem;
        background-color: #3d424c;
      }
      .search-phone {
        float: left;
        margin-left: 16/100rem;
        color: rgba(61, 66, 76, 0.3);
      }
    }
    .tab {
      width: 100%;
      height: 90/100rem;
      margin-top: 20/100rem;
      color: #8a92a2;
      font-weight: bold;
      .left {
        width: 187/100rem;
        height: 90/100rem;
        line-height: 90/100rem;
        text-align: center;
        float: left;
        position: relative;
        span {
          width: 36/100rem;
          height: 4/100rem;
          position: absolute;
          left: 75/100rem;
          bottom: 0;
          background-color: transparent;
        }
      }
      .active {
        color: #3d424c;
        span {
          background-color: #5e7bff;
        }
      }
    }
  }
  .button {
    position: fixed;
    left: 30/100rem;
    bottom: 40/100rem;
    width: 690/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    text-align: center;
    background-color: #5e7bff;
    color: #ffffff;
    border-radius: 50/100rem;
    box-shadow: 0 2/100rem 20/100rem #5e7bff;
    z-index: 1000;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
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
  .empty {
    width: 100%;
    height: 576/100rem;
    background: url("../../assets/img-empty.png") no-repeat center;
    background-size: 240/100rem;
    background-position-y: 280/100rem;
    span {
      display: block;
      text-align: center;
      padding-top: 550/100rem;
      color: #3e434d;
    }
  }
  .pull-right {
    max-width: 4.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
