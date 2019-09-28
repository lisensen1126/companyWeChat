<template>
  <div class="index">
    <div class="header">
      <div class="search">
        <span class="blod"></span>
        <input type="text" v-model.trim="keyword" @keyup.enter="search" autofocus="autofocus" class="font-13 search-phone" placeholder="输入项目名称">
        <span class="clear" v-if="keyword.length > 0" @click="clearInput"></span>
        <span class="cancel font-16" @click="search">搜索</span>
      </div>
    </div>
    <!-- 历史记录 -->
    <div class="history" v-show="show_history">
      <div class="list">
        <div class="title font-16">历史记录</div>
        <ul class="clearfix sku">
          <li class="font-12" v-for="(item, index) in info" :key="index" @click="searchHistory(item)">{{item}}</li>
        </ul>
      </div>
    </div>

    <!-- 搜索出的结果 -->
    <div class="search-list" v-if="page_init">
      <div class="tab">
        <div class="left font-13" :class="{'active': item.id == tab_state}" v-for="(item, index) in tab_list" :key="index" @click="tabClick(item)">
          {{item.name}}
          <span></span>
        </div>
      </div>

      <div class="pos" v-if="list.length > 0">
        <scroller ref="myscroller" :on-infinite="infinite">
          <div class="list font-20">
            <template v-for="(item,index) in list">
              <div class="list-item" :key="index">
                <div class="left pull-left">
                  <div class="item" :class="{ 'goods': item.type == 1, 'serve': item.type == 2, 'card': item.type != 2 && item.type != 1}"></div>
                  <img class="goods-img" :src="item.pic" alt="">
                </div>
                <div class="right pull-left">
                  <p class="good-name font-15">{{item.name}}</p>
                  <div class="money">
                    ￥{{item.price / 100}}
                  </div>
                  <div class="right-num pull-right">
                  <div class="reduce"
                       @click="reduceShopping(item)"></div>
                  <div class="value font-16">{{item.quantity ? item.quantity : 0}}</div>
                  <div class="add"
                       @click="addShopping(item)"></div>
                </div>
                </div>
              </div>
            </template>
          </div>
        </scroller>
      </div>

      <!-- 缺省 -->
      <div class="empty" v-if="list.length === 0 && page_init">
        <span class="font-12">暂无您想搜索的数据~</span>
      </div>
    </div>

    <!-- 下单按钮 -->
    <div class="footer">
      <div class="shop-car pull-left" @click="showCar">
        <div class="shop-num font-10">{{shop_num}}</div>
      </div>
      <div class="totle-money pull-left font-16">
        合计:<span class="font-20 count">￥{{shop_money / 100}}</span>
        <button class="sub font-14" v-if="shop_money == 0">去开单</button>
        <button class="sub font-14 active" v-if="shop_money > 0" @click="payOrder">去开单</button>
      </div>
    </div>

    <!-- 购物车弹框 -->
    <div class="shop-modal" v-if="show_car" @click.self="showCar">
      <div class="content">
        <div class="font-16 top-tip">
          商品详情
          <div class="font-14 clear-car pull-right" @click="clearShopCar">清空</div>
        </div>
        <div class="list-content" v-if="shop_car.length">
          <div class="list" v-for="(item, index) in shop_car" :key="index">
            <div class="list-item clearfix">
              <div class="left pull-left">
                <p class="font-14 name">{{item.item_title}}</p>
                <p class="money font-14">￥{{item.unit_price}}</p>
              </div>
              <div class="right">
                <div class="reduce" @click="reduce(item, index)"></div>
                <div class="value font-16">{{item.quantity}}</div>
                <div class="add" @click="add(item, index)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
