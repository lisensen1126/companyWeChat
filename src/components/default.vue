<template>
  <div class="default">
    <img :class="{system: picture == 'system', nodata: picture == 'nodata',nocontent: picture == 'nocontent' }"
         :src="imageUrl"
         alt="">
    <p>{{text}}</p>
  </div>
</template>
<script>
import system from "../assets/default/default.png";
import nodata from "../assets/default/noData.png";
import nocontent from "../assets/default/no_content.png";

export default {
  name: "default",
  props: {
    picture: {
      type: String,
      default: "default"
    },
    text: {
      type: String,
      default: "暂无数据"
    }
  },
  computed: {
    imageUrl() {
      // return this.picture == "system" ? system : nodata;
      return this.picture == "system"
        ? system
        : this.picture == "nodata"
          ? nodata
          : nocontent;
    }
  }
};
</script>

<style lang="less" scoped>
.default {
  width: 100%;
  height: 100vh;
  background: #fff;
  text-align: center;
  padding-top: 3rem;
  box-sizing: border-box;
  img.system {
    width: 3.32rem;
    height: 3.2rem;
  }
  img.nodata {
    width: 2.56rem;
    height: 1.72rem;
    margin-right: 0.45rem;
  }
  p {
    padding-top: 13px;
    font-size: 14px;
    color: #b2b2b2;
  }
}
</style>
