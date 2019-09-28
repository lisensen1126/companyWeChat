<template>
  <div class="staff-power">
    <div class="tool-banner">
      <img src="../../assets/application/staff-power1.png">
    </div>
    <div class="tool-content">
      <div class="tool-item" @click="goCard">
        <div class="font-12 tool-item-title">发送名片</div>
        <div class="font-10 tool-item-text">展现自己收获机会</div>
        <img src="../../assets/application/tool-card.png" alt="">
      </div>
      <div class="tool-item" @click="goPreferential">
        <div class="font-12 tool-item-title">发送优惠</div>
        <div class="font-10 tool-item-text">送人玫瑰手有余香</div>
        <img src="../../assets/application/tool-coupon.png" alt="">
      </div>
      <div class="tool-item" @click="goStore">
        <div class="font-12 tool-item-title">推广门店</div>
        <div class="font-10 tool-item-text">门店推广人人有责</div>
        <img src="../../assets/application/tool-store.png" alt="">
      </div>
      <div class="tool-item" @click="goEvaluation">
        <div class="font-12 tool-item-title">邀请评价</div>
        <div class="font-10 tool-item-text">优质服务收获好评</div>
        <img src="../../assets/application/tool-ev.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "staffPower",
  data() {
    return {}
  },
  methods: {
    goCard() {
      this.$router.push({
        name: "mycard"
      })
    },
    goPreferential() {
      this.$router.push({
        name: "prefer"
      })
    },
    goEvaluation() {
      this.$router.push({
        name: "invite-evaluation"
      })
    },
    goStore() {
      this.$router.push({
        name: "spread"
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
.tool-banner {
  width: 100%;
  height: 3rem;
  img{
    width: 100%;
    height: 100%;
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
</style>
