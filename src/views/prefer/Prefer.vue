<template class="prefer font-PC">
  <div class="content">
    <div class="qr-box"
         id="targetDom">
      <div class="block-height">
        <img class="qr-code"
             v-if="firstFinish"
             :src="qrCode.image?qrCode.image:defualtQrcode"
             :onerror="error"
             alt="">
      </div>

      <div class="tips">
        <span class="font-PC-re"
              v-bind:class="{'f-16':isCut,'f-12':!isCut}" @click="reGetQRCode()">{{tip}}</span>
      </div>
    </div>
    <div class="bottom"
         v-if="userIdentifier == 1">
      <div class="b-content"
           @click="onMenuShareWechat()">
        <img class="img"
             :src="wxImg"
             alt="">
        <div>
          <span class="tip font-PC-re">发送到微信</span>
        </div>
      </div>
      <div class="b-content"
           @click="onMenuShareAppMessage()">
        <img class="img"
             :src="qyWx"
             alt="">
        <div>
          <span class="tip font-PC-re">企业微信好友</span>
        </div>
      </div>
      <div class="b-content"
           @click="downloadPicture()">
        <img class="img"
             :src="download"
             alt="">
        <div>
          <span class="
				     tip
				     font-PC-re">保存到相册</span>
        </div>
      </div>
    </div>
    <div class="modal-container"
         v-if="isShowModal"
         style="text-align: center;"
         id="modal-container"
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
<script src="//res.wx.qq.com/open/js/jweixin-1.2.0.js">
</script>
<script>
import defualtQrcode from "../../assets/defualt_qrcode.png";
import qyWx from "../../assets/qy_wx@2x.png";
import wxImg from "../../assets/weixin@2x.png";
import download from "../../assets/download@2x.png";
import Api from "@/api/preferApi";
import html2canvas from "html2canvas";
import AppConfig from "../../app.config.js";

export default {
  name: "prefer",
  component: {},
  data() {
    return {
      isShowModal: false,
      qyWx: qyWx,
      wxImg: wxImg,
      download: download,
      defualtQrcode: defualtQrcode,
      error: 'this.src="' + require("../../assets/defualt_qrcode.png") + '"',
      qrCode: {},
      userIdentifier: 0,
      tips: [
        "出示给客户，面对面扫码领取优惠券",
        "长按识别领取优惠券",
        "获取二维码失败，请重新点击获取"
      ],
      tip: "出示给客户，面对面扫码领取优惠券",
      memUid: "",
      firstFinish: false,
      isCut: false,
      dataURL: ""
    };
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
    self.memUid = self.urlQuery.memUid || self.memUid;
    this.getQRCode();
  },
  methods: {
    getQRCode: function() {
      let self = this;
      let param = {
        type: 2
      };
      if (
        AppConfig.user.hasOwnProperty("member") &&
        AppConfig.user.member.hasOwnProperty("memUid") &&
        AppConfig.user.member.memUid
      ) {
        self.tip = self.tips[0];
        self.userIdentifier = 1;
      } else {
        self.tip = self.tips[1];
        self.userIdentifier = 2;
        param.memUid = self.memUid;
      }
      self.$loading.show("加载中");
      Api.getQRCode(param).then(
        function(data) {
          if (data.data && data.code == 0 && data.status == 200) {
            self.qrCode = data.data;
          } else {
            self.qrCode = self.defualtQrcode;
            self.tip = self.tips[2];
          }
          self.$loading.hide();
          self.firstFinish = true;
        },
        function(err) {
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    reGetQRCode: function() {
      let self = this;
      if (self.tip == self.tips[2]) {
        self.getQRCode();
      }
    },
    relayQRCode: function() {
      Api.relayQRCode({
        type: 2
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
    getRequest: function() {
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
      // 分享 - 微信
      let self = this;
      let link =
        location.protocol +
        "//" +
        location.host +
        "/" +
        AppConfig.corp_id +
        "/" +
        AppConfig.app_identifier +
        "/prefer?memUid=" +
        self.memUid;
      console.log(link);
      wx.showOptionMenu();
      wx.invoke(
        "shareWechatMessage",
        {
          title: "快来领取优惠券",
          desc: "打开链接长按小程序码领取优惠券",
          link: link,
          imgUrl: self.qrCode.image
        },
        function(res) {
          if (res.err_msg == "shareWechatMessage:ok") {
            self.relayQRCode();
          }
        }
      );
    },
    onMenuShareAppMessage: function() {
      // 分享 - 企业微信
      let self = this;
      let link =
        location.protocol +
        "//" +
        location.host +
        "/" +
        AppConfig.corp_id +
        "/" +
        AppConfig.app_identifier +
        "/prefer?memUid=" +
        self.memUid;
      wx.showOptionMenu();
      wx.invoke(
        "shareAppMessage",
        {
          title: "快来领取优惠券",
          desc: "打开链接长按小程序码领取优惠券",
          link: link,
          imgUrl: self.qrCode.image
        },
        function(res) {
          if (res.err_msg == "shareAppMessage:ok") {
            self.relayQRCode();
          }
        }
      );
    },
    downloadPicture() {
      let self = this;
      self.$loading.show("生成图片中");
      self.isCut = true;
      self.tip = self.tips[1];
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
        }).then(canvas => {
          canvas.className = "canvas";
          var dataURL = canvas.toDataURL("image/png");
          self.dataURL = dataURL;
          self.isShowModal = true;
          self.tip = self.tips[0];
          self.$loading.hide();
          self.isCut = false;
        });
      }, 1000);
    },
    cancelModal() {
      this.isShowModal = false;
    }
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
@import "../../less/config/mixins/border-radius.less";
@import "../../less/config/vendor-prefixes.less";
@import "../../less/report-common.less";

.prefer {
  width: 100%;
  height: 100vh;
}

.qr-box {
  background-color: #ffffff;
  margin-top: 0.68rem;
  margin-right: 0.36rem;
  margin-left: 0.36rem;
  padding-bottom: 1.34rem;
  box-shadow: 0px 22px 44px 0px rgba(49, 50, 66, 0.11);
  .border-radius(3 px);
  text-align: center;
}

.qr-code {
  width: 4.3rem;
}
.block-height {
  padding-top: 1.7rem;
  min-height: 6rem;
}
.tips {
  margin-top: 1.74rem;
  width: 100%;
  text-align: center;
  span {
    color: #8a92a2;
    line-height: 0.34rem;
  }
  .f-12 {
    font-size: 0.24rem;
  }
  .f-16 {
    font-size: 0.32rem;
  }
}
.bottom {
  margin-top: 0.5rem;
  .display-flex();
  .justify-content(space-between);
  padding-right: 0.8rem;
  padding-left: 0.8rem;
}

.b-content {
  text-align: center;
}

.img {
  height: 0.56rem;
  width: 0.56rem;
  margin-bottom: 0.1rem;
}

.tip {
  font-size: 0.24rem;
  color: #8a92a2;
  line-height: 0.34rem;
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
</style>
