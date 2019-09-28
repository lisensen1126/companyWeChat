<template>
  <div class="detail font-PC-re" v-if="firstFinish">
    <div class="tabs font-14">
      <div class="tabs-item" :class="{'tab-active': currentTabs === 1}" @click="selectTabs(1)">客户详情</div>
      <div class="tabs-item" :class="{'tab-active': currentTabs === 2}" @click="selectTabs(2)">车检报告</div>
      <div class="tabs-item" :class="{'tab-active': currentTabs === 3}" @click="selectTabs(3)">卡包</div>
    </div>
    <div v-if="currentTabs === 1">
      <!-- 客户详情 -->
      <div class="customer-detail">
        <div class="header-pic m-r-30 pull-left">
          <img :src="customerInfo.ec_avatar?customerInfo.ec_avatar:defualtHead" alt>
        </div>
        <div class="pull-left text-over">
          <div class="m-t-up-4 font-18 black-3d font-PC-sd text-over-hide">{{customerInfo.ec_name}}</div>
          <div
            class="font-12 gray-8a line-height-1 m-t-20 m-b-10"
          >手机号： {{customerInfo.ec_mobile || "--"}}</div>
          <div
            class="font-12 gray-8a line-height-1 text-over-hide"
          >姓名： {{customerInfo.real_name|| "--"}}</div>
        </div>
        <div class="star-pic pull-right" @click="starCustomer(ec_id)">
          <img
            :src="stars_status?require('../../assets/star_fill.png'):require('../../assets/star.png')"
            alt
          >
          <!-- <img src="@/assets/star.png"
          alt="">-->
        </div>
      </div>
      <!-- 编辑资料 -->
      <div class="edit-customer line-height-1" @click="goEidtInfo">
        <div class="font-14 black-3d">编辑客户资料</div>
        <div class="arrow-right">
          <img src="@/assets/arrow_right.png" alt>
        </div>
      </div>
      <div v-if="isRegister">
        <!-- 最近消费 -->
        <div class="consumption">
          <div class="list-icon">
            <div class="list-item font-14">
              <div class="black-3d line-height-1 pull-left">最近消费时间</div>
              <div
                class="gray-8a line-height-1 pull-right"
              >{{consumption.last_consume_time?formartDate(consumption.last_consume_time):"暂无数据"}}</div>
            </div>
            <div class="list-item font-14">
              <div class="black-3d line-height-1 pull-left">最近消费商品/服务</div>
              <div
                class="gray-8a xiaofei line-height-1 pull-right"
              >{{consumption.commodity?consumption.commodity:"暂无数据"}}</div>
            </div>
          </div>
        </div>
        <!-- 车辆信息 -->
        <div class="p-b-150">
          <div
            class="car-info list-icon"
            v-for="(item,index) in carInfo"
            v-bind:key="index"
            v-if="carInfo.length>0"
          >
            <div class="list-item font-14 black-3d line-height-1 font-PC-sd">车辆{{index+1}}信息</div>
            <div class="list-item font-14 left30 m-r-30">
              <div class="black-3d line-height-1 pull-left">车牌号</div>
              <div
                class="gray-8a line-height-1 pull-right"
              >{{item.license_plate?item.license_plate:"暂无数据"}}</div>
            </div>
            <div class="list-item font-14 left30">
              <div class="black-3d line-height-1 pull-left">车辆型号</div>
              <div
                class="gray-8a width-over pull-right m-r-20 text-right"
              >{{(item.brand_name+item.model_name+item.vehicle_name) || "暂无数据"}}</div>
            </div>
            <!-- <div class="list-item font-14 left30 m-r-30">
          <div class="black-3d line-height-1 pull-left">注册时间</div>
          <div class="gray-8a line-height-1 pull-right">{{formartDate(item.register_time)}}</div>
            </div>-->
            <div class="list-item font-14 left30 m-r-30">
              <div class="black-3d line-height-1 pull-left">行驶里程</div>
              <div class="gray-8a line-height-1 pull-right">{{item.mileage}}</div>
            </div>
          </div>
          <div class="car-info list-icon" v-if="carInfo.length==0">
            <div class="list-item font-14 black-3d line-height-1 font-PC-sd">车辆信息</div>
            <div class="default_content text-center">
              <img class="car-pic" src="../../assets/default_Data.png">
              <div class="font-PC-re font-12 gray-a1 line-32">暂无数据</div>
            </div>
          </div>
        </div>
        <!-- 尾部按钮 -->
        <div class="info-btn" @click="goSendInfo(ec_user_id)">
          <div class="font-14 white bnt-content">发消息</div>
        </div>
      </div>
      <div v-if="!isRegister">
        <div class="no-register">
          <img class="no-register-pic" src="@/assets/defualt_qrcode.png" alt>
          <div class="font-12 black-3e no-register-title m-t-20">此客户还未注册小程序，快去分享门店小程序给客户。</div>
        </div>
      </div>
    </div>
    <div v-if="currentTabs === 2">
      <scroller class="scroll-container" ref="myscroller" v-if="list.length>0">
        <div
          class="record-item"
          v-for="(item, index) in list"
          :key="index"
          @click="diagnosisInfo(item)"
        >
          <div class="plate-bumber font-16">
            <span v-text="item.license_plate.substring(0,2)"></span>
            <span class="plate-right" v-text="item.license_plate.substring(2)"></span>
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
    </div>
    <div v-if="currentTabs === 3">
      <div v-if="upkeep_list.length !== 0" class="card-item" v-for="(item, index) in upkeep_list" :key="index" :style="'background-image: url(' + item.image_url +')'" @click="goCardDetail(item.id, item.upkeep_no)">
        <div>
           <div class="card-top">
            <div class="card-name font-14">
              {{item.name}}
              <div class="pasted font-9" v-if="item.is_past === 1">过期</div>
              <div class="card-give-icon font-9" v-if="item.type === 2 && item.from === 2">获赠</div>
            </div>
            <div class="card-num-box">
              <div class="card-num" v-if="item.type === 1">
                <div class="font-10">可使用</div>
                <div class="num-bg font-10">{{item.num}}</div>
                <div class="font-10">次</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="card-order font-16">
            NO.{{item.upkeep_no_number}}****
          </div>
          <div class="card-time">
            <div class="time font-10">
              有效期至{{item.end_time}}
            </div>
          </div>
        </div>
      </div>
      <!-- 无数据 -->
      <div v-if="upkeep_list.length === 0" class="no-customer-bar">
        <img src="../../assets/no_customer.png" class="default-img">
        <div class="no-result font-12">暂无保养卡</div>
      </div>
    </div>
  </div>
