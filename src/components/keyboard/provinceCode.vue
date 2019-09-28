<template>
  <div class="provinceCode">
    <div class="keyboard">
      <div
        class="font-20 key"
        v-for="(item, index) in key_one"
        :key="index"
        v-text="item"
        @click="_keyDown('common', item)"
      ></div>
    </div>
    <div class="keyboard">
      <div
        class="font-20 key"
        v-for="(item, index) in key_two"
        :key="index"
        v-text="item"
        @click="_keyDown('common', item)"
      ></div>
    </div>
    <div class="keyboard">
      <div
        class="font-20 key"
        v-for="(item, index) in key_three"
        :key="index"
        v-text="item"
        @click="_keyDown('common', item)"
      ></div>
    </div>
    <div class="keyboard">
      <div
        class="font-20 key"
        v-for="(item, index) in key_four"
        :key="index"
        v-text="item"
        @click="_keyDown('common', item)"
      ></div>
      <div class="font-20 key-remove" @click="_keyDown('remove')">
        <img class="keyboard-remove" src="@/assets/keyboard_remove.png" alt>
      </div>
    </div>
    <div class="keyboard">
      <div
        class="font-20 key"
        v-for="(item, index) in key_five"
        :key="index"
        v-text="item"
        @click="_keyDown('common' , item)"
      ></div>
      <div class="font-20 key-none"></div>
      <div class="font-16 key-save" @click="_keyDown('save')">完成</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key_one: ["京", "沪", "粤", "浙", "津", "渝", "川", "苏"],
      key_two: ["鄂", "皖", "湘", "闽", "黑", "吉", "辽", "鲁"],
      key_three: ["冀", "甘", "陕", "宁", "豫", "晋", "赣", "琼"],
      key_four: ["贵", "黔", "云", "桂", "青", "新"],
      key_five: ["蒙", "藏", "使", "临"]
    };
  },
  methods: {
    /**
     * @event
     * @description 键盘按下 (内容)，触发 emit
     */
    _keyDown(type, val) {
      this.$emit("getCode", {
        type: type,
        value: val
      });
    }
  }
};
</script>

<style lang="less" scoped>
.provinceCode {
  width: 100%;
  height: 100%;
  padding: 0.2rem 0.28rem;
  .keyboard {
    display: flex;
    color: black;
    width: 100%;
    height: 0.84rem;
    justify-content: space-between;
    margin-bottom: 0.22rem;
  }
  .key,
  .key-remove,
  .key-save,
  .key-none {
    display: block;
    width: 0.8rem;
    line-height: 0.84rem;
    text-align: center;
    background: white;
    border-radius: 0.1rem;
    box-shadow: 0 0.02rem 0rem #898b92;
    font-weight: 400;
  }
  .key-remove {
    width: 1.66rem;
    background: #abadb3;
  }
  .key-save {
    width: 2.56rem;
    background: white;
  }
  .key-none {
    visibility: hidden;
  }
  .keyboard-remove {
    width: 0.44rem;
    height: 0.36rem;
  }
  .key:active {
    background: #5e7bff;
    color: white;
  }
}
</style>
