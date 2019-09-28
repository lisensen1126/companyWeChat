<template>
  <div class="customer-infomation font-PC-re"
       v-if="firstFinish">
    <!-- 提示信息 -->
    <div class="close-tips"
         v-if="isShowTip">
      <div class="font-11 blue-5e tips-info m-l-30 pull-left">建议尽可能完善客户的资料，有助于为客户提供个性化服务。</div>
      <div class="tips-btn pull-right"
           @click="goCloseTips">
        <img src="@/assets/close_tips.png"
             alt="">
      </div>
    </div>
    <div class="infomation-main">
      <!-- 昵称相关信息 -->
      <div class="list-icon">
        <div class="list-item font-14 left30 gray-af">
          <div class="line-height-1 pull-left black-3d">昵称</div>
          <div class="text-over-show pull-right text-over-height text-right">{{cusInfomation.ec_name}}</div>
        </div>
        <div class="list-item font-14 left30">
          <div class="black-3d line-height-1 pull-left black-3d">姓名</div>
          <div class="black-3d text-over-height pull-right">{{cusInfomation.real_name}}</div>
          <input type="text"
                 placeholder="请输入姓名"
                 v-model="cusInfomation.real_name"
                 maxlength="15"
                 class="inputSel text-position black-3d font-14" />
        </div>
        <div class="list-item font-14 left30"
             v-if="cusInfomation.sex_status">
          <div class="line-height-1 pull-left  black-3d">性别</div>
          <div class="select-name black-3d line-height-1 pull-right text-right">{{ cusInfomation.sex | sexFil}}</div>
          <select name=""
                  id="selectVal"
                  v-model="cusInfomation.sex"
                  class="sex-select">
            <option value="">请选择性别</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>
        <div class="list-item font-14 left30 gray-af"
             v-if="!cusInfomation.sex_status">
          <div class="line-height-1 pull-left black-3d">性别</div>
          <!-- <div class="line-height-1 pull-right">{{cusInfomation.sex!=0? sexFilter(cusInfomation.sex): "请输入性别"}}</div> -->
          <div class="line-height-1 pull-right">{{cusInfomation.sex | sexFil}}</div>
        </div>
        <div class="list-item font-14 left30"
             v-if="cusInfomation.mobile_status">
          <div class="line-height-1 pull-left  black-3d">手机</div>
          <div class="line-height-1 pull-right">{{cusInfomation.ec_mobile || "请输入手机号"}}</div>
          <input type="text"
                 placeholder="请输入手机号"
                 v-model="cusInfomation.ec_mobile"
                 class="inputSel text-position black-3d font-14"
                 maxlength="11">
        </div>
        <div class="list-item font-14 left30 gray-af"
             v-if="!cusInfomation.mobile_status">
          <div class="line-height-1 pull-left black-3d">手机</div>
          <div class="line-height-1 pull-right">{{cusInfomation.ec_mobile}}</div>
        </div>
      </div>
      <!-- 生日、备注 -->
      <div class="list-icon m-t-30">
        <div class="list-item font-14 black-3d">
          <div class="line-height-1 pull-left">生日</div>
          <div class="line-height-1 pull-right"
               v-if="cusInfomation.birthday">{{cusInfomation.birthday}}</div>
          <div class="line-height-1 pull-right gray-af"
               v-if="cusInfomation.birthday==''">请选择生日日期</div>

          <input type="date"
                 id="birthday"
                 placeholder="请选择生日日期"
                 v-model="cusInfomation.birthday"
                 class="inputSel"
                 @change="changeDate">
        </div>
        <div class="list-item font-14 black-3d">
          <div class="line-height-1 pull-left">备注</div>
        </div>
        <div class="list-item font-14 black-3d">

          <textarea name=""
                    v-model="cusInfomation.em_remark"
                    class="text-are black-3d font-14 font-PC-re"
                    placeholder="请填写备注"
                    maxlength="50"
                    id="em_remark_id"></textarea>
        </div>
      </div>

    </div>
    <!-- 尾部按钮 -->
    <div class="info-btn"
         @click="goSave"
         v-if="!isFocusFlag">
      <div class="font-14 white btn-content">保存</div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/customerApi";
