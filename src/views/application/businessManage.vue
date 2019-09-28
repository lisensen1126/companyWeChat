<template>
  <div class="business-manage" :class="{'height100':show_modal}">
    <div class="tool-banner">
      <img src="../../assets/application/staff-power2.png" />
    </div>
    <div class="tool-notice" @click="goNotice" v-if="noctice_data">
      <div class="txt">
        <span class="l-b">通知</span>
        <span class="m-350">{{noctice_data}}</span>
      </div>
      <div class="notice-num font-10" v-if="count > 0">{{count > 99 ? '99+' : count}}</div>
      <div class="go-page">
        <img src="../../assets/application/right-icon.png" alt />
      </div>
    </div>
    <div class="tool-content">
      <div
        class="tool-item"
        @click="goResults"
        v-if="authority.YJKBR && authority.YJKBR.hasPermission == 1"
      >
        <div class="font-12 tool-item-title">业绩看板</div>
        <div class="font-10 tool-item-text">实时掌握店内生意</div>
        <img src="../../assets/application/tool-kanban.png" alt />
      </div>
      <div class="tool-item" @click="goRank">
        <div class="font-12 tool-item-title">技师排名</div>
        <div class="font-10 tool-item-text">技师评比榜上有名</div>
        <img src="../../assets/application/tool-rank.png" alt />
      </div>
      <div
        class="tool-item"
        @click="goEvaluation"
        v-if="authority.KHPJR && authority.KHPJR.hasPermission == 1"
      >
        <div class="font-12 tool-item-title">客户评价</div>
        <div class="font-10 tool-item-text">客户评价及时回复</div>
        <img src="../../assets/application/tool-evaluate.png" alt />
      </div>
      <div class="tool-item" @click="goManage">
        <div class="font-12 tool-item-title">客户管理</div>
        <div class="font-10 tool-item-text">您随身的客户档案</div>
        <img src="../../assets/application/tool-mange.png" alt />
      </div>
      <div class="tool-item" @click="goApplyIntro">
        <div class="font-12 tool-item-title flex-b-c">
          <span>支付红包活动</span>
          <img
            class="question"
            @click.stop="showModal(true)"
            src="../../assets/application/question.png"
            alt
          />
        </div>
        <div class="font-10 tool-item-text">每周万元红包100%中奖</div>
        <div class="font-10 tool-item-text">(最高88元),门店双重奖励</div>
        <img src="../../assets/application/pay-reduction.png" alt />
      </div>
    </div>
    <div class="pay-reduction-modal" v-if="show_modal">
      <div class="modal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <span>小程序智慧支付红包活动介绍</span>
          <img @click="showModal(false)" src="../../assets/application/close2.png" />
        </div>
        <div class="bg-fff out-box">
          <div class="box-main" :class="{'android-fix':isAndroid}">
            <div class="tag-blue">活动主题</div>
            <div class="content-gray">小程序智慧支付每周瓜分万元红包，车主百分百中奖（最高88元），门店可获双重奖励</div>
            <div class="tag-blue">车主活动机制</div>
            <div class="content-gray">活动期间，智慧门店需在店内展示“小程序线下收款码”立牌；车主通过小程序支付时(线下扫码或线上支付皆可),可随机获得立减红包；活动期间同一车主(以微信号为准)仅限获得一次红包</div>
            <div class="tag-blue">门店奖励机制</div>
            <div class="content-gray">活动结束后，壳牌将计算店内车主获得的支付红包累计金额，并给到智慧门店同等金额的奖励</div>
            <div class="tag-blue">活动报名时间</div>
            <div class="content-gray">2019年7月8日 - 7月21日</div>
            <div class="tag-blue">活动进行时间</div>
            <div class="content-gray">2019年7月22日 - 9月29日（共10周）</div>
            <div class="tag-blue">参与门店</div>
            <div class="content-gray">800家（按报名顺序，先报先得）</div>
            <div class="content-gray tag-title">Q1：小程序线下支付对智慧门店的好处是什么？</div>
            <div class="content-gray m-t-0">A1：车主首次扫码付款时需要注册门店小程序，帮助门店最小成本连接车主和集客；门店可在小程序后台清楚看到每位车主的交易时间，订单信息，车辆信息，会员卡信息和车检报告（部分信息需维护才可见）；</div>
            <div class="content-gray tag-title">Q2：车主如何进行小程序线下支付，什么时候获得立减红包？</div>
            <div class="content-gray m-t-0">A2：车主打开微信扫一扫即可，与正常微信支付流程一致；支付环节时车主会获得随机红包，可在本次消费金额里抵扣；</div>
            <div class="content-gray tag-title">Q3：本次支付后如何拉动车主下次到店复购？</div>
            <div class="content-gray m-t-0">A3：门店可在小程序后台设置“支付有礼”营销活动。车主支付后除了获得本次活动的立减红包，还可获得门店自主设置的小程序优惠券（洗车/换油/轮胎/美容/贴膜等），可供下次消费时使用，拉动车主下次到店复购；</div>
            <div class="content-gray tag-title">Q4：门店是否一定要配置“支付有礼”和“评价有礼”营销功能的优惠券，才可参加本次活动？</div>
            <div class="content-gray m-t-0">A4：不是，门店不配置优惠券也可参加活动。我们建议门店在本次活动中加上这些活动，是为了提升车主下次到店复购/转化率，以及增加门店优质评价。</div>
            <div class="content-gray tag-title">Q5：门店双重奖励的机制介绍？</div>
            <div class="content-gray m-t-0">A5：活动期间，车主所得立减红包将由门店暂时承担，门店每天可从企业微信工作台看到本店车主的累计红包金额。同时，门店所获的奖励等于该店车主累计红包金额（例：A门店的车主累计红包金额为1000元，则A门店的奖励金额为1000元。活动结束后门店将获得2000元）。</div>
            <div class="content-gray tag-title">Q6：门店活动奖励如何兑现？</div>
            <div class="content-gray m-t-0">A6：活动结束后（9月29日），壳牌将统计所有参与门店的奖励金额，并通过进货抵扣方式给到所属经销商；经销商将从10月起，通过进货抵扣的方式，把对应的活动奖励金额给到门店；</div>
            <div class="content-gray tag-title">Q7：小程序线下支付的手续费是多少？到账周期？</div>
            <div class="content-gray m-t-0">A7：小程序线下支付与小程序在线支付无区别，手续费为0.38%，T+1天到门店银行账户；</div>
            <div class="content-gray tag-title">Q8：活动报名后，壳牌会发哪些线下物料？</div>
            <div class="content-gray m-t-0 m-b-30">A8：1. 小程序支付立牌；2. 活动海报；3. 活动指导手册；以上物料都印制了该智慧门店二维码；</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/messageApi";
