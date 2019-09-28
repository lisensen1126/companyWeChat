<template>
  <div class="check-success">
    <div class="success-content">
      <img src="../../assets/check-success.png" alt="">
      <p class="font-10">完成车辆检测</p>
    </div>
    <div class="footer-btn">
      <button class="btn font-12" @click='goBack()'>返回首页</button>
      <button class="btn primary font-12" @click='goDetail()'>查看车检报告</button>
    </div>
  </div>
</template>
<script>
import Api from "@/api/diagnosisApi";
export default {
  data() {
    return {
    };
  },
  methods: {
    // 返回首页
    goBack() {
      this.$router.go(-1)
    },
    // 查看车检详情
    goDetail() {
      this.$router.replace({
        name: "dialist",
        query: {},
        // replace: true,
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/button.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.success-content{
  text-align: center;
  img{
    width: 2.4rem;
    height: 2.34rem;
    margin-top: 1rem;
  }
  p{
    color: #3E434D;
    margin-top: 0.3rem;
  }
}
.footer-btn{
  padding: 0 0.3rem;
  margin-top: 0.9rem;
  justify-content: space-between;
  .btn{
    width: 3.3rem;
    height: 0.76rem;
    line-height: 0.76rem;
    border-radius: 50px;
    padding: 0;
    background-color: #fff;
    border: 1px solid #5E7BFF;
    color: #5E7BFF;
    &.primary{
      background-color: #5E7BFF;
      color: #fff;
      float: right;
      box-shadow:0px 12px 24px 0px rgba(94,123,255,0.3);
    }
  }
}
</style>