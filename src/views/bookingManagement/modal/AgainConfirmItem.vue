<template>
  <div>
    <div class="modal font-PC-re">
      <div class="content">
        <p class="title font-14">确定核销下列项目吗？</p>
        <div class="list">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="item-left">
              <div class="item-title font-12">{{item.item_title}}{{item.sku_attribute.toString().replace(/,/g, ' ')}}</div>
            </div>
            <div class="item-num font-12">x{{item.value}}</div>
          </div>
        </div>
        <div class="footer">
          <div class="cancel font-14" @click='cancel'>
            取消
          </div>
          <div class="submit font-14" @click="confirm">
            确认
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AgainConfirmItem",
  props: {
    list: {
      type: Array,
      default () {
        return []
      },
    },
  },
  data() {
    return {
      
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel', {})
    },
    confirm() {
      this.$emit('confirm', {type: this.type})
    },
  },
  mounted() {
  }
};
</script>
<style lang="less" scoped>
  .title {
    color: #ffffff;
    text-align: center;
    font-weight: bold;
    width: 100%;
    height: 1.24rem;
    line-height: 1.24rem;
    background: #4B77B0;
  } 
  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.04rem;
  }
  .content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    z-index: 10;
    width: 5.5rem;
    height: 6.02rem;
  }
  .list{
    width: 100%;
    height: 3.7rem;
    padding: 0.3rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
  }
  .item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.3rem;
    &:last-child{
      padding-bottom: 0.3rem;
    }
    .item-left{
      max-width: 4rem;
      display: flex;
      align-items: center;
    }
    .item-title{
      color: #3D424C;
      font-weight: 400;
      line-height: 0.4rem;
      width: 5rem;
    }
    .item-end{
      width: 0.6rem;
      height: 0.28rem;
      line-height: 0.28rem;
      text-align: center;
      color: #fff;
      background: #D42E12;
      margin-left: 0.14rem;
    }
    .item-num{
      color: #8A92A2;
      font-weight: 400;
      line-height: 0.4rem;
    }
  }
  .footer{
    height: 1.08rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #F0F0F0;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .cancel{
    width: 50%;
    height: 100%;
    line-height: 1.08rem;
    text-align: center;
    color: #404040;
    font-weight: bold;
    border-right: 1px solid #F0F0F0;
  }
  .submit{
    color: #4B77B0;
    width: 50%;
    height: 100%;
    line-height: 1.08rem;
    text-align: center;
    font-weight: bold;
  }
</style>