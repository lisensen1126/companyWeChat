<template>
  <div class="customer-search">
    <div class="title-background"></div>
    <!-- 输入框（点击吊起 车牌号 软键盘） -->
    <div class="plateNumber-bar">
      <transition name="fade" mode="out-in">
        <div class="plateNumber-title font-16" v-if="searchType === 1" :key="1">
          <div>请输入客户车牌号：</div>
          <el-upload
            v-if="searchType === 1 && plate_show"
            class="avatar-uploader"
            :action="API_ROOT + 'work/v1/common/image_upload?corp_id=' + corp_id + '&app_identifier=' + app_identifier"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img src="../../assets/again-saomiao.png" alt="">
            <span class="square-text font-12">重新扫描</span>
          </el-upload>
        </div>
        <div class="plateNumber-title font-16" v-if="searchType === 2" :key="2">请查找客户：</div>
      </transition>
      <transition name="fade" mode="out-in">
        <!-- 车牌号 -->
        <div
          class="plateNumber"
          v-if="searchType === 1"
          :key="1"
        >
          <div
            class="plateNumber-item font-24"
            v-for="(item, index) in plateNumbers"
            :key="index"
            :class="change_index === index ? 'border' : ''"
            v-text="item"
            @click="isShowKeyboardCar(index)"
          ></div>
        </div>
        <!-- 手机号 -->
        <div
          class="phoneNumber font-24"
          :class="border_show ? 'active' : ''"
          v-if="searchType === 2"
          :key="2"
        >
          <img class="search-icon" src="../../assets/search-icon.png" alt="">
          <span class="serach-line font-12">|</span>
          <input class="input-phone-numer font-12" @focus="addBorder" @blur="removeBorder" type="tel" placeholder="输入数字快速查找手机号或车牌号" v-model.trim.lazy="phone_number">
        </div>
      </transition>
      <!-- 切换搜索 -->
      <transition name="fade" mode="out-in">
        <div v-if="searchType === 1" class="changeSearchStatus font-16">
          <div class="button font-14" @click="search()">
            <my-button :theme="plateNumbers.join('').length < 7 ? 'disabled' : ''">查找</my-button>
          </div>
        </div>
        <div v-if="searchType === 2" class="changeSearchStatus font-16">
          <div class="button font-14" @click="searchAll()">
            <my-button>查找</my-button>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="isShowSearch" class="search-bar">
      <!-- 客户列表 -->
      <div class="has-customer-bar">
        <div class="title font-14">搜索结果</div>
        <!-- 有数据 -->
        <div
          class="scroll-container"
          ref="myscroller"
          v-if="customerList.length && customerList.length > 0 && isHasCustomer"
        >
          <div
            class="list-item"
            v-for="(item, index) in customerList"
            :key="index"
            @click="goInfo(item)"
          >
            <img v-if="item.avatar" class="customer-image" :src="item.avatar">
            <img v-if="!item.avatar" class="customer-image" src="@/assets/defualt_head.png">
            <div class="customer-info">
              <div class="cus-name font-14" v-text="item.real_name ? item.real_name : item.nick_name"></div>
              <div class="cus-phone font-12" v-html="item.mobile"></div>
            </div>
            <div class="plate-number font-18" v-if="searchType === 2" v-html="item.license_plate_1"></div>
            <div class="plate-number font-18" v-if="searchType === 1" v-text="license_plate"></div>
          </div>
        </div>
        <!-- 无数据 -->
        <div v-if="!isHasCustomer" class="no-customer-bar">
          <img src="../../assets/no_customer.png" class="default-img">
          <div class="no-result font-12">搜索不到结果哦～</div>
          <div class="new-customer font-14" v-if="my_button_is_show" @click="newCustomer()">
            <my-button theme="mbutton-2">{{button_text}}</my-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 软键盘组件 -->
    <key-board ref="keyboard" type="2" :index="change_index" :maxLength="maxLength" @getCode="getCode" @save="save" @remove="remove"></key-board>
  </div>
</template>