export default {
  data() {
    return {
      keyword: "",
      tab_list: [
        {
          name: "商品",
          id: 1
        },
        {
          name: "服务",
          id: 2
        }
        // {
        //   name: '养护卡',
        //   id: 3
        // }
      ],
      tab_state: 2,
      page: 1,
      page_size: 10,
      show_data: false,
      list: [], // 页面列表
      page_init: false,
      info: [], // 历史记录
      show_history: true, // 是否显示历史纪录
      shop_car: [], // 购物车总数居
      shop_num: 0, // 购物车总数量
      show_car: false, // 是否显示购物车弹框
      shop_money: 0, // 商品总金额
      spu_id: null // 当前商品spu_id(选择规格时用)
    };
  },
  watch: {
    keyword(val) {
      if (val.length === 0) {
        this.list = [];
        this.page_init = false;
      }
    }
  },
  methods: {
    // 历史搜索记录
    fetchHistory() {
      let self = this;
      self.$loading.show("加载中");
      Api.getHistoryApi().then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.$loading.hide();
            self.info = res.data;
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

    // tab切换
    tabClick(params) {
      this.tab_state = params.id;
      this.list = [];
      this.page = 1;
      this.show_data = false;
      this.page_init = false;
      this.fetBillList();
    },

    // 获取列表数据
    fetBillList(done) {
      let self = this;
      self.$loading.show("加载中");
      Api.getOfflineSearchApi({
        page: self.page,
        per_page: self.page_size,
        type: self.tab_state,
        keyword: self.keyword
      }).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.page_init = true;
            if (res.meta) {
              if (res.meta.current_page == 1) {
                self.list = res.data;
                done && done();
              } else if (res.meta.current_page !== 1) {
                res.data.forEach(element => {
                  self.list.push(element);
                });
              }
              if (res.meta.current_page == res.meta.last_page) {
                self.show_data = true;
                done && done();
              } else {
                done && done();
              }
              this.updateListNum();
            }
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

    // 上拉加载
    infinite(done) {
      if (this.show_data) {
        done(true);
        return;
      }
      this.page++;
      this.fetBillList(done);
    },

    // 搜索
    search() {
      if (this.keyword == "") return;
      this.show_history = false;
      this.tab_state = 2;
      this.fetBillList();
    },

    // 历史记录搜索
    searchHistory(item) {
      this.show_history = false;
      this.tab_state = 2;
      this.keyword = item;
      this.fetBillList();
    },

    // 清除搜索框
    clearInput() {
      this.keyword = "";
      this.show_data = false;
      this.list = [];
      this.page_init = false;
    },

    // 控制显示购物车
    showCar() {
      this.show_car = !this.show_car;
    },

    // 商品存储本地函数
    setLocalInfo() {
      let storage = window.localStorage;
      let store_arr = JSON.stringify(this.shop_car);
      storage.setItem("cy_car", store_arr);
    },

    // 将列表数据添加到购物车
    addShopping(item) {
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      let self = this;
      let existence = self.shop_car.find(v => v.item_id == item.id);
      if (existence == undefined) {
        let obj = {
          item_id: item.id,
          item_type: item.type,
          item_title: item.name,
          image_url: item.pic,
          quantity: 1,
          unit_price: item.price / 100
        };
        this.shop_car.push(obj);
        this.shop_num++;
        this.shop_money = this.shop_money + Number(obj.unit_price) * 100;
      } else {
        this.shop_car.forEach(v => {
          if (v.item_id == item.id) {
            v.quantity++;
            self.shop_num++;
            self.shop_money = this.shop_money + Number(item.price);
          }
        });
      }
      self.setLocalInfo();
      this.updateListNum();
    },

    // 减少列表及购物车中的商品数量
    reduceShopping(item) {
      console.log(item);
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      if (!item.quantity) {
        return;
      } else {
        this.shop_car.forEach((cell, index) => {
          if (cell.item_id === item.id) {
            cell.quantity--; // 当前商品
            this.shop_num--; // 购物车角标
            this.shop_money = Number(this.shop_money) - Number(item.price);
            if (!cell.quantity) {
              this.$delete(this.shop_car, index);
            }
            this.updateListNum();
            this.setLocalInfo();
          }
        });
      }
    },

    // 更新列表数量
    updateListNum() {
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      this.list.forEach(x => {
        x.quantity = 0;
        this.shop_car.forEach(y => {
          if (x.id === y.item_id) {
            x.quantity = y.quantity;
          }
        });
      });
    },

    // 购物车减少项目
    reduce(item, index) {
      item.quantity--;
      this.shop_num--;
      this.shop_money = this.shop_money - Number(item.unit_price) * 100;
      if (item.quantity == 0) this.$delete(this.shop_car, index);
      this.setLocalInfo();
      this.updateListNum();
    },

    // 购物车内项目添加
    add(item) {
      item.quantity++;
      this.shop_num++;
      this.shop_money = this.shop_money + Number(item.unit_price) * 100;
      this.setLocalInfo();
      this.updateListNum();
    },

    // 清空购物车
    clearShopCar() {
      this.shop_car = [];
      this.shop_num = 0;
      this.shop_money = 0;
      this.setLocalInfo();
      this.showCar();
      this.updateListNum();
    },

    // 去开单，开单操作
    payOrder() {
      this.$router.push({ path: "/opening/confirm" });
    }
  },

  mounted() {
    this.fetchHistory();

    // 初始化购物车
    let storage = window.localStorage;
    if (storage.getItem("cy_car")) {
      let self = this;
      let store_arr = JSON.parse(storage.getItem("cy_car"));
      this.shop_car = [...store_arr];
      this.shop_car.forEach(v => {
        self.shop_num = self.shop_num + Number(v.quantity);
        self.shop_money =
          self.shop_money + Number(v.unit_price) * 100 * Number(v.quantity);
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index {
  background-color: #f7f8fa;
  height: 100vh;
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
  }

  .history {
    .list {
      padding-left: 30/100rem;
      .title {
        padding: 30/100rem 0;
        color: #3d424c;
        font-weight: bold;
      }
      .sku {
        li {
          padding: 18/100rem 36/100rem;
          background-color: #ffffff;
          color: #7f7f7f;
          float: left;
          margin-right: 24/100rem;
          margin-bottom: 20/100rem;
        }
      }
    }
  }
  .search-list {
    .tab {
      width: 100%;
      height: 90/100rem;
      color: #8a92a2;
      font-weight: bold;
      display: flex;
      justify-content: space-around;
      background-color: #fff;
      .left {
        height: 90/100rem;
        line-height: 90/100rem;
        text-align: center;
        float: left;
        position: relative;
        span {
          width: 36/100rem;
          height: 4/100rem;
          position: absolute;
          left: calc(50% - 0.18rem);
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
    .pos {
      width: 100%;
      min-height: 80vh;
      position: relative;
      margin-top: 2px;
      background-color: #fff;
      .list {
        padding: 0 30/100rem;
        .list-item {
          width: 100%;
          height: 240/100rem;
          padding-top: 30/100rem;
          position: relative;
          .left {
            width: 268/100rem;
            height: 168/100rem;
            position: relative;
            .goods-img {
              width: 268/100rem;
              height: 168/100rem;
            }
            .item {
              width: 76/100rem;
              height: 28/100rem;
              position: absolute;
              right: -4/100rem;
              top: -4/100rem;
            }
            .goods {
              background: url("../../assets/application/good-tip.png") no-repeat
                center;
              background-size: 76/100rem 28/100rem;
            }
            .serve {
              background: url("../../assets/application/serve-tip.png")
                no-repeat center;
              background-size: 76/100rem 28/100rem;
            }
            .card {
              background: url("../../assets/application/card-tip.png") no-repeat
                center;
              background-size: 76/100rem 28/100rem;
            }
          }
          .right {
            width: 392/100rem;
            height: 168/100rem;
            margin-left: 30/100rem;
            position: relative;
            .good-name {
              line-height: 44/100rem;
              color: #000;
              font-weight: bold;
            }
            .money {
              position: absolute;
              left: 0;
              bottom: 0;
              color: #e50413;
              line-height: 1;
              font-weight: bold;
            }
            .right-num {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 188/100rem;
              height: 56/100rem;
              margin-top: 24/100rem;
              display: flex;
              justify-content: space-around;
              border: 1px solid #f7f7f7;
              .reduce {
                width: 56/100rem;
                height: 56/100rem;
                background: url("../../assets/application/reduce.png") no-repeat
                  center;
                background-size: 20/100rem;
              }
              .value {
                width: 76/100rem;
                height: 56/100rem;
                line-height: 56/100rem;
                text-align: center;
                background-color: #f7f7f7;
                color: #404040;
              }
              .add {
                width: 56/100rem;
                height: 56/100rem;
                background: url("../../assets/application/add-shi.png")
                  no-repeat center;
                background-size: 20/100rem;
              }
            }
          }
        }
        .list-item:after {
          content: " ";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 1px;
          width: 720/100rem;
          background-color: #eeeeee;
        }
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 116/100rem;
    background-color: #fff;
    box-shadow: 0px 6/100rem 32/100rem 0px rgba(26, 26, 32, 0.09);
    z-index: 10;
    .shop-car {
      width: 140/100rem;
      height: 116/100rem;
      background: url("../../assets/application/shop-car.png") no-repeat center;
      background-size: 60/100rem;
      border-right: 1px solid #eeeeee;
      position: relative;
      .shop-num {
        position: absolute;
        top: 24/100rem;
        left: 86/100rem;
        min-height: 28/100rem;
        min-width: 28/100rem;
        border: 1px solid #fff;
        line-height: 28/100rem;
        text-align: center;
        border-radius: 28/100rem;
        background-color: #eb5342;
        color: #fff;
      }
    }
    .totle-money {
      width: 606/100rem;
      height: 116/100rem;
      line-height: 116/100rem;
      color: #404040;
      padding-left: 30/100rem;
      position: relative;
      .count {
        color: #dd1d21;
        font-weight: bold;
        line-height: 1;
      }
      .sub {
        width: 210/100rem;
        height: 80/100rem;
        line-height: 80/100rem;
        position: absolute;
        top: 16/100rem;
        right: 30/100rem;
        border-radius: 80/100rem;
        color: #fff;
        background-color: #aeb5c5;
      }
      .active {
        background-color: #5e7bff;
        box-shadow: 0px 12/100rem 24/100rem 0px rgba(94, 123, 255, 0.3);
      }
    }
  }
  .shop-modal {
    width: 100%;
    height: calc(100vh - 1.14rem);
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    .content {
      width: 100%;
      min-height: 422/100rem;
      max-height: 640/100rem;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      .top-tip {
        width: 100%;
        height: 104/100rem;
        line-height: 104/100rem;
        padding-left: 30/100rem;
        color: #3d424c;
        font-weight: bold;
        border-bottom: 1px solid #f0f0f0;
        .clear-car {
          width: 140/100rem;
          height: 1.04rem;
          text-align: right;
          color: #8a92a2;
          padding-right: 30/100rem;
        }
      }
      .list-content {
        max-height: 536/100rem;
        overflow-y: scroll;
      }
      .list {
        width: 100%;
        max-height: 536/100rem;
        overflow-x: scroll;
        padding: 0 30/100rem;
        .list-item {
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 30/100rem;
          position: relative;
          .left {
            width: 430/100rem;
            height: 100%;
            .name {
              color: #3d424c;
              line-height: 40/100rem;
              padding-top: 30/100rem;
            }
            .money {
              color: #dd1d21;
              padding-top: 4/100rem;
            }
          }
          .right {
            width: 208/100rem;
            height: 56/100rem;
            position: absolute;
            top: 32%;
            right: 0;
            display: flex;
            justify-content: space-around;
            border: 1px solid #f7f7f7;
            .reduce {
              width: 56/100rem;
              height: 56/100rem;
              background: url("../../assets/application/reduce.png") no-repeat
                center;
              background-size: 20/100rem;
            }
            .value {
              width: 96/100rem;
              height: 56/100rem;
              line-height: 56/100rem;
              text-align: center;
              background-color: #f7f7f7;
              color: #404040;
            }
            .add {
              width: 56/100rem;
              height: 56/100rem;
              background: url("../../assets/application/add.png") no-repeat
                center;
              background-size: 20/100rem;
            }
          }
        }
      }
    }
  }
  .sku-modal {
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    z-index: 11;
    .content {
      width: 100%;
      min-height: 422/100rem;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      padding-bottom: 40/100rem;
      .top-tip {
        width: 100%;
        height: 104/100rem;
        line-height: 104/100rem;
        padding-left: 30/100rem;
        color: #3d424c;
        font-weight: bold;
        .clear-car {
          width: 1.04rem;
          height: 1.04rem;
          background: url("../../assets/application/close.png") no-repeat center;
          background-size: 30/100rem;
        }
        .right {
          float: right;
          width: 220/100rem;
          height: 70/100rem;
          display: flex;
          justify-content: space-around;
          .reduce {
            width: 70/100rem;
            height: 70/100rem;
            background: url("../../assets/application/reduce.png") no-repeat
              center;
            background-size: 28/100rem;
          }
          .value {
            width: 80/100rem;
            height: 70/100rem;
            line-height: 70/100rem;
            text-align: center;
            background-color: #f7f7f7;
            color: #404040;
          }
          .add {
            width: 70/100rem;
            height: 70/100rem;
            background: url("../../assets/application/add.png") no-repeat center;
            background-size: 28/100rem;
          }
        }
      }
      .l-h-70 {
        line-height: 70/100rem;
        height: 70/100rem;
      }
      .m-t-40 {
        margin-top: 40/100rem;
      }
      .goods-info {
        padding: 0 30/100rem;
        .good-img {
          width: 268/100rem;
          height: 168/100rem;
          img {
            width: 268/100rem;
            height: 168/100rem;
          }
        }
        .good-msg {
          width: 420/100rem;
          height: 168/100rem;
          padding-left: 20/100rem;
          position: relative;
          .good-name {
            color: #000;
            font-weight: bold;
            line-height: 1.1;
          }
          .select-sku {
            color: #a7a9ac;
            line-height: 1;
            padding-top: 12/100rem;
          }
          .goods-price {
            color: #d42e12;
            font-weight: bold;
            position: absolute;
            left: 0;
            bottom: 0;
            line-height: 1;
            padding-left: 20/100rem;
          }
        }
      }
      .goods-sku {
        height: 430/100rem;
        width: 100%;
        overflow-y: scroll;
        .list {
          margin-top: 20/100rem;
          padding-left: 30/100rem;
          .title {
            padding: 30/100rem 0;
            color: #3d424c;
            font-weight: bold;
          }
          .sku {
            li {
              padding: 18/100rem 36/100rem;
              background-color: #f8f8f8;
              color: #7f7f7f;
              float: left;
              margin-right: 24/100rem;
              margin-bottom: 20/100rem;
            }
            .active {
              color: #fff;
              background-color: #5e7bff;
            }
          }
        }
      }
    }
  }
  .submit {
    width: 690/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    border-radius: 76/100rem;
    color: #fff;
    background-color: #aeb5c5;
    margin: 0 auto;
    margin-top: 40/100rem;
    text-align: center;
  }
  .active-sku {
    background-color: #5e7bff;
    box-shadow: 0px 12/100rem 24/100rem 0px rgba(94, 123, 255, 0.3);
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
