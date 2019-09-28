<template>
  <div class="support-detail">
    <div class="support-title font-16" v-text="info.name"></div>
    <div class="support-time font-12" v-text="info.open_time"></div>
    <div class="support-content font-14" v-html="info.content"></div>
  </div>
</template>
<script>
import Api from "@/api/operationSupport.js"
export default {
  name: "supportDetail",
  component: {},
  data() {
    return {
      info: {
        name: '',
        open_time: '',
        content: ''
      }
    }
  },
  methods: {
    // 获取详情数据
    getDetail() {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getBrandArticleDetailApi({
        id: _this.$route.query.id
      }).then(res => {
        _this.$loading.hide();
        if (res.code === 0) {
          res.data.open_time = _this.formartDate1("yyyy-MM-dd hh:mm:ss",res.data.open_time)
          _this.info = res.data;
        }
      });
    },
    // 时间格式化
    formartDate1 (fmt, date) {
      if ((date + "").length === 10) {
        date = new Date(Number(date) * 1000);
      } else {
        date = new Date(Number(date));
      }
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
  },
  mounted() {
    this.getDetail()
  }
};
</script>
<style lang="less">
@import "../../less/base/utilities.less";
.support-detail{
  width: 100%;
  min-height: 100vh;
  background: #fff;
  padding: 0.3rem;
  box-sizing: border-box;
  .support-title{
    color: #3D424C;
    font-weight: bold;
  }
  .support-time{
    color: #3D424C;
    font-weight: 400;
    margin-top: 0.2rem;
  }
  .support-content{
    color: #3D424C;
    font-weight: 400;
    margin-top: 0.3rem;
    word-break: break-all;
    p {
      word-break: break-all;
    }
    img{
      width: 100%;
    }
  }
}
</style>
