<template>
  <div class="diagnosis-info">
    <!-- 车辆信息 -->
    <div class="car-item">
      <div class="car-logo">
        <img v-if="!report.logo" class="logo" src="@/assets/default_car.png">
        <img v-if="report.logo" class="logo" :src="report.logo">
      </div>
      <div class="carinfo">
        <div class="car-size font-18" v-text="report.vehicle_name ? report.vehicle_name : '暂无'"></div>
        <div class="plate-km font-12">
          <span v-text="report.license_plate"></span>
          <span v-if="report.mileage" class="m-l-30">
            已行驶&nbsp;
            <span>{{report.mileage}}KM</span>
          </span>
          <span v-if="!report.mileage" class="m-l-30">
            已行驶&nbsp;
            <span>暂无</span>
          </span>
        </div>
      </div>
    </div>
    <!-- 车检信息 -->
    <div class="create-form">
      <div class="form-group btm-line">
        <div class="mlabel font-14">技师</div>
        <div class="input font-14" v-text="report.technician_name"></div>
      </div>
      <div class="form-group btm-line">
        <div class="mlabel font-14">检测门店</div>
        <div class="input font-14" v-text="report.store_name"></div>
      </div>
      <div class="form-group">
        <div class="mlabel font-14">检测日期</div>
        <div class="input font-14" v-text="report.updated"></div>
      </div>
    </div>
    <div class="record-item-second btm-line">
      <ul>
        <li :class="{'active':active === 1}" @click="doActive(1, report.exception)">
          <div
            class="number font-16"
            v-text="report.exception_count > 99 ? '99+' : report.exception_count"
          ></div>
          <div class="tag err font-10">异常点</div>
        </li>
        <li :class="{'active':active === 2}" @click="doActive(2, report.pending)">
          <div
            class="number font-16"
            v-text="report.pending_count > 99 ? '99+' : report.pending_count"
          ></div>
          <div class="tag success font-10">需关注</div>
        </li>
        <li :class="{'active':active === 3}" @click="doActive(3, report.normal)">
          <div
            class="number font-16"
            v-text="report.normal_count > 99 ? '99+' : report.normal_count"
          ></div>
          <div class="tag common font-10">正常点</div>
        </li>
        <li :class="{'active':active === 4}" @click="doActive(4, report.noninspect)">
          <div
            class="number font-16"
            v-text="report.noninspect_count > 99 ? '99+' : report.noninspect_count"
          ></div>
          <div class="tag none font-10">未检测</div>
        </li>
      </ul>
    </div>
    <!-- 车检项目信息 -->
    <div class="record-info">
      <div v-for="(step, findex) in current.category" :key="findex" class="diagnosis-step">
        <div class="diagnosis-step-title font-16" :class="{'err':active === 1, 'success' : active === 2, 'common' : active === 3, 'none' : active === 4}" v-text="step.name"></div>
        <!-- <img v-if="step.logo" class="diagnosis-step-icon" :src="step.logo"> -->
        <!-- <img v-if="!step.logo" class="diagnosis-step-icon" src="@/assets/default_car.png"> -->
        <div v-for="(item, sindex) in step.category_item" :key="sindex" class="diagnosis-item">
          <div class="diagnosis-item-name font-14" v-text="item.name"  :class="{'err':active === 1, 'success' : active === 2, 'common' : active === 3, 'none' : active === 4}"></div>
          <div class="diagnosis-point-name font-12">检测点</div>
          <div class="diagnosis-points clearfix">
            <div
              v-for="(point, tindex) in item.point"
              :key="tindex"
              class="font-12"
              v-text="point.name"
            ></div>
          </div>
          <div
            class="diagnosis-point-name font-12"
            v-if="item.exception && item.exception.length > 0"
          >异常问题</div>
          <div
            class="diagnosis-line font-12"
            v-for="(exception_item, excindex) in item.exception"
            :key="excindex+10"
            v-text="(excindex + 1) + '.' +exception_item.name"
          ></div>
          <div
            class="diagnosis-point-name font-12"
            v-if="item.exception_advice && item.exception_advice.length > 0"
          >异常建议</div>
          <div
            class="diagnosis-line font-12"
            v-for="(exception_adv, aindex) in item.exception_advice"
            :key="aindex"
            v-text="(aindex + 1) + '.' +exception_adv.name"
          >1.建议更换空调滤清器</div>
          <div class="diagnosis-point-name font-12" v-if="item.technician_comment">技师备注</div>
          <div class="diagnosis-line font-12" v-text="item.technician_comment"></div>
          <div
            class="diagnosis-point-name font-12"
            v-if="item.exception_image && item.exception_image.length > 0"
          >详情图</div>
          <div class="image-bar clearfix">
            <img
              class="diagnosis-img"
              v-for="(img, zindex) in item.exception_image"
              :key="zindex"
              :src="img"
              @click="previewImage(item.exception_image, img)"
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="showBtn === 1" class="start-diagnosis font-14" @click="startDiagnosis">
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
      report: {}, // 车检报告详情
      active: 1, // 当前显示的 tab
      current: {}, // 当前内容
      showBtn: 0 // 是否显示按钮
    };
  },
  methods: {
    previewImage(commentImages, url) {
      var params = [];
      commentImages.forEach(item => {
        params.push(item);
      });
      return new Promise(function() {
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: params // 需要预览的图片http链接列表
        });
      });
    },
    // 时间格式化
    formartDate(date) {
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
    // tab 切换
    doActive(val, data) {
      this.active = val;
      this.current = data;
      console.log(this.current);
    },
    // 开始车检
    startDiagnosis() {
      this.$router.push({
        name: "SelectingVehicle",
        query: {
          customer_id: this.report.customer_id,
          mobile: this.report.mobile,
          license_plate: this.report.license_plate
        }
      });
    },
    // 获取详情
    getInfo(val) {
      let self = this;
      self.$loading.show("加载中");
      Api.getDiagnosisReportApi({
        id: this.$route.query.id
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.updated = this.formartDate(res.data.updated_at);
          this.report = res.data;
          this.current = this.report.exception;
        } else {
          self.$toast.error(res.message);
        }
      });
    }
  },
  mounted() {
    this.showBtn = Number(this.$route.query.showButton);
    this.getInfo();
  }
};
</script>
<style lang="less" scoped>
.diagnosis-info {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}
.diagnosis-step-icon {
  position: absolute;
  top: 23/50rem;
  left: 15/50rem;
  width: 17/50rem;
}
.car-item {
  position: relative;
  height: 83/50rem;
  width: 100%;
  background: white;
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
  width: 280/50rem;
  overflow: hidden;
}
.car-size {
  height: 33/50rem;
  color: #3d424c;
  font-weight: bold;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.plate-km {
  height: 50%;
  margin-top: 5/50rem;
  font-weight: 400;
  span {
    color: #8a92a2;
  }
}
.create-form {
  width: 100%;
  height: 150/50rem;
  margin-bottom: 15/50rem;
}
.form-group {
  position: relative;
  width: 100%;
  height: 1rem;
  background: white;
  .input {
    float: right;
    color: #8a92a2;
    text-align: right;
    max-width: 225/50rem;
    height: 1rem;
    line-height: 1rem;
    margin-right: 15/50rem;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    position: absolute;
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1/50rem;
    background: #f0f0f0;
  }
}
.record-item-second {
  position: relative;
  height: 65/50rem;
  width: 100%;
  padding: 15/50rem 35/50rem 10/50rem 35/50rem;
  background: white;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    li {
      position: relative;
      float: left;
      font-weight: 500;
    }
    .tag {
      display: block;
      width: 36/50rem;
      height: 18/50rem;
      line-height: 18/50rem;
      color: white;
      text-align: center;
      border-radius: 2/50rem;
      font-weight: 500;
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
      width: 36/50rem;
      height: 18/50rem;
      line-height: 18/50rem;
      text-align: center;
    }
  }
  .active {
    &:after {
      position: absolute;
      content: "";
      left: 8/50rem;
      right: 8/50rem;
      width: auto;
      background: #5e7bff;
      height: 3/50rem;
      bottom: -10/50rem;
    }
  }
}
.diagnosis-step {
  position: relative;
  width: 100%;
  padding: 0 20/50rem 10/50rem 20/50rem;
  min-height: 100/50rem;
  background: white;
}
.diagnosis-step-title {
  height: 62/50rem;
  color: #3d424c;
  font-weight: bold;
  line-height: 62/50rem;
  padding-left: 0.2rem;
  position: relative;
  &:before{
    content: '';
    display: block;
    width: 0.1rem;
    height: 0.4rem;
    background-color: #F7D117;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &.err {
    &:before{
      background: #D42E12;
    }
  }
  &.success {
    &:before{
      background: #F7D117;
    }
  }
  &.common {
    &:before{
      background: #21B437;
    }
  }
  &.none {
    &:before{
      background: #AEB5C5;
    }
  }
}
.diagnosis-item-name {
  font-weight: bold;
  &.err {
    color: #D42E12;
  }
  &.success {
    color: #F7D117;
  }
  &.common {
    color: #21B437;
  }
  &.none {
    color: #AEB5C5;
  }
}
.diagnosis-point-name {
  margin-top: 7/50rem;
  margin-bottom: 3/50rem;
}
.diagnosis-points {
  div {
    float: left;
    width: auto;
    padding: 0 10/50rem;
    border: 1/50rem solid #858587;
    height: 18/50rem;
    border-radius: 9/50rem;
    color: #858587;
    line-height: 18/50rem;
    margin-right: 12/50rem;
    margin-top: 8/50rem;
    font-weight: 500;
  }
}
.diagnosis-line {
  // color: #8a92a2;
  font-weight: 400;
}
.image-bar {
  width: 100%;
  margin-bottom: 15/50rem;
  justify-content: space-between;
  align-content: flex-start;
}
.diagnosis-img {
  width: 100/50rem;
  height: 100/50rem;
  margin-left: 1/50rem;
  margin-bottom: 1/50rem;
  border: none;
}
.start-diagnosis {
  height: 60/50rem;
  padding: 10/50rem 15/50rem;
  background: white;
}
</style>
