<template>
    <div class="styleTest">
        <div class="test1 font-18 m-t-10 p-l-20 p-t-20 p-b-15 p-r-10 gray-blue bg-gray">这个div用了18号字体、内外边距、蓝色字体、底部边框线</div>
        <div class="btn-box p-t-15 p-l-15 p-r-15 p-b-15">
            <button class="btn btn-primary m-t-20">主操作</button>
            <button class="btn btn-sub m-t-20">次操作</button>
            <button class="btn btn-default m-t-20">禁用操作</button>
        </div>
    </div>
</template>

<script>
export default {
  name: "StyleTest"
};
</script>

<style scoped lang="less">
@import "../less/config/_variables.less";
@import "../less/config/vendor-prefixes.less";
@import "../less/config/mixins/border.less";
.styleTest {
  width: 100%;
  .test1 {
    position: relative;
    &:after {
      .Pseudo-border-after(#ff0000);
    }
  }
  .test2 {
    width: 100%;
    height: 0.9rem;
    background: #00a5ff;
  }
  button {
    width: 100%;
    height: 0.9rem;
  }
}
</style>
