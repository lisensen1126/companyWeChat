<template>
  <div class="bookingList font-PC-re">
    <div class="header">
      <div class="search">
        <span class="blod"></span>
        <input type="number" v-model="keyword" @keyup.enter="search" oninput="if(value.length>11)value=value.slice(0,11)" autofocus="autofocus" class="font-13 search-phone" placeholder="手机号">
        <span class="clear" v-if="keyword.length > 0" @click="clearInput"></span>
        <span class="cancel font-16" @click="search">搜索</span>
      </div>
      <div class="tab">
        <div class="left font-13" :class="{'active': item.id == tabState}" v-for="(item, index) in tabList" :key="index" @click="tabClick(item)">
          {{item.name}}
          <span></span>
        </div>
      </div>
    </div>
    <div class="pos">
      <scroller ref="myscroller" :on-infinite="infinite" v-if="artList.length && artList.length > 0">
        <div class="list">
          <template v-for="(item,index) in artList">
            <div class="list-item" :key="index" @click.stop="goDetail(item.trade_order_no)">
              <div class="item-oder">
                <div class="left pull-left font-12">
                  订单编号: {{item.trade_order_no}}
                </div>
                <div class="right pull-right font-12">
                  <span v-if="item.status == 2">待核销</span>
                  <span v-else class="default">已核销</span>
                </div>
              </div>
              <div class="user-info">
                <div class="left pull-left">
                  <img :src="item.customer.avatar" alt="">
                </div>
                <div class="right pull-left">
                  <div class="name font-18">{{item.customer.real_name}}</div>
                  <div class="phone font-12">手机号：{{item.customer.mobile}}</div>
                </div>
              </div>
              <div class="line-item" v-if="tabState == 2 || tabState == 4">
                <div class="left pull-left font-14">预约时间</div>
                <div class="right pull-right font-14">{{item.reserve_time}}</div>
              </div>
              <div class="line-item" v-if="tabState == 2 || tabState == 4">
                <div class="left pull-left font-14">预约门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div>
              <div class="line-item" v-if="tabState == 3">
                <div class="left pull-left font-14">核销时间</div>
                <div class="right pull-right font-14">{{item.write_off_at}}</div>
              </div>
              <!-- <div class="line-item" v-if="tabState == 3">
                <div class="left pull-left font-14">核销门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div> -->
              <div class="line-item"
                   v-if="tabState == 3 && item.operator">
                <div class="left pull-left font-14">核销人</div>
                <div class="right pull-right font-14">{{item.operator}}</div>
              </div>
              <div class="line-item" v-if="tabState == 1">
                <div class="left pull-left font-14">下单时间</div>
                <div class="right pull-right font-14">{{item.created_at}}</div>
              </div>
              <div class="line-item" v-if="tabState == 1">
                <div class="left pull-left font-14">下单门店</div>
                <div class="right pull-right font-14">{{item.store_name}}</div>
              </div>
            </div>
          </template>
        </div>
      </scroller>
      <div class="empty" v-if="init && artList.length === 0">
        <span class="font-12">搜索不到结果，请重新查找哦～</span>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/bookingApi.js";
