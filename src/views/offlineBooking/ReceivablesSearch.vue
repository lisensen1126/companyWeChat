<template>
  <div class="index">
    <!-- 开始时间 -->
    <div class="time font-14">
      <div class="left pull-left">开始时间</div>
      <div class="right pull-right">{{start_time}} <input type="date" @change="startChange"></div>
    </div>
    <div class="time font-14">
      <div class="left pull-left">结束时间</div>
      <div class="right pull-right">{{end_time}} <input type="date" @change="endChange"></div>
    </div>
    <div class="search-btn font-14" @click="search">查询</div>

    <!-- 搜索出的结果 -->
    <div v-if="list.length > 0 && page_init">
      <div class="list">
        <div class="title font-14">
          查询结果
        </div>
        <div class="list-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
          <div class="top">
            <div class="left font-14 pull-left">
              <img :src="item.avatar" alt="">
              {{item.nick_name || '--'}}
            </div>
            <div class="right font-16 pull-right">
              ￥{{item.final_amount / 100}}
            </div>
          </div>
          <div class="bottom font-14">
            <div class="left pull-left">收款时间</div>
            <div class="right pull-right">{{item.paid_at | date("yyyy年MM月dd日 HH:mm:ss", "cn")}}</div>
          </div>
          <div class="bottom font-14">
            <div class="left pull-left">收款类型</div>
            <div class="right pull-right">{{item.order_type == 6 ? '门店收款码' : '开单收款码'}}</div>
          </div>
        </div>
      </div>
      <div class="tips font-12">—— 以上是全部收款记录 ——</div>
    </div>

    <!-- 缺省 -->
    <div class="empty" v-if="list.length === 0 && page_init">
      <span class="font-12">搜索不到该时间段的数据~</span>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
export default {
  data() {
    return {
      start_time: "请选择日期",
      end_time: "请选择日期",
      send_start: 0, // 给后台传的开始时间
      send_end: 0, // 给后台传的结束时间
      list: [],
      page_init: false
    };
  },
  methods: {
    startChange(e) {
      this.start_time = e.target.value;
      let obj = (this.start_time + " 00:00:00").replace(/-/g, "/"); // 2019/06/19 00:00:00  这种时间格式兼容IOS的new Data()方法，这个和ios的系统内核有关WKWebview
      this.send_start = Number(new Date(obj)) / 1000;
      console.log(e, obj, new Date(obj), this.send_start);
    },

    endChange(e) {
      this.end_time = e.target.value;
      let obj = (this.end_time + " 23:59:59").replace(/-/g, "/");
      this.send_end = Number(new Date(obj)) / 1000;
    },

    // 获取列表
    fetchList() {
      let self = this;
      self.list = [];
      self.$loading.show("加载中");
      Api.getOrderListApi({
        start_time: this.send_start,
        end_time: this.send_end,
        data_type: 2
      }).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.page_init = true;
            self.$loading.hide();
            if (res.data.length == 0) {
              self.list = [];
              return;
            }
            res.data.forEach(v => {
              self.list = [...self.list, ...v.list];
            });
          } else {
            self.$loading.hide();
            self.$router.replace({
              path: "/error",
              query: { msg: res.message }
            });
          }
        },
        err => {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },

    // 搜索列表
    search() {
      console.log("start --" + this.send_start, "end--" + this.send_end);
      this.page_init = false;
      if (this.send_end == 0 || this.send_start == 0) {
        this.$toast.error("请选择时间段筛选！");
        return;
      }
      if (this.send_end < this.send_start) {
        this.$toast.error("开始时间不能大于结束时间");
        return;
      }
      if(this.send_end-this.send_start>2678400){
        this.$toast.error("查询时间范围限定1个月");
        return;
      }
      this.fetchList();
    },

    // 去详情
    goDetail(id) {
      this.$router.replace({
        name: "ReceivablesDetail",
        query: {
          id: id.trade_order_no
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 10/100rem;
  .time {
    height: 120/100rem;
    line-height: 120/100rem;
    background-color: #ffffff;
    margin-top: 20/100rem;
    padding: 0 30/100rem;
    color: #8a92a2;
    .right {
      padding-right: 40/100rem;
      color: #3d424c;
      background: url("../../assets/arrow_right2.png") no-repeat right;
      background-size: 10/100rem 20/100rem;
      position: relative;
      input {
        width: 200/100rem;
        height: 120/100rem;
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
      }
    }
  }
  .search-btn {
    width: 690/100rem;
    height: 76/100rem;
    background: rgba(94, 123, 255, 1);
    box-shadow: 0/100rem 12/100rem 24/100rem 0/100rem rgba(94, 123, 255, 0.3);
    border-radius: 50/100rem;
    margin: 0 auto;
    margin-top: 60/100rem;
    line-height: 76/100rem;
    text-align: center;
    color: #ffffff;
  }
  .list {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30/100rem;
    margin-bottom: 20/100rem;
    .title {
      height: 92/100rem;
      width: 100%;
      padding-top: 40/100rem;
      line-height: 1;
      .left {
        font-weight: bold;
        color: #3d424c;
      }
      .right {
        color: #5e7bff;
        font-weight: 500;
        padding-right: 38/100rem;
        background: url("../../assets/application/dataily.png") no-repeat center;
        background-position-x: 140/100rem;
        background-size: 28/100rem;
      }
    }
    .list-item {
      width: 100%;
      height: 298/100rem;
      background-color: #ffffff;
      box-shadow: 0 12/100rem 32/100rem 0 rgba(35, 36, 46, 0.04);
      border-radius: 4/100rem;
      padding: 40/100rem 30/100rem 0 30/100rem;
      position: relative;
      margin-bottom: 0.2rem;
      .top {
        width: 100%;
        height: 100/100rem;
        border-bottom: 1px solid #f0f0f0;
        .left {
          img {
            width: 80/100rem;
            height: 80/100rem;
            vertical-align: middle;
            border-radius: 100%;
            margin-right: 18/100rem;
          }
          max-width: 420/100rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .right {
          line-height: 1;
          padding-top: 24/100rem;
          padding-right: 30/100rem;
        }
      }
      .bottom {
        color: #8a92a2;
        padding-top: 20/100rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .left {
          color: #3d424c;
        }
      }
    }
    .list-item:before {
      content: " ";
      position: absolute;
      left: 30/100rem;
      bottom: 0;
      height: 1px;
      width: 630/100rem;
      background-color: #f0f0f0;
    }
  }
  .tips {
    color: #8a92a2;
    padding-top: 40/100rem;
    text-align: center;
  }
  .empty {
    width: 100%;
    height: 576/100rem;
    background: url("../../assets/img-empty.png") no-repeat center;
    background-size: 240/100rem;
    background-position-y: 280/100rem;
    span {
      display: block;
      text-align: center;
      padding-top: 550/100rem;
      color: #3e434d;
    }
  }
}
</style>
