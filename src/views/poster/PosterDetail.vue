<template>
  <div class="poster-detail font-PC-re font-12">
    <div class="poster-box" id="targetDom" v-if="type != '0'">
      <img class="bg-url" v-if="qrCode" :src="qrCode.bg_url" alt="">
      <div class="content-banner" v-if="type == 4">
        <img :src="cover" alt="">
      </div>
      <div class="content-title" v-if="type == 4">【{{title}}】</div>
      <div class="footer">
        <div class="store-info">
          <div class="name">{{qrCode.store_name}}</div>
          <div class="address">
            <span class="font-8">{{qrCode.address}}</span>
          </div>
          <div class="address phone">
            <span class="font-8">{{qrCode.phone}}</span>
          </div>
        </div>
        <img class="qy-img" :src="qrCode.img_url">
      </div>
    </div>
    <div v-if="type == '0'" class="poster-img-bg">
      <img :src="dataURL" alt="">
    </div>
    <div class="foot-box">
      <div class="box-item" @click="onMenuShareWechat()">
        <img src="../../assets/poster/weixi-icon.png" alt="">
        <div>发给微信好友</div>
      </div>
      <div class="box-item" @click="onMenuShareAppMessage()">
        <img src="../../assets/poster/qyweixi-icon.png" alt="">
        <div>企业微信转发</div>
      </div>
      <div class="box-item" @click="downloadPicture()">
        <img src="../../assets/poster/save-icon.png" alt="">
        <div>保存到手机</div>
      </div>
    </div>
    <!-- 海报图片弹框 -->
    <div
      class="modal-container"
      v-if="isShowModal"
      style="text-align: center;"
      @click="cancelModal()"
    >
      <div class="image-box">
        <img id="pointer" class="dowloadImage" :src="dataURL" alt="">
      </div>
    </div>
    <tip-modal v-if="show_tip" @cancel="cancelTip" :type="tip_type"></tip-modal>
  </div>
