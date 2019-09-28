<template>
  <div class="page">
    <div class="confirm-page">
      <div class="goods-item"
           v-for="(item, index) in shop_car"
           :key="index">
        <div class="title font-18">{{item.item_title}}</div>
        <div class="num-box">
          <div class="font-16">数量</div>
          <div class="right-num">
            <div class="reduce"
                 @click="reduce(item, index)"></div>
            <div class="value font-16">{{item.quantity}}</div>
            <div class="add"
                 @click="add(item, index)"></div>
          </div>
        </div>
        <div class="price-box">
          <div class="font-16">
            单价: ¥{{item.unit_price_copy}}
            <span class="font-12"
                  style="text-decoration: line-through"
                  v-if="item.unit_price_copy !== item.unit_price">¥{{item.unit_price}}</span>
          </div>
          <div class="btn font-14"
               @click="revisePrice(item, index)">修改价格</div>
        </div>
        <div class="subtotal-box font-16">
          小计: <span class="red">¥{{item.subtotal}}</span>
        </div>
      </div>
    </div>
    <!-- 修改价格模态框 -->
    <div class="modal-box"
         v-if="is_show">
      <div class="modal-content">
        <div class="close"
             @click="closeModel"></div>
        <div class="title font-16">修改价格</div>
        <div class="input-box">
          <input type="text"
                 v-model="revise_price"
                 maxlength="9"
                 placeholder="请输入修改价格"
                 autofocus="autofocus">
          <div class="sign font-20">¥</div>
        </div>
        <div class="button-sure font-14"
             :class="{'disabled': isDisabled}"
             @click="confirmEdit">确认修改</div>
      </div>
    </div>
    <!-- 下单按钮 -->
    <div class="footer">
      <div class="totle-money pull-left font-16">
        合计:<span class="font-20 count">￥{{shop_money}}</span>
        <button class="sub font-14"
                v-if="shop_money == 0">确认开单</button>
        <button class="sub font-14 active"
                v-if="shop_money > 0"
                @click="confirmPayOrder">确认开单</button>
      </div>
    </div>
    <!-- 项目添加成功 -->
    <div class="success-box"
         v-show="show_success">
      <div class="success">
        <img src="../../assets/application/edit-success.png">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Api from "../../api/offlineBookingApi";
