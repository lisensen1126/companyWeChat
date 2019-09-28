<template>
  <div>
    <div class="modal">
      <div class="content">
        <p class="title font-16" v-if="is_title">提交车检报告？</p>
        <div class="content-header">
          <p class="font-14">{{title}}</p>
        </div>
        <div class="footer">
          <div class="cancel font-12" @click='cancel'>
            取消
          </div>
          <div class="submit font-12" @click="confirm">
            {{confirmText}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ConfirmModal",
  props: {
    confirmText: {
      type: String,
      default () {
        return '确定提交'
      },
    },
    title: {
      type: String,
      default () {
        return '提交车辆报告后，车主可以在小程序同步收到！'
      },
    },
    type: {
      type: Number
    },
    is_title: false,
  },
  data() {
    return {
      text: '',
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
    this.text = this.text_modal
  }
};
</script>
<style lang="less" scoped>
  .title {
    color: #3D424C;
    text-align: center;
    padding-bottom: 0.4rem;
  } 
  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.5)
  }
  .content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    padding: 0.4rem;
    background-color: #fff;
    z-index: 10;
    width: 6.3rem;
    height: auto;
  }
  .content-header{
    display: flex;
    justify-content: space-between;
    p{
      color: #3D424C;
    }
  }
  .footer{
    margin-top: 0.6rem;
    display: flex;
    justify-content: space-between;
  }
  .cancel{
    width: 2.58rem;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    border: 1px solid #5E7BFF;
    color: #5E7BFF;
    background: #fff;
    border-radius: 50px;
  }
  .submit{
    width: 2.58rem;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    color: #fff;
    background: #5E7BFF;
    border-radius: 50px;
    box-shadow:0px 12px 24px 0px rgba(94,123,255,0.3);
  }
</style>