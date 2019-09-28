<template>
  <div class="diagnosis-list">
    <scroller v-if="list.length > 0" class="scroll-container" ref="myscroller">
      <div class="record-item" v-for="(item, index) in list" :key="index" @click="viewInfo(item)">
        <div class="plate-bumber font-16">
          <img v-if="item.logo" :src="item.logo" alt="">
          <img v-if="!item.logo" class="logo" src="@/assets/default_car.png">
          <span class="blue-plate" v-text="item.blueplate"></span>
          <span v-text="item.commonplate"></span>
        </div>
        <div class="car-size font-12" v-text="item.vehicle_name"></div>
        <div class="record-item-second">
          <ul>
            <li class="font-12">
              <div class="tag err font-10">异常点</div>
              <div class="number font-16" v-text="item.exception > 99 ? '99+' : item.exception"></div>
            </li>
            <li class="font-12">
              <div class="tag success font-10">需关注</div>
              <div class="number font-16" v-text="item.pending > 99 ? '99+' : item.pending"></div>
            </li>
            <li class="font-12">
              <div class="tag common font-10">正常点</div>
              <div class="number font-16" v-text="item.normal > 99 ? '99+' : item.normal"></div>
            </li>
            <li class="font-12">
              <div class="tag none font-10">未检测</div>
              <div class="number font-16" v-text="item.noninspect > 99 ? '99+' : item.noninspect"></div>
            </li>
          </ul>
        </div>
        <div class="record-line">
          <span class="record-line-left font-14">检测时间</span>
          <span class="record-line-right font-14" v-text="item.inspect_time"></span>
        </div>
        <div class="record-line">
          <span class="record-line-left font-14">检测门店</span>
          <span class="record-line-right font-14" v-text="item.store_name"></span>
        </div>
      </div>
    </scroller>
    <!-- 无数据 -->
    <div v-if="list.length === 0" class="no-customer-bar">
      <img src="../../assets/no_customer.png" class="default-img">
      <div class="no-result font-12">搜索不到车检结果哦~</div>
    </div>
    <!-- 软键盘组件 -->
    <key-board ref="keyboard" type="1" :maxLength="maxLength" @getCode="getCode" @save="save"></key-board>
  </div>
