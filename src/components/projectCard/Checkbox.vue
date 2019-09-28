<template>
  <div class="subject">
    <div class="subject-checkbox">
      <div class="subject-item" v-for='(item, index) in list' :key='index'>
        <div class="flex subject-item-content" :class="(is_multi === 2 && disabled && disabled_id !== item.id) ? 'disabled' : ''">
          <p class="font-12 subject-title">{{index + 1}}. {{item.name}}</p>
          <div class="checkbox flex">
            <div class="btn-div" v-for='(btn, i) in item.button' :key='i'>
              <button class="btn font-12" :class="btn.checked ? btn.color : ''" @click='checkAbnormal(index,i)'>{{btn.name}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="abnormal-question" v-show='show_question'>
      <div class="question-list">
        <div class="flex" @click='checkQuestion()'>
          <p class="font-12">异常问题(可多选)<font color='#FF6464'>*</font>
          </p>
          <img src="../../assets/arrow_right2.png" alt="">
        </div>
        <div class="check-list" v-if='checked_question.length > 0'>
          <p class="check-item font-12" v-for="(item, index) in checked_question" :key="index">{{item.name}}</p>
        </div>
      </div>
      <div class="question-list">
        <div class="flex" @click='checkAdvice()'>
          <p class="font-12">异常建议(可多选)<font color='#FF6464'>*</font>
          </p>
          <img src="../../assets/arrow_right2.png" alt="">
        </div>
        <div class="check-list" v-if='checked_advice.length > 0'>
          <p class="check-item font-12" v-for="(item, index) in checked_advice" :key="index">{{item.name}}</p>
        </div>
      </div>
      <div class="question-list">
        <div class="flex">
          <p class="font-12">上传图片(最多三张)</p>
        </div>
        <div class="upload-pic">
          <div class="picture" v-for="(item,index) in img_list" :key='index'>
            <img class="picture-img" @click="previewImage(item, img_list)" :src="item" alt="">
            <img class="delete" src="../../assets/delete-image.png" @click="deleteImg(index)">
          </div>
          <div class="picture picture-upload" v-if="img_list.length < 3">
            <el-upload
              class="avatar-uploader"
              :action="API_ROOT + 'work/v1/common/image_upload?corp_id=' + corp_id + '&app_identifier=' + app_identifier"
              :show-file-list="false"
              accept="image/*"
              :on-success="handleAvatarSuccess"
              :on-error="avatarUploadOnError"
              :before-upload="beforeAvatarUpload">
                <img class="image" src="../../assets/upload-image.png" alt="">
              </el-upload>
          </div>
        </div>
      </div>
      <div class="question-list">
         <div class="flex">
          <p class="font-12">视频</p>
        </div>
        <div class="upload-pic">
          <div class="picture video" v-for="(item,index) in video_list" :key='index'>
            <!-- <video id="video" :src="item" ref="video" :poster="item + '?vframe/jpg/offset/1'"></video> -->
            <div class="video-pic">
              <img :src="item + '?vframe/jpg/offset/1'" alt="">
            </div>
            <div class="play" @click="videoPlay(index)">
              <img src="https://oss1.chedianai.com/images/assets/videoplay.png" alt="">
            </div>
            <img class="delete" src="../../assets/delete-image.png" @click="deleteVideo(index)">
            <div class="video-v" v-show="video_show">
              <video id="video" :src="item" ref="video" controls="controls">
              </video>
              <img class="close" src="../../assets/delete-image.png" @click="hideVideo(index)">
            </div>
          </div>
          <div class="picture picture-upload" v-show="video_list.length < 1">
            <el-upload
              class="avatar-uploader el-video"
              :action="API_ROOT + 'work/v1/common/video_upload?corp_id=' + corp_id + '&app_identifier=' + app_identifier"
              :show-file-list="false"
              :on-success="handleAvatarSuccessVideo"
              :on-error="avatarUploadOnErrorVideo"
              accept="video/*"
              :before-upload="beforeAvatarUploadVideo">
                <img class="image" src="../../assets/upload-image.png" alt="">
              </el-upload>
          </div>
        </div>
      </div>
      <div class="question-list">
        <div class="flex">
          <p class="font-12">技师备注</p>
        </div>
        <div>
          <textarea class="textarea font-12" v-model="technician_comment" placeholder="请输入备注" @blur="completeNote($event)"></textarea>
        </div>
      </div>
    </div>
    <slide-question
      v-if='slide_question'
      @complete='complete'
      :list='question_list'
      :checklist='checked_question'
      title="请选择异常问题"
    ></slide-question>
    <slide-question
      v-if='slide_advice'
      @complete='completeAdvice'
      :list='advice_list'
      :checklist='checked_advice'
      title="请选择异常建议"
    ></slide-question>
  </div>
</template>
<script>
/**
 * @description 车检流程 开始车检的项目选择
 */
import SlideQuestion from "./SlideQuestion";
import Api from "@/api/diagnosisApi";
import AppConfig from "../../app.config";
import AppBase from "../../app.base";
import appConfig from "../../app.config";

export default {
  name: "Checkbox",
  components: {
    SlideQuestion
  },
  props: {
    resList: {
      type: Array,
      default() {
        return [];
      }
    }, // card对应的项目的监测点的列表
    categoryId: null, // 当前选择的分类ID
    is_multi: null, //  判读是否是多选
    question_list: {
      type: Array,
      default() {
        return [];
      }
    }, //  异常问题列表
    advice_list: {
      type: Array,
      default() {
        return [];
      }
    } //  异常建议列表
  },
  data() {
    return {
      checkbox: true,
      slide_question: false, // 是否显示选择异常问题列表的弹框
      slide_advice: false, // 是否显示选择异常建议列表的弹框
      checked_question: [], // 选中的异常问题列表
      checked_advice: [], // 选中的异常建议列表
      show_question: false, // 是否显示选择问题界面
      project_index: null, // 当前点击卡片的下标
      button_index: null, // 当前卡片点击的按钮下标
      img_list: [],
      pic_list: [],
      video_list: [],
      disabled: false, // 判断当前监测点是否单选
      disabled_id: null,
      list: [],
      technician_comment: "", // 技师评论
      API_ROOT: AppBase.base_url, // 上传图片的请求接口前缀
      corp_id: AppConfig.corp_id,
      app_identifier: AppConfig.app_identifier,
      video_show: false
    };
  },
  methods: {
    /**
     * index 对应项目的下标
     * i 对象项目的点击的按钮的下标
     */
    checkAbnormal(index, i) {
      if (
        this.is_multi === 2 &&
        this.disabled &&
        this.disabled_id !== this.list[index].id
      ) {
        return;
      }
      if (this.list[index].button[i].checked) {
        this.list[index].button[i].checked = !this.list[index].button[i]
          .checked;
        this.$emit("checkItem", {
          id: this.list[index].id,
          value: 4, // 1 正常  2 异常  3 需关注  4 未检测
          categoryId: this.categoryId
        });
      } else {
        this.list[index].button.forEach(ele => {
          ele.checked = false;
        });
        this.list[index].button[i].checked = true;
        this.$emit("checkItem", {
          id: this.list[index].id,
          value: this.list[index].button[i].button_color,
          categoryId: this.categoryId
        });
      }
      this.list = [...this.list];
      this.show_question = this.checkAbnormalStatus();
    },
    // 查找该项目有没有异常状态
    checkAbnormalStatus() {
      let arr = [];
      arr = this.list.filter(ele => {
        if (ele.button.filter(element => element.checked).length > 0) {
          // 判断是否多选如果选择的是单选则让其他置灰
          if (this.is_multi === 2) {
            this.disabled = true;
            this.disabled_id = ele.id;
          }
          return ele.button.filter(element => element.checked);
        }
      });
      // 判断是否多选如果没有选择则让其他恢复正常
      if (arr.length === 0) {
        this.disabled = false;
        this.disabled_id = null;
      }
      let flag = false;
      // arr.forEach(ele => {
      //   ele.button.forEach(element => {
      //     if(element.checked && element.button_color === 2) {
      //       flag = true
      //       return
      //     }
      //   })
      // })

      // 判断当前点击的卡片是否有异常场景 button_color 1 正常   2 异常   3 需关注
      flag = arr.some(ele => {
        if (
          ele.button.some(
            element => element.checked && element.button_color === 2
          )
        ) {
          return true;
        } else {
          return false;
        }
      });
      return flag;
    },
    // 显示选择异常建议
    checkAdvice() {
      this.slide_advice = true;
    },
    // 显示选择异常问题
    checkQuestion() {
      this.slide_question = true;
    },
    // 选择异常问题回调
    complete(data) {
      this.slide_question = false;
      this.checked_question = data.list;
      let arr = [];
      this.checked_question.forEach(ele => {
        arr.push({ id: ele.id });
      });
      this.$emit("complete", {
        arr: arr,
        categoryId: this.categoryId
      });
    },
    // 选择异常建议回调
    completeAdvice(data) {
      this.slide_advice = false;
      this.checked_advice = data.list;
      let arr = [];
      this.checked_advice.forEach(ele => {
        arr.push({ id: ele.id });
      });
      this.$emit("completeAdvice", {
        arr: arr,
        categoryId: this.categoryId
      });
    },
    // 技师输入备注信息点完成回调
    completeNote(e) {
      // if (e.keyCode === 13) {
      this.$emit("completeNote", {
        technician_comment: this.technician_comment,
        categoryId: this.categoryId
      });
      // }
    },
    /**
     * @method
     * @description 删除图片
     */
    deleteImg(index) {
      this.$emit("deleteImg", {
        index: index,
        categoryId: this.categoryId
      });
      this.img_list.splice(index, 1);
    },
    /**
     * @method
     * @description 上传成功
     */
    handleAvatarSuccess(res, file) {
      this.$emit("uploadPic", {
        image_url: res.data.image_url,
        categoryId: this.categoryId
      });
      this.img_list.push(res.data.image_url);
      this.$loading.hide();
    },
    /**
     * @method
     * @description 上传前
     */
    beforeAvatarUpload(file) {
      console.log("file", file);
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$toast.error("上传的图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (this.img_list.length > 3) {
        this.$toast.error("图片最多上传三张");
      }
      this.$loading.show("上传中");
      return this.img_list.length < 3;
    },

    /**
     * @method
     * @description 上传失败
     */
    avatarUploadOnError(res) {
      this.$toast.error("上传失败");
      this.$loading.hide();
    },

    /**
     * @method
     * @description 预览图片
     */
    previewImage(url, list) {
      return new Promise(function() {
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: list // 需要预览的图片http链接列表
        });
      });
    },
    // 初始化列表 给每一个列表加上button
    initList() {
      this.list.forEach(ele => {
        ele["button"] = [
          {
            name: "正常",
            checked: false,
            button_color: 1,
            color: "green"
          },
          {
            name: "异常",
            checked: false,
            button_color: 2,
            color: "red"
          },
          {
            name: "需关注",
            checked: false,
            button_color: 3,
            color: "blue"
          }
        ];
      });
    },
    // 拷贝数据
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    // 播放视频
    videoPlay(index) {
      console.log("this.$refs", this.$refs);
      // this.$refs.video[0].play();
      this.video_show = true;
    },
    hideVideo() {
      this.$refs.video[0].pause();
      this.video_show = false;
    },
    /**
     * @method
     * @description 上传视频前
     */
    beforeAvatarUploadVideo(file) {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif"
      ) {
        this.$toast.error("格式不正确!");
        return false;
      }
      let size = file.size / 1024 / 1024;
      if (size > 20) {
        this.$toast.error("视频文件大小不能超过 20M");
        return false;
      }
      this.$loading.show("上传中");
    },
    /**
     * @method
     * @description 上传成功 video
     */
    handleAvatarSuccessVideo(res, file) {
      if (res.code === 0) {
        this.$emit("uploadVideo", {
          video_url: res.data.video_url,
          categoryId: this.categoryId
        });
        this.video_list.push(res.data.video_url);
      } else {
        this.$toast.error(res.message);
      }
      this.$loading.hide();
    },
    /**
     * @method
     * @description 上传失败
     */
    avatarUploadOnErrorVideo(res) {
      this.$toast.error("上传失败");
      this.$loading.hide();
    },
    /**
     * @method
     * @description 删除视频
     */
    deleteVideo(index) {
      this.$emit("deleteVideo", {
        index: index,
        categoryId: this.categoryId
      });
      this.video_list.splice(index, 1);
    }
  },
  created() {
    this.list = this.deepClone(this.resList);
    this.initList();
  },
  mounted() {
    var v = document.getElementsByClassName('el-video');
    console.log('v', v)
    for(var i = 0;i<v.length;i++) {
      v[i].querySelector('input').setAttribute('capture', 'camcorder')
    }
  }
};
</script>
<style lang="less">
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/button.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.subject {
  .subject-checkbox {
    padding: 0 0.3rem;
    border-bottom: 1px solid #f0f0f0;
  }
  .subject-item {
    position: relative;
    padding: 0.3rem 0;
    &:after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: #f0f0f0;
      left: 0;
      bottom: 0;
    }
    &:last-child:after {
      height: 0;
    }
  }
  .subject-item-content {
    &.disabled {
      opacity: 0.3;
    }
  }
  .subject-title {
    color: #3d424c;
  }
  .btn-div:last-child {
    .btn {
      margin-right: 0;
    }
  }
  .btn {
    background-color: #fff;
    color: #8a92a2;
    border: 1px solid #8a92a2;
    margin-right: 0.2rem;
    height: 0.6rem;
    line-height: 0.6rem;
    padding: 0 0.2rem;
    &.green {
      background-color: #12c49f;
      color: #fff;
      border: 1px solid #12c49f;
    }
    &.red {
      background-color: #ff6464;
      color: #fff;
      border: 1px solid #ff6464;
    }
    &.blue {
      background-color: #4b86ff;
      color: #fff;
      border: 1px solid #4b86ff;
    }
  }
  .abnormal-question {
    padding: 0 0.3rem;
  }
  .question-list {
    border-bottom: 1px solid #f0f0f0;
    padding: 0.3rem 0;
    &:last-child {
      border-bottom: 0;
    }
    .flex {
      justify-content: space-between;
      align-items: center;
      color: #3d424c;
      img {
        height: 0.2rem;
      }
    }
    .check-list {
      padding: 0.2rem 0 0 0;
      .check-item {
        display: inline-block;
        margin-right: 0.15rem;
        background-color: #f7f7fa;
        color: #8a92a2;
        padding: 0.1rem 0.2rem;
        margin-top: 0.1rem;
      }
    }
    .upload-pic {
      margin-top: 0.3rem;
      .picture {
        display: inline-block;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        margin-left: 0.1rem;
        position: relative;
        .delete {
          position: absolute;
          width: 0.32rem;
          height: 0.32rem;
          right: 0.1rem;
          top: 0.1rem;
        }
        &.picture-upload {
          background: #f7f7fa;
          .avatar-uploader {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
          }
          .image {
            width: 0.48rem;
            height: 0.48rem;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            z-index: 99;
          }
        }
        &:first-child {
          margin-left: 0;
        }
        .picture-img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .video {
      position: relative;
      width: 2rem;
      height: 2rem;
      // background: #000;
      .video-pic {
        width: 2rem;
        height: 2rem;
        img {
          width: 2rem;
          height: 2rem;
        }
      }
      .video-v {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 9999;
        video {
          width: 100vw;
          height: 50vh;
        }
        .close {
          position: absolute;
          left: 50%;
          bottom: 60/100rem;
          margin-left: -30/100rem;
          width: 60/100rem;
          height: 60/100rem;
        }
      }
      .play {
        position: absolute;
        left: 0;
        top: 0;
        width: 2rem;
        height: 2rem;
        color: #fff;
        img {
          margin: 0.5rem 0 0 0.5rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
  .upload-picture {
    width: 0.4rem;
    height: auto !important;
  }
  .textarea {
    width: 100%;
    height: 1rem;
    padding: 0.2rem;
    color: #8a92a2;
  }
}
.el-upload__input {
  display: none;
}
</style>
