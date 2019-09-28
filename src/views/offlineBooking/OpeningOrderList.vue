<template>
  <div class="index">
    <!-- 头部 -->
    <div class="header">
      <!-- 搜索部分 -->
      <div class="search-info clearfix">
        <div class="search pull-left"
             @click="goSearch">
          <span class="blod"></span>
          <span class="font-13 search-phone">搜索更多项目</span>
        </div>
        <div class="operation pull-right">
          <div class="left font-10"
               @click="goCreate">
            手动创建
          </div>
          <div class="middle"></div>
          <div class="right font-10"
               @click="goHistory">
            历史记录
          </div>
        </div>
      </div>

      <!-- tab切换部分 -->
      <div class="tab">
        <div class="roll">
          <div class="left font-13"
               :class="{'active': item.quick_bill_category_id == tab_state}"
               v-for="(item, index) in tab_list"
               @click="tabClick(item)"
               :key="index">
            {{item.quick_bill_name}}
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="pos"
         v-if="list.length > 0 && page_init">
      <scroller ref="myscroller"
                :on-infinite="infinite">
        <div class="list font-20">
          <template v-for="(item,index) in list">
            <div class="list-item"
                 :key="index">
              <div class="left pull-left">
                <div class="item"
                     :class="{ 'goods': item.obj_type == 1, 'serve': item.obj_type == 2, 'card': item.obj_type != 2 && item.obj_type != 1}"></div>
                <img class="goods-img"
                     :src="item.pic"
                     alt="">
              </div>
              <div class="right pull-left">
                <p class="good-name font-15">{{item.name}}</p>
                <!-- <div class=""> -->
                <div class="money">
                  ￥{{item.price / 100}}
                </div>
                <!-- <div class="addcar" @click="addShopping(item)"></div> -->
                <div class="right-num pull-right">
                  <div class="reduce"
                       @click="reduceShopping(item)"></div>
                  <div class="value font-16">{{item.quantity ? item.quantity : 0}}</div>
                  <div class="add"
                       @click="addShopping(item)"></div>
                </div>
                <!-- </div> -->
              </div>
            </div>
          </template>
        </div>
      </scroller>
    </div>

    <!-- 缺省 -->
    <div class="empty"
         v-if="list.length == 0 && page_init">
      <p class="empty-tip font-15">暂未添加快速开单项目可在后台配置项目</p>
      <div class="list-search font-14 pull-left"
           @click="goSearch">
        从全部中搜索
      </div>
      <div class="list-create font-14 pull-left"
           @click="goCreate">
        手动创建项目
      </div>
    </div>

    <!-- 下单按钮 -->
    <div class="footer">
      <div class="shop-car pull-left"
           @click="showCar">
        <div class="shop-num font-10">{{shop_num}}</div>
      </div>
      <div class="totle-money pull-left font-16">
        合计:<span class="font-20 count">￥{{(shop_money / 100).toFixed(2)}}</span>
        <button class="sub font-14"
                v-if="shop_money == 0">去开单</button>
        <button class="sub font-14 active"
                v-if="shop_money > 0"
                @click="payOrder">去开单</button>
      </div>
    </div>

    <!-- 购物车弹框 -->
    <div class="shop-modal"
         v-if="show_car"
         @click.self="showCar">
      <div class="content">
        <div class="font-16 top-tip">
          商品详情
          <div class="font-14 clear-car pull-right"
               @click="clearShopCar">
            <div class="empty-icon"></div>
            清空
          </div>
        </div>
        <div class="list-content"
             v-if="shop_car.length">
          <div class="list"
               v-for="(item, index) in shop_car"
               :key="index">
            <div class="list-item clearfix">
              <div class="left pull-left">
                <p class="font-14 name">{{item.item_title}}</p>
                <p class="money font-14">￥{{item.unit_price}}</p>
              </div>
              <div class="right">
                <div class="reduce"
                     @click="reduce(item, index)"></div>
                <div class="value font-16">{{item.quantity}}</div>
                <div class="add"
                     @click="add(item, index)"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="emp font-14"
             v-if="shop_car.length == 0">
          暂无数据，快快添加吧~
        </div>
      </div>
    </div>

    <!-- sku选择弹框 -->
    <div class="sku-modal"
         v-if="show_sku"
         @click.self="closeSku">
      <div class="content">
        <div class="font-16 top-tip">
          商品详情
          <div class="font-14 clear-car pull-right"
               @click.stop="closeSku"></div>
        </div>

        <div class="goods-info clearfix">
          <div class="good-img pull-left">
            <img :src="car_img"
                 alt="">
          </div>
          <div class="good-msg pull-left">
            <p class="good-name font-15">{{car_name}}</p>
            <p class="select-sku font-12">已选：{{checked_name.toString()}}</p>
            <p class="goods-price font-20">￥{{car_money / 100}}</p>
          </div>
        </div>

        <div class="goods-sku">
          <div class="list"
               v-for="(item,index) in sku_list.attribute_data"
               :key="index">
            <div class="title font-16">{{item.attribute_name}}</div>
            <ul class="clearfix sku">
              <li :class="info.is_checkout ? 'font-12 active': 'font-12'"
                  v-for="(info, key) in item.attribute_items"
                  :key="key"
                  @click="selectSku(info, index, item.attribute_items)">{{info.attribute_item_value}}</li>
            </ul>
          </div>
        </div>

        <div class="font-16 top-tip l-h-70 m-t-40">
          数量
          <div class="right">
            <div :class="car_num == 1 ? 'reduce-xu' : 'reduce'"
                 @click="shopReduce"></div>
            <div class="value font-16">{{car_num}}</div>
            <div class="add"
                 @click="shopAdd"></div>
          </div>
        </div>

        <div class="submit active-sku font-14"
             v-if="is_click"
             @click="skuAddItem">
          选好了
        </div>
        <div class="submit font-14"
             v-if="!is_click">
          该规格商品暂未上架
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
      tab_list: [],
      tab_state: 1,
      shop_car: [], // 购物车总数居
      shop_num: 0, // 购物车总数量
      show_car: false, // 是否显示购物车弹框
      shop_money: 0, // 商品总金额
      page: 1,
      page_size: 10,
      show_data: false,
      list: [], // 页面列表
      page_init: false,
      show_sku: false, // sku弹框
      checked_sku: [], // 选中的sku   ids
      checked_name: [], // 选中的sku   names
      sku_list: [],
      shopping_temp: {
        // 购物车中数据的数据格式及字段
        item_id: 0,
        item_type: 1,
        item_title: "",
        image_url: "",
        quantity: 1,
        unit_price: null,
        spu_id: null
      },
      is_click: true, // 购物车弹框中，“选好了” 是否可以点击
      car_name: "", // 购物车调起之后显示的商品名称
      car_money: 0, // 购物车调起之后显示的商品价格
      car_img: "", // 购物车调起之后显示的商品图片
      car_num: "", // 购物车调起之后显示的商品数量
      sku_id: "", // 选中的sku id
      spu_id: null // 当前商品spu_id(选择规格时用)
    };
  },
  methods: {
    // 去搜索
    goSearch() {
      this.$router.push({
        name: "OpeningOrderSearch"
      });
    },

    // 去创建项目页面
    goCreate() {
      this.$router.push({
        name: "OpeningOrderCreat"
      });
    },

    // 去开单记录列表
    goHistory() {
      this.$router.push({
        name: "OpeningRecordList"
      });
    },

    // 获取快速开单项目分类列表（tab）
    fetchOrderMenu() {
      let self = this;
      self.$loading.show("加载中");
      Api.getOrderMenuApi().then(
        res => {
          if (res.code === 0) {
            this.tab_list = res.data;
            self.$loading.hide();
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
      this.tab_state = params.quick_bill_category_id;
      this.show_data = false;
      this.list = [];
      this.page = 1;
      this.page_size = 20;
      this.page_init = false;
      this.fetBillList();
    },

    // 获取列表数据
    fetBillList(done) {
      let self = this;
      self.$loading.show("加载中");
      Api.getBillListApi({
        page: self.page,
        per_page: self.page_size,
        quick_bill_category_id: self.tab_state
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

    // 购物车减少项目
    reduce(item, index) {
      item.quantity--;
      this.shop_num--;
      this.shop_money = this.shop_money - Number(item.unit_price) * 100;
      if (item.quantity == 0) this.$delete(this.shop_car, index);
      this.updateListNum();
      this.setLocalInfo();
    },

    // 购物车内项目添加
    add(item) {
      item.quantity++;
      this.shop_num++;
      this.shop_money = this.shop_money + Number(item.unit_price) * 100;
      this.updateListNum();
      this.setLocalInfo();
    },

    // 清空购物车
    clearShopCar() {
      this.shop_car = [];
      this.shop_num = 0;
      this.shop_money = 0;
      this.updateListNum();
      this.setLocalInfo();
      this.showCar();
    },

    // 去开单，开单操作
    payOrder() {
      this.$router.push({ path: "/opening/confirm" });
    },

    // 将列表数据添加到购物车
    addShopping(item) {
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      if (item.obj_type == 1) {
        this.car_name = item.name;
        this.spu_id = item.obj_id;
        this.fetchSkuList(item);
      } else {
        let self = this;
        let existence = self.shop_car.find(v => v.item_id == item.obj_id);
        if (existence == undefined) {
          let obj = {
            item_id: item.obj_id,
            item_type: item.obj_type,
            item_title: item.name,
            image_url: item.pic,
            quantity: 1,
            unit_price: item.price / 100
          };
          this.shop_car.push(obj);
          this.shop_num++;
          this.shop_money =
            Number(this.shop_money) + Number(obj.unit_price) * 100;
        } else {
          this.shop_car.forEach(v => {
            if (v.item_id == item.obj_id) {
              v.quantity++;
              self.shop_num++;
              self.shop_money = Number(this.shop_money) + Number(item.price);
            }
          });
        }
        self.setLocalInfo();
        this.updateListNum();
      }
    },

    // 减少列表及购物车中的商品数量
    reduceShopping(item) {
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      if (item.obj_type == 1) {
        if (!item.quantity) {
          return;
        } else {
          this.showCar();
        }
      } else {
        if (!item.quantity) {
          return;
        } else {
          this.shop_car.forEach((cell, index) => {
            if (cell.item_id === item.obj_id) {
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
      }
    },

    // 更新列表数量
    updateListNum() {
      // obj_type:（1商品/2服务/3养护卡）
      // obj_id: 商品/服务/养护卡 ID
      this.list.forEach(x => {
        x.quantity = 0;
        this.shop_car.forEach(y => {
          if (x.obj_type === 1) {
            if (x.obj_id === y.spu_id) {
              x.quantity += y.quantity;
            }
          } else {
            if (x.sku_id === y.item_id) {
              x.quantity = y.quantity;
            }
          }
        });
      });
    },

    // 将选中的sku添加到购物车
    skuAddItem() {
      let self = this;
      let existence = self.shop_car.find(
        v => v.item_id == self.shopping_temp.item_id
      );
      if (existence == undefined) {
        this.shop_car.push(self.shopping_temp);
        this.shop_num = this.shop_num + Number(self.shopping_temp.quantity);
        this.shop_money =
          Number(this.shop_money) +
          Number(self.shopping_temp.unit_price) *
            100 *
            Number(self.shopping_temp.quantity);
      } else {
        this.shop_car.forEach(v => {
          if (v.item_id == self.shopping_temp.item_id) {
            v.quantity++;
            self.shop_num = self.shop_num + Number(self.shopping_temp.quantity);
            self.shop_money =
              Number(self.shopping_temp.unit_price) *
                Number(self.shopping_temp.quantity) *
                100 +
              Number(self.shop_money);
          }
        });
      }
      this.updateListNum();
      self.setLocalInfo();
      self.show_sku = false;
    },

    // 获取SKU列表
    fetchSkuList(item) {
      let self = this;
      self.$loading.show("加载中");
      Api.getSkuListApi({ spu_id: item.obj_id, sku_id: item.sku_id }).then(
        res => {
          if (res.code === 0) {
            // 默认选中的数据的价格图片
            res.data.sku_data.forEach(v => {
              if (v.is_checkout) {
                self.car_img = v.sku_pics[0];
                self.car_money = v.sell_price;
                self.checked_sku = v.attribute_item_ids;
                self.checked_name = v.attribute_items;
                self.sku_id = v.sku_id;
                self.car_num = 1;
                self.shopping_temp = {
                  item_id: v.sku_id,
                  item_type: 1,
                  item_title: self.car_name + self.checked_name.join(" "),
                  image_url: v.sku_pics[0],
                  quantity: self.car_num,
                  unit_price: v.sell_price / 100,
                  spu_id: item.obj_id
                };
              }
            });
            self.sku_list = res.data;
            self.$loading.hide();
            self.show_sku = true;
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

    // 关闭sku选择列表
    closeSku() {
      this.show_sku = !this.show_sku;
      this.spu_id = null;
    },

    // 选择sku
    selectSku(current, index) {
      let self = this;
      let arr_id = []; // 点击选中的sku_id
      let arr_name = []; // 点击选中的sku_name
      this.$set(current, "is_checkout", true);
      this.sku_list.attribute_data.forEach((v, sub) => {
        v.attribute_items.forEach(n => {
          if (n.attribute_item_id != current.attribute_item_id && sub == index)
            n.is_checkout = false;
          if (n.is_checkout) {
            arr_id.push(n.attribute_item_id);
            arr_name.push(n.attribute_item_value);
          }
        });
      });

      this.checked_name = arr_name;

      // 判断选中的sku是否是上架商品，是上架商品暂时存入变量，不是上架商品将“选好了”按钮置灰，不让点击
      let existence = this.sku_list.sku_data.find(
        v => v.attribute_item_ids.sort().toString() == arr_id.sort().toString()
      );
      if (existence == undefined) {
        this.is_click = false;
      } else {
        this.is_click = true;
        this.car_money = existence.sell_price;
        this.car_img = existence.sku_pics[0];
        this.sku_id = existence.sku_id;
        this.shopping_temp = {
          // 购物车中数据的数据格式及字段
          item_id: existence.sku_id,
          item_type: 1,
          item_title: self.car_name + existence.attribute_items.join(" "),
          image_url: existence.sku_price[0],
          quantity: self.car_num,
          unit_price: existence.sell_price / 100,
          spu_id: this.spu_id
        };
      }
    },

    // sku中商品数量的添加
    shopAdd() {
      this.car_num++;
      this.shopping_temp.quantity = this.car_num;
    },

    // sku中商品数量的减少
    shopReduce() {
      if (this.car_num == 1) return;
      this.car_num--;
      this.shopping_temp.quantity = this.car_num;
    }
  },

  mounted() {
    this.fetchOrderMenu();
    this.fetBillList();

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
    } else {
      storage.setItem("cy_car", this.shop_car);
    }

    // 该页面如果是从重开此单页面跳转而来，打开购物车弹框
    if (this.$route.query.flag == "detail") this.show_car = true;
  }
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";

.font-10 {
  font-size: 20/100rem;
}
.font-12 {
  font-size: 24/100rem;
}
.font-14 {
  font-size: 28/100rem;
}
.font-16 {
  font-size: 32/100rem;
}
.font-18 {
  font-size: 36/100rem;
}
.font-20 {
  font-size: 40/100rem;
}

.index {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #fff;
  .header {
    width: 100%;
    height: 200/100rem;
    background-color: #ffffff;
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    .search {
      width: 500/100rem;
      height: 70/100rem;
      line-height: 70/100rem;
      margin-left: 30/100rem;
      margin-top: 20/100rem;
      border: 1px solid #3d424c;
      border-radius: 4/100rem;
      background: url("../../assets/search-img.png") no-repeat center;
      background-position-x: 20/100rem;
      background-size: 28/100rem 26/100rem;
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
        color: rgba(61, 66, 76, 0.3);
      }
    }
    .operation {
      width: 220/100rem;
      height: 70/100rem;
      margin-top: 20/100rem;
      display: flex;
      justify-content: space-around;
      color: #aeb5c5;
      line-height: 1;
      .left {
        height: 70/100rem;
        padding-top: 50/100rem;
        background: url("../../assets/application/nv.png") no-repeat center;
        background-size: 44/100rem;
        background-position-y: 0;
      }
      .middle {
        width: 2/100rem;
        height: 30/100rem;
        background-color: #eeeeee;
      }
      .right {
        height: 70/100rem;
        padding-top: 50/100rem;
        background: url("../../assets/application/nm.png") no-repeat center;
        background-size: 44/100rem;
        background-position-y: 0;
      }
    }
    .tab {
      width: 750/100rem;
      height: 96/100rem;
      margin-top: 20/100rem;
      overflow-x: scroll;
      color: #8a92a2;
      font-weight: bold;
      .roll {
        width: 900/100rem;
        height: 96/100rem;
        display: flex;
        justify-content: space-around;
      }
      .left {
        height: 96/100rem;
        line-height: 96/100rem;
        text-align: center;
        float: left;
        position: relative;
        span {
          width: 36/100rem;
          height: 4/100rem;
          position: absolute;
          left: calc(50% - 0.18rem);
          bottom: 6/100rem;
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
  .pos {
    width: 100%;
    min-height: 80vh;
    position: relative;
    margin-top: 2px;
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
            background: url("../../assets/application/serve-tip.png") no-repeat
              center;
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
            line-height: 56/100rem;
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
              background: url("../../assets/application/add-shi.png") no-repeat
                center;
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
  .empty {
    width: 100%;
    min-height: 84vh;
    background: url("../../assets/application/empty.png") no-repeat center;
    background-size: 240/100rem;
    background-position: 256/100rem 94/100rem;
    background-color: #f7f8fa;
    box-sizing: border-box;
    padding-top: 354/100rem;
    .empty-tip {
      width: 340/100rem;
      text-align: center;
      margin: 0 auto;
    }
    .list-search {
      width: 330/100rem;
      height: 76/100rem;
      line-height: 76/100rem;
      text-align: center;
      border: 1px solid #5e7bff;
      color: #5e7bff;
      border-radius: 76/100rem;
      margin-left: 30/100rem;
      margin-right: 30/100rem;
      margin-top: 70/100rem;
    }
    .list-create {
      width: 330/100rem;
      height: 76/100rem;
      line-height: 76/100rem;
      text-align: center;
      color: #fff;
      border-radius: 76/100rem;
      margin-top: 70/100rem;
      background-color: #5e7bff;
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
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    .emp {
      color: #8a92a2;
      text-align: center;
      line-height: 536/100rem;
    }
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
          display: flex;
          align-items: center;
          // flex-direction: column;
          padding-right: 30/100rem;
          width: 140/100rem;
          height: 1.04rem;
          text-align: right;
          color: #8a92a2;
          .empty-icon {
            margin-right: 10/100rem;
            width: 30/100rem;
            height: 32/100rem;
            background: url("../../assets/empty-icon.png") no-repeat center;
            background-size: 30/100rem 32/100rem;
          }
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
              // font-size: 32/100rem;
              background-color: #f7f7f7;
              color: #404040;
            }
            .add {
              width: 56/100rem;
              height: 56/100rem;
              background: url("../../assets/application/add-shi.png") no-repeat
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
          .reduce-xu {
            width: 70/100rem;
            height: 70/100rem;
            background: url("../../assets/application/reduce-xu.png") no-repeat
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
            background: url("../../assets/application/add-shi.png") no-repeat
              center;
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
}
</style>
