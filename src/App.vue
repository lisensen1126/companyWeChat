<template>
  <div>
    <keep-alive>
      <router-view v-if="this.$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!this.$route.meta.keepAlive" />
  </div>
</template>

<script>
import Vue from "vue";
import { ToastPlugin, LoadingPlugin, AlertPlugin } from "vux";
import store from './vuex/store'
import AppConfig from "./app.config";
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
Vue.use(AlertPlugin);

export default {
  name: "app",
  store,
  created() {
    /**
     * 企业信息和应用信息解析，实现中间页面跳转 app_identifier=cddaily
     * http://xxxx.xxx.com/app_identifier/{页面路由}?corpid=xxxxxxx
     */
    // let self = this;
    // let params = this.$route.query;
    // // if(!AppConfig.corpid){
    // //   console.log('企业参数配置错误：corpid为空。<br>请联系管理员');
    // // }
    // // 如果不包含code,是用户打开,需要获得用户信息
    // // 如果参数里面包含code,说明是微信授权返回
    // if (params.hasOwnProperty("code") && !!params.code) {
    //   this.getCodeLogin(params.code);
    // } else {
    //   Api.getLogin({
    //     redirect_uri: window.location.href,
    //     url: window.location.href
    //   }).then(function(res) {
    //     if (res.code === 0) {
    //       if (res.data.auth_url) {
    //         if (process.env.NODE_ENV !== "dev") {
    //           window.location.replace(res.data.auth_url);
    //         } else {
    //           debugger;
    //           return false;
    //         }
    //       } else {
    //         // 回调
    //         self.loginHandle(res.data);
    //       }
    //     } else {
    //       if (res.code) {
    //         self.$router.push({ path: "/error", query: { code: res.code } });
    //         return;
    //       }
    //       console.log("登陆失败");
    //     }
    //   });
    // }
  },
  mounted() {
    if(AppConfig.isLogin) this.$store.dispatch('synchronizeStores');
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/1px.less";
.swiper-pagination-customs {
  width: 0.32rem ;
  height: 0.04rem;
  background: #D2D2D2;
  margin-left: 0.1rem;
  display: inline-block;
  margin: 0 0.1rem;
} 
.swiper-pagination-customs-active{
  background: #5E7BFF;
}
</style>
