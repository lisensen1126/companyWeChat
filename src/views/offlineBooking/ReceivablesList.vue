<template>
  <div class="index">
    <div class="positionTop" v-if="positionDate">
      <div class="title">
        <div class="left pull-left font-14">{{positionDate}}</div>
        <div class="right pull-right font-14" @click.stop="goSarch">指定日期</div>
      </div>

    </div>
    <div v-if="page_init && list.length > 0">
      <div v-for="(item,index) in list" :key="index">
        <div class="list">
          <div class="title">
            <div class="left pull-left font-14">{{item.date}}</div>
            <div class="right pull-right font-14" v-if="index == 0" @click.stop="goSarch">指定日期</div>
          </div>
          <div class="list-item" v-for="(info, index) in item.list" :key="index" @click="goDetail(info)">
            <div class="top">
              <div class="left font-14 pull-left">
                <img :src="info.avatar || 'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png'" alt="">
                {{info.nick_name || '--'}}
              </div>
              <div class="right font-16 pull-right">
                ￥{{info.final_amount / 100}}
              </div>
            </div>
            <div class="bottom font-14">
              <div class="left pull-left">收款时间</div>
              <div class="right pull-right">{{info.paid_at | date("yyyy年MM月dd日 HH:mm:ss", "cn")}}</div>
            </div>
            <div class="bottom font-14">
              <div class="left pull-left">收款类型</div>
              <div class="right pull-right">{{info.order_type == 6 ? '门店收款码' : '开单收款码'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="tips font-12">—— 以上是全部收款记录 ——</div>
    </div>

    <div class="empty-page" v-if="page_init && list.length == 0">
      <div class="empty">
        <img src="../../assets/empty_page.png" alt="">
        <p class="font-10">暂无数据</p>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
export default {
  data() {
    return {
      list: [],
      page_init: false,
      positionDate: "",
      itemOffsetY: []
    };
  },
  methods: {
    //监听滚动
    handleWindowScroll() {
      var windowScrollTop = window.pageYOffset;
      // console.log("滚轮移动了  " + windowScrollTop);
      let itemList = document.getElementsByClassName("list");
      for (let i = 0; i < itemList.length; i++) {
        if (this.itemOffsetY.length == itemList.length) {
          break;
        }
        this.itemOffsetY.push(itemList[i].offsetTop);
      }
      for (let j = 0; j < this.itemOffsetY.length; j++) {
        if (windowScrollTop > this.itemOffsetY[j]) {
          this.positionDate = this.list[j].date;
        }
      }

      if (windowScrollTop == 0) {
        this.positionDate = "";
      }
    },
    goSarch() {
      this.$router.push({
        name: "ReceivablesSearch"
      });
    },

    // 去详情
    goDetail(id) {
      this.$router.push({
        name: "ReceivablesDetail",
        query: {
          id: id.trade_order_no
        }
      });
    },

    // 获取列表
    fetchList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getOrderListApi({ data_type: 2 }).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.$loading.hide();
            self.list = res.data;
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
    }
  },

  mounted() {
    this.fetchList();
    window.addEventListener("scroll", this.handleWindowScroll);
  },

  destroyed() {
    window.removeEventListener("scroll", this.handleWindowScroll);
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fa;
  .positionTop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #f7f8fa;
    z-index: 999;
    padding: 0 30/100rem 0 30/100rem;
    height: 92/100rem;
    font-weight: bold;
    color: #3d424c;
    box-sizing: border-box;
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
        background: url("../../assets/application/dataily.png") right 50%
          no-repeat;
        // background-position-x: 140/100rem;
        background-size: 28/100rem;
      }
    }
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
        background: url("../../assets/application/dataily.png") right 50%
          no-repeat;
        // background-position-x: 140/100rem;
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
      margin-bottom: 20/100rem;
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
    padding-bottom: 30/100rem;
  }
  .empty-page {
    background-color: #f7f8fa;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    .empty {
      img {
        width: 2.4rem;
        height: 2.4rem;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
