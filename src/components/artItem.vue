<template>
  <div class="listBox font-PC-re">
    <div class="avatar">
      <img :src="item.header_image?item.header_image:defaultHeader"
           alt="">
    </div>
    <div class="username">
      <span v-text="item.customer_name?item.customer_name:'暂无昵称'"></span><img v-if="item.relation_tag === 1"
           :src="iconVip"
           alt="">
    </div>
  </div>
</template>

<script>
import defaultHeader from "../assets/default_header.png";
import iconVip from "../assets/icon_vip.png";

export default {
  name: "listItem",
  props: {
    item: Object
  },
  data() {
    return {
      defaultHeader: defaultHeader,
      iconVip: iconVip
    };
  }
};
</script>

<style lang="less" scoped>
@import "../less/config/mixins/border.less";
@import "../less/base/utilities.less";
@import "../less/base/base.less";
@import "../less/base/margin.less";
.listBox {
  overflow: hidden;
  padding: 0.29rem 0;
  .avatar {
    float: left;
    width: 0.72rem;
    height: 0.72rem;
    img {
      width: 0.72rem;
      height: 0.72rem;
    }
  }
  .username {
    float: left;
    padding-left: 0.2rem;
    font-size: 18px;
    line-height: 0.72rem;
    color: #353535;
    img {
      margin-left: 0.3rem;
      width: 0.4rem;
      height: 0.4rem;
      vertical-align: middle;
    }
  }
}
</style>