import Api_ from "@/api/payReduction";
import AppConfig from "../../app.config.js";
export default {
  name: "businessManage",
  data() {
    return {
      AppConfig,
      noctice_data: "",
      count: 0,
      authority: {}, // 权限
      show_modal: false // 是否显示支付立减弹窗
    };
  },
  computed: {
    isAndroid() {
      let u = navigator.userAgent;
      if (u.indexOf("Android") > -1 || u.indexOf("Adr") > -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    goResults() {
      this.$router.push({
        name: "achieveIndex"
      });
    },
    goRank() {
      this.$router.push({
        name: "rank"
      });
    },
    goEvaluation() {
      this.$router.push({
        name: "customer-evaluation"
      });
    },
    goManage() {
      this.$router.push({
        name: "customer-new"
      });
    },
    // 前往立减页面
    goApplyIntro() {
      this.$loading.show("加载中");
      // 根据接口返回值来确定跳转的页面，此数组的内容的支付立减的name结尾值
      let steps = ["intro", "one", "two", "three", "four", "done"];
      Api_.getApplyStatus().then(
        res => {
          this.$loading.hide();
          if (res.code === 0) {
            // 如果活动已经开始，且已经报名成功，则跳到业绩看板
            if (res.data.isStart === 1 && res.data.step === 5) {
              this.$router.push({
                name: "achieveIndex"
              });
            } else {
              // 如果报名未开始，或者报名未完成，则跳到报名对应页面
              this.$router.push({
                name: "apply-step-" + steps[res.data.step]
              });
            }
          } else if (res.code === 41230) {
            // 如果在点击的时候，报名尚未开始，给出提示
            this.$toast.warning(res.message, 1500);
          } else if (res.code === 41231) {
            // 如果在点击的时候，报名已经结束，跳转到业绩看板
            this.$router.push({
              name: "achieveIndex"
            });
          } else if (res.code === 41230) {
            // 如果在点击的时候，报名尚未开始，给出提示
            this.$toast.warning(res.message, 1500);
          } else if (res.code === 41231) {
            // 如果在点击的时候，报名已经结束，跳转到业绩看板
            this.$router.push({
              name: "achieveIndex"
            });
          } else {
            this.$router.replace({
              path: "/error",
              query: {
                msg: res.message
              }
            });
          }
        },
        err => {
          this.$loading.hide();
          this.$router.replace({
            path: "/error",
            query: {
              msg: err
            }
          });
        }
      );
    },
    goNotice() {
      this.$router.push({
        name: "message-notice"
      });
    },
    getList() {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getMessageList().then(
        res => {
          _this.$loading.hide();
          if (res.code === 0) {
            this.count = res.data.count;
            if (res.data.info.id) {
              this.noctice_data = res.data.info.title;
            } else {
              this.noctice_data = "暂无通知";
            }
          } else {
            _this.$router.replace({
              path: "/error",
              query: { msg: res.message }
            });
          }
        },
        function(err) {
          _this.$loading.hide();
          _this.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    showModal(show) {
      this.show_modal = show;
    }
  },
  mounted() {
    this.authority = AppConfig.user.permission;
    this.getList();
  }
};
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
@import "../payReduction/less/popup.less";
.out-box {
  // max-height: 9rem;
  overflow: scroll;
  height: calc(100% - 62px);
}
.bg-fff {
  border-radius: 0 !important;
}

.tool-banner {
  width: 100%;
  height: 3rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.tool-notice {
  width: 6.9rem;
  height: 0.76rem;
  line-height: 0.76rem;
  background: white;
  margin: 0 auto;
  margin-top: 0.3rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.3rem;
  .go-page {
    margin-top: 0.18rem;
    img {
      width: 0.32rem;
      height: 0.32rem;
    }
  }
  .txt {
    color: #3d424c;
    font-size: 0.18rem;
    display: flex;
    justify-content: start;
    .l-b {
      color: #4b77b0;
      font-size: 0.32rem;
      margin-right: 0.2rem;
      font-weight: bold;
    }
    .m-350 {
      width: 4rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 28/100rem;
    }
  }
}
.tool-content {
  padding: 0.3rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .tool-item {
    width: 3.34rem;
    height: 2.86rem;
    background: #ffffff;
    position: relative;
    margin-bottom: 0.3rem;
    img {
      width: 100%;
      height: 1.72rem;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  .tool-item-title {
    color: #3d424c;
    font-weight: bold;
    line-height: 1;
    margin-top: 0.3rem;
    margin-left: 0.3rem;
  }
  .tool-item-text {
    color: #9ea1a7;
    font-weight: 400;
    line-height: 1;
    margin-left: 0.3rem;
    margin-top: 0.1rem;
  }
}
.notice-num {
  float: right;
  min-width: 36/100rem;
  height: 36/100rem;
  line-height: 28/100rem;
  text-align: center;
  background-color: #eb5342;
  color: #ffffff;
  border-radius: 36/100rem;
  margin-top: 20/100rem;
  padding: 4/100rem;
}
.flex-b-c {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.question {
  width: 0.28rem !important;
  height: 0.28rem !important;
  position: static !important;
  margin-right: 0.2rem;
}
.pay-reduction-modal {
  .modal {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  .modal-content {
    z-index: 1000;
    position: fixed;
    height: 85vh !important;
    top: 0.8rem;
    left: 0.3rem;
    right: 0.3rem;
    bottom: 0.8rem;
    overflow: hidden;
    border-radius: 0 0 2px 2px;
    margin: 0 auto !important;
    // background: transparent;
    .modal-header {
      position: relative;
      line-height: 0.44rem;
      padding: 0.5rem 0 0.3rem 0;
      text-align: center;
      color: #ffffff;
      font-size: 0.32rem;
      background: #4b77b0;
      font-weight: bold;
      margin: 0;
      img {
        position: absolute;
        right: 0.32rem;
        top: 0.3rem;
        width: 0.5rem;
        height: 0.5rem;
      }
    }
    .modal-text {
      background: #fff;
      padding: 0.3rem 0.6rem 0.6rem 0.6rem;
      color: #3d424c;
      font-size: 0.24rem;
    }
  }
}
.height100 {
  max-height: 100vh;
  overflow: hidden;
}
.box-main {
  padding-top: 0.1rem;
  border-bottom: none !important;
}
</style>
