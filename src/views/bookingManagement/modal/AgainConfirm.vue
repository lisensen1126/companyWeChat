<template>
  <div>
    <div class="modal font-PC-re">
      <div class="content">
        <p class="title font-14">确定核销该订单吗？</p>
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
  name: "AgainConfirm",
  props: {
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
    color: #3D424C;
    text-align: center;
    margin-top: 0.94rem;
    font-weight: bold;
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
    height: 3.4rem;
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
    font-weight: 400;
    border-right: 1px solid #F0F0F0;
  }
  .submit{
    color: #4B77B0;
    width: 50%;
    height: 100%;
    line-height: 1.08rem;
    text-align: center;
    font-weight: 400;
  }
</style>