<script>
import KeyBoard from "../../components/keyboard/keyboard";
import MyButton from "../../components/button";
import Api from "@/api/diagnosisApi";
import AppConfig from "../../app.config";
import AppBase from "../../app.base";
export default {
  components: {
    KeyBoard,
    MyButton
  },
  data() {
    return {
      API_ROOT: AppBase.base_url,
      corp_id: AppConfig.corp_id,
      app_identifier: AppConfig.app_identifier,
      searchType: null, // 搜索类型 1: 车牌号，2: 电话
      maxLength: 16, // 键盘内容最大长度
      plateNumbers: ["", "", "", "", "", "", "", ""], // 车牌号
      phone_number: "", // 手机号
      isShowSearch: false, // 是否显示搜索结果
      customerList: [], // 用户列表
      license_plate: "",
      button_text: "",
      memRoleId: null,
      change_index: 0,
      border_show: false,
      plate_show: false,
      my_button_is_show: false
    };
  },
  computed: {
    // 是否有搜索数据
    isHasCustomer() {
      return this.customerList.length > 0 ? true : false;
    }
  },
  methods: {
    /**
     * @method
     * @description 获取键盘内容 (success)
     * @param obj {val, type} 键盘内容
     */
    getCode(obj) {
      let tmp = [];
      tmp = JSON.parse(JSON.stringify(this.plateNumbers));
      let content_len = 0,
        tmp_content = obj.val.split(",");
      tmp.map((item, index) => {
        if (tmp_content[index]) {
          tmp[index] = tmp_content[index];
          content_len++;
        } else {
          tmp[index] = "";
        }
      });
      if (
        this.change_index < 7 &&
        this.plateNumbers[this.change_index + 1].length === 0 &&
        obj.type === "common"
      ) {
        this.change_index++;
      }
      if (Number(this.searchType) === 1) {
        // 车牌号
        this.plateNumbers = tmp;
        if (this.change_index > 0) {
          this.$refs.keyboard.setBoardType("number");
        } else if (this.change_index === 0) {
          this.$refs.keyboard.setBoardType("province");
        } else {
          this.$refs.keyboard.setBoardType("province");
        }
      }
    },
    /**
     * @method
     * @description 车牌号删除
     */
    remove() {
      this.plateNumbers[this.change_index] = "";
      this.plateNumbers = this.plateNumbers;
      this.$refs.keyboard.resetContent(this.plateNumbers.join(","));
    },
    /**
     * @method
     * @description 触发车牌号输入键盘 (success)
     */
    isShowKeyboardCar(index) {
      if (this.plateNumbers.join(",").length === 0 && index !== 0) {
        return;
      }
      this.change_index = index;
      this.isShowSearch = false;
      this.$refs.keyboard.resetContent(this.plateNumbers.join(","));
      if (index === 0) {
        this.$refs.keyboard.setBoardType("province");
      } else {
        this.$refs.keyboard.setBoardType("number");
      }
      this.$refs.keyboard.showKeyBoard();
    },
    /**
     * @method
     * @description 检测字段
     */
    valideField() {
      let plate = this.plateNumbers.join(""),
        phone = this.phone_number;
      status;
      if (this.searchType === 1) {
        if (plate.length < 7) {
          this.$toast.error("车牌号格式不符合规范，请检查");
          status = false;
        } else {
          status = true;
        }
      } else if (this.searchType === 2) {
        if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
          this.$toast.error("手机号格式不符合规范，请检查");
          status = false;
        } else {
          status = true;
        }
      }
      return status;
    },
    /**
     * @method
     * @description 搜索 (success)
     */
    search() {
      let self = this;
      self.$refs.keyboard.hideKeyBoard();
      let plate = this.plateNumbers.join("");
      if (plate.length < 7) {
        // this.$toast.error("车牌号格式不符合规范，请检查");
        return;
      }
      self.$loading.show("加载中");
      let params = {};
      params.license_plate = self.plateNumbers.join("");
      self.license_plate = self.plateNumbers.join("");
      Api.getCustomerList(params).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.my_button_is_show = true;
          self.isShowSearch = true;
          // 处理默认显示车辆
          if (res.data.length === 0) {
            this.button_text = "添加客户";
            self.customerList = [];
          } else {
            this.button_text = "快速添加车辆";
            res.data.map(item => {
              if (item.vehicle.length > 1) {
                item.vehicle.map((car, index) => {
                  if (Number(car.is_default) === 1) {
                    item.plate = item.vehicle[index].license_plate;
                  }
                });
                self.customerList = res.data;
              } else if (item.vehicle.length === 1) {
                item.plate = item.vehicle[0].license_plate;
                self.customerList = res.data;
              } else {
                self.customerList = [];
              }
            });
          }
        } else {
          self.$toast.error(res.message);
        }
      });
    },
    /**
     * @method
     * @description 搜索手机号
     */
    searchAll() {
      let self = this;
      if (self.phone_number.length === 0) {
        self.my_button_is_show = false;
        self.isShowSearch = true;
        self.customerList = [];
        return;
      }
      self.$loading.show("加载中");
      let params = {};
      params.keyword = self.phone_number;
      Api.getAllCustomerList(params).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.my_button_is_show = true;
          self.isShowSearch = true;
          // 处理默认显示车辆
          if (res.data.length === 0) {
            this.button_text = "添加客户";
            self.customerList = [];
          } else {
            this.button_text = "快速添加车辆";
            res.data.map(item => {
              if (
                item.license_plate.indexOf(
                  self.phone_number.toLocaleUpperCase()
                ) !== -1
              ) {
                item.license_plate_1 = item.license_plate.replace(
                  self.phone_number.toLocaleUpperCase(),
                  "<font color='#5E7BFF'>" +
                    self.phone_number.toLocaleUpperCase() +
                    "</font>"
                );
              } else {
                item.license_plate_1 = item.license_plate;
              }
              if (item.mobile.indexOf(self.phone_number) !== -1) {
                item.phone_number = item.mobile;
                item.mobile = item.mobile.replace(
                  self.phone_number,
                  "<font color='#5E7BFF'>" + self.phone_number + "</font>"
                );
              } else {
                item.mobile = item.mobile;
              }
            });
            self.customerList = res.data;
          }
        } else {
          self.$toast.error(res.message);
        }
      });
    },
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
     * @description 查看详情 (succcess)
     * @param item {Object} 客户信息
     */
    goInfo(item) {
      if (this.searchType === 2 && !item.license_plate) {
        this.$router.push({
          name: "createcus",
          query: { phone: item.phone_number }
        });
      } else {
        this.$router.push({
          name: "cusinfo",
          query: {
            phone: item.phone_number,
            license: this.searchType === 1 ? item.plate : item.license_plate
          }
        });
      }
    },
    /**
     * @method
     * @description 新建用户 (success)
     */
    newCustomer() {
      let params = {};
      this.searchType === 1
        ? (params.plate = this.plateNumbers.join(""))
        : (params.phone = "");
      this.$router.push({
        name: "createcus",
        query: params
      });
    },
    /**
     * @method
     * @description 输入框获取焦点添加边框
     */
    addBorder() {
      this.border_show = true;
    },
    /**
     * @method
     * @description 输入框失去焦点取消边框
     */
    removeBorder() {
      this.border_show = false;
    },
    /**
     * @method
     * @description 键盘保存事件 (success)
     */
    save() {
      this.search();
    },
    /**
     * @method
     * @description 重新扫描
     */
    handleAvatarSuccess(res, file) {
      let self = this;
      self.$loading.show("加载中");
      let images = res.data.image_url;
      Api.ocrLicensePlate({
        url: images
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.plateNumbers = res.data.string.split("")
          if (res.data.string.split("").length === 7) {
            self.plateNumbers.push("")
          }
          self.$refs.keyboard.resetContent(self.plateNumbers.join(","));
        } else {
          self.$toast.error("识别失败");
        }
      });
    }
  },
  mounted() {
    this.searchType = Number(this.$route.query.search_type);
    if (this.$route.query.plate) {
      this.plate_show = true;
      this.plateNumbers = this.$route.query.plate.split("")
    }
    if (this.plateNumbers.length === 7) {
      this.plateNumbers.push("")
    }
    this.$loading.hide();
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
.customer-search {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f7f8fa;
  .title-background {
    height: 0.62rem;
    width: 100%;
    background: #4b77b0;
  }
  .plateNumber-bar {
    position: relative;
    top: -0.62rem;
    width: 6.9rem;
    height: 3.66rem;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0px 6px 16px 0px rgba(35, 36, 46, 0.04);
    padding: 0.4rem 0.3rem;
  }
  .plateNumber-title {
    color: #3d424c;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar-uploader {
      color: #5e7bff;
      line-height: 1;
      img {
        width: 0.32rem;
        height: 0.32rem;
        vertical-align: middle;
      }
    }
  }
  .plateNumber {
    display: flex;
    width: 100%;
    height: 0.9rem;
    margin-top: 0.2rem;
    justify-content: space-between;
    font-weight: bold;
  }
  .phoneNumber {
    display: flex;
    width: 100%;
    height: 0.9rem;
    margin-top: 0.2rem;
    padding: 0.2rem;
    background: #f6f7f9;
    align-items: center;
    border: 1px solid #f6f7f9;
    &.active {
      border: 1px solid #8bb1ff;
    }
    .search-icon {
      width: 0.25rem;
      height: 0.25rem;
    }
    .serach-line {
      color: #3d424c;
      margin: 0 0.2rem;
    }
    .input-phone-numer {
      flex: 1;
      height: 0.4rem;
      background: none;
      color: #8a92a2;
      letter-spacing: 1px;
    }
  }
  .plateNumber-item {
    width: 0.7rem;
    height: 100%;
    background: #f6f7f9;
    color: #3d424c;
    text-align: center;
    line-height: 0.9rem;
    font-weight: bold;
    &.border {
      border: 1px solid #8bb1ff;
    }
  }
  .changeSearchStatus {
    display: flex;
    width: 100%;
    margin-top: 0.6rem;
    height: 0.4rem;
    justify-content: center;
    align-items: center;
    color: #5e7bff;
    &.active {
      background: #aeb5c5;
    }
  }
  .phone-search {
    width: 0.32rem;
    height: 0.32rem;
    margin-right: 0.08rem;
  }
  .prefix {
    color: #8a92a2;
  }
  .button {
    // margin-top: 1.86rem;
    // padding: 0 0.3rem;
    width: 100%;
    height: 0.76rem;
  }
  .record {
    margin-top: 35/50rem;
    width: 100%;
    text-align: center;
    color: #3e434d;
  }
  .phone {
    display: inline-block;
    margin-left: 10/50rem;
    color: #3d424c;
    font-weight: bold;
  }
  .search-bar {
    position: absolute;
    bottom: 0;
    top: 187/50rem;
    width: 100%;
    background: white;
  }
  .has-customer-bar {
    .title {
      position: absolute;
      width: 100%;
      height: 60/50rem;
      line-height: 60/50rem;
      padding: 0 20/50rem;
      font-weight: bold;
      color: #3d424c;
      background: white;
      z-index: 2;
      &:after {
        position: absolute;
        content: "";
        height: 1/50rem;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        background: #f5f6f9;
      }
    }
    .scroll-container {
      width: 100%;
      height: calc(100vh - 3.66rem);
      padding-top: 60/50rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .list-item {
        position: relative;
        width: 100%;
        height: 70/50rem;
        &:after {
          .Pseudo-border-after(#f0f0f0);
          left: 20/50rem;
          right: 20/50rem;
          bottom: 0;
          width: auto;
        }
      }
      .customer-image {
        display: block;
        float: left;
        margin-top: 15/50rem;
        margin-left: 20/50rem;
        margin-right: 16/50rem;
        width: 40/50rem;
        height: 40/50rem;
        border-radius: 50%;
      }
      .customer-info {
        float: left;
        height: 100%;
        min-width: 100/50rem;
        max-width: 140/50rem;
      }
      .cus-name,
      .cus-phone {
        height: 50%;
        color: #8a92a2;
      }
      .cus-name {
        padding-top: 17/50rem;
        color: #2c3039;
        width: 100%;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .cus-phone {
        padding-top: 5/50rem;
      }
      .plate-number {
        float: right;
        min-width: 100/50rem;
        height: 100%;
        color: #332e2e;
        font-weight: bold;
        margin-right: 20/50rem;
        line-height: 70/50rem;
      }
    }
    .no-customer-bar {
      padding-top: 97/50rem;
    }
    .no-result {
      width: 100%;
      color: #3e434d;
      margin-top: 27/50rem;
      margin-bottom: 15/50rem;
      top: 40/50rem;
      text-align: center;
    }
    .default-img {
      display: block;
      width: 120/50rem;
      height: 120/50rem;
      margin: 0 auto;
      top: 97/50rem;
    }
    .new-customer {
      width: 165/50rem;
      margin: 0 auto;
    }
  }
}
//消失时间持续3s
.fade-enter-active {
  transition: all 0.2s;
}
//显示时间持续1.5s
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
