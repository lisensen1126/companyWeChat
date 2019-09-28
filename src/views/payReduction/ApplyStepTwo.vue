<template>
  <div class="apply-step-two">
    <TimeLine step="2"/>
    <div class="step-desc">
      <div>
        <span class="round-num">2</span>
        <span class="desc">确认收到物料</span>
      </div>
    </div>

    <div class="submit-done">
      <div class="img-wrapper">
        <img src="../../assets/application/submit-done.png" alt>
      </div>
      <div class="done-title">报名信息提交成功</div>
      <div class="done-text">{{apply_info.contacts}}您好，报名信息已收到，我们将在2个工作日内处理收款码、海报等物料制作，并安排物流寄送，请注意查收物流信息。如有疑问，可在自己店的智慧门店微信客服群咨询客服。</div>
    </div>

    <div class="submited-info">
      <div class="info-item">
        <span>门店名称</span>
        <div class="right-value">{{apply_info.store_name}}</div>
      </div>
      <div class="info-item">
        <span>联系人姓名</span>
        <div class="right-value">{{apply_info.contacts}}</div>
      </div>
      <div class="info-item">
        <span>联系人手机</span>
        <div class="right-value">{{apply_info.mobile}}</div>
      </div>
      <div class="info-item">
        <span>所在地区</span>
        <div class="right-value">{{apply_info.province_name + " " + apply_info.city_name + " "+ apply_info.area_name}}</div>
      </div>
      <div class="info-item multi-line">
        <span>详细地址：</span>
        <div class="right-value">{{apply_info.address}}</div>
      </div>
    </div>
    <div class="round-btn" @click="confirm()">我确认已收到物料</div>
  </div>
</template>
<script>
import TimeLine from "@/components/payReduction/TimeLine.vue";
import Api from "@/api/payReduction";
import Mixes from "./mixin/payReductionPublic";
export default {
  mixins: [Mixes],
  components: {
    TimeLine
  },
  data() {
    return {
      // 用户填写的报名信息
      apply_info: {}
    };
  },
  mounted() {
    this.getApplyInfo();
  },
  methods: {
    // 获取报名信息
    getApplyInfo() {
      this.$loading.show("加载中");
      Api.getApplyInfo().then(
        res => {
          this.$loading.hide();
          if (res.code === 0) {
            this.apply_info = res.data;
          } else if (res.code === 41231 || res.code === 41230) {
            // 如果报名的过程中，报名结束，则给出提示并跳到首页
            this.$toast.warning(res.message, 1500);
            setTimeout(() => {
              this.$router.replace({
                path: "/business-manage"
              });
            }, 1500);
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
    confirm() {
      this.updateInfo({ step: 2 }, "apply-step-three");
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";

.submit-done {
  background: #fff;
  margin: 0.3rem;
  border-radius: 2px;
  padding-bottom: 0.4rem;
  .img-wrapper {
    text-align: center;
    padding-top: 0.3rem;
    img {
      width: 2.4rem;
      height: 2.34rem;
    }
  }
  .done-title {
    margin-top: 0.3rem;
    font-size: 0.36rem;
    color: #3e434d;
    text-align: center;
    font-weight: bold;
  }
  .done-text {
    text-indent: 0.48rem;
    color: #8a92a2;
    font-size: 0.24rem;
    line-height: 0.34rem;
    margin: 0.3rem 0.4rem 0 0.4rem;
  }
}
.submited-info {
  background: #fff;
  border-radius: 2px;
  margin: 0 0.3rem;
  .info-item {
    height: 1rem;
    padding: 0 0.3rem;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: #3d424c;
      font-size: 0.28rem;
      margin-left: 0.3rem;
    }
    .right-value {
      text-align: right;
      font-size: 0.28rem;
      color: #8a92a2;
      word-break: break-all;
      margin-right: 0.3rem;
    }
  }
  .multi-line {
    border-bottom: none;
    height: 1.7rem;
    span {
      align-self: flex-start;
      margin-top: 0.33rem;
    }
    .right-value {
      border: none;
      height: 0.96rem;
      outline: none;
      text-align: right;
      font-size: 0.28rem;
      line-height: 0.32rem;
      color: #8a92a2;
      flex: 1;
      margin-left: 0.16rem;
    }
  }
}
.round-btn {
  margin: 0.4rem 0.3rem !important;
}
.apply-step-two {
  padding-bottom: 1px;
}
</style>
