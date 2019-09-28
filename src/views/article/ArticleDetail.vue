<template>
  <div class="articleDetail font-PC-re">
    <div ref="count">
      <div class="article-content">
        <div class="font-16 black-3d font-PC-sd content-title">{{articleContent.title}}</div>
        <div class="font-14 black-3d font-PC-sd line-height-1 m-t-24 m-b-10">{{articleContent.brand_name}}</div>
        <div class="font-12 gray-8a font-PC-sd line-height-1">{{articleContent.created_at}}</div>
      </div>
      <div class="article-detail position-relative font-15 font-PC-lg black-3d"
           v-html="articleContent.content">
      </div>
      <div>
        <div class="bottom-share bg-ef"
             ref="isFooterShowShare"
             v-if="!workWx && isShow">
          <!-- 左半部 -->
          <div class="share-info pull-left color-3d">
            <div class="font-16 line-height-1 font-PC-sd">{{shareInfo.store_name}}</div>
            <div class="font-14 share-address m-t-10 m-b-10">地址：{{shareInfo.address}}</div>
            <div class=" font-14">电话：{{shareInfo.business_phone}}</div>
          </div>
          <!-- 右半部 -->
          <div class="char-code pull-right m-t-14">
            <img :src="shareInfo.qr_code?shareInfo.qr_code:defaultHeader"
                 alt="">
          </div>
        </div>
      </div>
    </div>
    <div v-if="(isShowShare && !workWx) && (shareInfo && shareInfo.store_name.length > 0)">
      <div class="bottom-share-fixed bg-24"
           ref="footer">
        <!-- 左半部 -->
        <div class="share-info pull-left"
             :class="isFooter?'white':'color-3d'">
          <div class="font-16 line-height-1 font-PC-sd">{{shareInfo.store_name}}</div>
          <div class="font-14 share-address m-t-10 m-b-10">地址：{{shareInfo.address}}</div>
          <div class=" font-14">电话：{{shareInfo.business_phone}}</div>
        </div>
        <!-- 右半部 -->
        <div class="char-code pull-right m-t-14">
          <img :src="shareInfo.qr_code?shareInfo.qr_code:defaultHeader"
               alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import temporaryPictures from "../../assets/avatar.jpeg";