</template>
<script>
// import TemporaryPer from "../../assets/avatar.jpeg";
import defualtHead from "../../assets/defualt_head.png";
import Api from "@/api/customerApi";
import DiaApi from "@/api/diagnosisApi";
export default {
  name: "detail",
  components: {
    // defaultPages
  },
  data() {
    return {
      bcImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550224342688&di=0df76aff9e12a58e2c2b9e7758168959&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201802%2F24%2F20180224222040_vTytf.jpeg',
      ec_id: "",
      customerInfo: {},
      isRegister: true,
      list: [],
      paginationConf: {
        current: 1, // 当前页数
        pageSize: 2, // 每页显示条数
        noData: false
      },
      cusId: 0,
      defualtHead: defualtHead,
      // isStarFill: false,
      stars_status: "",
      consumption: {
        // last_consume_time: "1539532800",
        // commodity: "轮胎"
      },
      carInfo: [],
      currentTabs: 1,
      ec_user_id: "", //ec_id
      next_data: "",
      firstFinish: false,
      upkeep_list: [],
    };
  },
  created() {
    this.ec_id = this.$route.params.ec_id
      ? this.$route.params.ec_id
      : sessionStorage.getItem("ec_id");
    this.getCustomerDetail();
  },
  methods: {
    selectTabs: function(val) {
      // this.$set(this.paginationConf, "current", 1);
      this.currentTabs = val;
      if (val === 2) {
        this.getList();
      }
      if (val == 3) {
        this.getCardList()
      }
    },
    // 报告详情
    diagnosisInfo: function(item) {
      if (item.type === 1) {
        this.$router.push({
          name: "diainfo",
          query: { id: item.id }
        });
      } else {
        window.location.href = item.url;
      }
    },
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
    // 时间格式化
    formartDate1 (fmt, date) {
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
    goEidtInfo: function() {
      var self = this;
      this.$router.push({
        name: "customer-infomation",
        params: { ec_id: self.ec_id, data: self.next_data }
      });
    },
    getCustomerDetail: function() {
      let self = this;
      self.$loading.show("加载中");
      Api.getCustomerDetail({ ec_id: self.ec_id }).then(
        function(data) {
          self.$loading.hide();
          self.firstFinish = true;
          if (data.code === 0) {
            // 没有数据
            // if (data.data.car_info && data.data.car_info.length == 0) {
            //   return false;
            // }
            console.log(data.data);
            self.cusId = data.data.customer_id;
            if (!data.data.customer_id) {
              self.isRegister = false;
            }
            //加载车的数据
            if (data.data.car_info.length > 0) {
              self.carInfo = data.data.car_info;
              // self.$refs.my_scroller.resize();
              // self.$refs.my_scroller.scrollTo(0, 0);
            }
            if (data.data.consume) {
              self.consumption = data.data.consume;
            }
            if (data.data.next_data) {
              self.next_data = data.data.next_data;
              sessionStorage.setItem("next_data", self.next_data);
            }
            // self.customerInfo.ec_mobile = data.data.ec_mobile;
            self.ec_user_id = data.data.ec_user_id;
            self.stars_status = data.data.stars_status; //是否星标客户
            self.customerInfo.ec_mobile = data.data.ec_mobile;
            self.customerInfo.ec_name = data.data.ec_name;
            self.customerInfo.ec_avatar = data.data.ec_avatar;
            self.customerInfo.real_name = data.data.real_name;
          }
        },
        function(err) {
          self.$loading.hide();
          self.firstFinish = true;
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    goSendInfo: function(id) {
      wx.openEnterpriseChat({
        userIds: "",
        externalUserIds: id,
        groupName: "",
        success: function(res) {
          console.log("wx.openEnterpriseChat 成功+++" + JSON.stringify(res));
        },
        fail: function(res) {
          if (
            res.errMsg.indexOf("function_not_exist") > -1 ||
            res.errMsg.indexOf("fail_nosupport") > -1
          ) {
            console.log("wx.openEnterpriseChat 版本过低请升级");
          }
        }
      });
    },
    /**
     * @method
     * @description 获取列表
     */
    getList(done, type) {
      let self = this;
      self.$loading.show("加载中");
      DiaApi.getCusDiagnosisList({
        customer_id: self.cusId, // self.cusId,
        mobile: self.customerInfo.ec_mobile // self.customerInfo.ec_mobile
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          // 如果没有数据就不请求接口
          // if (Number(res.data.meta.last_page) === self.paginationConf.current) {
          //   done && done(true);
          //   return;
          // }
          // 没有数据
          if (res.data.length === 0) {
            self.$set(self.paginationConf, "noData", true);
          }
          res.data.map(item => {
            item.inspect_time = this.formartDate1(
              "yyyy-MM-dd hh:mm:ss",
              item.inspect_time
            );
          });
          self.list = res.data;
          // if (type === "down") {
          //   self.list = res.data.data;
          // } else {
          //   res.data.data.map(item => {
          //     self.list.push(item);
          //   });
          // }
          if (self.$refs.myscroller) {
            self.$refs.myscroller.resize();
          }
          self.paginationConf.current++;
          done && done();
        }
      });
    },
    // /**
    //  * @method
    //  * @description 下拉刷新
    //  */
    // refresh(done) {
    //   this.paginationConf.current = 1;
    //   this.getList(done, "down");
    // },
    // /**
    //  * @method
    //  * @description 上拉加载
    //  */
    // infinite(done) {
    //   this.getList(done, "up");
    // },
    //是否标星
    starCustomer: function(id) {
      var self = this;
      if (self.stars_status) {
        Api.starCustomerCancel({ ec_id: id }).then(
          function(data) {
            if (data.code === 0 && data.status === 200) {
              self.stars_status = false;
            }
          },
          function(err) {
            self.$loading.hide();
            self.$router.replace({ path: "/error", query: { msg: err } });
          }
        );
        self.stars_status = false;
      } else {
        Api.starCustomerAdd({ ec_id: id }).then(
          function(data) {
            if (data.code === 0 && data.status === 200) {
              self.stars_status = true;
            }
          },
          function(err) {
            self.$loading.hide();
            self.$router.replace({ path: "/error", query: { msg: err } });
          }
        );
        self.stars_status = true;
      }
    },
    /**
     * @method
     * @description 获取保养卡列表
     */
    getCardList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getUpkeepListApi({
        customer_id: self.cusId,
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.data.forEach(element => {
            element.end_time = this.formartDate(element.end_time)
            element.upkeep_no_number = element.upkeep_no.substring(0, element.upkeep_no.length - 4)
          });
          self.upkeep_list = res.data.data;
        }
      });
    },
    // 卡详情
    goCardDetail(id, upkeep_no) {
      this.$router.push({
        name: "card-detail",
        query: { id: id, upkeep_no: upkeep_no }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
.tabs {
  width: 100%;
  height: 47/50rem;
  background: white;
  margin-bottom: 10/50rem;
  color: #8a92a2;
  div {
    position: relative;
    float: left;
    width: 33.33%;
    height: 100%;
    line-height: 47/50rem;
    text-align: center;
  }
  .tab-active {
    color: #3d424c;
    &::after {
      position: absolute;
      content: "";
      left: 43%;
      right: 0;
      bottom: 0;
      width: 18/50rem;
      background: #5e7bff;
      height: 2/50rem;
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
.detail {
  width: 100%;
  background: #f7f8fa;
  min-height: 100vh;
  .m-t-up-4 {
    margin-top: -0.04rem;
  }
  .customer-detail {
    padding: 0.32rem 0.4rem 0.3rem;
    overflow: hidden;
    background-color: #fff;
    .text-over {
      width: 60%;
      .text-over-hide {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .header-pic {
      width: 1rem;
      height: 1rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .star-pic {
      width: 0.32rem;
      height: 0.32rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .edit-customer {
    margin: 0.3rem;
    background: #fff;
    padding: 0.3rem;
    position: relative;
    .arrow-right {
      width: 0.1rem;
      height: 0.2rem;
      position: absolute;
      right: 0.4rem;
      top: 0.4rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .consumption,
  .car-info {
    margin: 0.3rem;
  }
  .p-b-150 {
    padding-bottom: 1.5rem;
  }
  .list-icon {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    .list-item {
      position: relative;
      padding: 0.3rem;
      overflow: hidden;
      &:after {
        .Pseudo-border-after(#f0f0f0);
      }
      .width-over {
        width: 70%;
        line-height: 0.35rem;
      }
    }
    :last-child {
      &:after {
        height: 0;
      }
    }
    .left30 {
      padding-right: 0;
      &:after {
        left: 0.3rem;
        right: 0.3rem;
      }
    }
    .default_content {
      height: 5rem;
      padding-top: 1rem;
      .car-info {
        width: 1.08rem;
        height: 1.08rem;
      }
      .line-32 {
        height: 0.32rem;
        line-height: 0.32rem;
      }
    }
  }
  .info-btn {
    width: 6.9rem;
    position: fixed;
    bottom: 0.4rem;
    margin: 0 0.3rem;
    height: 0.76rem;
    line-height: 0.76rem;
    background: #5e7bff;
    box-shadow: 0px 12px 24px 0px rgba(94, 123, 255, 0.3);
    border-radius: 0.5rem;
    cursor: pointer;
    .bnt-content {
      text-align: center;
    }
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
    }
  }
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
  top: 57/50rem;
  bottom: 20/50rem;
  height: auto !important;
}
.record-item {
  width: 100%;
  min-height: 180/50rem;
  background: white;
  box-shadow: 0 6/50rem 16/50rem 0 rgba(35, 36, 46, 0.04);
  margin-bottom: 10/50rem;
}
.plate-bumber {
  width: 100%;
  height: 42/50rem;
  color: #3d424c;
  font-weight: 600;
  padding: 15/50rem 0 0 15/50rem;
}
.plate-right {
  text-indent: 10/50rem;
}
.car-size {
  color: #8a92a2;
  font-weight: 400;
  padding-left: 15/50rem;
  margin-top: 5/50rem;
}
.record-line {
  position: relative;
  height: 1rem;
  padding: 0 15/50rem;
  color: #3d424c;
  line-height: 1rem;
  .record-line-left {
    font-weight: 400;
  }
  .record-line-right {
    float: right;
    color: #8a92a2;
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
      font-weight: 500;
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
    }
  }
}
.card-item {
  width: 6.9rem;
  height: 4.28rem;
  margin: 0 auto;
  margin-top: 0.4rem;
  border-radius: 0.2rem;
  background-size: 6.9rem 4.28rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .pasted{
    width: 0.68rem;
    height: 0.32rem;
    text-align: center;
    line-height: 0.32rem;
    color: #FFF6E1;
    border: 1px solid #FFF;
    border-radius: 0.04rem;
    font-weight: 400;
    margin-left: 0.1rem;
  }
  .card-give-icon{
    width: 0.68rem;
    height: 0.32rem;
    line-height: 0.32rem;
    text-align: center;
    border-radius: 0.04rem;
    border: 1px solid #FFF;
    color: #FFF6E1;
    font-weight: 400;
    margin-left: 0.1rem;
  }
  .card-top{
    padding: 0.46rem 0.24rem 0;
  }
  .card-bottom{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 0.24rem 0.3rem;
  }
  .card-num-box{
    display: flex;
    justify-content: flex-end;
    margin-top: 0.08rem;
    height: 0.28rem;
  }
  .card-num{
    color: #FFF6E1;
    display: flex;
    align-items: center;
    .num-bg{
      background-color: #FFF6E1;
      color: #000000;
      margin-left: 0.04rem;
      margin-right: 0.04rem;
      text-align: center;
      height: 0.28rem;
      display: flex;
      align-items: center;
      padding: 0 0.08rem;
    }
  }
  .card-name{
    color: #FFF6E1;
    line-height: 1;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .card-time{
    color: #FFF6E1;
    line-height: 1;
  }
  .card-order{
    color: #FFF6E1;
    line-height: 1;
    font-weight: bold;
    margin-top: 0.02rem;
  }
}
.card-item:last-child{
  margin-bottom: 0;
}
.xiaofei{
  max-width: 3rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
