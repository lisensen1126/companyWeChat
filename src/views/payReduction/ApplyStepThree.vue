<template>
  <div class="apply-step-three" :class="{'of-h':show_modal}">
    <TimeLine step="3"/>
    <div class="step-desc">
      <div>
        <span class="round-num">3</span>
        <span class="desc">上传物料包装、物料陈列照片</span>
      </div>
      <div class="guide">
        <span>拍照上传物料照片，不知道怎么拍？</span>
        <span class="blue" @click="showPop">点击查看</span>
      </div>
    </div>
    <div class="main-content">
      <div class="tip">上传物料陈列照片（最多3张）</div>

      <div class="upload-box">
        <!-- <span class="pos-rel" v-for="(item,index) in img_list" :key="index">
          <img class="img" :src="item">
          <img class="close-btn" @click="deleteImg(index)" src="../../assets/delete-image.png">
        </span>-->
        <!-- <el-upload
          v-show="file_list.length<3"
          class="img-uploader"
          :action="API_ROOT + 'work/v1/common/image_upload?corp_id=' + corp_id + '&app_identifier=' + app_identifier"
          :show-file-list="false"
          :multiple="true"
          :file-list="file_list"
          :on-change="handleChange"
          :on-success="handleSuccess"
          :auto-upload="false"
          ref="uploader"
        >
          <img class="img" src="../../assets/application/camera.png" alt>
        </el-upload>-->
        <ChooseImg limit="3" :imgArr="file_list" @changeImgArr="changeImg" @deleteImg="deleteImg"/>
      </div>
    </div>
    <div class="round-btn" @click="submit">我确认已陈列</div>
    <!-- 指引弹窗 -->
    <div class="popup" v-show="show_modal">
      <div class="modal"></div>

      <div class="header">
        <span>活动物料陈列示意图</span>
        <img @click="showPop(false)" src="../../assets/application/close2.png">
      </div>
      <div class="img-box">
        <img src="../../assets/application/reduction-modal.png" alt>
      </div>
    </div>
  </div>
</template>
<script>
import AppBase from "../../app.base";
import AppConfig from "../../app.config";
import TimeLine from "@/components/payReduction/TimeLine.vue";
import Mixes from "./mixin/payReductionPublic";
import ChooseImg from "@/components/chooseImg";
import Api from "@/api/payReduction";
export default {
  mixins: [Mixes],
  components: {
    TimeLine,
    ChooseImg
  },
  data() {
    return {
      API_ROOT: AppBase.base_url, // 接口域名
      corp_id: AppConfig.corp_id, // 企业id
      app_identifier: AppConfig.app_identifier, // appid
      file_list: [], // 文件上传组件存放文件的数组
      url_list: [],
      // img_list: [], // 存放图片转换为base64的数组
      has_upload: false, // 是否已上传图片
      upload_time: 0, // 上传的图片数量
      show_modal: false
    };
  },
  methods: {
    changeImg(res) {
      this.file_list = [...this.file_list, res];
    },
    deleteImg(i) {
      this.file_list.splice(i, 1);
    },
    showPop(bool) {
      this.show_modal = bool;
    },
    // async handleChange(file) {
    //   if (this.has_upload) {
    //     return;
    //   }
    //   let self = this;
    //   if (this.file_list.length < 3) {
    //     this.file_list = [...this.file_list, file];
    //     let fr = new FileReader();
    //     fr.readAsDataURL(file.raw);
    //     fr.onload = async function() {
    //       self.img_list.push(this.result);
    //     };
    //   } else {
    //     this.$toast.error("最多上传3张图片");
    //   }
    // },
    // handleSuccess() {
    //   this.$loading.hide();
    // },
    // deleteImg(index) {
    //   this.file_list.splice(index, 1);
    //   this.img_list.splice(index, 1);
    // },
    // checkList() {
    //   return this.file_list.length < 3;
    // },
    async uploadImg() {
      this.$loading.show("上传中");
      // 将任务存在一个数组里，然后用Promise.all一起执行
      let promistArr = [];
      this.file_list.forEach(async item => {
        promistArr.push(
          Api.uploadPicApi({ file: item.file }).then(
            res => {
              if (res.code === 0) {
                this.url_list.push(res.data.image_url);
              } else {
                this.$toast.error("上传失败");
              }
            },
            err => {
              this.$router.replace({
                path: "/error",
                query: {
                  msg: err
                }
              });
            }
          )
        );
      });
      Promise.all(promistArr).then(() => {
        this.$loading.hide();
        // 全部图片上传完毕后，请求接口更新报名状态
        this.updateInfo(
          {
            step: 3,
            pics: this.url_list
          },
          "apply-step-four"
        );
      });
    },
    submit() {
      // this.$refs.uploader.submit();
      this.uploadImg();
      this.has_upload = true;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";
.main-content {
  background: #fff;
  border-radius: 2px;
  padding-top: 0.32rem;
  margin: 0 0.3rem;
  .tip {
    font-size: 0.28rem;
    color: #3d424c;
    margin-left: 0.3rem;
  }
}
.upload-box {
  margin: 0.2rem 0.3rem 0 0.3rem;
  display: flex;
  padding-bottom: 0.3rem;
  .img {
    width: 2rem;
    height: 2rem;
  }
  .img-uploader {
    border: 1px dashed #c4c6c9;
    display: flex;
    background: #f7f7fa;
    margin: 0 0.15rem 0.3rem 0;
    align-items: center;
    justify-content: center;
    .img {
      width: 0.56rem;
      height: 0.56rem;
      padding: calc(0.72rem - 1px);
      margin: 0;
      box-sizing: content-box;
    }
  }
}
.pos-rel {
  position: relative;
  margin: 0 0.15rem 0.3rem 0;
  .close-btn {
    position: absolute;
    width: 0.32rem;
    height: 0.32rem;
    top: 0.12rem;
    right: 0.12rem;
  }
}
.round-btn {
  position: absolute;
  bottom: 0;
  left: 0.3rem;
  right: 0.3rem;
}
// 弹窗
.of-h {
  overflow: hidden;
  height: 100vh;
}
.popup {
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .header {
    text-align: center;
    line-height: 1.3rem;
    color: #fff;
    font-size: 0.32rem;
    background: #4b77b0;
    position: absolute;
    top: 0.8rem;
    left: 0.3rem;
    right: 0.3rem;
    img {
      position: absolute;
      width: 0.52rem;
      height: 0.52rem;
      top: 0.3rem;
      right: 0.3rem;
    }
  }
  .img-box {
    overflow: scroll;
    position: absolute;
    top: 2.1rem;
    left: 0.3rem;
    right: 0.3rem;
    bottom: 0.8rem;
    max-height: 80vh;
    background: #fff;
    img {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.UploadImgXCY .uploader_box {
  width: 2rem !important;
  height: 2rem !important;
  border: 1px dashed #c4c6c9 !important;
  text-align: center;
  background: #f7f7f7;
  .clickIcon {
    width: 0.56rem;
    height: 0.56rem;
    margin-top: 0.72rem;
  }
}
.UploadImgXCY {
  .loadedImg {
    width: 2rem !important;
    height: 2rem !important;
    margin: 0 !important;
  }
  .clear {
    top: 0.1rem !important;
    right: 0.12rem !important;
    width: 0.32rem !important;
    height: 0.32rem !important;
  }
  .imgLoop {
    flex-wrap: nowrap !important;
    .imgBox {
      margin: 0 0.12rem 0 0 !important;
    }
    .imgBox:last-child {
      margin: 0 !important;
    }
  }
}
</style>