import defaultHeader from "../../assets/default_header.png";
import Api from "../../api/articleApi";
// import ApiCommon from "../../api/commonApi"
import { ChangeDate } from "./DateTimes.js";
import AppConfig from "../../app.config.js";
export default {
  name: "articleDetail",
  data() {
    return {
      articleContent: {},
      shareInfo: {},
      defaultHeader: defaultHeader,
      isShowShare: false,
      isFooter: true,
      html: "<h1>这是一个富文本标签<h1>",
      newsID: "",
      uid: "",
      link: "",
      box: "",
      workWx: false,
      clientHeight: 0,
      domHeight: 0,
      footerHeight: 0,
      scrollTop: 0,
      FooterHeight: 0,
      t1: null,
      t2: null,
      isShow: false
    };
  },
  mounted() {
    let self = this;
    self.isShow = false;
    var meUid = this.$router.currentRoute.query.uid;
    this.workWx = navigator.userAgent.indexOf("wxwork") > -1 ? true : false;
    if (meUid !== undefined) {
      this.uid = meUid;
    } else {
      if (
        AppConfig.user.hasOwnProperty("member") &&
        AppConfig.user.member.hasOwnProperty("memUid") &&
        AppConfig.user.member.memUid
      ) {
        this.uid = AppConfig.user.member.memUid;
      }
    }
    self.clientHeight =
      window.innerHeight || document.documentElement.clientHeight;
    self.newsID = this.$router.currentRoute.query.id;
    self.getDetail();
  },
  methods: {
    isScrollEnd: function() {
      let self = this;
      self.t2 = document.documentElement.scrollTop || document.body.scrollTop;
      if (self.t2 == self.t1) {
        self.isShowShare = true;
      }
    },
    relayQRCode: function() {
      let self = this;
      Api.relayQRCode({
        id: self.newsID
      }).then(
        function(data) {
          if (data.data && data.code == 0 && data.status == 200) {
            console.log("分享记录成功 : + 1");
          } else {
            console.log("分享记录失败");
          }
        },
        function() {
          console.log("网络错误!");
        }
      );
    },
    getDetail() {
      var self = this;
      let link =
        location.protocol +
        "//" +
        location.host +
        "/" +
        AppConfig.corp_id +
        "/" +
        AppConfig.app_identifier +
        "/article-detail?id=" +
        self.newsID +
        "&uid=" +
        self.uid;
      self.$loading.show("加载中");
      var ID_data = {
        id: self.newsID
      };
      var Uid_data = {
        id: self.newsID,
        uid: self.uid
      };
      Api.getArticleDetail(this.uid ? Uid_data : ID_data).then(
        res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.articleContent = res.data;
            self.articleContent.created_at = ChangeDate(
              self.articleContent.created_at
            );
            if (res.data.store_info !== undefined) {
              self.isShow = true;
              self.isShowShare = true;
              self.shareInfo = res.data.store_info;
            }
            console.log("分享文章链接+++" + link);
            // 用户确认分享后执行的回调函数
            try {
              wx.onMenuShareWechat({
                title: self.articleContent.title, // 分享标题
                desc: self.articleContent.mini_title, // 分享描述
                link: link, // 分享链接
                imgUrl: self.articleContent.head_img, // 分享图标
                success: function() {
                  self.relayQRCode();
                  console.log("yes message");
                },
                cancel: function() {
                  console.log("yeah message");
                }
              });
              wx.onMenuShareAppMessage({
                title: self.articleContent.title, // 分享标题
                desc: self.articleContent.mini_title, // 分享描述
                link: link, // 分享链接
                imgUrl: self.articleContent.head_img, // 分享图标
                success: function() {
                  self.relayQRCode();
                  console.log("yes message");
                },
                cancel: function() {
                  console.log("yeah message");
                }
              });
              if (self.workWx) {
                // 企业微信打开
                wx.onMenuShareTimeline(
                  {
                    title: self.articleContent.title, // 分享标题
                    link: link, // 分享链接
                    imgUrl: self.articleContent.head_img
                  },
                  function(res) {
                    if (res.err_msg == "onMenuShareTimeline:ok") {
                      self.relayQRCode();
                    }
                  }
                );
              }
            } catch (err) {
              console.log("详情调用微信转发try catch error++" + err);
              //在这里处理错误
            }
            setTimeout(function() {
              // 动态获取 DOM元素 高度
              self.domHeight = self.$refs.count.clientHeight;
              self.footerHeight = self.$refs.footer.clientHeight;

              if (self.domHeight > self.clientHeight) {
                self.scollFlag = true;
              }
              let timer = null;
              document.addEventListener("scroll", function() {
                let scrollTop =
                  document.documentElement.scrollTop || document.body.scrollTop;
                self.FooterHeight = self.$refs.isFooterShowShare.clientHeight;
                if (
                  scrollTop + self.clientHeight >=
                  document.documentElement.scrollHeight - self.FooterHeight
                ) {
                  self.isShowShare = false;
                  return false;
                }
                if (self.domHeight + self.footerHeight >= self.clientHeight) {
                  self.isShowShare = false;
                  clearTimeout(timer);
                  timer = setTimeout(self.isScrollEnd, 500);
                  self.t1 = scrollTop || document.body.scrollTop;
                }
              });
            }, 300);
          }
        },
        function(err) {
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  }
};
</script>
<style lang="less">
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/base/position.less";
.articleDetail {
  width: 100%;
  min-height: 100vh;
  background: #fff;
  .article-content {
    padding: 0.4rem;
    .content-title {
      min-height: 0.48rem;
      line-height: 0.48rem;
    }
  }
  .article-detail {
    padding: 0.02rem 0.4rem 0.4rem 0.4rem;
    width: 100% !important;
    p {
      width: 100% !important;
      img {
        width: 100% !important;
      }
    }
  }
  .bottom-share-fixed {
    position: fixed;
    z-index: 1000;
    bottom: 0;
    width: 100%;
    height: 2.36rem;
    padding: 0.2rem 0.4rem;
  }
  .bottom-share {
    height: 2.9rem;
    width: 100%;
    padding: 0.4rem;
  }
  .share-info {
    width: 4.26rem;
  }
  .share-address {
    height: 0.88rem;
    line-height: 0.44rem;
  }
  .color-3d {
    color: #3d424c;
  }
  .char-code {
    width: 1.68rem;
    height: 1.68rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bg-24 {
    background: #24262a;
    opacity: 0.7997;
  }
  .bg-ef {
    background: #eff0f2;
  }
}
</style>
