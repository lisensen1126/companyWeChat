<template>
  <div class="business-tool">
    <div class="tool-banner">
      <img src="../../assets/application/business-tool.png">
    </div>
    <div class="tool-content">
      <div class="tool-item" @click="goVehicle">
        <div class="font-12 tool-item-title">车检帮手</div>
        <div class="font-10 tool-item-text">快速车检高效工作</div>
        <img src="../../assets/application/tool-2.png" alt="">
      </div>
      <div class="tool-item" @click="goRecevice" v-if="authority.YYHXR && authority.YYHXR.hasPermission == 1">
        <div class="font-12 tool-item-title">预约核销</div>
        <div class="font-10 tool-item-text">随时随地手机核销</div>
        <img src="../../assets/application/tool-1.png" alt="">
      </div>
      <div class="tool-item" @click="goPoster">
        <div class="font-12 tool-item-title">裂变海报</div>
        <div class="font-10 tool-item-text">我的海报我做主</div>
        <img src="../../assets/application/tool-poster.png" alt="">
      </div>
      <div class="tool-item" @click="goOfflineBooking">
        <div class="font-12 tool-item-title">线下买单</div>
        <div class="font-10 tool-item-text">开单收款一招搞定</div>
        <img src="../../assets/application/tool-offline.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import AppConfig from "../../app.config.js";
export default {
  name: "businessTool",
  data() {
    return {
      authority: {},               // 权限
    }
  },
  methods: {
    goVehicle() {
      this.$router.push({
        name: "vehicle-assistant"
      });
    },
    goRecevice() {
      this.$router.push({
        name: "bookingList"
      });
    },
    goPoster() {
      this.$router.push({
        name: "poster-list"
      })
    },
    goOfflineBooking() {
      // 从新获取权限
      let url =window.location.origin + '/' + AppConfig.corp_id + '/' + AppConfig.app_identifier + '/offlineIndex'
      window.location.href = url
      // this.$router.push({
      //   name: "OfflineMenu"
      // })
    }
  },
  mounted () {
    this.authority = AppConfig.user.permission
  }
};
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
.tool-banner {
  width: 100%;
  height: 3rem;
  img {
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
