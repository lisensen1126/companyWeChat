<template>
  <div class="new-customer">
    <div class="create-form">
      <div class="form-group btm-line">
        <div class="mlabel font-14">
          客户手机号
          <span class="required">*</span>
        </div>
        <div class="input font-14" v-text="`+86 ${phone}`" @click="showKeyBoard('number')"></div>
      </div>
      <div class="form-group btm-line">
        <div class="mlabel font-14">
          客户车牌号
          <span class="required">*</span>
        </div>
        <div
          class="input font-14"
          v-text="`${plate.substring(0,2)}  ${plate.substring(2)}`"
          @click="showKeyBoard('plate')"
        ></div>
      </div>
      <div class="form-group">
        <div class="mlabel font-14">行车里程</div>
        <div class="input font-14" @click="showKeyBoard('km')">
          <span v-text="kilometres"></span>
          <span class="unit">KM</span>
        </div>
      </div>
    </div>
    <div class="save font-14" @click="saveAndTest">
      <my-button>完成并开始检测</my-button>
    </div>
    <!-- 软键盘组件 -->
    <key-board type="1" ref="keyboard" :maxLength="maxLength" @getCode="getCode" @save="save"></key-board>
  </div>
</template>

<script>
import KeyBoard from "../../components/keyboard/keyboard";
import MyButton from "../../components/button";
import Api from "@/api/diagnosisApi";
export default {
  components: {
    KeyBoard,
    MyButton
  },
  data() {
    return {
      plate: "", // 车牌号
      phone: "", // 电话号码
      kilometres: "", // 公里数
      inputType: 1, // 当前输入模式 1: 电话号码； 2: 车牌号
      maxLength: 8, // 软键盘内容长度
      type: null // 判断输入框类型
    };
  },
  mounted() {
    // 获取传递参数
    this.plate = this.$route.query.plate
      ? this.$route.query.plate
      : "请输入车牌号";
    this.phone = this.$route.query.phone
      ? this.$route.query.phone
      : "请输入手机号";
  },
  methods: {
    // 验证车牌
    checkingPlate() {
      if (this.plate.slice(0, 1) === "使") {
        const pattern = /^[0-9]{6}$/;
        if (!pattern.test(this.plate.slice(1))) {
          this.$toast.error("车牌号格式不符合规范，请检查");
          return false;
        } else {
          return true;
        }
      }
      if (this.plate.slice(0, 1) === "临") {
        // 临 后是随便6位
        if (this.plate.slice(1).length !== 6) {
          this.$toast.error("车牌号格式不符合规范，请检查");
          return false;
        } else {
          return true;
        }
      } else {
        const pattern = /^([a-zA-Z]{1})([A-Za-z0-9]{5}|[DdFf][A-HJ-NP-Za-hj-np-z0-9][0-9]{4}|[0-9]{5}[DdFf]|[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/;
        if (!pattern.test(this.plate.slice(1))) {
          this.$toast.error("车牌号格式不符合规范，请检查");
          return false;
        } else {
          return true;
        }
      }
    },
    /**
     * @method
     * @description 键盘保存事件 (success)
     */
    save() {
      if (this.type === "number") {
        if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
          this.$toast.error("手机号格式不符合规范，请检查");
          return;
        }
      }
      if (this.type === "plate") {
        this.checkingPlate();
      }
      if (this.type === "km") {
        if (
          !/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone) ||
          !this.checkingPlate()
        ) {
          if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
            this.$toast.error("手机号格式不符合规范，请检查");
          }
          return;
        }
      }
    },
    /**
     * @method
     * @description 保存并开始检测 (success)
     */
    saveAndTest() {
      if (
        !/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone) ||
        !this.checkingPlate()
      ) {
        if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
          this.$toast.error("手机号格式不符合规范，请检查");
        }
        return;
      }
      let params = {},
        self = this;
      params.license_plate =
        this.plate && this.plate !== "请输入车牌号" ? this.plate : "";
      params.mobile =
        this.phone && this.phone !== "请输入手机号" ? this.phone : "";
      params.mileage = this.kilometres ? this.kilometres : 0;
      self.$loading.show("加载中");
      Api.newCustomer(params).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          if (res.data.result) {
            self.$toast.success("创建用户成功");
            self.$router.replace({
              name: "SelectingVehicle",
              query: {
                customer_id: res.data.customer_id,
                mobile: params.mobile,
                license_plate: params.license_plate
              }
            });
          } else {
            self.$toast.error("用户已存在或创建用户失败");
          }
          // 跳转至车检流程
        } else {
          self.$toast.error(res.message);
        }
      });
    },
    /**
     * @method
     * @description 键盘按下回调 (普通按键) (success)
     */
    getCode(val) {
      switch (this.inputType) {
        case 1: // 电话号模式
          this.phone = val;
          break;
        case 2: // 车牌号模式
          this.plate = val;
          break;
        case 3: // 公里模式
          this.kilometres = val;
          break;
      }
    },
    /**
     * @method
     * @description 调用软键盘 (success)
     * @param type {String} 键盘类型
     */
    showKeyBoard(type) {
      this.type = type;
      switch (type) {
        case "number":
          if (this.phone === "请输入手机号") {
            this.phone = "";
          }
          this.$refs.keyboard.setBoardType("number");
          this.$refs.keyboard.resetContent(this.phone);
          this.inputType = 1;
          this.maxLength = 11;
          break;
        case "plate":
          if (this.plate === "请输入车牌号") {
            this.plate = "";
          }
          this.inputType = 2;
          this.maxLength = 8;
          if (this.plate.length >= 1) {
            this.$refs.keyboard.setBoardType("number");
          } else {
            this.$refs.keyboard.setBoardType("province");
          }
          this.$refs.keyboard.resetContent(this.plate);
          break;
        case "km":
          this.inputType = 3;
          this.maxLength = 6;
          this.$refs.keyboard.setBoardType("number");
          this.$refs.keyboard.resetContent(this.kilometres);
          break;
      }
      this.$refs.keyboard.showKeyBoard();
    }
  },
  watch: {
    // 监听车牌号长度 判断是否切换键盘
    plate(val) {
      if (val.length >= 1) {
        this.$refs.keyboard.setBoardType("number");
      } else {
        this.$refs.keyboard.setBoardType("province");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
.new-customer {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
  padding-top: 15/50rem;
  .create-form {
    width: 345/50rem;
    height: 150/50rem;
    background: white;
    margin: 0 auto;
    box-shadow: 0 6/50rem 16/50rem 0 rgba(35, 36, 46, 0.04);
  }
  .form-group {
    position: relative;
    width: 100%;
    height: 1rem;
    .input {
      float: right;
      color: #8a92a2;
      text-align: right;
      min-width: 200/50rem;
      height: 1rem;
      line-height: 1rem;
      margin-right: 15/50rem;
      font-weight: 400;
    }
  }
  .mlabel {
    float: left;
    min-width: 100/50rem;
    text-indent: 15/50rem;
    color: #3d424c;
    line-height: 1rem;
    font-weight: 400;
  }
  .btm-line {
    &:after {
      .Pseudo-border-after(#f0f0f0);
    }
  }
  .required {
    color: red;
  }
  .unit {
    display: inline-block;
    color: #3d424c;
    margin-left: 10/50rem;
  }
  .save {
    position: absolute;
    bottom: 20/50rem;
    width: 100%;
    padding: 0 15/50rem;
  }
}
</style>
