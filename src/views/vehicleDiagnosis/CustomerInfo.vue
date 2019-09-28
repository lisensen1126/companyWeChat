<template>
  <div class="customer-info">
    <div class="customer-title">
      <!-- 头像 -->
      <div class="cus-image">
        <img v-if="customer.avatar" :src="customer.avatar" class="image">
        <img v-if="!customer.avatar" src="@/assets/defualt_head.png" class="image">
      </div>
      <!-- 用户信息 -->
      <div class="info">
        <div class="title font-18" v-text="customer.real_name ? customer.real_name : customer.nick_name"></div>
        <div class="phone item font-12">手机号：{{customer.mobile}}</div>
        <div
          v-if="customer.sex"
          class="sex item font-12"
        >性别：{{customer.sex !== 3 ? customer.sex === 1 ? '男': '女' :'暂无'}}</div>
      </div>
    </div>
    <!-- 车辆信息 -->
    <div class="car-info">
      <div class="cinfo">
        <div class="cinfo-title font-16">
          车辆信息(
          <span v-text="customer.vehicle.length"></span>辆)
        </div>
        <div
          class="car-item btm-line"
          v-for="(item, index) in customer.vehicle"
          :key="index"
          @click="selectCar(item.license_plate)"
        >
          <div class="car-logo">
            <img v-if="item.logo" class="logo" :src="item.logo">
            <img v-if="!item.logo" class="logo" src="@/assets/default_car.png">
          </div>
          <div class="carinfo">
            <div class="car-size font-14" v-text="item.model_name ? item.model_name : '暂无'"></div>
            <div class="plate-km font-12">
              <span v-text="item.license_plate ? item.license_plate : '暂无'"></span>
              <span class="m-l-30">
                已行驶:
                <span v-text="item.mileage ? item.mileage+'KM' : '暂无'"></span>
              </span>
            </div>
          </div>
          <div class="checked" v-if="item.license_plate === car">
            <img src="@/assets/checked.png" class="isChecked">
          </div>
        </div>
      </div>
    </div>
    <!-- 车检记录 -->
    <div class="diagnosis-list">
      <div class="list">
        <div class="cinfo-title font-16">车检记录</div>
        <div v-if="list.length > 0">
          <div
            class="record-item btm-line"
            v-for="(item, index) in list"
            :key="index"
            @click="goInfo(item)"
          >
            <div class="record-item-first">
              <div class="left content font-12" v-text="item.inspect_time"></div>
              <div class="right content font-12">车检技师：{{item.technician_name}}</div>
            </div>
            <div class="record-item-second">
              <ul>
                <li class="font-12">
                  <div class="tag err font-10">异常点</div>
                  <div class="number font-16">{{item.exception > 99 ? '99+' : item.exception}}</div>
                </li>
                <li class="font-12">
                  <div class="tag success font-10">需关注</div>
                  <div class="number font-16">{{item.pending > 99 ? '99+' : item.pending}}</div>
                </li>
                <li class="font-12">
                  <div class="tag common font-10">正常点</div>
                  <div class="number font-16">{{item.normal > 99 ? '99+' : item.normal}}</div>
                </li>
                <li class="font-12">
                  <div class="tag none font-10">未检测</div>
                  <div class="number font-16">{{item.noninspect > 99 ? '99+' : item.noninspect}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 无数据 -->
        <div v-if="list.length == 0" class="no-customer-bar">
          <img src="../../assets/no_report.png" class="default-img">
          <div class="no-result font-12">没有车检记录</div>
        </div>
      </div>
    </div>
    <div class="save font-14" @click="startDiagnosis">
      <my-button>开始车检</my-button>
    </div>
  </div>
</template>

<script>
import MyButton from "../../components/button";
import Api from "@/api/diagnosisApi";
export default {
  components: {
    MyButton
  },
  data() {
    return {
      customer: {
        vehicle: []
      }, // 用户详情
      car: "", // 当前默认车辆
      list: [], // 车检记录
      paginationConf: {
        current: 1, // 当前页数
        // pageSize: 1000, // 每页显示条数
        noData: false // 没有数据
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
    // 开始车检
    startDiagnosis() {
      this.$router.push({
        name: "SelectingVehicle",
        query: {
          customer_id: this.customer.customer_id,
          mobile: this.customer.mobile,
          license_plate: this.car
        }
      });
    },
    // 查看车检报告 (success)
    goInfo(item) {
      if (item.type === 1) {
        this.$router.push({
          name: "diainfo",
          query: { id: item.id, showButton: 1 }
        });
      } else {
        window.location.href = item.url;
      }
    },
    /**
     * @method
     * @description 获取列表 (success)
     */
    getList(done, type) {
      let self = this;
      self.$loading.show("加载中");
      Api.getCusDiagnosisList({
        license_plate: self.car,
        customer_id: self.customer.customer_id,
        mobile: self.customer.mobile
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          // 没有数据
          if (res.data.length === 0) {
            self.$set(self.paginationConf, "noData", true);
          }
          res.data.map(item => {
            item.inspect_time = this.formartDate(
              "yyyy-MM-dd hh:mm:ss",
              item.inspect_time
            );
          });
          self.list = res.data;
          if (self.$refs.myscroller) {
            self.$refs.myscroller.resize();
          }
          self.paginationConf.current++;
          done && done();
        } else {
          self.$toast.error(res.message);
        }
      });

      self.$loading.hide();
    },
    /**
     * @method
     * @description 获取用户详情 (success)
     */
    getCustomerInfo() {
      let params = {};
      self = this;
      params.license_plate = this.$route.query.license;
      console.log(params)
      self.$loading.show("加载中");
      Api.getCustomerDetail(params).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.customer = res.data[0];
          self.customer.vehicle.map((item, index) => {
            if (Number(item.is_default) === 1) {
              self.selectCar(self.customer.vehicle[index].license_plate);
            }
          });
          self.getList();
        } else {
          self.$toast.error(res.message);
        }
      });
    },
    /**
     * @method
     * @description 选中车辆 (success)
     */
    selectCar(val) {
      this.car = val;
      this.getList();
    }
  },
  // 初始化 (success)
  mounted() {
    this.getCustomerInfo();
  }
};
</script>

