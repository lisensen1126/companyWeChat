<template>
  <div class="my-card-new font-PC-re">
    <div class="card-content" id="targetDom">
      <img class="card-bg" src="../../assets/card/code-bg.png" alt="">
      <div class="card-avater">
        <img :src="cardInfo.local_head_image?cardInfo.local_head_image:defaultHeader" :onerror="defaultHeader" alt="">
      </div>
      <div class="card-title">
        <span class="card-name font-14">{{cardInfo.user_name}}</span>
        <span class="card-job font-10">{{cardInfo.name}}</span>
      </div>
      <div class="card-store font-10" v-if="cardInfo.store_info">{{cardInfo.store_info.store_name}}</div>
      <div class="card-code">
        <img class="or_code_size" v-if="firstFinish" :src="cardInfo.local_code_image?cardInfo.local_code_image:defaultQRcode" :onerror="defaultQRcode" alt="">
      </div>
      <!-- <div class="card-tip">
        <span>一</span><span class="font-8">微信扫码加为好友</span><span>一</span>
      </div> -->
    </div>
    <div class="card-footer"
         v-if="userIdentifier == 1">
      <div class="card_common pull-left"
           @click="onMenuShareWechat()">
        <img class="pic_common"
             src="@/assets/weixin.png"
             alt="">
        <div class="font-12 gray-8a line-height-1 m-t-10">发送到微信</div>
      </div>
      <div class="card_common pull-right"
           @click="downloadPicture()">
        <img class="pic_common"
             src="@/assets/download_save.png"
             alt="">
        <div class="font-12 gray-8a line-height-1 m-t-10">保存到相册</div>
      </div>
    </div>
    <div class="modal-container"
         v-if="isShowModal"
         style="text-align: center;"
         @click="cancelModal()">
      <div class="image-box">
        <img id="pointer"
             class="dowloadImage"
             :src="dataURL"
             alt="">
      </div>
      <div class="image-tip">
        <span class="font-PC-re">长按图片保存到相册</span>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/cardApi";
import html2canvas from "html2canvas";
import AppConfig from "../../app.config.js";
import defaultHeader from "../../assets/defualt_head.png";
import defaultQRcode from "../../assets/defualt_qrcode.png";

export default {
  name: "myCardNew",
  data() {
    return {
      isShowModal: false,
      cardInfo: {},
      memUid: "",
      firstFinish: false,
      userIdentifier: 0,
      defaultHeader: defaultHeader,
      defaultQRcode: defaultQRcode,
    };
  },
  methods: {
    getQRCode: function() {
      let self = this;
      self.$loading.show("加载中");
      let params = {};
      if (AppConfig.user.member && AppConfig.user.member.memUid) {
        self.userIdentifier = 1;
      } else {
        params.memUid = self.memUid;
        self.userIdentifier = 2;
      }
      Api.getQRCode(params).then(
        function(data) {
          self.$loading.hide();
          self.firstFinish = true;
          if (data.data && data.code == 0 && data.status == 200) {
            self.cardInfo = data.data;
          }
        },
        function(err) {
          console.log(err, params);
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    relayQRCode: function() {
      Api.relayQRCode({
        type: 5
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
    getRequest() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    onMenuShareWechat: function() {
      let self = this;
      let link =
        location.protocol +
        "//" +
        location.host +
        "/" +
        AppConfig.corp_id +
        "/" +
        AppConfig.app_identifier +
        "/mycard?memUid=" +
        self.memUid;
      console.log(link);
      wx.showOptionMenu();
      wx.invoke(
        "shareWechatMessage",
        {
          title: "递上一张名片",
          desc: "打开链接识别二维码加我为好友",
          link: link,
          imgUrl: self.cardInfo.local_head_image
        },
        function(res) {
          if (res.err_msg == "shareWechatMessage:ok") {
            self.relayQRCode();
          }
        }
      );
    },
    downloadPicture() {
      let self = this;
      self.$loading.show("生成图片中");
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
          // allowTaint: true
        }).then(canvas => {
          canvas.className = "canvas";
          var dataURL = canvas.toDataURL("image/png");
          self.dataURL = dataURL;
          self.isShowModal = true;
          self.$loading.hide();
        });
      }, 2000);
    },
    cancelModal() {
      this.isShowModal = false;
    }
  },
  created() {
    let self = this;
    self.urlQuery = self.getRequest();
    if (
      AppConfig.user.hasOwnProperty("member") &&
      AppConfig.user.member.hasOwnProperty("memUid") &&
      AppConfig.user.member.memUid
    ) {
      self.memUid = AppConfig.user.member.memUid;
    }
    if (self.urlQuery.hasOwnProperty("memUid")) {
      self.$route.meta.title = "我的名片";
      self.memUid = self.urlQuery.memUid;
    }
    self.getQRCode();
  },
  watch: {
    listener: function() {
      var t;
      var pointer = document.querySelector("#pointer");
      var cancelTimeout = function() {
        if (t) {
          clearTimeout(t);
          t = null;
        }
      };
      pointer.addEventListener("touchstart", function(e) {
        t = setTimeout(function() {
          alert("2s!");
          cancelTimeout();
        }, 2000);
        e.preventDefault();
        return false;
      });
      pointer.addEventListener("touchend", cancelTimeout);
      pointer.addEventListener("touchcancel", cancelTimeout);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";

.my-card-new {
  width: 100%;
  height: 100vh;
  background: #F2F3F3;
  position: relative;
  padding-top: 0.52rem;
  .card-content{
    width: 6.4rem;
    height: 9rem;
    margin: 0 auto;
    position: relative;
    // position: absolute;
    // left: 50%;
    // top: 44%;
    // transform: translate(-50%, -50%);
    .card-bg{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .card-avater{
    position: absolute;
    top: 1.76rem;
    left: 2.42rem;
    width: 1.56rem;
    height: 1.56rem;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .card-title{
    text-align: center;
    vertical-align: bottom;
    position: absolute;
    width: 100%;
    left: 0;
    top: 3.56rem;
    .card-name{
      font-weight: 300;
      color: #F2CC8F;
      margin-right: 0.1rem;
      line-height: 1;
    }
    .card-job{
      font-weight: 300;
      color: #F2CC8F;
      line-height: 1;
    }
  }
  .card-store{
    font-weight: 300;
    color: #F2CC8F;
    position: absolute;
    width: 100%;
    left: 0;
    top: 4.16rem;
    line-height: 1;
    text-align: center;
  }
  .card-code{
    width: 100%;
    text-align: center;
    position: absolute;
    left: 0;
    top: 4.88rem;
    img{
      width: 2rem;
      height: 2rem;
    }
  }
  .card-tip{
    color: #948369;
    width: 100%;
    left: 0;
    top: 7.34rem;
    .font-8{
      margin: 0 0.06rem;
    }
  }
  .card-footer {
    position: absolute;
    left: 0;
    bottom: 0.88rem;
    width: 100%;
    .card_common {
      width: 50%;
      text-align: center;
      .pic_common {
        width: 0.56rem;
        height: 0.56rem;
      }
    }
  }
  .dowloadImage {
    width: 100%;
  }
  .image-box {
    margin-top: 1.62rem;
    margin-left: 1.04rem;
    margin-right: 1.04rem;
  }
  .image-tip {
    margin-top: 1.38rem;
    margin-bottom: 1.04rem;
    span {
      width: 100%;
      text-align: center;
      font-size: 0.36rem;
      line-height: 0.5rem;
      color: #ffffff;
    }
  }
}
</style>