</template>
<script>
import defualtQrcode from "../../assets/defualt_qrcode.png"
import qyWx from "../../assets/qy_wx@2x.png"
import wxImg from "../../assets/weixin@2x.png"
import download from "../../assets/download@2x.png"
import html2canvas from "html2canvas"
import AppConfig from "../../app.config.js"
import Api from "@/api/articleApi.js"
import TipModal from "./modal/TipModal.vue"
export default {
  name: "poster-detail",
  components: {
    TipModal
  },
  data() {
    return {
      defualtQrcode: defualtQrcode,
      isShowModal: false,
      dataURL: "",
      qyWx: qyWx,
      wxImg: wxImg,
      download: download,
      userIdentifier: 0,
      error: 'this.src="' + require("../../assets/defualt_qrcode.png") + '"',
      qrCode: {},
      phone_icon: "https://oss1.chedianai.com/phone-icon.png",
      memUid: "",
      firstFinish: false,
      type: this.$route.query.type,
      title: this.$route.query.title ? this.$route.query.title : "",
      tip_type: 0,
      show_tip: false,
      cover: this.$route.query.cover || "",
      content_type: this.$route.query.content_type || ""
    }
  },
  created() {
    let self = this
    self.urlQuery = self.getRequest()
    if (AppConfig.user.hasOwnProperty("member") && AppConfig.user.member.hasOwnProperty("memUid") && AppConfig.user.member.memUid) {
      self.memUid = AppConfig.user.member.memUid
    }
    self.memUid = self.urlQuery.memUid || self.memUid
    self.dataURL = self.$route.query.url
    if (this.$route.query.type != '0') {
      this.getQRCode()
    }
  },
  methods: {
    // 获取二维码
    getQRCode: function() {
      let self = this
      let params = {
        type: this.$route.query.type,
        id: this.$route.query.poster_id
      }
      // 活动
      if (params.type == 4) {
        params.path = "pages/article/article"
        params.content_id = this.$route.query.id
        params.content_type = this.content_type
      }
      // 门店
      if (params.type == 3) {
        params.path = "pages/store/store"
      }
      // 节日
      if (params.type == 6) {
        params.path = "pages/index/index"
      }
      self.$loading.show("加载中")
      Api.getPosterDetail(params).then(
        function(data) {
          self.qrCode = {
            bg_url: data.data.poster,
            img_url: data.data.qr_code,
            store_name: data.data.store.store_name,
            address: data.data.store.address,
            phone: data.data.store.business_phone
          }
          self.firstFinish = true
          self.$loading.hide()
        },
        function(err) {
          self.$loading.hide()
          self.firstFinish = true
          self.$router.replace({ path: "/error", query: { msg: err } })
        }
      )
    },
    reGetQRCode: function() {
      let self = this
      if (self.tip == self.tips[2]) {
        self.getQRCode()
      }
    },
    getRequest() {
      var url = location.search //获取url中"?"符后的字串
      var theRequest = new Object()
      if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
        }
      }
      return theRequest
    },
    onMenuShareWechat: function() {
      if (!localStorage.getItem("wx_tip")) {
        this.show_tip = true
        this.tip_type = 1
        localStorage.setItem("wx_tip", 1)
      }
      if (this.dataURL) {
        this.isShowModal = true
        return
      }
      let self = this
      self.$loading.show("生成图片中")
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
        }).then(canvas => {
          canvas.className = "canvas"
          var dataURL = canvas.toDataURL("image/png")
          self.dataURL = dataURL
          self.isShowModal = true
          self.$loading.hide()
        })
      }, 2000)
    },
    onMenuShareAppMessage: function() {
      if (!localStorage.getItem("qy_tip")) {
        this.show_tip = true
        this.tip_type = 2
        localStorage.setItem("qy_tip", 2)
      }
      if (this.dataURL) {
        this.isShowModal = true
        return
      }
      let self = this
      self.$loading.show("生成图片中")
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
        }).then(canvas => {
          canvas.className = "canvas"
          var dataURL = canvas.toDataURL("image/png")
          self.dataURL = dataURL
          self.isShowModal = true
          self.$loading.hide()
        })
      }, 2000)
    },
    downloadPicture() {
      if (!localStorage.getItem("phone_tip")) {
        this.show_tip = true
        this.tip_type = 3
        localStorage.setItem("phone_tip", 3)
      }
      if (this.dataURL) {
        this.isShowModal = true
        return
      }
      let self = this
      self.$loading.show("生成图片中")
      setTimeout(function() {
        html2canvas(document.querySelector("#targetDom"), {
          useCORS: true
        }).then(canvas => {
          canvas.className = "canvas"
          var dataURL = canvas.toDataURL("image/png")
          self.dataURL = dataURL
          self.isShowModal = true
          self.$loading.hide()
        })
      }, 2000)
    },
    cancelModal() {
      this.isShowModal = false
    },
    cancelTip() {
      this.show_tip = false
    }
  },
  watch: {
    listener: function() {
      var t
      var pointer = document.querySelector("#pointer")
      var cancelTimeout = function() {
        if (t) {
          clearTimeout(t)
          t = null
        }
      }
      pointer.addEventListener("touchstart", function(e) {
        t = setTimeout(function() {
          alert("2s!")
          cancelTimeout()
        }, 2000)
        e.preventDefault()
        return false
      })
      pointer.addEventListener("touchend", cancelTimeout)
      pointer.addEventListener("touchcancel", cancelTimeout)
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.poster-detail {
  .image-box {
    margin-top: 0.52rem;
    text-align: center;
    #pointer {
      width: 7.5rem;
      height: 10.65rem;
    }
  }
  .canvas-img {
    width: 6.9rem;
    height: 9.8rem;
  }
  .poster-img-bg{
    border-radius: 0.04rem;
    width: 6.9rem;
    height: 9.8rem;
    margin: 0 auto;
    margin-top: 0.3rem;
    overflow: hidden;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .poster-box {
    border-radius: 0.04rem;
    width: 6.9rem;
    height: 9.8rem;
    margin: 0 auto;
    margin-top: 0.3rem;
    overflow: hidden;
    position: relative;
    .bg-url {
      width: 6.9rem;
      height: 9.8rem;
      position: absolute;
      top: 0;
      left: 0;
    }
    .content-banner {
      width: 100%;
      height: 3.77rem;
      padding: 0.28rem;
      box-sizing: border-box;
      position: relative;
      z-index: 1111;
      text-align: center;
      img {
        width: 5.8rem;
        height: 3.22rem;
      }
    }
    .content-title {
      width: 100%;
      padding: 0 0.28rem;
      box-sizing: border-box;
      text-align: center;
      color: #ffffff;
      font-size: 0.35rem;
      position: relative;
      z-index: 1111;
    }
    .footer {
      width: 6.9rem;
      height: 1.8rem;
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0.3rem;
      box-sizing: border-box;
      .store-info {
        box-sizing: border-box;
        color: #ffffff;
        padding-top: 0.1rem;
        .address {
          padding-left: 0.28rem;
          margin-top: 0.08rem;
          line-height: 0.28rem;
          background-image: url('https://oss1.chedianai.com/local-icon.png');
          background-size: 0.24rem 0.24rem;
          background-position: 0 0.01rem;
          background-repeat: no-repeat;
        }
        .phone {
          background-image: url('https://oss1.chedianai.com/phone-icon.png');
        }
        .name {
          font-size: 0.32rem;
          font-weight: 500;
          line-height: 0.45rem;
        }
      }
      .qy-img {
        width: 1.2rem;
        height: 1.2rem;
      }
    }
  }
  .foot-box {
    width: 100%;
    display: flex;
    justify-content: start;
    padding-top: 0.48rem;
    .box-item {
      width: 100%;
      text-align: center;
      color: #8a92a2;
      font-size: 0.24rem;
      img {
        width: 0.56rem;
        height: 0.56rem;
        margin-top: 0.1rem;
      }
    }
  }
}
</style>
