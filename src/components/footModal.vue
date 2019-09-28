<template>
  <div>
    <div class="modal">
      <div class="content">
        <div class="edit font-12" @click='edit'>
          编辑
        </div>
        <div class="edit font-12" @click="deleteEva">
          删除
        </div>
        <div class="cancel font-12" @click="cancel">
          取消
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "footModal",
  props: {
    id: String
  },
  methods: {
    cancel() {
      this.$emit('cancel', {})
    },
    edit() {
      this.$emit('edit', {})
    },
    deleteEva() {
      this.$emit('deletes', {})
    }
  },
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
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    z-index: 10;
    width: 100%;
    .edit{
      width: 100%;
      height: 0.88rem;
      line-height: 0.88rem;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0;
      color: #3D424C;
    }
    .cancel{
      margin-top: 0.15rem;
      width: 100%;
      height: 0.88rem;
      line-height: 0.88rem;
      background-color: #fff;
      color: #FF6464;
    }
  }
</style>