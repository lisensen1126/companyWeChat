<template>
  <div>
    <div class="modal">
      <div class="content">
        <div class="div-top"></div>
        <img v-if="type == 1" class="tip-img" src="../../../assets/poster/wx-bg.png" alt="">
        <img v-if="type == 2" class="tip-img" src="../../../assets/poster/qy-bg.png" alt="">
        <img v-if="type == 3" class="tip-img" src="../../../assets/poster/phone-bg.png" alt="">
        <div class="footer">
          <div class="cancel font-14" @click="cancel">我知道啦</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TipModal",
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {}
  },
  methods: {
    cancel() {
      this.$emit("cancel", {})
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.title {
  color: #3d424c;
  text-align: center;
  margin-top: 0.94rem;
  font-weight: bold;
}
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.04rem;
  z-index: 19999;
}
.content {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.tip-img {
  width: 5.5rem;
  height: 9.58rem;
  margin-top: 0.5rem;
  margin-left: 1rem;
}
.div-top {
  position: fixed;
  width: 100%;
  height: 9.58rem;
  top: 0.5rem;
  z-index: 999;
}
.footer {
  height: 0.78rem;
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0.7rem;
  left: 0;
}
.cancel {
  width: 3.36rem;
  height: 0.78rem;
  line-height: 0.78rem;
  text-align: center;
  color: #ffffff;
  font-weight: 400;
  border: 1px solid #ffffff;
}
</style>