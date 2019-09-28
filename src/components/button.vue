<template>
  <div class="mbutton" :class="theme">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "mbutton"
    }
  }
};
</script>

<style lang="less" scoped>
.mbutton,
.mbutton-2 {
  width: 100%;
  height: 38/50rem;
  line-height: 38/50rem;
  background: #5e7bff;
  box-shadow: 0 6/50rem 12/50rem 0 rgba(94, 123, 255, 0.3);
  color: white;
  border-radius: 25/50rem;
  text-align: center;
  // padding-top: 9/50rem;
}
.mbutton-2 {
  background: white;
  border: 1/50rem solid #5e7bff;
  color: #5e7bff;
  box-shadow: none;
}
.disabled{
  background: #AEB5C5;
}
</style>
