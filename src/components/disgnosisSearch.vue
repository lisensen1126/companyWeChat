<template>
  <div class="slide-question">
    <div class="content">
      <div class="content-list">
        <div>
          <div class="title font-16">
            选择车辆
          </div>
          <div class="car-list">
            <div class="car-item" v-for="(item,index) in car_arr" :key="index" :class="item.checked ? 'active' : ''" @click="checkCar(index)">
              <img v-if="item.logo" class="car-logo" :src="item.logo" alt="">
              <img v-if="!item.logo" class="car-logo" src="@/assets/default_car.png">
              <div class="car-info">
                <p class="font-14 car-plate" v-text="item.license_plate"></p>
                <p class="font-10 car-info-type" v-text="item.vehicle_name"></p>
              </div>
              <div class="img_check">
                <img v-if="item.checked" src="../assets/car-check.png" alt="">
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="title font-16">
            选择检车门店
          </div>
          <div class="car-list">
            <div class="car-item store-item" v-for="(item,index) in store_arr" :key="index" :class="item.checked ? 'active' : ''" @click="checkStore(index)">
              <img v-if="item.current_image" class="store-logo" :src="item.current_image" alt="">
              <img v-if="!item.current_image" class="store-logo" src="https://oss1.chedianai.com/images/assets/category-default.png">
              <div class="store-info">
                <p class="font-12 store-title" v-text="item.store_name + '(' + item.district_name + '店)'">（嘉路店）</p>
                <p class="font-10 store-address" v-text="item.province_name + item.city_name + item.district_name + item.address"></p>
              </div>
              <div class="img_check">
                <img v-if="item.checked" src="../assets/car-check.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="complete" class="confirm-btn font-14">确定</button>
    </div>
  </div>
</template>
<script>
import Api from "@/api/diagnosisApi";
/**
 * @description 车检列表搜索侧栏
 */
export default {
  name: "disgnosisSearch",
  props: {
    mobile: null
  },
  data() {
    return {
      car_arr: [],
      store_arr: [],
    }
  },
  computed: {
  },
  methods: {
    /**
     * id 点击选中的问题/建议id
     */
    checkCar(index) {
      this.car_arr[index].checked = !this.car_arr[index].checked
    },
    checkStore(index) {
      this.store_arr[index].checked = !this.store_arr[index].checked
    },
    // 完成
    complete() {
      let car = this.car_arr.filter(ele => ele.checked)
      let store = this.store_arr.filter(ele => ele.checked)
      this.$emit('confirm', {
        car_list: car,
        store_list: store,
      })
    },
    // 拷贝数据
    deepClone(obj){
      let _obj = JSON.stringify(obj),
          objClone = JSON.parse(_obj);
      return objClone
    },
    /**
     * @method
     * @description 获取列表
     */
    getList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getHubSearchListApi({
        mobile: this.mobile
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.vehicles.forEach(ele => {
            ele.checked = false
          })
          res.data.stores.forEach(ele => {
            ele.checked = false
          })
          self.car_arr = res.data.vehicles
          self.store_arr = res.data.stores
        }
      });
    },
  },
  mounted() {
    this.getList()
  }
};
</script>
<style lang="less" scoped>
@import "../less/config/mixins/border.less";
@import "../less/base/utilities.less";
@import "../less/base/button.less";
@import "../less/base/base.less";
@import "../less/base/margin.less";
@import "../less/report-common.less";
@import "../less/base/flex.less";
.slide-question{
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.content{
  width: 6rem;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  padding-bottom: 1rem;
  box-sizing: border-box;
}
.confirm-btn{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  border: 0;
  border-radius: 0;
  text-align: center;
  color: #373737;
  font-weight: 400;
  background: #F7D117;
}
.title{
  padding: 0.4rem 0.3rem;
  font-weight: blod;
  position: relative;
  &:after{
    .Pseudo-border-after(#f0f0f0);
  }
}
.car-list{
  box-sizing: border-box;
  position: relative;
  &:after{
    .Pseudo-border-after(#f0f0f0);
  }
}
.car-item{
  position: relative;
  padding: 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  &:after{
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
  &.active{
    background: #F5F5F5;
  }
  .img_check{
    width: 0.36rem;
    height: 0.36rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .car-logo{
    width: 40/50rem;
    height: 40/50rem;
    margin-right: 0.15rem;
  }
  .car-info{
    width: 3.8rem;
    .car-plate{
      color: #373737;
      font-weight: 400;
    }
    .car-info-type{
      color: #858587;
      font-weight: 300;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
.store-item{
  .store-logo{
    width: 1.7rem;
    height: 1.7rem;
    margin-right: 0.15rem;
  }
  .store-info{
    width: 2.88rem;
    .store-title{
      color: #373737;
      font-weight: 400;
    }
    .store-address{
      color: #7D7D7D;
      font-weight: 300;
    }
  }
}
.content-list{
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}
</style>
