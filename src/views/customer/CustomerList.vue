<template>
  <div class="list font-PC-re"
       :class="isGuide?'list-fixed':''">
    <!-- 没有数据 -->
    <div class="searchPage">
      <div class="search">
        <div class="sea_l">
          <div class="sea_box">
            <img class="sea"
                 src="../../assets/search.png"
                 alt="">
            <input type="text"
                   placeholder="请输入微信昵称"
                   v-model="input"
                   @change="change($event)"
                   maxlength="20">
            <div class="close font-18"
                 @click="cleanData()"
                 v-if="input !== ''">×</div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-header">
      <div class="header-item m-t-5"
           v-if="isClick"
           :class="isGuide && !isGuideLast? 'background-white':''"
           @click="goCustomerCard">
        <div class="item-line">
          <img class="item-pic pull-left"
               src="@/assets/external_contact.png"
               alt="">
          <div class="item-content">添加微信好友</div>
          <img class="arrow_right pull-left"
               src="@/assets/arrow_right.png"
               alt="">
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="header-item m-t-5"
           v-if="!isClick"
           :class="isGuide && !isGuideLast? 'background-white header-fixed':''">
        <div class="item-line">
          <img class="item-pic pull-left"
               src="@/assets/external_contact.png"
               alt="">
          <div class="item-content">添加微信好友</div>
          <img class="arrow_right pull-left"
               src="@/assets/arrow_right.png"
               alt="">
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="header-item"
           v-if="isClick"
           :class="isGuideLast?'background-white':''"
           @click="chooseExternalContacts">
        <div class="item-line">
          <img class="item-pic pull-left"
               src="@/assets/external_user.png"
               alt="">
          <div class="item-content pull-left">标记微信好友为企业客户</div>
          <img class="arrow_right"
               src="@/assets/arrow_right.png"
               alt="">
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="header-item"
           v-if="!isClick"
           :class="isGuideLast?'background-white header-fixed':''">
        <div class="item-line">
          <img class="item-pic pull-left"
               src="@/assets/external_user.png"
               alt="">
          <div class="item-content pull-left">标记微信好友为企业客户</div>
          <img class="arrow_right"
               src="@/assets/arrow_right.png"
               alt="">
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <!-- <default-page picture="nodata"
                  text="暂无客户数据"
                  v-if="firstFinish && ordinaryList.length === 0"
                  style="height:0;width:100%;"></default-page> -->
    <!-- 引导页入口 -->
    <!-- <default-page picture="nodata"
                  text="暂无客户数据"
                  v-if=""
                  style="height:0;width:100%;"></default-page> -->
    <div class="no-register"
         v-if="firstFinish && ordinaryList.length === 0">
      <img class="no-register-pic"
           src="@/assets/no_customer.png"
           alt="">
      <div class="font-12 black-3e no-register-title m-t-20">还没有客户哦，
        <span class="add-color"
              @click="goGuideFun">点击了解如何添加客户</span>
      </div>
    </div>
    <scroller class="scroll-container"
              ref="my_scroller"
              v-if="ordinaryList.length && ordinaryList.length > 0 && firstFinish">
      <div class="star-customer"
           v-if="showStar && starCustomerList.length !== 0">
        <div class="font-12 star-name pull-left">标星客户</div>
        <div class="clearfix"></div>
      </div>
      <!-- 引导 -->
      <div class="font-12 go-guide"
           @click="goGuideFun">
        <div class="pull-left font-12 m-r-10">了解如何添加客户</div>
        <div class="pull-right arrow-right">
          <img src="@/assets/arrow_right2.png"
               alt="">
        </div>

      </div>
      <div class="list-icon"
           v-if="showStar">
        <div class="list-item"
             v-for="(item,index) in starCustomerList"
             v-bind:key=index
             @click="goItem(item.ec_id)">
          <div class="head-portrait pull-left">
            <img :src="item.avatar?item.avatar:defualtHead"
                 alt="">
          </div>
          <div class="user-name m-l-30 pull-left">
            <div class="nick-name font-16">{{item.nick_name}}</div>
            <div class="real-name font-12">{{item.real_name}}</div>
          </div>
        </div>
      </div>
      <div class="ordinary-list">
        <div class="list-icon">
          <div v-for="(item,index) in ordinaryList"
               v-bind:key=index>
            <div class="list-item"
                 @click="goItem(item.ec_id)"
                 v-if="!item.type">
              <div class="head-portrait pull-left">
                <img :src="item.avatar?item.avatar:defualtHead"
                     alt="">
              </div>
              <div class="user-name m-l-30 pull-left">
                <div class="nick-name font-16">{{item.nick_name}}</div>
                <div class="real-name font-12">{{item.real_name}}</div>
              </div>
            </div>
            <div class="star-customer"
                 v-if="item.type">
              {{item.text}}
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div class="side-search"
         v-if="showStar">
      <ul>
        <li class="leter font-12"
            v-for="(item,index) in sideSearchLeter"
            @click="scrollTo(item)"
            v-bind:key="index">{{item}}
        </li>
      </ul>
    </div>
    <div class="guide"
         v-if="isGuide">
      <div class="guide-title "
           v-if="isGuide && !isGuideLast">
        <!-- <div class="font-16 white">第一步：<br> 点击“添加微信好友”，出示二维码给客户，面对面扫码添加客户为好友</div> -->
        <div class="font-16 white font-PC-sd">第一步：</div>
        <div class="font-16 white font-PC-sd">点击“添加微信好友”，出示二维码给客户，面对面扫码添加客户为好友</div>
      </div>
      <div class="guide-footer"
           v-if="isGuide && !isGuideLast">
        <div class="footer-btn pull-left text-center m-r-72 footer-left"
             @click="isGuideLastFun">
          <div class="btn-content black-11 font-16">下一步</div>
        </div>
        <div class="footer-btn pull-right text-center footer-right"
             @click="cancelGuideFun">
          <div class="btn-content font-16 white">跳过引导</div>
        </div>
      </div>
      <div class="guide-title m-t-390"
           v-if="isGuide && isGuideLast">
        <!-- <div class="font-16 white">第二步：<br> 点击“标记微信好友为企业客户”，在已添加的微信好友中勾选，标记为客户</div> -->
        <div class="font-16 white font-PC-sd">第二步：</div>
        <div class="font-16 white font-PC-sd">点击“标记微信好友为企业客户”，在已添加的微信好友中勾选，标记为客户</div>
      </div>
      <div class="guide-footer left-25"
           v-if="isGuide && isGuideLast">
        <div class="footer-btn text-center footer-left"
             @click="cancelGuideFun">
          <div class="btn-content font-16 black-11">我知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchPage from "../../components/searchPage";
