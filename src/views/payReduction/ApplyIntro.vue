<template>
  <div class="apply-intro">
    <div class="bg-fff out-box">
      <div class="box-title with-border">小程序智慧支付红包活动报名</div>
      <div class="box-main" :class="{'android-fix':isAndroid}">
        <div class="tag-blue">活动主题</div>
        <div class="content-gray">小程序智慧支付每周瓜分万元红包，车主百分百中奖（最高88元），门店可获双重奖励</div>
        <div class="tag-blue">车主活动机制</div>
        <div class="content-gray">活动期间，智慧门店需在店内展示“小程序线下收款码”立牌；车主通过小程序支付时(线下扫码或线上支付皆可),可随机获得立减红包；活动期间同一车主（以微信号为准）仅限获得一次红包</div>
        <div class="tag-blue">门店奖励机制</div>
        <div class="content-gray">活动结束后，壳牌将计算店内车主获得的支付红包累计金额，并给到智慧门店同等金额的奖励</div>
        <div class="tag-blue">活动报名时间</div>
        <div class="content-gray">2019年7月8日 - 7月21日</div>
        <div class="tag-blue">活动进行时间</div>
        <div class="content-gray">2019年7月22日 - 9月29日（共10周）</div>
        <div class="tag-blue">参与门店</div>
        <div class="content-gray">800家（按报名顺序，先报先得）</div>
      </div>
      <div class="box-foot">
        <span @click="goPage('intro-detail')"> &lt; 更多活动详情 &gt;</span>
        </div>
    </div>
    <div class="bg-fff out-box padding-40">
      <div class="box-title">点击下方“立即报名”，4步快速参与活动</div>
      <div class="plain-text">吸引新客；连接车主；发券复购；门店双重奖励</div>
      <div class="progress-line margint-50">
        <span class="num num-active">1</span>
        <span class="line line-active"></span>
        <span class="num num-active">2</span>
        <span class="line line-active"></span>
        <span class="num num-active">3</span>
        <span class="line line-active"></span>
        <span class="num num-active">4</span>
      </div>
      <div class="progress-name">
        <span>确认报名信息</span>
        <span>确认收到物料</span>
        <span>物料拍照</span>
        <span>优惠券配置</span>
      </div>
    </div>
    <div class="round-btn" @click="applyNow()">立即报名</div>
  </div>
</template>
<script>
import Api from "@/api/payReduction";
import Mixes from "./mixin/payReductionPublic";
export default {
  mixins: [Mixes],
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
    goPage(name) {
      this.$router.push({
        name
      });
    },
    // 判断当前活动是否开始，如果开始，就跳出提示，并且进入下一步
    popTipAndGoSign() {
      let steps = ["intro", "one", "two", "three", "four", "done"];
      Api.getApplyStatus().then(
        res => {
          this.$loading.hide();
          if (res.code === 0) {
            // 如果已经开始，则弹出提示，否则不弹
            if (res.data.isStart === 1) {
              this.$toast.warning("活动已经开始了，抓紧时间报名！", 1500);
              setTimeout(() => {
                this.$router.push({
                  name: "apply-step-" + steps[res.data.step]
                });
              }, 1500);
            } else {
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
    // 立即报名接口
    applyNow() {
      this.$loading.show("加载中");
      Api.applyCreate().then(
        res => {
          if (res.code === 0) {
            this.popTipAndGoSign();
          } else if (res.code === 41231 || res.code === 41230) {
            // 如果报名的过程中，报名结束，则给出提示并跳到首页
            this.$toast.warning(res.message, 1500);
            setTimeout(() => {
              this.$router.replace({
                path: "/business-manage"
              });
            }, 1500);
          } else if (res.code === 41232) {
            this.$toast.error(res.message, 1500);
            // 如果用户通过链接进入此页面，并且已经报过名，则重新请求获取当前报名步骤接口，并进入正确的页面
            this.goRightPage();
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
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";
@import "./less/popup.less";
.apply-intro {
  padding: 0.3rem 0.3rem 1px 0.3rem;
}
.margint-50 {
  margin-top: 0.5rem;
}
.padding-40 {
  padding-bottom: 0.4rem;
}
</style>
