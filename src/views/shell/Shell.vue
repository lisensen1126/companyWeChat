<template>
  <div class="shell">
    <img class="img"
         :src="url" />
    <div class="text-center">{{text}}</div>
    <!-- <p><a class="weapp_image_link"
         data-miniprogram-appid="wx354fbe979434a690"
         data-miniprogram-path="pages/index/index"
         data-miniprogram-nickname="车店AI入口商城体验"
         href="javascript:void(0);">车店AI入口商城体验小程序</a></p> -->
  </div>
</template>
<script>
import jianshe from "../../assets/shell_jianshe.png";
export default {
  name: "shell",
  component: {},
  data() {
    return {
      text: "内容正在建设中",
      url: jianshe
    };
  }
};
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
.shell {
  width: 100%;
  height: 100vh;
  font-size: @font-size-base;
  text-align: center;
  .img {
    margin-top: 3.44rem;
    width: 2.4rem;
    height: 2.4rem;
  }
  .text-center {
    text-align: center;
    font-size: 0.24rem;
    color: #3e434d;
  }
}
</style>
