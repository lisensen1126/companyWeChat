<template>
  <div>
    <div class="modal">
      <div class="content">
        <div class="content-header">
          <span class="font-16">商家回复</span>
          <img src='../assets/close1.png' @click='cancel'/>
        </div>
        <textarea name="" v-model="text" id="text" class="textarea font-14" maxlength="100" placeholder="请输入，最多100个字符"></textarea>
        <div class="footer">
          <div class="cancel font-12" @click='cancel'>
            取消
          </div>
          <div class="submit font-12" @click="submit">
            发布
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footModal",
  props: {
    text_modal: {
      type: String,
      default () {
        return ''
      },
    }
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
    submit() {
      this.$emit('submit', {text: this.text})
    },
  },
  mounted() {
    this.text = this.text_modal
  }
};
</script>
<style lang="less" scoped>
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
    padding: 0.3rem;
    background-color: #fff;
    z-index: 10;
    width: 6.68rem;
    height: auto;
  }
  .content-header{
    display: flex;
    justify-content: space-between;
    padding: 0 0 0.4rem 0;
    span{
      color: #3D424C;
      font-weight:600;
    }
    img{
      width: 0.5rem;
      height: 0.5rem;
    }
  }
  .textarea{
    width: 100%;
    height: 1.9rem;
    background-color: #F7F7FA;
    color: #3D424C;
    padding: 0.15rem;
  }
  .footer{
    margin-top: 0.6rem;
    display: flex;
    justify-content: space-between;
  }
  .cancel{
    width: 2.78rem;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    border: 1px solid #5E7BFF;
    color: #5E7BFF;
    background: #fff;
    border-radius: 50px;
  }
  .submit{
    width: 2.78rem;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    color: #fff;
    background: #5E7BFF;
    border-radius: 50px;
  }
</style>