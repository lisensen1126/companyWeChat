<template>
  <div class="header-title">
    <h3 class="font-14">{{title}}</h3>
    <div class="content-box">
      <p class="font-10 content">更换里程：{{info.exchange_mile}}KM  检测里程：{{info.inspect_mile}}KM</p>
      <p class="font-10 content">检测提示：{{title_content}}</p>
    </div>
  </div>
</template>
<script>
/**
 * @description 车检流程 开始车检的项目title
 */
export default {
  name: "HeaderTitle",
  props: {
    title: String,
    title_content: String,
    info: Object,
  },
  methods: {
    
  },
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.header-title{
  width: 100%;
  padding: 0.3rem;
  border-bottom: 1px solid #F0F0F0;
}
.content-box{
  margin-top: 0.1rem;
}
.font-14{
  color: #3D424C;
  font-weight: bold;
}
.content{
  color: #8BB1FF;
  word-break: break-all;
}
</style>
