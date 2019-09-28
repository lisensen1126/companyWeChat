<template>
  <div class="plateNumber">
    <div class="top">
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
          :class=" item === 'I' ? 'disabled' : ''"
        ></div>
      </div>
    </div>
    <div class="bottom">
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
          @click="_keyDown('common', item)"
        ></div>
        <div class="font-20 key-none"></div>
        <div class="font-16 key-save" @click="_keyDown('save')">完成</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key_one: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      key_two: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      key_three: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      key_four: ["Z", "X", "C", "V", "B", "N", "M"],
      key_five: ["学", "港", "澳", "警", "领"]
    };
  },
  methods: {
    /**
     * @event
     * @description 键盘按下 (内容)，触发 emit
     */
    _keyDown(type, val) {
      if (val === "I") {
        return;
      }
      this.$emit("getCode", {
        type: type,
        value: val
      });
    }
  }
};
</script>

<style lang="less" scoped>
.plateNumber {
  width: 100%;
  height: 100%;
  .top {
    width: 100%;
    padding: 0.2rem 0.06rem 0 0.06rem;
  }
  .bottom {
    width: 100%;
    padding: 0 0.48rem;
  }
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
    width: 0.64rem;
    line-height: 0.84rem;
    text-align: center;
    background: white;
    border-radius: 0.1rem;
    box-shadow: 0 0.02rem 0rem #898b92;
    font-weight: 400;
  }
  .key-remove {
    width: 1.38rem;
    background: #abadb3;
  }
  .key-save {
    width: 2.12rem;
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
  .disabled {
    background: #cfd2d6;
    &:active {
      background: #cfd2d6;
      color: black;
    }
  }
}
</style>
