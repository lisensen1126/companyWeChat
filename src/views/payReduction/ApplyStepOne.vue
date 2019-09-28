<template>
  <div class="apply-step-one">
    <TimeLine step="1"/>
    <div class="step-desc">
      <div>
        <span class="round-num">1</span>
        <span class="desc">确认物料接收地址信息，等待寄送物料</span>
      </div>
      <div class="apply-form">
        <div class="flex-b-c form-item">
          <span>门店名称</span>
          <input class="flex1" type="text" v-model="searchData.store_name" disabled>
        </div>
        <div class="flex-b-c form-item">
          <span>联系人姓名</span>
          <input type="text" v-model="searchData.name" placeholder="请输入姓名" @focus="inputFocusBlur(1)" @blur="inputFocusBlur(0)">
        </div>
        <div class="flex-b-c form-item">
          <span>联系人手机</span>
          <input type="number" maxlength="11" v-model="searchData.tel" placeholder="请输入手机号"  @focus="inputFocusBlur(1)" @blur="inputFocusBlur(0)">
        </div>
        <div class="flex-b-c form-item">
          <span>所在地区</span>
          <input type="text" v-model="searchData.area" disabled>
        </div>
        <div class="flex-b-c form-item last-item">
          <span>详细地址：</span>
          <textarea
            maxlength="50"
            type="text"
            v-model="searchData.addr"
            placeholder="请输入街道门牌等详细地址"
            @focus="inputFocusBlur(1)"
            @blur="inputFocusBlur(0)"
          />
        </div>
      </div>
      <div class="tips">
        点击确认即视为参与活动，收到提交信息后，2个工作日内
        处理物料制作打印寄送。
      </div>
    </div>
    <div class="bottom-btn" :class="{'pos-fix':!input_focus}" @click="confirm()">我确认信息正确</div>
  </div>
</template>
<script>
import TimeLine from "@/components/payReduction/TimeLine.vue";
import Api from "@/api/payReduction";
import Mixes from "./mixin/payReductionPublic";
export default {
  mixins: [Mixes],
  components: {
    TimeLine
  },
  data() {
    return {
      searchData: {
        store_name: "", // 门店名称
        name: "", // 联系人姓名
        tel: "", //  联系人电话
        area: "", // 联系人的省市区，由接口赋值，用户不可修改
        addr: "" //  联系人详细地址
      },
      input_focus: 0 // input框是否处于聚焦状态
    };
  },
  mounted() {
    this.getApplyInfo();
  },
  methods: {
    // 获取报名详情信息
    getApplyInfo() {
      this.$loading.show("加载中");
      Api.getApplyInfo().then(
        res => {
          this.$loading.hide();
          if (res.code === 0) {
            let data = res.data;
            this.searchData.area = `${data.province_name} ${data.city_name} ${
              data.area_name
            }`;
            this.searchData.store_name = data.store_name;
            this.searchData = {
              area: `${data.province_name} ${data.city_name} ${data.area_name}`,
              store_name: data.store_name,
              name: data.contacts,
              tel: data.mobile,
              addr: data.address
            };
          } else if (res.code === 41231 || res.code === 41230) {
            // 如果报名的过程中，报名结束，则给出提示并跳到首页
            this.$toast.warning(res.message, 1500);
            setTimeout(() => {
              this.$router.replace({
                path: "/business-manage"
              });
            }, 1500);
          } else {
            this.$router.replace({
              path: "/error",
              query: {
                msg: res.message
              }
            });
          }
        },
        err => {
          this.$loading.hide();
          this.$router.replace({
            path: "/error",
            query: {
              msg: err
            }
          });
        }
      );
    },
    // 判断数据是否合法
    filterData() {
      let res = true;
      let telReg = /^[1][3,5,6,7,8,9]\d{9}$/; // 手机号正则
      if (!this.searchData.name) {
        res = "请输入联系人姓名";
      } else if (!telReg.test(this.searchData.tel)) {
        res = "请输入正确的手机号";
      } else if (!this.searchData.addr.length) {
        res = "请输入详细地址";
      }
      return res;
    },
    confirm() {
      let res = this.filterData();
      if (res !== true) {
        this.$toast.error(res);
      } else {
        this.updateInfo(
          {
            step: 1,
            contacts: this.searchData.name, //联系人姓名
            mobile: this.searchData.tel, // 联系人电话
            address: this.searchData.addr // 详细地址
          },
          "apply-step-two"
        );
      }
    },
    /**
     * 输入框聚焦失焦检测，用于控制按钮的定位状态
     * @param type {Number} 触发的事件类型，1 聚焦，0 失焦
     */
    inputFocusBlur(type) {
      this.input_focus = type;
      if (!type) {
        document.body.scrollTop = 0;
      }
    }
  },
  watch: {
    "searchData.tel"(newVal, oldVal) {
      if (newVal.length > 11) {
        this.searchData.tel = oldVal;
      }
    },
    "searchData.name"(newVal, oldVal) {
      if (newVal.length > 10) {
        this.searchData.name = oldVal;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";
.step-desc {
  margin: 0.4rem 0.3rem 0 0.3rem;
  .round-num {
    display: inline-block;
    width: 0.32rem;
    line-height: 0.32rem;
    background-color: #5e7bff;
    color: #fff;
    font-size: 0.16rem;
    text-align: center;
    border-radius: 0.32rem;
    vertical-align: middle;
    margin-right: 0.1rem;
    font-weight: bold;
  }
  .desc {
    vertical-align: middle;
    color: #3d424c;
    font-size: 0.32rem;
    font-weight: bold;
  }
  .apply-form {
    margin-top: 0.3rem;
    .form-item {
      background: #fff;
      border-radius: 2px;
      height: 1rem;
      padding: 0 0.3rem;
      border-bottom: 1px solid #f0f0f0;
      span {
        color: #3d424c;
        font-size: 0.28rem;
        min-width: 1.5rem;
      }
      input {
        border: none;
        width: 3rem;
        outline: none;
        text-align: right;
        font-size: 0.28rem;
        color: #8a92a2;
        background: #fff;
      }
      ::-webkit-input-placeholder {
        color: #dbdee3 !important;
      }
    }
    .last-item {
      border-bottom: none;
      height: 1.7rem;
      span {
        align-self: flex-start;
        margin-top: 0.33rem;
      }
      textarea {
        border: none;
        height: 0.96rem;
        outline: none;
        text-align: right;
        line-height: 0.32rem;
        font-size: 0.28rem;
        color: #8a92a2;
        flex: 1;
        margin-left: 0.16rem;
      }
    }
  }
  .tips {
    text-align: center;
    color: #8a92a2;
    font-size: 0.24rem;
    line-height: 0.34rem;
    margin: 0.3rem;
  }
}
.pos-fix {
  position: fixed;
  position: fixed;
  bottom: 0.4rem;
  left: 0.3rem;
  right: 0.3rem;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.bottom-btn {
  color: #fff;
  font-size: 0.28rem;
  border-radius: 0.38rem;
  line-height: 0.76rem;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  background: #5e7bff;
  text-align: center;
  box-shadow: 0px 12px 24px 0px rgba(94, 123, 255, 0.3);
}
.flex-b-c {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex1 {
  flex: 1;
}
input[disabled] {
  color: #000 !important;
}
input:disabled {
  text-fill-color: #000 !important;
  opacity: 1 !important;
  color: #000 !important;
}
</style>
