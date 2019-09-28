<template>
  <div>
    <transition name="fade">
      <div class="toast" :class="{'success': type == 'success','error': type == 'error','warning': type == 'warning',}" v-if="show">
        {{message}}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      show: false,
      type: "success",
      message: ""
    };
  }
};
</script>

<style scoped lang="less">
.toast {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  text-align: center;
  font-size: 14px;
  padding: 10px;
  min-height: 0.68rem;
  color: #fff;
}
.toast.success {
  background: #7fb80e;
}
.toast.warning {
  background: #fdb933;
}
.toast.error {
  background: #f17c67;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
  transform: translateY(0);
}
.fade-enter,
.fade-leave-to {
  transform: translateY(-100%);
}
</style>
