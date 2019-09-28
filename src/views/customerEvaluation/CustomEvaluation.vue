<template>
  <div class="customEvaluation">
    <div class="choose">
      <div class="chooseTitle p-b-20">
        <div class="fItem"
             @click="select(0)">
          <span class="font-PC-re">{{techSel.memUsername}}</span>
          <span class="arrowDown font-PC-re"
                v-show="!isTechSel"></span>
          <span class="arrowUp font-PC-re"
                v-show="isTechSel"></span>
        </div>
        <div class="fItem"
             @click="select(1)">
          <span class="font-PC-re">{{scoreSel.name}}
            <span v-if="scoreSel.code != 0"> 分</span>
          </span>
          <span class="arrowDown font-PC-re"
                v-show="!isScoreSel"></span>
          <span class="arrowUp font-PC-re"
                v-show="isScoreSel"></span>
        </div>
        <div class="fItem"
             @click="select(2)">
          <span class="font-PC-re">{{statusSel.name}}</span>
          <span class="arrowDown font-PC-re"
                v-show="!isStatusSel"></span>
          <span class="arrowUp font-PC-re"
                v-show="isStatusSel"></span>
        </div>
      </div>

      <div class="chooseBox content-bg">
        <ul class="chooseUl"
            v-if="isTechSel">
          <li class="chooseli p-l-40 p-t-20 p-b-20 font-PC-re"
              v-bind:class="{'bor-t':index != 0}"
              v-for="(item, index) in technicianList"
              :key="index"
              @click="selected(1,index)">{{item.memUsername}}</li>
        </ul>
        <ul class="chooseUl"
            v-if="isScoreSel">
          <li class="chooseli p-l-40 p-t-20 p-b-20 font-PC-re"
              v-bind:class="{'bor-t':index != 0}"
              v-for="(item, index) in scoreList"
              :key="index"
              @click="selected(2,index)">{{item.name}}</li>
        </ul>
        <ul class="chooseUl"
            v-if="isStatusSel">
          <li class="chooseli p-l-40 p-t-20 p-b-20 font-PC-re"
              v-bind:class="{'bor-t':index != 0}"
              v-for="(item, index) in evaStatus"
              :key="index"
              @click="selected(3,index)">{{item.name}}</li>
        </ul>
      </div>

    </div>
    <!-- 没有数据 -->
    <default-page picture="nodata"
                  :text="noDataText"
                  v-if="isShowdefualt"></default-page>
    <scroller :on-infinite="infinite"
              ref="my_scroller"
              v-if="evalutions.length && evalutions.length > 0" style="padding-top:0.68rem;">
      <template v-for="(item,index) in evalutions">
        <div class="content content-bg"
             @click="cancelSelect()"
             v-bind:class="{'m-b-10':index < (evalutions.length - 1)}"
             :key="index">
          <div class="evaTitle clearfix">
            <div class="avatDiv pull-left">
              <img :src="item.customer_avatar?item.customer_avatar:defaultHeader"
                   alt=""
                   class="avat"
                   :onerror="defaultHeader">
            </div>


            <div class="infoDiv pull-left">
              <div class="title">
                <div class="center">
                  <span class="font-PC-sd first font-14" v-if="item.customer_name != ''">{{item.customer_name}}</span>
                  <span class="font-PC-sd first font-14" v-if="item.customer_name == ''">&nbsp;</span>
                </div>
              </div>
              <div class="title m-t-10 m-b-10">
                <div class="center">
                  <span class="second font-12">{{item.store_info.store_name}}</span>
                </div>
              </div>
              <div class="score">
                <div class="starList">
                  <img class="star"
                       :src="item.comment_score.length > 0 && item.comment_score[0].score >=1?starLight:starGray">
                  <img class="star"
                       :src="item.comment_score.length > 0 && item.comment_score[0].score >=2?starLight:starGray">
                  <img class="star"
                       :src="item.comment_score.length > 0 && item.comment_score[0].score >=3?starLight:starGray">
                  <img class="star"
                       :src="item.comment_score.length > 0 && item.comment_score[0].score >=4?starLight:starGray">
                  <img class="star"
                       :src="item.comment_score.length > 0 && item.comment_score[0].score >=5?starLight:starGray">
                </div>
                <div class="scoreContent font-PC-me"
                     v-if="item.comment_score.length > 0">{{item.comment_score[0].score}}分</div>
                <div class="scoreContent font-PC-me"
                     v-else>0分</div>
              </div>
            </div>



            <div class="date"
                 v-if="item.created_at">
              <span class="font-PC-lg font-10">{{formartDate(item.created_at)}}</span>
            </div>
          </div>
          <div class="evaContet"
               v-bind:class="{'border-b': ((item.comment_technican && item.comment_technican.wx_u_avatar.length > 0) || (item.sub_comment.length > 0 && item.sub_comment[0].comment_content.length > 0)),'p-b-52':item.comment_image.length > 0}">
            <div class="wrap">
              <span class="text font-PC-re">{{item.comment_content}}</span>
            </div>
            <div class="imgList">
              <div v-for="(img,index) in item.comment_image"
                   :key="index"
                   class="imgBox"
                   v-bind:class="{'mar-r-4':(index != 2 && index !=5 && index != 8),'mar-t-4': index >= 3}"
                   v-bind:style="{ 'background-image':'url('+img.image_url+')','background-size':'cover',
              'background-position-x':'center','background-position-y':'center'}"
                   @click="previewImage(item.comment_image,img.image_url)">
              </div>
            </div>
          </div>
          <div class="recommand">
            <div v-if="item.comment_technican && item.comment_technican.wx_u_avatar.length > 0">
              <span class="title font-PC-re">推荐技师</span>
              <div class="techTile"
                   v-bind:class="{'m-b-40':item.sub_comment.length > 0}">
                <div class="avatDiv">
                  <img :src="item.comment_technican.wx_u_avatar?item.comment_technican.wx_u_avatar:defaultHeader"
                       alt=""
                       class="avat"
                       :onerror="defaultHeader">
                </div>
                <div class="infoDiv">
                  <div class="title font-PC-sd ellipsis">{{item.comment_technican.wx_u_name}}</div>
                  <div class="occup font-PC-me"
                       v-bind:class="{'m-b-4':item.sub_comment.length > 0}">
                    <p v-if="!item.comment_technican.wx_u_role"
                       class="optic ellipsis">占位</p>
                    <p v-else
                       class="ellipsis">{{item.comment_technican.wx_u_role}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="commit"
                 v-if="item.sub_comment.length > 0 && item.sub_comment[0].comment_content.length > 0" @click='editRevert(item)'>
              <span class="font-PC-re">
                <span>商家回复：</span>{{item.sub_comment[0].comment_content}}</span>
            </div>
            <div class="commit-btn"
                v-if="item.sub_comment.length === 0 || item.sub_comment[0].comment_content.length === 0">
              <span class="replay font-12" @click='revert(item)' v-if="authority.KHPJO.hasPermission == 1">回复</span>
            </div>
          </div>
        </div>
      </template>
    </scroller>
    <foot-modal v-if='show_modal' @cancel='cancelEvaluation' @edit='editEvaluation' @deletes='deleteEvaluation'></foot-modal>
    <enter-modal :text_modal='text' v-if='show_text' @cancel='cancelText' @submit='submitText'></enter-modal>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import defaultHeader from "../../assets/defualt_head.png";
import starLight from "../../assets/star_light@2x.png";
import starGray from "../../assets/star_gray@2x.png";
import Api from "@/api/customEvaluationApi";
import defaultPage from "../../components/default";
import FootModal from '../../components/footModal';
import EnterModal from '../../components/enterModal';
import AppConfig from "../../app.config.js";

export default {
  name: "customEvaluation",
  components: {
    defaultPage,
    FootModal,
    EnterModal
  },
  data() {
    return {
      show_modal: false,
      show_text: false,
      text: '',
      revert_obj: null,
      text_type: null,
      defaultHeader: defaultHeader,
      starLight: starLight,
      starGray: starGray,
      technicianList: [
        {
          memUsername: "全部技师",
          memUid: -1
        }
      ],
      scoreList: [
        {
          name: "不限",
          code: 0
        },
        {
          name: 1,
          code: 1
        },
        {
          name: 2,
          code: 2
        },
        {
          name: 3,
          code: 3
        },
        {
          name: 4,
          code: 4
        },
        {
          name: 5,
          code: 5
        }
      ],
      evaStatus: [
        {
          name: "不限",
          code: 0
        },
        {
          name: "未回复",
          code: 1
        },
        {
          name: "已回复",
          code: 2
        }
      ],
      evalutions: [],
      page: 1,
      pageSize: 10,
      techSel: {
        memUsername: "全部技师",
        memUid: -1
      },
      scoreSel: {
        name: "评分",
        code: 0
      },
      statusSel: {
        name: "回复状态",
        code: 0
      },
      isTechSel: false,
      isScoreSel: false,
      isStatusSel: false,
      noData: false,
      isShowdefualt: false,
      noDataText: "暂无客户评价",
      authority: {},               // 权限
    };
  },
  created() {
    this.authority = AppConfig.user.permission
    let self = this;
    this.getListInfo({
      page: self.page,
      per_page: self.pageSize
    });
    this.getRankListInfo1();
  },
  computed: {},
  watch: {},
  methods: {
    formartDate: function(date) {
      var farmarttedDate = new Date(date * 1000);
      var year = farmarttedDate.getFullYear();
      var month = farmarttedDate.getMonth() + 1;
      var day = farmarttedDate.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    select: function(code) {
      let self = this;
      switch (code) {
        case 0:
          self.isTechSel = !self.isTechSel;
          self.isScoreSel = false;
          self.isStatusSel = false;
          break;
        case 1:
          self.isTechSel = false;
          self.isScoreSel = !self.isScoreSel;
          self.isStatusSel = false;
          break;
        case 2:
          self.isTechSel = false;
          self.isScoreSel = false;
          self.isStatusSel = !self.isStatusSel;
          break;
        default:
          break;
      }
    },
    selected: function(code, index) {
      let self = this;
      self.page = 1;
      var data = {
        page: self.page,
        per_page: self.pageSize
      };
      switch (code) {
        case 1:
          self.techSel = self.technicianList[index];
          self.isTechSel = false;
          break;
        case 2:
          self.scoreSel = self.scoreList[index];
          self.isScoreSel = false;
          break;
        case 3:
          self.statusSel = this.evaStatus[index];
          self.isStatusSel = false;

          break;
      }
      if (self.techSel.memUid !== -1) {
        data.technican_id = self.techSel.memUid;
      }
      if (self.scoreSel.code !== 0) {
        data.score = self.scoreSel.code;
      }
      if (self.statusSel.code !== 0) {
        data.answer_type = self.statusSel.code;
      }
      self.getListInfo(data);
    },
    getListInfo: function(requestData, done) {
      let self = this;
      if (requestData.page === 1) {
        self.$loading.show("加载中");
      }
      Api.getEvalutionInfo(requestData).then(
        function(response) {
          let data = response.data;
          if (response.code === 0 && data.data) {
            //加载首页数据时应重新绑定页面数据
            if (self.evalutions.length == 0 || self.page == 1) {
              self.evalutions = data.data;
              done && done();
              self.$refs.my_scroller && self.$refs.my_scroller.scrollTo(0, 0);
            } else {
              data.data.forEach(item => {
                self.evalutions.push(item);
              });
              self.$refs.my_scroller.resize();
            }
            if (
              data.data.length < self.per_page ||
              data.meta.total == self.evalutions.length
            ) {
              self.noData = true;
              done && done(true);
            } else {
              self.noData = false;
              done && done();
            }
            if (self.evalutions.length == 0) {
              self.isShowdefualt = true;
            } else {
              self.isShowdefualt = false;
            }
          } else {
            self.noDataText = "获取客户评价列表失败";
            self.isShowdefualt = true;
            done && done(true);
          }
          self.$loading.hide();
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    getRankListInfo1: function() {
      let self = this;
      Api.getRankListInfo({
        is_all: 1,
      }).then(
        function(response) {
          if (response.status !== 200 || !response.data) {
            return false;
          }
          let data = response.data;
          if (data && data.data) {
            self.technicianList = self.technicianList.concat(data.data);
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    cancelSelect: function() {
      let self = this;
      if (self.isTechSel || self.isScoreSel || self.isStatusSel) {
        self.isTechSel = false;
        self.isScoreSel = false;
        self.isStatusSel = false;
      }
    },
    previewImage: function(commentImages, url) {
      var params = [];
      commentImages.forEach(item => {
        params.push(item.image_url);
      });
      console.log("previewImage" + JSON.stringify(params));
      return new Promise(function() {
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: params // 需要预览的图片http链接列表
        });
      });
    },
    // 上拉加载
    infinite(done) {
      let self = this;
      if (self.noData) {
        done(true);
        return;
      }
      self.page++;
      var data = {
        page: self.page,
        per_page: self.pageSize,
        technican_id: self.techSel.id,
        score: self.scoreSel.code,
        answer_type: self.statusSel.code
      };
      self.getListInfo(data, done);
    },
    // 下拉刷新
    refresh() {
      let self = this;
      self.page = 0;
    },
    // 回复弹框
    revert(obj) {
      this.revert_obj = obj
      this.show_text = true
      this.text_type = 1
    },
    // 编辑回复弹框
    editRevert(obj) {
      this.revert_obj = obj
      this.text = obj.sub_comment[0].comment_content
      this.show_modal = true
    },
    // 编辑回复弹框的编辑回调
    editEvaluation(data) {
      this.show_modal = false
      this.show_text = true
      this.text_type = 2
    },
    // 编辑回复弹框的删除回调
    deleteEvaluation(data) {
      this.show_modal = false
      this.text = null
      let self = this
      self.$loading.show("加载中");
      Api.deleteCommentApi({
        comment_id: this.revert_obj.sub_comment[0].comment_id
      }).then(function(res){
        if (res.status === 200 && res.data) {
          self.$loading.hide();
          self.$toast.show("删除成功");
          self.getListInfo({
            page: 1,
            per_page: 10,
            technican_id: self.techSel.id,
            score: self.scoreSel.code,
            answer_type: self.statusSel.code
          })
        } else {
          self.$toast.error("删除失败");
        }
      }, function(err){
        self.$loading.hide();
        self.$router.replace({ path: "/error", query: { msg: err } });
      })
    },
    // 编辑回复弹框的取消回调
    cancelEvaluation(data) {
      this.text = null
      this.revert_obj = null
      this.show_modal = false
    },
    // 回复弹框的取消回调
    cancelText() {
      this.text = null
      this.revert_obj = null
      this.show_text = false
    },
    // 回复弹框的发布回调
    submitText(data) {
      let texts = data.text
      if (this.text_type === 1) {
        this.createText(texts)
      } else if (this.text_type === 2) {
        this.editText(texts)
      }
    },
    // 编辑回复方法
    editText(texts) {
      this.show_text = false
      this.text = null
      let self = this
      self.$loading.show("加载中");
      Api.editCommentApi({
        comment_id: this.revert_obj.sub_comment[0].comment_id,
        comment_content: texts,
      }).then(function(res){
        if (res.status === 200 && res.data) {
          self.$loading.hide();
          self.$toast.show("编辑成功");
          self.getListInfo({
            page: 1,
            per_page: 10,
            technican_id: self.techSel.id,
            score: self.scoreSel.code,
            answer_type: self.statusSel.code
          })
        } else {
          self.$toast.error("编辑失败");
        }
      }, function(err){
        self.$loading.hide();
        self.$router.replace({ path: "/error", query: { msg: err } });
      })
    },
    // 创建回复方法
    createText(texts) {
      this.show_text = false
      this.text = null
      let self = this
      if(texts == null || texts.trim() == '') {
        self.$toast.error("请输入回复内容！");
        return false;
      }
      self.$loading.show("加载中");
      Api.createCommentApi({
        comment_id: this.revert_obj.comment_id,
        comment_content: texts,
      }).then(function(res){
        if (res.status === 200 && res.data) {
          self.$toast.show("回复成功");
          self.getListInfo({
            page: 1,
            per_page: 10,
            technican_id: self.techSel.id,
            score: self.scoreSel.code,
            answer_type: self.statusSel.code
          })
        } else {
          self.$toast.error("回复失败");
        }
        self.$loading.hide();
      }, function(err){
        self.$loading.hide();
        self.$router.replace({ path: "/error", query: { msg: err } });
      })
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/_variables.less";
@import "../../less/config/vendor-prefixes.less";
@import "../../less/base/position.less";
@import "../../less/base/padding.less";
@import "../../less/config/mixins/border.less";
@import "../../less/config/mixins/pxToRem.less";
@import "../../less/config/mixins/arrow.less";
@import "../../less/base/utilities.less";
.customEvaluation {
  width: 100%;
  height: 100vh;
  .p-t-f {
    padding-top: 0.3rem;
  }
  .content-bg {
    background-color: @body-bg;
  }
  .content {
    padding-bottom: 0.6rem;
  }
  .choose {
    .position-fixed();
    z-index: 999;
    width: 100%;
    .chooseTitle {
      .display-flex();
      padding-bottom: 0.18rem;
      justify-content: space-between;
      padding-left: 0.4rem;
      padding-right: 0.4rem;
      width: 100%;
      z-index: 999;
      background-color: @body-bg;
      padding-top: 0.18rem;
      .fItem {
        // width: auto;
        min-width: 1.3rem;
        height: auto;
        text-align: center;
        span {
          color: #8a92a2;
          font-size: 0.28rem;
          line-height: 0.32rem;
        }
        .arrowDown {
          .arrow(down, 3px, #6d7483, #6d7483);
          border: none;
          position: relative;
          margin-left: 0.18rem;
          display: inline-block;
          padding-bottom: 0.03rem;
        }
        .arrowUp {
          .arrow(up, 3px, #6d7483, #6d7483);
          border: none;
          position: relative;
          margin-left: 0.18rem;
          display: inline-block;
          padding-bottom: 0.15rem;
        }
      }
    }
    .chooseBox {
      width: 100%;
      box-shadow: 0px 4px 4px 0px rgba(35, 36, 46, 0.06);
      .chooseUl {
        overflow: scroll;
        max-height: 4.8rem;
        .bor-t {
          .border-top(1px, solid, #f0f0f0);
        }
        .chooseli {
          height: 0.8rem;
          color: #3d424c;
          font-size: 0.28rem;
          padding-left: 0.4rem;
        }
      }
    }
  }
  .evaTitle {
    .avatDiv {
      padding-left: 0.3rem;
      padding-top: 0.38rem;
      .avat {
        border-radius: 50%;
        height: 0.64rem;
        width: 0.64rem;
      }
    }
    .infoDiv {
      display: inline-block;
      padding-left: 0.18rem;
      padding-top: 0.38rem;
      line-height: 1;
      .title {
        display: flex;
        // height: 0.62rem;
        .center {
          // align-self: center;
          span {
            // font-size: 0.28rem;
            color: #332e2e;
            line-height: 1;
          }
          .first {
            font-weight: 600;
            min-height: 0.3rem;
          }
          .second {
            color: #4D515A;
            padding-top: 0.1rem;
            min-height: 0.3rem;
          }
        }
      }
      .score {
        color: #000000;
        .display-flex();
        .starList {
          margin-right: 0.14rem;
          letter-spacing: -0.08rem;
          .star {
            height: 0.24rem;
            margin-right: 0.06rem;
          }
        }
        .scoreContent {
          display: inline-block;
          line-height: 0.28rem;
          font-size: 0.28rem;
          letter-spacing: 0.02rem;
        }
      }
    }
    .date {
      float: right;
      padding-top: 0.4rem;
      span {
        color: #8a92a2;
        line-height: 0.28rem;
        font-size: 0.28rem;
        padding-right: 0.48rem;
      }
    }
  }
  .border-b {
    border-bottom: 1px solid #f0f0f0;
  }
  .p-b-52 {
    padding-bottom: 0.52rem;
  }
  .evaContet {
    margin-top: 0.34rem;
    margin-left: 1.12rem;
    margin-right: 0.3rem;
    .wrap {
      overflow-wrap: break-word;
    }
    .text {
      color: #3d424c;
      font-size: 0.32rem;
      line-height: 0.44rem;
      display: block;
      padding-right: 0.34rem;
    }
    .imgList {
      margin-top: 0.36rem;
      .imgBox {
        height: 2rem;
        width: 2rem;
        display: inline-block;
      }
      .mar-r-4 {
        margin-right: 0.04rem;
      }
      .mar-t-4 {
        margin-top: 0.04rem;
      }
    }
  }
  .recommand {
    margin-left: 1.12rem;
    margin-right: 0.3rem;
    margin-top: 0.2rem;
    .title {
      display: block;
      font-size: 0.24rem;
      line-height: 0.34rem;
      color: #8a92a2;
    }
    .techTile {
      .avatDiv {
        display: inline-block;
        padding-top: 0.14rem;
        .avat {
          border-radius: 50%;
          height: 0.6rem;
          width: 0.6rem;
        }
      }
      .infoDiv {
        max-height: 0.72rem;
        display: inline-block;
        padding-left: 0.18rem;
        .title {
          display: block;
          color: #332e2e;
          font-size: 0.24rem;
          line-height: 0.38rem;
          max-width: 5rem;
        }
        .occup {
          margin-bottom: 0.4rem;
          max-width: 5rem;
          p {
            font-size: 0.24rem;
            color: #6682ff;
            line-height: 0.24rem;
            line-height: 0.32rem;
          }
          .optic {
            opacity: 0;
          }
        }
      }
    }
    .commit {
      background: #f7f7fa;
      padding: 0.2rem 0.4rem 0.2rem 0.2rem;
      span {
        font-size: 0.28rem;
        color: #8a92a2;
        line-height: 0.4rem;
      }
    }
  }
}
.commit-btn{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.3rem;
  .replay{
    color: #8A92A2;
    width: 1.2rem;
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    border: 1px solid #dcdee3;
    border-radius: 50px;
  }
}
</style>
