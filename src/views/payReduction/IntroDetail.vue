<template>
  <div class="intro-detail">
    <div class="out-box" :class="{'android-fix':isAndroid}">
      <div class="title-large margin-b10">Part1 活动详情</div>
      <div class="tag-blue">活动主题</div>
      <div class="content-gray">小程序智慧支付每周瓜分万元红包，车主百分百中奖（最高88元），门店可获双重奖励</div>
      <div class="tag-blue">车主活动机制</div>
      <div
        class="content-gray"
      >活动期间，智慧门店需在店内展示“小程序线下收款码”立牌；车主通过小程序支付时(线下扫码或线上支付皆可),可随机获得立减红包；活动期间同一车主(以微信号为准)仅限获得一次红包</div>
      <div class="tag-blue">门店奖励机制</div>
      <div class="content-gray">活动结束后，壳牌将计算店内车主获得的支付红包累计金额，并给到智慧门店同等金额的奖励</div>
      <div class="tag-blue">活动报名时间</div>
      <div class="content-gray">2019年7月8日 - 7月21日</div>
      <div class="tag-blue">活动进行时间</div>
      <div class="content-gray">2019年7月22日 - 9月29日（共10周）</div>
      <div class="tag-blue">参与门店</div>
      <div class="content-gray">800家（按报名顺序，先报先得）</div>
    </div>
    <div class="out-box padding-b1">
      <div class="title-large">Part2 活动Q&A</div>
      <div class="padding-t40 q-n-a">
        <div class="question">Q1：小程序线下支付对智慧门店的好处是什么？</div>
        <div class="answer">
          A1：车主首次扫码付款时需要注册门店小程序，帮助门店最小成本连接车主和集客；门店可在小程序后台清楚看到每位车主的交易时间，订单信息，车辆信息，会员卡信息和车检报告（部分信息需维护才可见）。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q2：车主如何进行小程序线下支付，什么时候获得立减红包？
        </div>
        <div class="answer">
          A2：车主打开微信扫一扫即可，与正常微信支付流程一致；支付环节时车主会获得随机红包，可在本次消费金额里抵扣。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q3：本次支付后如何拉动车主下次到店复购？
        </div>
        <div class="answer">A3：门店可在小程序后台设置“支付有礼”营销活动。车主支付后除了获得本次活动的立减红包，还可获得门店自主设置的小程序优惠券（洗车/换油/轮胎/美容/贴膜等），可供下次消费时使用，拉动车主下次到店复购。</div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q4：门店是否一定要配置“支付有礼”和“评价有礼”营销功能的优惠券，才可参加本次活动？
        </div>
        <div class="answer">
          A4：不是，门店不配置优惠券也可参加活动。我们建议门店在本次活动中加上这些活动，是为了提升车主下次到店复购/转化率，以及增加门店优质评价。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q5：门店双重奖励的机制介绍？
        </div>
        <div class="answer">
          A5：活动期间，车主所得立减红包将由门店暂时承担，门店每天可从企业微信工作台看到本店车主的累计红包金额。同时，门店所获的奖励等于该店车主累计红包金额（例：A门店的车主累计红包金额为1000元，则A门店的奖励金额为1000元。活动结束后门店将获得2000元）。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q6：门店活动奖励如何兑现？
        </div>
        <div class="answer">
          A6：活动结束后（9月29日），壳牌将统计所有参与门店的奖励金额，并通过进货抵扣方式给到所属经销商；经销商将从10月起，通过进货抵扣的方式，把对应的活动奖励金额给到门店。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q7：小程序线下支付的手续费是多少？到账周期？
        </div>
        <div class="answer">
          A7：小程序线下支付与小程序在线支付无区别，手续费为0.38%，T+1天到门店银行账户。
        </div>
      </div>
      <div class="q-n-a">
        <div class="question">
          Q8：活动报名后，壳牌会发哪些线下物料？
        </div>
        <div class="answer">
          A8：1. 小程序支付立牌；2. 活动海报；3. 活动指导手册；以上物料都印制了该智慧门店二维码。
        </div>
      </div>
    </div>
    <div class="round-btn" @click="goBack()">我知道了</div>
  </div>
</template>
<script>
export default {
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
    goBack() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/popup.less";
@import "./less/progress.less";
.intro-img {
  width: 100vw;
}
.round-btn {
  margin: 0 0.3rem 0.4rem 0.3rem;
}
.out-box {
  background: #fff;
  margin: 0.3rem;
  padding-bottom: 0.6rem;
}
.title-large {
  line-height: 1.18rem;
  font-size: 0.32rem;
  font-weight: bold;
  text-align: center;
  background: #637fff;
  color: #fff;
  border-radius: 2px 2px 0 0;
}
.padding-t40 {
  padding-top: 0.4rem;
}
.padding-b1 {
  padding-bottom: 1px;
}
.margin-b10 {
  margin-bottom: 0.1rem;
}
.q-n-a {
  margin: 0.2rem 0.3rem 0.6rem 0.3rem;
  font-size: 0.28rem;
  line-height: 0.42rem;
  .question {
    color: #5e7bff;
  }
  .answer {
    color: #8a92a2;
  }
}
</style>
