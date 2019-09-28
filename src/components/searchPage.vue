<template>
  <div class="searchPage">
    <!-- search -->
    <div class="search">
      <!-- center -->
      <!--<div class="sea_c" v-if="false" @click="showInput">-->
      <!--<img class="sea" src="../assets/search.png" alt=""> 搜索-->
      <!--</div>-->
      <!-- left -->
      <!--<div class="sea_l">-->
      <!--<div class="arrow" @click="hideInput">-->
      <!--<img class="left" src="../assets/arrow_left.png" alt="">-->
      <!--</div>-->
      <!--<div class="sea_btn" @click="goSearch">搜索</div>-->
      <!--<div class="sea_box">-->
      <!--<img class="sea" src="../assets/search.png" alt=""><input type="text" v-focus="true" v-model="keyWord">-->
      <!--</div>-->
      <!--</div>-->
      <div class="sea_l">
        <div class="sea_box">
          <img class="sea"
               src="../assets/search.png"
               alt="">
          <div class="sea-line"></div>
          <input type="text"
                 placeholder="请输入姓名"
                 v-model="keyWord">
        </div>
      </div>
    </div>
    <!-- search end -->
    <!-- list -->
    <!--<div class="listBox" v-if="show">-->
    <!--<list-box api-name="customerList" padding-top="100" v-on:clickItem="goDetail" ref="list"></list-box>-->
    <!--</div>-->
    <!-- list -->
  </div>

</template>

<script>
import listBox from "./list";
export default {
  name: "searchPage",
  components: {
    listBox
  },
  data() {
    return {
      keyWord: "",
      show: false
    };
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    showInput() {
      this.show = true;
    },
    hideInput() {
      this.show = false;
      this.keyWord = "";
      this.$emit("clickItem", {});
    },
    goSearch() {
      let obj = {
        user_name: this.keyWord
      };
      this.$emit("clickItem", obj);
    },
    goDetail(item) {
      if (item.relation_tag === 1) {
        this.$router.push({
          path: "/customerDetail/CustomerInfo",
          query: {
            customer_third_id: item.customer_third_id,
            type: 1
          }
        });
      } else {
        this.$router.push({
          name: "nocoustomerInfo",
          query: { ec_id: item.ec_id, ec_user_id: item.ec_user_id }
        });
      }
    }
  },
  watch: {
    keyWord: {
      handler() {
        this.goSearch();
      },
      deep: false
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  z-index: 99;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 0.16rem 0.2rem;
  .sea_c {
    width: 100%;
    height: 0.7rem;
    line-height: 0.7rem;
    background: #eee;
    border-radius: 0.08rem;
    text-align: center;
    font-size: 16px;
    color: #999;
  }
  img.sea {
    display: inline-block;
    width: 0.26rem;
    height: 0.26rem;
  }
  .sea_l {
    position: relative;
    /*padding-left: 0.4rem;*/
    /*padding-right: 0.84rem;*/
    // border:1px solid rgba(61,66,76,1);
    border-radius: 0.04rem;
    .arrow {
      position: absolute;
      left: 0;
      top: 0;
      padding: 0.2rem 0 0 0;
      img.left {
        width: 0.18rem;
        height: 0.28rem;
      }
    }
    .sea_box {
      position: relative;
      width: 100%;
      height: 0.7rem;
      box-sizing: border-box;
      background: #fff;
      border: 1px solid #3d424c;
      border-radius: 0.04rem;
      padding-left: 0.6rem;
      overflow: hidden;
      img.sea {
        position: absolute;
        top: 50%;
        left: 0.2rem;
        margin-top: -0.13rem;
      }
      div.sea-line {
        position: absolute;
        top: 30%;
        display: inline-block;
        width: 1px;
        height: 22/100rem;
        background: #3d424c;
      }
      input {
        width: 100%;
        // height: 0.68rem;
        background: #fff;
        font-size: 26/100rem;
        color: #1d1d26;
        // line-height: 0.68rem;
        padding: 0.18rem;
        border: none;
        outline: none;
      }
    }
    .sea_btn {
      position: absolute;
      right: 0;
      top: 0;
      line-height: 0.68rem;
      font-size: 16px;
    }
  }
}
.listBox {
  position: fixed;
  z-index: 98;
  width: 100%;
  height: 100vh;
  background: #fff;
}
</style>
