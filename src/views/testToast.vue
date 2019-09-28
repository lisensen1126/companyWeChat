<template>
  <div class="list" style="padding-top:200px; text-align:center">
    <p class="font-14" style="height: 40px" @click="waringSuccess">toast 警告</p>
    <p class="font-14" style="height: 40px" @click="errorSuccess">toast 报错</p>
    <p class="font-14" style="height: 40px" @click="toastSuccess">toast 成功</p>
  </div>
</template>

<script>
export default {
  name: "test",
  methods: {
    toastSuccess() {
      this.$toast.show("成功了");
    },
    errorSuccess() {
      this.$toast.error("报错啦");
    },
    waringSuccess() {
      this.$toast.warning("警告你一次");
    }
  }
};
</script>
<style lang="less" scoped>
.list {
  width: 100%;
  height: 100vh;
  background: #fff;
}
</style>