export default {
  name: "customer-infomation",
  data() {
    return {
      cusInfomation: {
        sex: 0,
        birthday: "",
        // ec_name: "悸动的秋天",
        // real_name: "某某某",
        // sex: 1,
        // ec_mobile: "13368298789",
        // birthday: "请选择生日",
        em_remark: "",
        mobile_status: true, //手机号可否编辑
        sex_status: true //性别可否编辑
      },
      isShowTip: true,
      ec_id: "",
      isEidt: false,
      nextData: "",
      firstFinish: false,
      birthDay: "",
      isGray: false,
      isFocusFlag: false
    };
  },
  filters: {
    sexFil(sex) {
      if (sex == 0) {
        return "请选择性别";
      } else if (sex == 1) {
        return "男";
      } else if (sex == 2) {
        return "女";
      }
    }
  },
  created() {
    console.log(this.$route.params.ec_id, 556);
    this.ec_id = this.$route.params.ec_id
      ? this.$route.params.ec_id
      : sessionStorage.getItem("ec_id");
    this.nextData = this.$route.params.data
      ? this.$route.params.data
      : sessionStorage.getItem("next_data");
    // var date_now = new Date();
    // // this.birthDay = this.formartDate(date_now);
    // var year = date_now.getFullYear();
    // var month =
    //   date_now.getMonth() + 1 < 10
    //     ? "0" + (date_now.getMonth() + 1)
    //     : date_now.getMonth() + 1;
    // var date =
    //   date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate();
    // this.birthDay = year + "-" + month + "-" + date;
    // console.log(this.birthDay, 5555);
    this.getEditInfo();
  },
  methods: {
    formartDate: function(date) {
      var dates = new Date(date * 1000);
      var year = dates.getFullYear();
      var month = dates.getMonth() + 1;
      var day = dates.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //手机号
    changePhone(e) {
      var self = this;
      self.cusInfomation.ec_mobile = e.target.value;
      console.log(self.cusInfomation.ec_mobile, "手机号可改变");
    },
    //姓名
    changeName(e) {
      console.log(e.target.value, "e");
      this.cusInfomation.real_name = e.target.value;
      console.log(this.cusInfomation.real_name, "姓名可改变");
    },
    //生日change
    changeDate(e) {
      var self = this;
      console.log(e.target.value, "e");
      var birthday = e.target.value;
      // this.cusInfomation.birthday = e.target.value;
      console.log(self.cusInfomation.birthday, "生日可改变");
      var now = new Date().getTime();
      var date_now = new Date();
      debugger;
      //得到当前年份
      var year = date_now.getFullYear();
      var month =
        date_now.getMonth() + 1 < 10
          ? "0" + (date_now.getMonth() + 1)
          : date_now.getMonth() + 1;

      var date =
        date_now.getDate() < 10 ? "0" + date_now.getDate() : date_now.getDate();
      //设置input标签的max属性
      // var bir = document.getElementById("birthday");
      // bir.setAttribute("max", year + "-" + month + "-" + date);

      if (now < new Date(birthday.replace(/-/g, "/")).getTime()) {
        // self.cusInfomation.birthday = now;
        self.cusInfomation.birthday = year + "-" + month + "-" + date;
        console.log(self.cusInfomation.birthday, "444444");
        // debugger;
      }
    },
    //改变isEdit
    changeIsEdit: function() {
      var self = this;
      var edit = !self.isEidt;
      console.log(edit, 666);
      return (self.isEidt = edit);
    },
    go: function() {
      console.log(this.starCustomerList);
    },
    getEditInfo: function() {
      var self = this;
      self.$loading.show("加载中");
      Api.getEditInfo({ ec_id: self.ec_id, data: self.nextData }).then(
        function(data) {
          self.$loading.hide();
          self.firstFinish = true;
          if (data.code === 0) {
            if (data.data) {
              self.cusInfomation = data.data;
              console.log(data.data, 33);
              self.ec_id = data.data.ec_id;
              console.log(self.cusInfomation, "编辑接口成功");
              setTimeout(function() {
                var em_remark_id = document.querySelector("#em_remark_id");
                em_remark_id.addEventListener("focus", function() {
                  self.isFocusFlag = true;
                });
                em_remark_id.addEventListener("blur", function() {
                  self.isFocusFlag = false;
                });
              }, 500);
            }
          } else {
            console.log("获取编辑接口失败");
          }
        },
        function(err) {
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    goCloseTips: function() {
      var self = this;
      var a = !self.isShowTip;
      self.isShowTip = a;
      return self.isShowTip;
    },
    goSave: function() {
      var self = this;
      if (self.cusInfomation.ec_mobile) {
        if (!/^1[34578]\d{9}$/.test(self.cusInfomation.ec_mobile)) {
          console.log("手机号码有误，请重填");
          self.$toast.error("手机号码有误，请重填");
          return false;
        }
      }
      var params = {
        ec_id: self.ec_id,
        // sex: self.cusInfomation.sex,
        // mobile: self.cusInfomation.ec_mobile,
        real_name: self.cusInfomation.real_name,
        // remark: self.cusInfomation.em_remark,
        birthday: self.cusInfomation.birthday
      };
      if (self.cusInfomation.em_remark) {
        params.remark = self.cusInfomation.em_remark;
      } else {
        params.remark = "";
      }
      if (self.cusInfomation.sex != 0) {
        params.sex = self.cusInfomation.sex;
      }
      if (self.cusInfomation.ec_mobile) {
        params.mobile = self.cusInfomation.ec_mobile;
      }
      console.log(params, "保存参数");
      Api.saveInfomation(params).then(
        function(data) {
          if (data.code === 0) {
            console.log("获取保存接口成功");
            self.$toast.show("编辑成功");
            self.$router.push({
              name: "customer-detail",
              params: { ec_id: self.ec_id }
            });
          } else {
            self.$toast.error(data.message);
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
.customer-infomation {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
  position: relative;
  .close-tips {
    height: 0.64rem;
    background: #e0e0e9;
    .tips-info {
      line-height: 0.64rem;
    }
    .tips-btn {
      width: 0.2rem;
      height: 0.2rem;
      margin-top: 0.2rem;
      margin-right: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .infomation-main {
    padding-top: 0.3rem;
    margin: 0 0.3rem;
    .list-icon {
      position: relative;
      overflow: hidden;
      background: #ffffff;
      .list-item {
        position: relative;
        padding: 0.3rem;
        overflow: hidden;
        .text-are {
          // margin-right: -0.3rem;
          // outline: none;
          // max-width: 65%;
          // float: right;
          width: 100%;
          height: 1.3rem;
        }
        .text-over-show {
          width: 65%;
        }
        .text-over-height {
          line-height: 0.32rem;
        }
        .inputSel {
          position: absolute;
          right: 0;
          width: 70%;
          opacity: 0;
          height: 0.8rem;
          top: 0;
        }
        .text-position {
          text-align: right;
          margin-right: 0.3rem;
          top: 0.1rem;
          opacity: 1;
        }
        .test {
          margin-left: 1.5rem;
          outline: none;
          max-width: 65%;
          float: right;
        }
        .select-name {
          width: 60%;
        }
        .sex-select {
          width: 60%;
          position: absolute;
          right: 0.3rem;
          opacity: 0;
        }

        &:after {
          .Pseudo-border-after(#f0f0f0);
        }
      }
      :last-child {
        &:after {
          height: 0;
        }
      }
      .left30 {
        // padding-right: 0;
        &:after {
          left: 0.3rem;
          right: 0.3rem;
        }
      }
      .input-text {
        position: absolute;
        right: 0;
        width: 70%;
      }
    }
  }
  .info-btn {
    width: 6.9rem;
    position: fixed;
    bottom: 0.4rem;
    line-height: 0.76rem;
    margin-left: 0.3rem;
    background: #5e7bff;
    box-shadow: 0px 12px 24px 0px rgba(94, 123, 255, 0.3);
    border-radius: 0.5rem;
    cursor: pointer;
    .btn-content {
      text-align: center;
    }
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #afb6c3;
  }
  input:-moz-placeholder,
  textarea:-moz-placeholder {
    color: #afb6c3;
  } // Firefox
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: #afb6c3;
  } // Firefox
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #afb6c3;
  }
  textarea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #afb6c3;
  }
  textarea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #afb6c3;
  }
  textarea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #afb6c3;
  }
  textarea::-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #afb6c3;
  }
}
</style>