import Math from "../../mixins/utilities/math";
export default {
  name: "OpeningOrderConfirm",
  mixins: [Math],
  data() {
    return {
      shop_car: [], // 购物车列表
      shop_money: 0, // 商品总金额
      revise_price: "", // 修改的价格
      is_show: false, // 是否显示模态框
      goods_index: null, // 要修改价格的index
      show_success: false // 修改成功
    };
  },
  computed: {
    isDisabled() {
      let flag = true;
      // 不为0 且 大于等于0.01 且 是数字
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.revise_price = this.revise_price.match(/^\d*(\.?\d{0,2})/g)[0];
      if (
        Number(this.revise_price) !== 0 &&
        this.revise_price * 100 >= 1 &&
        !Number.isNaN(Number(this.revise_price))
      ) {
        flag = false;
      }
      return flag;
    }
  },
  methods: {
    /**
     * 增加商品数量
     * @item 当前商品
     * @index 当前下标
     */
    add(item) {
      item.quantity++;
      item.subtotal = this.accMul(item.unit_price_copy, item.quantity); // 小计
      this.shop_money = this.accAdd(this.shop_money, item.unit_price_copy); // 总计
    },
    /**
     * 减少商品数量
     * @item 当前商品
     * @index 当前下标
     */
    reduce(item) {
      if (item.quantity === 1) return false;
      item.quantity--;
      item.subtotal = this.accMul(item.unit_price_copy, item.quantity); // 小计
      this.shop_money = this.accSub(this.shop_money, item.unit_price_copy); // 总计
    },
    /**
     * 修改价格
     * @item 当前商品
     * @index 当前下标
     */
    revisePrice(item, index) {
      this.goods_index = index;
      this.is_show = true;
    },
    // 关闭修改价格模态框
    closeModel() {
      this.goods_index = null;
      this.revise_price = "";
      this.is_show = false;
    },
    // 确认修改
    confirmEdit() {
      // 无输入 或 小于0.01 或 不是数字
      // !Number.isNaN(Number(this.revise_price))
      if (
        !this.revise_price ||
        this.revise_price * 100 < 1 ||
        Number.isNaN(Number(this.revise_price))
      ) {
        return false;
      }
      // 单价
      this.shop_car[this.goods_index].unit_price_copy = Number(
        this.revise_price
      );
      // 小计
      this.shop_car[this.goods_index].subtotal = this.accMul(
        this.shop_car[this.goods_index].unit_price_copy,
        this.shop_car[this.goods_index].quantity
      );
      // 总计
      this.shop_money = 0;
      this.shop_car.forEach(cell => {
        this.shop_money = this.accAdd(this.shop_money, cell.subtotal);
      });

      this.show_success = true;
      setTimeout(() => {
        this.show_success = false;
      }, 500);

      this.revise_price = "";
      this.is_show = false;
    },
    // 确认开单
    confirmPayOrder() {
      const TOTAL = 200000;
      if (this.shop_money > TOTAL) {
        this.$toast.error("开单总额不能大于20万");
        return false;
      }
      // 开单之前将数据格式化，金钱转换为分  OpeningOrderPay
      let self = this;
      let tamp_arr = JSON.parse(JSON.stringify(this.shop_car));
      tamp_arr.forEach(v => {
        v.old_price = this.accMul(v.unit_price, 100); // 修改前价格
        v.unit_price = this.accMul(v.unit_price_copy, 100); // 修改后的价格
      });
      self.$loading.show("加载中");
      Api.setOrderApi({ item: tamp_arr }).then(
        res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.$router.push({
              name: "OpeningOrderPay",
              query: {
                id: res.data.quick_order_id
              }
            });
          } else {
            self.$loading.hide();
            self.$toast.error(res.message, 3000);
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
    console.log(this.$route.query);
    let store_arr = [];
    if (this.$route.query.flag) {
      store_arr = this.$route.query.list;
    } else {
      // 初始化购物车
      let storage = window.localStorage;
      store_arr = JSON.parse(storage.getItem("cy_car"));
    }
    this.shop_car = [...store_arr].map(cell => {
      cell.unit_price_copy = cell.unit_price;
      cell.subtotal = this.accMul(cell.unit_price_copy, cell.quantity);
      this.shop_money = this.accAdd(this.shop_money, cell.subtotal);
      return cell;
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../less/report-common.less";

.page {
  height: 100vh;
  overflow: scroll;
  background-color: #f7f8fa;
  &::-webkit-scrollbar {
    display: none;
  }
}

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

input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #d9d9d9;
  /* placeholder字体大小  */
  font-size: 24/100rem;
}

.confirm-page {
  padding: 30/100rem;
  padding-bottom: 120/100rem;
  width: 100%;
  position: relative;
  background-color: #f7f8fa;
  .goods-item {
    margin-bottom: 20/100rem;
    min-height: 494/100rem;
    background: #fff;
    .title {
      box-sizing: border-box;
      padding: 40/100rem 30/100rem;
      min-height: 112/100rem;
      border-bottom: 2/100rem solid #eee;
      font-weight: bold;
    }
    .num-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 30/100rem;
      height: 132/100rem;
      border-bottom: 2/100rem solid #eee;
      .right-num {
        width: 188/100rem;
        height: 56/100rem;
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
    .price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 30/100rem;
      height: 132/100rem;
      line-height: 1;
      .btn {
        width: 188/100rem;
        height: 60/100rem;
        color: #5e7bff;
        background: #e8edff;
      }
    }
    .subtotal-box {
      padding: 0 30/100rem;
      height: 112/100rem;
      line-height: 112/100rem;
      text-align: right;
      border-top: 2/100rem solid #eee;
      .red {
        color: #dd1d21;
      }
    }
  }
}
.modal-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  .modal-content {
    width: 630/100rem;
    height: 390/100rem;
    background-color: #ffffff;
    margin-top: 298/100rem;
    margin-left: 60/100rem;
    position: relative;
    border-radius: 4/100rem;
    .title {
      padding-top: 50/100rem;
      color: #3d424c;
      text-align: center;
      padding-bottom: 30/100rem;
    }
    .close {
      position: absolute;
      top: 26/100rem;
      right: 30/100rem;
      width: 52/100rem;
      height: 52/100rem;
      background: url("../../assets/close-img.png") no-repeat center;
      background-size: 52/100rem;
      z-index: 5;
    }
    .input-box {
      position: relative;
      line-height: 80/100rem;
      input {
        padding-left: 74/100rem;
        width: 438/100rem;
        height: 80/100rem;
        background-color: #f9f9f9;
        margin: 0 auto;
        margin-left: 96/100rem;
      }
      .sign {
        position: absolute;
        top: 0;
        left: 116/100rem;
      }
    }

    .button-sure {
      width: 216/100rem;
      height: 76/100rem;
      line-height: 76/100rem;
      text-align: center;
      background-color: #5e7bff;
      color: #ffffff;
      display: block;
      margin: 0 auto;
      border-radius: 76/100rem;
      margin-top: 50/100rem;
      &.disabled {
        background: #aeb5c5;
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
  .totle-money {
    width: 100%;
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
.success-box {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background: rgba(94, 123, 255, 0);
  .success {
    width: 320/100rem;
    height: 280/100rem;
    position: fixed;
    top: 30%;
    left: 216/100rem;
    img {
      width: 320/100rem;
      height: 280/100rem;
    }
  }
}
</style>