export default {
  name: "WriteOffSearch",
  data() {
    return {
      page: 1,
      pageSize: 20,
      keyword: "",
      showData: false,
      init: false,
      tabList: [
        {
          name: "已预约",
          id: 2
        },
        {
          name: "未预约",
          id: 1
        },
        {
          name: "已核销",
          id: 3
        },
        {
          name: "预约过期",
          id: 4
        }
      ],
      artList: [],
      tabState: 2
    };
  },
  methods: {
    // 清除搜索框
    clearInput() {
      this.keyword = "";
      this.artList = [];
    },
    // 获取列表数据
    getList(done) {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getAppointmentList({
        page: _this.page,
        pre_page: _this.pageSize,
        reserve_status: _this.tabState,
        mobile: _this.keyword
      }).then(res => {
        _this.$loading.hide();
        if (res.code === 0) {
          _this.init = true;
          if (res.meta) {
            if (res.meta.current_page == 1) {
              _this.artList = res.data;
              done && done();
            } else if (res.meta.current_page !== 1) {
              res.data.forEach(element => {
                _this.artList.push(element);
              });
              // _this.$refs.myscroller.resize();
            }
            if (res.meta.current_page == res.meta.last_page) {
              _this.showData = true;
              done && done();
            } else {
              done && done();
            }
          }
        } else {
          _this.init = true;
        }
      });
    },
    // 上拉加载
    infinite(done) {
      if (this.showData) {
        done(true);
        return;
      }
      this.page++;
      this.getList(done);
    },
    // tab切换
    tabClick(params) {
      this.tabState = params.id;
      this.artList = [];
      this.page = 1;
      this.showData = false;
      this.pageSize = 20;
      this.init = false;
      this.getList();
    },
    // 去往订单详情
    goDetail(id) {
      this.$router.replace({
        name: "WriteOffDetails",
        query: {
          id: id,
          type: this.tabState
        }
      });
    },
    search() {
      this.artList = [];
      this.getList();
    }
  },
  watch: {
    keyword(val) {
      if (val.length === 0) {
        this.init = false;
      }
    }
  },
  mounted() {
    this.tabState = this.$route.query.type;
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.bookingList {
  line-height: 1;
  width: 100%;
  height: 100vh;
  position: relative;
  .pos {
    width: 100%;
    min-height: 80vh;
    position: relative;
    .list {
      padding: 0 30/100rem;
      .list-item {
        margin-top: 20/100rem;
        width: 100%;
        height: auto;
        background-color: #ffffff;
        border-radius: 4/100rem;
        .item-oder {
          height: 104/100rem;
          padding: 30/100rem 30/100rem 0 30/100rem;
          .left {
            color: #8a92a2;
          }
          .right {
            span {
              color: #5e7bff;
            }
            .default {
              color: #8a92a2;
            }
          }
        }
        .user-info {
          width: 100%;
          height: 100/100rem;
          padding-left: 30/100rem;
          margin-bottom: 20/100rem;
          .left {
            width: 100/100rem;
            height: 100/100rem;
            border-radius: 100/100rem;
            background-color: #5e7bff;
            margin-right: 30/100rem;
            img {
              width: 100/100rem;
              height: 100/100rem;
              border-radius: 100/100rem;
            }
          }
          .right {
            height: 100/100rem;
            overflow: hidden;
            .name {
              color: #3d424c;
              font-weight: bold;
              padding-top: 12/100rem;
              // line-height: 1.2;
            }
            .phone {
              margin-top: 20/100rem;
              color: #8a92a2;
              line-height: 1;
            }
          }
        }
        .line-item {
          line-height: 100/100rem;
          height: 100/100rem;
          position: relative;
          padding: 0 30/100rem;
          &:after {
            .Pseudo-border-before(#f0f0f0);
          }
          .left {
            color: #3d424c;
          }
          .right {
            color: #8a92a2;
          }
        }
      }
    }
  }
  .header {
    width: 100%;
    min-height: 110/100rem;
    background-color: #ffffff;
    border-top: 1/100rem solid transparent;
    .search {
      width: 596/100rem;
      height: 70/100rem;
      line-height: 70/100rem;
      margin: 0 auto;
      margin-left: 30/100rem;
      margin-top: 20/100rem;
      border: 1px solid #3d424c;
      border-radius: 4/100rem;
      background: url("../../assets/search-img.png") no-repeat center;
      background-position-x: 20/100rem;
      background-size: 28/100rem 26/100rem;
      position: relative;
      .clear {
        width: 70/100rem;
        height: 70/100rem;
        position: absolute;
        top: 0;
        right: 0;
        background: url("../../assets/search-clear.png") no-repeat center;
        background-size: 28/100rem;
      }
      .cancel {
        width: 120/100rem;
        height: 70/100rem;
        line-height: 70/100rem;
        text-align: center;
        color: #5e7bff;
        position: absolute;
        top: 0;
        right: -120/100rem;
      }
      .blod {
        margin-left: 66/100rem;
        float: left;
        height: 22/100rem;
        width: 1px;
        margin-top: 22/100rem;
        background-color: #3d424c;
      }
      .search-phone {
        float: left;
        margin-left: 16/100rem;
        height: 66/100rem;
        padding-top: 5/100rem;
      }
      input::-webkit-input-placeholder {
        color: rgba(61, 66, 76, 0.3);
      }
    }
    .tab {
      width: 100%;
      height: 90/100rem;
      margin-top: 20/100rem;
      color: #8a92a2;
      font-weight: bold;
      .left {
        width: 187/100rem;
        height: 90/100rem;
        line-height: 90/100rem;
        text-align: center;
        float: left;
        position: relative;
        span {
          width: 36/100rem;
          height: 4/100rem;
          position: absolute;
          left: 75/100rem;
          bottom: 0;
          background-color: transparent;
        }
      }
      .active {
        color: #3d424c;
        span {
          background-color: #5e7bff;
        }
      }
    }
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
