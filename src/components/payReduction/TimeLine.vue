<template>
  <div class="top-box">
      <div class="progress-box">
        <div class="progress-line margint-50">
          <span class="num num-active">1</span>
          <span class="line" :class="{'line-active':step>1}"></span>
          <span class="num" :class="{'num-active':step>1}">2</span>
          <span class="line" :class="{'line-active':step>2}"></span>
          <span class="num" :class="{'num-active':step>2}">3</span>
          <span class="line" :class="{'line-active':step>3}"></span>
          <span class="num" :class="{'num-active':step>3}">4</span>
        </div>
        <div class="progress-name">
          <span>确认报名信息</span>
          <span>确认收到物料</span>
          <span>物料拍照</span>
          <span>优惠券配置</span>
        </div>
      </div>
      <div class="detail-btn">
        <span @click="goPage('intro-detail')">&lt; 更多活动详情 &gt;</span>
      </div>
    </div>
</template>
<script>
export default {
  props: ["step"],
  methods: {
    goPage(name) {
      this.$router.push({
        name
      });
    }
  }
};
</script>

<style lang="less" scoped>
// 步骤条
.progress-line {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.8rem;
  .num {
    text-align: center;
    line-height: 0.32rem;
    width: 0.32rem;
    border-radius: 0.32rem;
    font-size: 0.16rem;
    background: #aeb5c5;
    color: #fff;
    font-weight: bold;
  }
  .num-active {
    background: #5e7bff;
  }
  .line {
    height: 2px;
    margin: 0 0.08rem;
    flex: 1;
    background: #aeb5c5;
  }
  .line-active {
    background: #5e7bff;
  }
}
.progress-name {
  display: flex;
  justify-content: space-between;
  font-size: 0.24rem;
  color: #3d424c;
  margin: 0.2rem 0.3rem 0 0.3rem;
  span {
    text-align: center;
    flex: 1;
  }
}

// 顶部步骤条的box
.top-box {
  background: #fff;
  border-radius: 2px;
  .progress-box {
    padding: 0.4rem 0;
  }
  .detail-btn {
    font-size: 0.24rem;
    color: #5e7bff;
    text-align: center;
    line-height: 0.66rem;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
