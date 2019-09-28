<template>
  <div class="diagnosis-list">
    <div class="search-btn" v-if="list.length > 0">
      <span class="font-12" @click="searchShow">筛选车辆或店铺</span>
      <img src="../../assets/search-list.png" @click="searchShow" alt="">
    </div>
    <div v-if="list.length > 0" class="scroll-container" ref="myscroller">
      <div class="record-item" v-for="(item, index) in list" :key="index" @click="viewInfo(item)">
        <div class="plate-bumber font-16">
          <img v-if="item.logo"  class="logo" :src="item.logo" alt="">
          <img v-if="!item.logo" class="logo" src="@/assets/default_car.png">
          <div class="car-size font-12">
            <div class="font-14 blod black-3d" v-text="item.license_plate"></div>
            <div class="font-10" v-text="item.vehicle_name"></div>
          </div>
        </div>
        <div class="record-item-second">
          <ul>
            <li class="font-12">
              <div class="tag err font-8">异常点</div>
              <div class="number font-14" v-text="item.exception > 99 ? '99+' : item.exception"></div>
            </li>
            <li class="font-12">
              <div class="tag success font-8">需关注</div>
              <div class="number font-14" v-text="item.pending > 99 ? '99+' : item.pending"></div>
            </li>
            <li class="font-12">
              <div class="tag common font-8">正常点</div>
              <div class="number font-14" v-text="item.normal > 99 ? '99+' : item.normal"></div>
            </li>
            <li class="font-12">
              <div class="tag none font-8">未检测</div>
              <div class="number font-14" v-text="item.noninspect > 99 ? '99+' : item.noninspect"></div>
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
    </div>
    <!-- 无数据 -->
    <div v-if="list.length === 0" class="no-customer-bar">
      <img src="../../assets/no_customer.png" class="default-img">
      <div class="no-result font-12">搜索不到车检结果哦~</div>
    </div>
    <disgnosis-search :mobile="mobile" v-if="show_search" @confirm="confirm"></disgnosis-search>
  </div>
</template>
<script>
import DisgnosisSearch from "@/components/disgnosisSearch"
import Api from "@/api/diagnosisApi";
export default {
  components: {
    DisgnosisSearch,
  },
  data() {
    return {
      list: [], // 车检记录列表
      isContent: false,
      maxLength: 8, // 搜索框内容长度
      paginationConf: {
        current: 1, // 当前页数
        pageSize: 10 // 每页显示条数
      },
      id: 123,
      show_search: false,
      mobile: null,
      license_plates: [],
      store_ids: [],
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
     * @description 获取列表
     */
    getList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getHubCusDiagnosisListApi({
        mobile: this.mobile,
        license_plate: this.license_plates.join(','),
        store_id: this.store_ids.join(',')
        // self.$route.query.mobile,
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.map(item => {
            item.inspect_time = this.formartDate(
              "yyyy-MM-dd hh:mm:ss",
              item.inspect_time
            );
          });
          self.list = res.data;
        }
      });
    },
    /**
     * @method
     * @description 查看详情
     */
    viewInfo(item) {
      // if (item.type === 1) {
      this.$router.push({
        name: "polymer-disgnosis-detail",
        query: { id: item.id, showButton: 0 }
      });
      // } else if (item.type === 2) {
      //   window.location.href = item.url;
      // }
    },
    searchShow() {
      this.show_search = true
    },
    /**
     * @method
     * @description 保存
     * @data 组件传值
     */
    confirm(data) {
      this.show_search = false
      let car = []
      let store = []
      data.car_list.forEach(ele => {
        car.push(ele.license_plate)
      })
      data.store_list.forEach(ele => {
        store.push(ele.store_id)
      })
      this.license_plates = car
      this.store_ids = store
      console.log(this.license_plates, this.store_ids)
      this.getList()
    }
  },
  mounted() {
    this.mobile = this.$route.query.mobile
    this.getList();
  },
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
.content {
  color: #1d1d26;
}
.diagnosis-list {
  width: 100%;
  height: 100vh;
  background: #f7f8fa;
}
.scroll-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 1rem;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
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
  color: #3d424c;
  font-weight: 500;
  padding: 15/50rem 0 15/50rem 15/50rem;
  display: flex;
  align-items: center;
  position: relative;
  &:after {
    .Pseudo-border-after(#f0f0f0);
  }
  .logo{
    width: 40/50rem;
    height: 40/50rem;
    margin-right: 0.15rem;
  }
}
.car-size {
  font-weight: 300;
  padding-left: 15/50rem;
  margin-top: 5/50rem;
  color: #373737;
  .blod{
    font-weight: 600;
  }
}
.record-line {
  position: relative;
  height: 1.32rem;
  padding: 0 15/50rem;
  box-sizing: border-box;
  color: #8a92a2;
  line-height: 1.32rem;
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
    width: 96%;
    right: 0;
    left: initial;
  }
  &:last-child{
    &:after{
      width: 0;
    }
  }
}
.record-item-second {
  position: relative;
  width: 100%;
  height: 1.32rem;
  box-sizing: border-box;
  padding: 16/50rem 15/50rem 16/50rem 15/50rem;
  &:after {
    .Pseudo-border-after(#f0f0f0);
    width: 96%;
    right: 0;
    left: initial;
  }
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      float: left;
    }
    .tag {
      display: block;
      float: left;
      width: auto;
      height: 18/50rem;
      padding: 0 5/50rem;
      line-height: 18/50rem;
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
      width: auto;
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
.search-btn{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  padding: 0.3rem;
  background: #fff;
  height: 1rem;
  z-index: 1;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;;
  span{
    color: #7D7D7D;
  }
  img{
    width: 16/50rem;
    height: 16/50rem;
    margin-left: 5/50rem;
  }
}
</style>
