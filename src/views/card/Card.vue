<template>
  <div class="myCard font-PC-re">
    <div class="card-info"
         id="targetDom">
      <!-- 上半部 -->
      <div class="card-bg-pic">
        <div class="head-portrait">
          <img v-if="firstFinish"
               :src="cardInfo.local_head_image?cardInfo.local_head_image:defaultHeader"
               :onerror="defaultHeader"
               alt="">
        </div>
        <div class="head-info clearfix">
          <div class="font-24 black-3d font-PC-sd line-height-1 pull-left">{{cardInfo.user_name}}</div>
          <div class="pull-left font-12 option">{{cardInfo.name}}</div>
        </div>
        <div class="font-14 store-name" v-if="cardInfo.store_info">{{cardInfo.store_info.store_name}}</div>
      </div>
      <div class="middle-line"></div>
      <!-- 下半部 -->
      <div class="or_code">
        <div class="block-height">
          <img class="or_code_size"
               v-if="firstFinish"
               :src="cardInfo.local_code_image?cardInfo.local_code_image:defaultQRcode"
               :onerror="defaultQRcode"
               alt="">
        </div>
        <div class="font-12 gray-8a line-height-1 m-t-40">{{tip}}</div>
      </div>
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
import defaultQRcode from "../../assets/defualt_qrcode.png";
import defaultHeader from "../../assets/defualt_head.png";

import Api from "@/api/cardApi";
import html2canvas from "html2canvas";
import AppConfig from "../../app.config.js";

export default {
  name: "myCard",
  data() {
    return {
      isShowModal: false,
      cardInfo: {},
      tips: ["出示给客户，面对面扫码加你好友", "长按识别加好友"],
      tip: "出示给客户，面对面扫码加你好友",
      defaultHeader: defaultHeader,
      defaultQRcode: defaultQRcode,
      memUid: "",
      firstFinish: false,
      userIdentifier: 0
    };
  },
  methods: {
    getQRCode: function() {
      let self = this;
      self.$loading.show("加载中");
      let params = {};
      if (AppConfig.user.member && AppConfig.user.member.memUid) {
        self.tip = self.tips[0];
        self.userIdentifier = 1;
      } else {
        self.tip = self.tips[1];
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
        "/card?memUid=" +
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
      self.tip = self.tips[1];
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
          // allowTaint: true
        }).then(canvas => {
          canvas.className = "canvas";
          var dataURL = canvas.toDataURL("image/png");
          self.dataURL = dataURL;
          self.isShowModal = true;
          self.tip = self.tips[0];
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

.myCard {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
  padding-top: 0.68rem;
  .card-info {
    // margin: 0.68rem 0.36rem 1.98rem;
    margin: 0 0.36rem;
    background: #fff;
    box-shadow: 0px 22px 44px 0px rgba(49, 50, 66, 0.11);
    border-radius: 6px;
    .card-bg-pic {
      width: 6.78rem;
      height: 3.96rem;
      background: url("../../assets/card_bg.png") no-repeat 100% 100%;
      position: relative;
      .head-portrait {
        width: 1rem;
        height: 1rem;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .head-info {
        position: absolute;
        top: 2.38rem;
        left: 0.4rem;
      }
    }
    .middle-line {
      position: relative;
      // padding: 0.3rem;
      // overflow: hidden;
      &:after {
        .Pseudo-border-after(#f0f0f0);
        height: 2px;
      }
    }
    .block-height {
      min-height: 3.36rem;
    }
    .or_code {
      padding: 0.62rem 0 0.74rem;
      background: #fff;
      text-align: center;
      .or_code_size {
        width: 3.34rem;
        height: 3.36rem;
      }
    }
  }
  .card-footer {
    // padding: 0.5rem 0.36rem 0.48rem;
    margin: 0.48rem 0.36rem;
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
  .option {
    color: #3D424C;
    padding-left: 16/100rem;
    line-height: 1;
    padding-top: 24/100rem;
  }
  .store-name {
    position: absolute;
    top: 3.04rem;
    left: 0.4rem;
    color: #8A92A2;
  }
}
</style>
