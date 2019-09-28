<template>
  <div class="apply-done">
    <div class="out-box-done">
      <img class="done-icon" src="../../assets/application/write-success.png">
      <div class="bold">报名成功</div>
      <div class="plain-text">您已成功报名支付立减活动</div>
      <div class="plain-text">活动将于2019年7月22日开启，敬请期待！</div>
      <div class="detail" @click="goIntroDetail()">
        &lt; 更多活动详情 &gt;
      </div>
    </div>
    <div class="round-btn" @click="confirm()">我知道了</div>
  </div>
</template>
<script>
import Mixes from "./mixin/payReductionPublic";
export default {
  mixins: [Mixes],
  methods: {
    confirm() {
      this.updateInfo({ step: 5 }, "business-manage");
    },
    goIntroDetail() {
      this.$router.push({
        name: "intro-detail"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";
.out-box-done {
  background: #fff;
  text-align: center;
  padding-top: 0.7rem;
  .done-icon {
    width: 1.8rem;
    height: 1.8rem;
  }
  .bold {
    font-weight: bold;
    color: #3d424c;
    font-size: 0.36rem;
    margin-top: 0.3rem;
    margin-bottom: 0.4rem;
  }
  .plain-text {
    line-height: 0.42rem;
    color: #8a92a2;
    font-size: 0.28rem;
  }
  .detail {
    font-size: 0.24rem;
    color: #5e7bff;
    line-height: 0.64rem;
    margin-top: 0.4rem;
    border-top: 1px solid #f0f0f0;
  }
}
.round-btn {
  position: absolute;
  bottom: 0;
  left: 0.3rem;
  right: 0.3rem;
}
</style>