import defualtHead from "../../assets/defualt_head.png";
// import TemporaryPer from "../../assets/avatar.jpeg";
import Api from "@/api/customerApi";
import defaultPage from "../../components/default";
// import AppConfig from "../../app.config.js";

export default {
  name: "list",
  components: {
    SearchPage,
    defaultPage
  },
  data() {
    return {
      isRegister: false,
      starCustomerList: [],
      ordinaryList: [],
      sideSearchLeter: [],
      input: "",
      firstLoadList: false,
      showStar: true,
      paramsObj: {
        page: 1,
        per_page: 5000,
        ec_name: ""
      },
      defualtHead: defualtHead,
      isDrop: true,
      firstFinish: false,
      isGuide: false,
      isGuideLast: false,
      isClick: true
    };
  },
  mounted() {
    this.getCustomerList(this.paramsObj);
  },
  methods: {
    //进入引导页
    goGuideFun: function() {
      var self = this;
      self.isGuide = true;
      self.isClick = false;
      console.log(self.isGuide, "self.isGuide");
    },
    cancelGuideFun: function() {
      var self = this;
      self.isGuide = false;
      self.isGuideLast = false;
      self.isClick = true;
      console.log(self.isGuide, "取消self.isGuide");
    },
    isGuideLastFun: function() {
      var self = this;
      self.isClick = false;
      self.isGuideLast = true;
      console.log(self.isGuideLast, "self.isGuideLast");
    },
    //选择外部联系人
    chooseExternalContacts: function() {
      console.log("++++");
      let self = this;
      self.isDrop = false;
      try {
        wx.invoke(
          "selectExternalContact",
          {
            filterType: 1 //0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。在企业微信2.4.22及以后版本支持该参数
          },
          function(res) {
            console.log('打开外部联系人回调', res)
            if (res.err_msg === "selectExternalContact:ok") {
              //返回此次选择的外部联系人userId列表，数组类型
              Api.chooseContacts({
                ids: JSON.stringify(res.userIds)
              }).then(
                function(data) {
                  if (data.code === 0) {
                    console.log("选择外部人员成功");
                    self.isDrop = true;
                    self.getCustomerList(self.paramsObj);
                  } else {
                    console.log("获取客户管理列表失败");
                  }
                },
                function(err) {
                  self.$loading.hide();
                  self.$router.replace({
                    path: "/error",
                    query: { msg: err }
                  });
                }
              );
            } else {
              console.log('调用失败',res.err_msg);
            }
          }
        );
      } catch (err) {
        console.log("err" + err);
      }
    },
    change(e) {
      this.paramsObj.ec_name = e.target.value;
      this.getCustomerList(this.paramsObj);
    },
    goItem: function(ec_id) {
      console.log(this.starCustomerList);
      sessionStorage.setItem("ec_id", ec_id);
      this.$router.push({
        name: "customer-detail",
        params: { ec_id: ec_id }
      });
    },
    goCustomerCard: function() {
      this.$router.push({ name: "customer-card" });
    },
    getCustomerList: function(paramsObj) {
      let self = this;
      self.$loading.show("加载中");
      Api.getCustomerList(paramsObj).then(
        function(data) {
          self.$loading.hide();
          self.firstFinish = true;
          if (data.code === 0) {
            let dataInfo = data.data; // result 数据
            // 没有数据
            if (data.data.data && data.data.data.length === 0) {
              self.ordinaryList = [];
              self.showStar = false;
              // done && done(true);
              return false;
            }
            // 渲染星标客户
            if (dataInfo.stars_customer.length > 0) {
              self.starCustomerList = dataInfo.stars_customer;
            }
            if (self.paramsObj.ec_name !== "" && self.firstLoadList) {
              self.ordinaryList = dataInfo.data;
              self.showStar = false;
            } else {
              // 临时数组构建按字母排序的数据结构
              self.firstLoadList = true;
              self.showStar = true;
              let tmp_ary = [],
                tmp_flag = "";
              if (dataInfo.data.length > 0) {
                for (let i = 0, len = dataInfo.data.length; i < len; i++) {
                  let flag = dataInfo.data[i].user_index[0];
                  var reg = /^[a-zA-Z].*/;
                  if (!reg.test(flag)) {
                    flag = "#";
                  } else {
                    flag = dataInfo.data[i].user_index[0].toUpperCase();
                  }
                  if (tmp_flag !== flag) {
                    tmp_flag = flag;
                    tmp_ary.splice(i + tmp_ary.length, 0, {
                      text: flag,
                      type: "title"
                    });
                  }
                  tmp_ary.push(dataInfo.data[i]);
                  // 右侧测滑排序内容添加
                  if (self.sideSearchLeter.indexOf(flag) === -1) {
                    self.sideSearchLeter.push(flag);
                  }
                  // self.sideSearchLeter = [
                  //   "A",
                  //   "B",
                  //   "C",
                  //   "d",
                  //   "E",
                  //   "F",
                  //   "G",
                  //   "H",
                  //   "I",
                  //   "J",
                  //   "K",
                  //   "L",
                  //   "M",
                  //   "N",
                  //   "O",
                  //   "P",
                  //   "K",
                  //   "R",
                  //   "S",
                  //   "T",
                  //   "U",
                  //   "V",
                  //   "W",
                  //   "X",
                  //   "Y",
                  //   "Z"
                  // ];
                }
                window.customerList = tmp_ary;
                self.ordinaryList = tmp_ary;
              }
            }
          } else {
            console.log("获取客户管理列表失败");
          }
        },
        function(err) {
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    /**
     * @method
     * @description 滚动至特定位置
     * @param flag
     */
    scrollTo(flag) {
      let self = this,
        size = 72; // 初始距离
      for (let i = 0, len = self.ordinaryList.length; i < len; i++) {
        self.ordinaryList[i].type ? (size += 36) : (size += 72);
        if (self.ordinaryList[i].text === flag) {
          this.$refs.my_scroller.scrollTo(0, size, false);
          return;
        }
      }
    },
    /**
     * @method
     * @description 清空input框
     */
    cleanData() {
      this.paramsObj.ec_name = "";
      this.input = "";
      this.getCustomerList(this.paramsObj);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/base/position.less";

.list {
  width: 100%;
  height: 100vh;
  background: #fff;
  // .searchPage {
  //   height: 1rem;
  // }
  .searchPage {
    height: 1rem;
    .search {
      position: fixed;
      z-index: 99;
      width: 100%;
      box-sizing: border-box;
      background: #fff;
      padding: 0.16rem 0.2rem;
      .sea_c {
        width: 100%;
        height: 0.7rem;
        line-height: 0.7rem;
        background: #eee;
        border-radius: 0.08rem;
        text-align: center;
        font-size: 16px;
        color: #999;
      }
      img.sea {
        display: inline-block;
        width: 0.26rem;
        height: 0.26rem;
      }
      .close {
        position: absolute;
        width: 60/100rem;
        height: 60/100rem;
        top: 0;
        text-align: center;
        line-height: 60/100rem;
        right: 0;
      }
      .sea_l {
        position: relative;
        /*padding-left: 0.4rem;*/
        /*padding-right: 0.84rem;*/
        // border:1px solid rgba(61,66,76,1);
        border-radius: 0.04rem;
        .arrow {
          position: absolute;
          left: 0;
          top: 0;
          padding: 0.2rem 0 0 0;
          img.left {
            width: 0.18rem;
            height: 0.28rem;
          }
        }
        .sea_box {
          position: relative;
          width: 100%;
          height: 0.7rem;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid #3d424c;
          border-radius: 0.04rem;
          padding-left: 0.6rem;
          overflow: hidden;
          img.sea {
            position: absolute;
            top: 50%;
            left: 0.2rem;
            margin-top: -0.13rem;
          }
          div.sea-line {
            position: absolute;
            top: 30%;
            display: inline-block;
            width: 1px;
            height: 22/100rem;
            background: #3d424c;
          }
          input {
            width: 100%;
            // height: 0.68rem;
            background: #fff;
            font-size: 26/100rem;
            color: #1d1d26;
            // line-height: 0.68rem;
            padding: 0.18rem 0;
            border: none;
            outline: none;
          }
        }
        .sea_btn {
          position: absolute;
          right: 0;
          top: 0;
          line-height: 0.68rem;
          font-size: 16px;
        }
      }
    }
  }
  .scroll-container {
    position: absolute;
    top: 370/100rem;
    height: auto !important;
    bottom: 0;
  }
  .no-register {
    text-align: center;
    .no-register-pic {
      width: 2.4rem;
      height: 2.4rem;
    }
    .no-register-title {
      height: 0.32rem;
      line-height: 0.32rem;
      .add-color {
        color: #5e7bff;
      }
    }
  }
  .list-header {
    //   margin-top: -0.3rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    z-index: 999;
    .header-item {
      background: #fff;
      position: relative;
      padding: 0.3rem 0;
      &:after {
        .Pseudo-border-after(#f0f0f0);
        // left: 1.36rem;
      }
      &:last-child {
        &:after {
          .Pseudo-border-after(#f0f0f0);
          height: 0;
        }
      }
      .item-line {
        line-height: 0.76rem;
        height: 0.76rem;
      }
      .item-pic {
        width: 0.76rem;
        height: 0.76rem;
        border-radius: 50%;
      }
      .item-content {
        margin-left: 0.3rem;
        color: #3d424c;
        font-size: 32/100rem;
        display: inline-block;
      }
      .arrow_right {
        width: 0.1rem;
        height: 0.2rem;
        float: right;
        margin-top: 0.24rem;
      }
    }
    .background-white {
      // padding: 0;
      background: #fff;
      margin: 0 -0.3rem;
      padding: 0.3rem;
      z-index: 101;
    }
    .header-fixed {
      width: 100%;
      position: fixed;
    }
    .mar-t-03 {
      margin-top: 0.3rem;
    }
  }
  .ordinary-list {
    overflow: hidden;
  }
  .star-customer {
    width: 100%;
    height: 0.72rem;
    line-height: 0.72rem;
    color: #6d7483;
    font-size: 24/100rem;
    background: #f7f7fa;
    padding: 0 0.3rem;
    // padding-right: 0.08rem;
    .star-name {
      display: inline-block;
      .arrow_right {
        width: 0.16rem;
        height: 0.16rem;
      }
      .arrow-right {
        width: 0.1rem;
        height: 0.2rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .search-pic {
      width: 0.16rem;
      height: 0.16rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .go-guide {
    position: fixed;
    top: 0.15rem;
    right: 0.3rem;
    color: #5e7bff;
    z-index: 99;
    .arrow-right {
      width: 0.1rem;
      height: 0.2rem;
      line-height: 0.42rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .list-icon {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    .list-item {
      position: relative;
      padding-left: 0.3rem;
      padding-bottom: 0.3rem;
      padding-top: 0.3rem;
      overflow: hidden;
      .head-portrait {
        width: 0.76rem;
        height: 0.76rem;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .user-name {
        display: inline-block;
        .nick-name {
          height: 0.44rem;
          line-height: 0.44rem;
          color: #3d424c;
        }
        .real-name {
          height: 0.32rem;
          line-height: 0.32rem;
          color: #8a92a2;
          margin-top: 0.08rem;
        }
      }
      &:after {
        .Pseudo-border-after(#f0f0f0);
        left: 1.36rem;
      }
    }
  }
  .side-search {
    position: fixed;
    height: 75%;
    width: 0.8rem;
    right: 0;
    top: 25%;
    .search-pic {
      width: 0.16rem;
      height: 0.16rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    :nth-child(2) {
      margin-top: 0.1rem;
    }
    .leter {
      width: 100%;
      height: 0.12rem;
      line-height: 0.12rem;
      margin-bottom: 0.24rem;
      color: #6d7483;
    }
  }
  .side-search > ul {
    text-align: center;
    width: 80/100rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .side-search > ul > li {
    display: block;
    width: 50/100rem;
    height: 50/100rem;
    text-align: center;
  }
  .guide {
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 100;
    position: fixed;
    background: rgba(0, 0, 0, 1);
    opacity: 0.7522;
    .guide-title {
      margin: 2.56rem 1.06rem 0 0.4rem;
      // position: fixed;
      // top: 2.56rem;
      // left: 0.4rem;
    }
    .m-t-390 {
      margin-top: 3.9rem;
      // top: 3.9rem;
    }
    .guide-footer {
      position: absolute;
      bottom: 0.88rem;
      left: 0.76rem;
      .footer-btn {
        width: 2.42rem;
        height: 0.76rem;
        border-radius: 50px;
        border: 2px solid rgba(255, 255, 255, 1);
        .btn-content {
          height: 0.76rem;
          line-height: 0.7rem;
        }
      }

      .m-r-72 {
        margin-right: 0.72rem;
      }
      .footer-left {
        background: #fff;
      }
    }
    .left-25 {
      left: 2.54rem;
    }
  }
}
.list-fixed {
  position: fixed;
}
</style>