<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
.customer-info {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}
.customer-title {
  width: 100%;
  height: 105/50rem;
  background: white;
}
.car-info {
  width: 100%;
  min-height: 102/50rem;
  padding: 9/50rem 15/50rem;
  .cinfo {
    width: 100%;
    background: white;
  }
}
.diagnosis-list {
  position: relative;
  width: 100%;
  bottom: 0;
  padding: 0 15/50rem;
  padding-bottom: 80/50rem;
  .list {
    position: relative;
    width: 100%;
    height: 100%;
    background: white;
  }
}
.cus-image {
  float: left;
  width: 85/50rem;
  height: 105/50rem;
  padding: 15/50rem 15/50rem 0 20/50rem;
  .image {
    width: 50/50rem;
    height: 50/50rem;
    border-radius: 50%;
  }
}
.info {
  float: left;
  min-width: 200/50rem;
  height: 105/50rem;
  padding-top: 15/50rem;
  .title {
    font-weight: bold;
  }
  .item {
    color: #8a92a2;
  }
  .phone {
    margin-top: 10/50rem;
  }
  .sex {
    margin-top: 5/50rem;
  }
}
.cinfo-title {
  position: relative;
  height: 1rem;
  line-height: 1rem;
  text-indent: 15/50rem;
  font-weight: bold;
  &:after {
    .Pseudo-border-after(#f0f0f0);
  }
}
.btm-line {
  &:after {
    .Pseudo-border-after(#f0f0f0);
  }
}
.scroll-container {
  top: 50/50rem;
  bottom: 80/50rem;
  height: auto !important;
}
.car-item {
  position: relative;
  height: 68/50rem;
  width: 100%;
  overflow: hidden;
}
.car-logo {
  float: left;
  width: 65/50rem;
  height: 100%;
  padding: 15/50rem 10/50rem 0 15/50rem;
  .logo {
    width: 40/50rem;
    height: 40/50rem;
  }
}
.carinfo {
  float: left;
  height: 100%;
  padding-top: 16/50rem;
  max-width: 290/50rem;
  overflow: hidden;
  max-width: 65%;
}
.car-size {
  height: auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}
.plate-km {
  height: 50%;
  margin-top: 3/50rem;
  span {
    color: #8a92a2;
  }
}
.checked {
  float: right;
  width: 16/50rem;
  height: 100%;
  margin-right: 15/50rem;
  padding-top: 27/50rem;
  img {
    width: 16/50rem;
    height: 16/50rem;
  }
}
.record-item {
  position: relative;
  width: 100%;
  height: 76/50rem;
}
.record-item-first {
  height: 50%;
  width: 100%;
  padding-top: 15/50rem;
  font-weight: 400;
  .left {
    width: 50%;
    float: left;
    padding-left: 15/50rem;
    color: #2c3039;
  }
  .right {
    width: 50%;
    float: right;
    text-align: right;
    padding-right: 15/50rem;
    color: #8a92a2;
  }
}
.record-item-second {
  height: 50%;
  width: 100%;
  padding: 0 15/50rem;
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
      width: auto;
      min-width: 36/50rem;
      height: 18/50rem;
      line-height: 18/50rem;
      padding: 0 1/50 0;
      color: white;
      text-align: center;
      border-radius: 2/50rem;
    }
    .err {
      background: #ff6464;
    }
    .success {
      background: #4b86ff;
    }
    .common {
      background: #12c49f;
    }
    .none {
      background: #aeb5c5;
    }
    .number {
      display: block;
      float: right;
      width: 36/50rem;
      height: 18/50rem;
      line-height: 18/50rem;
      margin-left: 5/50rem;
      font-weight: 500;
    }
  }
}
.no-customer-bar {
  padding-top: 25/50rem;
  min-height: 350/50rem;
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
  top: 97/50rem;
}
.save {
  position: fixed;
  height: 80/50rem;
  bottom: 0;
  width: 100%;
  padding: 0 15/50rem;
  padding-top: 20/50rem;
  background: #f7f8fa;
}
</style>
