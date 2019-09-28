<template>
  <div>
    <!-- search -->
    <div class="search vux-1px-b">
      <!-- center -->
      <div class="sea_c" v-if="!show" @click="showInput">
        <img class="sea" src="../assets/search.png" alt=""> 搜索
      </div>
      <!-- left -->
      <div class="sea_l" v-if="show">
        <div class="arrow" @click="hideInput">
          <img class="left" src="../assets/arrow_left.png" alt="">
        </div>
        <div class="sea_btn" @click="goSearch">搜索</div>
        <div class="sea_box">
          <img class="sea" src="../assets/search.png" alt=""><input type="text" v-model="keyWord">
        </div>
      </div>
    </div>
    <!-- search end -->
  </div>

</template>

<script>
import listBox from "./list";

export default {
  name: "search",
  props: {
    // callback: String
  },
  components: {
    listBox
  },
  data() {
    return {
      keyWord: "",
      show: false
    };
  },
  methods: {
    showInput() {
      this.show = true;
    },
    hideInput() {
      this.show = false;
      this.keyWord = "";
    },
    goSearch() {
      if (!this.keyWord) {
        return false;
      }

      this.$refs.list.search(this.keyWord);
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 1rem;
  box-sizing: border-box;
  background: #fff;
  padding: 0.16rem 0.2rem;
  .sea_c {
    width: 100%;
    height: 0.68rem;
    line-height: 0.68rem;
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
    padding-left: 0.4rem;
    padding-right: 0.84rem;
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
      height: 0.68rem;
      box-sizing: border-box;
      background: #eee;
      border-radius: 0.08rem;
      padding-left: 0.6rem;
      overflow: hidden;
      img.sea {
        position: absolute;
        top: 50%;
        left: 0.2rem;
        margin-top: -0.13rem;
      }
      input {
        width: 100%;
        // height: 0.68rem;
        background: #eee;
        font-size: 14px;
        color: #555;
        // line-height: 0.68rem;
        padding: 0.18rem 0 0;
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
  background: #000;
}
</style>