</template>
<script>
import KeyBoard from "../../components/keyboard/keyboard";
import Api from "@/api/diagnosisApi";
export default {
  components: {
    KeyBoard
  },
  data() {
    return {
      list: [], // 车检记录列表
      keyWord: "请输入车牌号", // 搜索框内容
      isContent: false,
      maxLength: 8, // 搜索框内容长度
      keyBoard: false,
      paginationConf: {
        current: 1, // 当前页数
        pageSize: 10 // 每页显示条数
      }
    };
  },
  methods: {
    // 时间格式化
    formartDate(fmt, date) {
      if ((date + "").length === 10) {
        date = new Date(Number(date) * 1000);
      } else {
        date = new Date(Number(date));
      }
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    /**
     * @method
     * @description 开启软键盘
     */
    showKeyboard() {
      if (this.keyBoard) {
        this.$refs.keyboard.hideKeyBoard();
      } else {
        this.$refs.keyboard.showKeyBoard();
      }
      this.keyBoard = !this.keyBoard;
    },
    /**
     * @method
     * @description 获取键盘内容
     */
    getCode(val) {
      this.keyWord = val;
    },
    /**
     * @method
     * @description 完成回调事件
     */
    save() {
      if (this.$refs.myscroller) {
        this.$refs.myscroller.scrollTo(0, 0, true);
      }
      this.keyBoard = !this.keyBoard;
      this.getList();
    },
    /**
     * @method
     * @description 获取列表
     */
    getList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getCusDiagnosisListApi({
        customer_id	: self.$route.query.customer_id,
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.map(item => {
            item.inspect_time = this.formartDate(
              "yyyy-MM-dd hh:mm:ss",
              item.inspect_time
            );
            if (self.keyWord !== "" && self.keyWord !== "请输入车牌号") {
              item.blueplate = item.license_plate.substring(
                item.license_plate.indexOf(self.keyWord),
                self.keyWord.length
              );
              item.commonplate = item.license_plate.substring(
                self.keyWord.length
              );
            } else {
              item.commonplate = item.license_plate;
            }
          });
          self.list = res.data;
        }
      });
    },
    /**
     * @method
     * @description 清空 input
     */
    clearInput() {
      this.keyWord = "";
      this.$refs.keyboard.resetContent("");
    },
    /**
     * @method
     * @description 查看详情
     */
    viewInfo(item) {
      if (item.type === 1) {
        this.$router.push({
          name: "appdiagnosisinfo",
          query: { id: item.id, showButton: 0 }
        });
      } else if (item.type === 2) {
        window.location.href = item.url;
      }
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    keyWord(val) {
      if (val !== "请输入车牌号") {
        this.isContent = true;
        if (val.length >= 1) {
          this.$refs.keyboard.setBoardType("number");
        } else {
          this.$refs.keyboard.setBoardType("province");
        }
      }
      if (val === "") {
        this.isContent = false;
        this.keyWord = "请输入车牌号";
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
.search {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 1rem;
  box-sizing: border-box;
  background: #fff;
  padding: 0.2rem 0.2rem;
  img.sea {
    display: inline-block;
    width: 0.26rem;
    height: 0.26rem;
  }
  .sea_l {
    position: relative;
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
      height: 0.68rem;
      box-sizing: border-box;
      background: white;
      border-radius: 0.08rem;
      padding-left: 0.6rem;
      overflow: hidden;
      border: 1/50rem solid #3d424c;
      &:before {
        position: absolute;
        content: "";
        width: 1/50rem;
        height: 12/50rem;
        background: #3d424c;
        left: 30/50rem;
        top: 10/50rem;
        z-index: 11;
      }
      img.sea {
        position: absolute;
        top: 50%;
        left: 0.2rem;
        margin-top: -0.13rem;
      }
      input {
        position: relative;
        width: 100%;
        // height: 0.68rem;
        background: white;
        font-size: 14px;
        color: #1d1d26;
        // line-height: 0.68rem;
        padding: 0.18rem 0 0;
        border: none;
        outline: none;
        text-indent: 20/50rem;
      }
    }
    .sea_btn {
      position: absolute;
      right: 10/40rem;
      top: 0;
      line-height: 0.68rem;
      font-size: 16px;
      z-index: 12;
    }
  }
}
.input {
  margin-left: 10/50rem;
  margin-top: 7/50rem;
  color: #8a92a2;
  font-weight: 300;
}
.blue-plate {
  color: #5e7bff;
}
.content {
  color: #1d1d26;
}
.diagnosis-list {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
}
.diagnosis-search {
  position: fixed;
  top: 0;
  width: 100%;
  height: 55/50rem;
  background: white;
  z-index: 10;
}
.scroll-container {
  padding: 0 15/50rem;
  top: 15/50rem;
  bottom: 20/50rem;
  height: auto !important;
}
.record-item {
  width: 100%;
  min-height: 208/50rem;
  background: white;
  box-shadow: 0 6/50rem 16/50rem 0 rgba(35, 36, 46, 0.04);
  margin-bottom: 10/50rem;
}
.plate-bumber {
  width: 100%;
  height: 42/50rem;
  color: #3d424c;
  font-weight: 500;
  padding: 15/50rem 0 0 15/50rem;
  display: flex;
  align-items: center;
  img{
    width: 0.8rem;
    height: 0.8rem;
    margin-right: 0.15rem;
  }
}
.car-size {
  color: #8a92a2;
  font-weight: 400;
  padding-left: 15/50rem;
  margin-top: 7.5/50rem;
}
.record-line {
  position: relative;
  height: 1rem;
  padding: 0 15/50rem;
  color: #8a92a2;
  line-height: 1rem;
  .record-line-left {
    font-weight: 400;
  }
  .record-line-right {
    float: right;
    color: #3d424c;
    font-weight: 400;
    max-width: 225/50rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:after {
    .Pseudo-border-after(#f0f0f0);
  }
}
.record-item-second {
  position: relative;
  height: 46/50rem;
  width: 100%;
  padding: 16/50rem 15/50rem 0 15/50rem;
  &:after {
    .Pseudo-border-after(#f0f0f0);
  }
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    li {
      float: left;
    }
    .tag {
      display: block;
      float: left;
      width: 36/50rem;
      height: 18/50rem;
      padding-top: 1/50rem;
      color: white;
      text-align: center;
      border-radius: 2/50rem;
    }
    .err {
      background: #D42E12;
    }
    .success {
      background: #4b86ff;
    }
    .common {
      background: #21B437;
    }
    .none {
      background: #AEB5C5;
    }
    .number {
      display: block;
      float: right;
      width: 36/50rem;
      height: 18/50rem;
      line-height: 18/50rem;
      margin-left: 5/50rem;
    }
  }
}
.no-customer-bar {
  padding-top: 25/50rem;
}
.no-result {
  width: 100%;
  color: #3e434d;
  margin-top: 10/50rem;
  text-align: center;
  font-weight: 400;
}
.default-img {
  display: block;
  width: 120/50rem;
  height: 120/50rem;
  margin: 0 auto;
  margin-top: 100/50rem;
}
</style>
