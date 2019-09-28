<template>
  <div class="index font-PC-re" v-if="page_init">
    <div class="order">
      <p class="header font-14">开单项目</p>
      <div class="order-info clearfix" v-for="(data, index) in info.item" :key="index">
        <div class="left pull-left">
          <img v-if="data.item_type == 1" class="float-img" src="../../assets/application/good-tip.png" alt="">
          <img v-if="data.item_type == 2" class="float-img" src="../../assets/application/serve-tip.png" alt="">
          <img v-if="data.item_type == 3" class="float-img" src="../../assets/application/card-tip.png" alt="">
          <img class="z-img" :src="data.image_url" alt="">
        </div>
        <div class="right pull-left">
          <div class="good-name font-13">{{data.item_title}}</div>
          <div class="good-price clearfix">
            <span class="pull-left font-18">
              ￥{{data.unit_price / 100}}
            </span>
            <span class="pull-right font-14">
              x {{data.quantity}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="line">
      <p class="header font-14">开单信息</p>
      <div class="line-box">
        <div class="left pull-left font-14">开单时间</div>
        <div class="right pull-right font-14">{{info.quick_create_time | date("yyyy-MM-dd HH:mm:ss", "cn")}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">开单员工</div>
        <div class="right pull-right font-14">{{info.mem_user_name || '--'}}</div>
      </div>
    </div>
    <div class="line">
      <p class="header font-14">订单信息</p>
      <div class="line-box">
        <div class="left pull-left font-14">客户名称</div>
        <div class="right pull-right font-14">{{info.nick_name || '--'}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">手机号码</div>
        <div class="right pull-right font-14">{{info.mobile || '--'}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">买单时间</div>
        <div class="right pull-right font-14">{{info.paid_at | date("yyyy-MM-dd HH:mm:ss", "cn")}}</div>
      </div>
      <div class="line-box">
        <div class="left pull-left font-14">实付金额</div>
        <div class="right pull-right font-14 color-red">￥{{info.final_amount / 100}}</div>
      </div>
    </div>

    <!-- 重开此单按钮 -->
    <div class="footer" v-if="info.order_type == 7">
    <div class="btn" @click="showModal">
        <p class="font-12 blod">重开此单</p>
        <p class="font-10">引用当前项目开单</p>
      </div>
    </div>

    <!-- 重开此单确认 -->
    <div class="modal" v-show="show_modal">
      <div class="content">
        <div class="box">
          <div class="title font-16">重开此单</div>
          <div class="text font-16">是否引用当前项目重新开单？</div>
          <div class="footer">
            <div class="left font-16" @click="showModal">取消</div>
            <div class="right font-16" @click="submit">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
export default {
  name: "OpeningRecordDetail",
  data() {
    return {
      info: {},
      page_init: false,
      show_modal: false
    };
  },
  methods: {
    // 获取列表
    fetchDetail() {
      let self = this;
      self.$loading.show("加载中");
      Api.getRecordDetailApi({
        trade_order_no: self.$route.query.id
      }).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.$loading.hide();
            self.info = res.data;
            self.page_init = true;
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

    // 打开二次确认
    showModal() {
      this.show_modal = !this.show_modal;
    },

    // 确认开单
    submit() {
      // let storage = window.localStorage
      let list = [];
      this.info.item.forEach(v => {
        let item = {
          item_id: v.item_id,
          item_type: v.item_type,
          item_title: v.item_title,
          image_url: v.image_url,
          quantity: v.quantity,
          unit_price: v.unit_price / 100
        };
        list.push(item);
      });
      // storage.setItem('cy_car', JSON.stringify(list))
      this.$router.push({
        name: "OpeningOrderConfirm",
        query: {
          flag: 1,
          list
        }
      });
    }
  },
  mounted() {
    this.fetchDetail();
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index {
  line-height: 1;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 136/100rem;
  .header {
    padding-left: 16/100rem;
    border-left: 10/100rem solid #4b77b0;
  }
  .order {
    width: 100%;
    height: auto;
    padding: 30/100rem 0 30/100rem 30/100rem;
    background-color: #ffffff;
    .order-info {
      width: 720/100rem;
      height: auto;
      padding-top: 0.3rem;
      padding-bottom: 30/100rem;
      padding-right: 30/100rem;
      border-bottom: 1px solid #eeeeee;
      .left {
        width: 268/100rem;
        height: 168/100rem;
        position: relative;
        .z-img {
          width: 268/100rem;
          height: 168/100rem;
        }
        .float-img {
          position: absolute;
          right: -4/100rem;
          top: -4/100rem;
          height: 28/100rem;
          width: 76/100rem;
        }
      }
      .right {
        width: 422/100rem;
        padding-left: 30/100rem;
        height: 168/100rem;
        position: relative;
        .good-name {
          line-height: 1.2;
          font-weight: bold;
          color: #000000;
          width: 100%;
        }
        .good-attr {
          line-height: 1.4;
          margin-top: 6/100rem;
          font-weight: bold;
          width: 100%;
          color: #000000;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .good-price {
          line-height: 1.1;
          margin-top: 43/100rem;
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          padding-left: 30/100rem;
          span:first-child {
            font-weight: bold;
            color: #e50413;
          }
          span:last-child {
            color: #000000;
            padding-top: 8/100rem;
          }
        }
      }
    }
    .order-info:last-child {
      padding-bottom: 0;
      border: none;
    }
  }
  .line {
    width: 100%;
    height: auto;
    margin-top: 20/100rem;
    background-color: #ffffff;
    padding-top: 30/100rem;
    p {
      margin-left: 30/100rem;
    }
    .line-box {
      width: 100%;
      padding: 0 30/100rem;
      height: 132/100rem;
      position: relative;
      border-bottom: 1px solid #eeeeee;
      overflow: hidden;
      .left {
        line-height: 132/100rem;
        color: #8a92a2;
      }
      .right {
        line-height: 132/100rem;
        color: #000000;
      }
      .color-red {
        color: #dd1d21;
      }
    }
    .line-box:last-child {
      border-bottom: 1px solid #ffffff;
    }
  }
  .hr {
    width: 100%;
    height: 160/100rem;
  }
  .pull-right {
    max-width: 5.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .footer {
    width: 100%;
    height: 116/100rem;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #ffffff;
    box-shadow: 0px 6/100rem 32/100rem 0/100rem rgba(26, 26, 32, 0.09);
    .btn {
      width: 690/100rem;
      height: 80/100rem;
      border: 1px solid #5e7bff;
      border-radius: 80/100rem;
      text-align: center;
      color: #5e7bff;
      margin-top: 16/100rem;
      margin-left: 30/100rem;
      .blod {
        font-weight: bold;
      }
    }
  }
  .modal {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    .content {
      width: 660/100rem;
      min-height: 420/100rem;
      background-color: #fff;
      position: absolute;
      left: 45/100rem;
      top: 30%;
      .title {
        width: 100%;
        height: 124/100rem;
        line-height: 124/100rem;
        text-align: center;
        background-color: #4b77b0;
        color: #fff;
      }
      .text {
        width: 500/100rem;
        text-align: center;
        color: #3d424c;
        margin: 0 auto;
        margin-top: 60/100rem;
      }
      .box {
        width: 100%;
        height: 420/100rem;
        position: relative;
      }
      .footer {
        width: 100%;
        height: 106/100rem;
        border-top: 1px solid #f0f0f0;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        text-align: center;
        .left {
          width: 50%;
          line-height: 106/100rem;
          border-right: 1px solid #f0f0f0;
          color: #404040;
        }
        .right {
          width: 50%;
          line-height: 106/100rem;
          color: #4b77b0;
        }
      }
    }
  }
}
</style>
