<template>
  <div class="vehicle-assistant">
    <div class="vehicle-content">
      <div class="vehicle-circle">
        <div class="circle-item" @click="goSearch(2)">
          <div class="circle">
            <img src="../../assets/search-customer.png" alt="">
          </div>
          <div class="circle-text font-12">
            查找客户
          </div>
        </div>
        <div class="circle-item" @click="goSearch(1)">
          <div class="circle">
            <img src="../../assets/vehicle.png" alt="">
          </div>
          <div class="circle-text font-12">
            输入车辆
          </div>
        </div>
      </div>
      <div class="vehicle-square">
        <el-upload
          class="avatar-uploader"
          :action="API_ROOT + 'work/v1/common/image_upload?corp_id=' + corp_id + '&app_identifier=' + app_identifier"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-error="avatarUploadOnError"
          :on-success="handleAvatarSuccess">
          <img src="../../assets/saomiao.png" alt="">
          <div class="square-text font-12">拍照自动识别车牌</div>
        </el-upload>
      </div>
    </div>
    <div class="look-record font-12" v-text="(memRoleId === 1 || memRoleId === 2) ? '查看车检记录' : '我的车检记录'" @click="myRecord()">查看我的车检记录</div>
  </div>
</template>
<script>
import Api from "@/api/diagnosisApi";
import AppConfig from "../../app.config";
import AppBase from "../../app.base";
import appConfig from '../../app.config';
export default {
  data() {
    return {
      process_info: {},
      memRoleId: null,
      API_ROOT: AppBase.base_url,
      corp_id: AppConfig.corp_id,
      app_identifier: AppConfig.app_identifier,
      images: '',
    };
  },
  methods: {
    /**
     * @method
     * @description 我的车检记录
     */
    myRecord() {
      this.$router.push({
        name: "dialist"
      });
    },

    /**
     * @method
     * @description 搜索客户/车牌号
     */
    goSearch(type) {
      let search_type = type
      this.$router.push({
        name: "diagnosis",
        query: {
          search_type: search_type,
        }
      })
    },

    /**
     * @method
     * @description 扫描车牌号上传前
     */
    beforeAvatarUpload() {
      this.$loading.show("上传中");
    },

    /**
     * @method
     * @description 扫描车牌号上传失败
     */
    avatarUploadOnError() {
      this.$loading.hide();
    },

    /**
     * @method
     * @description 扫描车牌号
     */
    handleAvatarSuccess(res, file) {
      let self = this;
      self.$loading.show("加载中")
      this.images = res.data.image_url;
      Api.ocrLicensePlate({
        url: self.images
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.$router.push({
            name: "diagnosis",
            query: {
              plate: res.data.string,
              search_type: 1,
            }
          })
        } else {
          self.$toast.error("识别失败")
        }
      });
    },

    /**
     * @method
     * @description 判断身份
     */
    async isLogin () {
      this.$loading.show("加载中")
      try {
        const {status, data, code} = await Api.isLoginApi()
        this.$loading.hide()
        if (status === 200 && code === 0) {
          this.memRoleId = data.member_role.memRoleId
          // if (data.member_role.memRoleId !== 2) {
          //   _this.$router.replace({path: "/error", query: {msg: "暂无权限"}});
          // }
        }
      } catch (err) {
        this.$loading.hide()
        this.$router.replace({ path: "/error", query: { msg: err } })
      }
    }
  },
  mounted() {
    this.isLogin()
  }
}
</script>
<style lang="less">
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/button.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.vehicle-assistant{
  width: 100%;
  min-height: 100vh;
  background: #F7F8FA;
  .look-record{
    font-weight: 400;
    color: #8A92A2;
    margin-top: 1.88rem;
    text-align: center;
  }
  .vehicle-content{
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .vehicle-circle{
    display: flex;
    width: 100%;
    height: auto;
    margin-top: 1.48rem;
    padding: 0 1.6rem;
    justify-content: space-between;
    .circle-item{
      .circle{
        width: 1.36rem;
        height: 1.36rem;
        background: linear-gradient(360deg,rgba(94,123,255,1) 0%,rgba(111,174,255,1) 100%);
        box-shadow: 0px 16px 30px 0px rgba(94,123,255,0.3);
        position: relative;
        border-radius: 50%;
        img{
          width: 0.8rem;
          height: 0.8rem;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
      .circle-text{
        font-weight: 400;
        color: #5E7BFF;
        text-align: center;
        margin-top: 0.12rem;
      }
    }
  }
  .vehicle-square{
    margin-top: 1.2rem;
    width: 4.68rem;
    height: 4.28rem;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .square-text{
      font-weight: 500;
      left: 0;
      bottom: 1.06rem;
      color: #5E7BFF;
      position: absolute;
      text-align: center;
      width: 100%;
    }
  }
}
.el-upload__input{
  display: none;
}
</style>