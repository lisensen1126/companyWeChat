<template>
  <transition name="slide-fade">
    <!-- 软键盘主面板 -->
    <div class="keyboard" v-if="isShow">
      <!-- 软键盘内容 -->
      <transition name="fade" mode="out-in">
        <!-- 软键盘 (企业简称) current -->
        <province-code v-if="current === 1" :key="1" @getCode="_getCode"></province-code>
        <!-- 软键盘 (车牌号) -->
        <plate-number v-if="current === 2" :key="2" @getCode="_getCode"></plate-number>
      </transition>
    </div>
  </transition>
</template>

<script>
/**
 * @description 移动端软键盘插件
 * @description （暂时只支持车牌号相关，后期可以自由扩展）
 */
import PlateNumber from "./plateNumber";
import ProvinceCode from "./provinceCode";
export default {
  components: {
    PlateNumber, // 车牌号键盘
    ProvinceCode // 各省简称键盘
  },
  props: {
    maxLength: Number, // 最大长度
    index: 0,
    type: [Number, String],  // 1 正常删除   2 点按某个去删除
  },
  data() {
    return {
      current: 1, // 当前显示的键盘
      keyContent: "", // 键盘内容
      array: ["","","","","","","",""],
      isShow: false // 键盘是否显示
    };
  },
  methods: {
    /**
     * @event
     * @description 键盘按下获取内容
     * @param val {Object} 获取按键内容
     */
    _getCode(obj) {
      switch (obj.type) {
        case "common": // 普通按键
          // this.type 1 正常删除   2 点按某个去删除
          if (this.type == 1) {
            if (this.keyContent.length < this.maxLength) {
              this.keyContent += obj.value;
            }
          } else if(this.type == 2) {
            if (this.keyContent.length > 0) {
              let arr = this.keyContent.split(",");
              this.array.map((item, index) => {
                if (arr[index]) {
                  this.array[index] = arr[index];
                } else {
                  this.array[index] = "";
                }
              });
            }
            this.array[this.index] = obj.value
            this.keyContent = this.array.join(",")
          }
          break;
        case "remove": // 删除按键
          // this.type 1 正常删除   2 点按某个去删除
          if (this.type == 1) {
            if (this.keyContent.length > 0) {
              this.keyContent = this.keyContent.substring(
                0,
                this.keyContent.length - 1
              );
            }
          } else if (this.type == 2) {
            this.$emit("remove", "remove");
          }
          break;
        case "save": // 保存按键
          this.isShow = false; // 键盘是否显示
          this.$emit("save");
          break;
      }
      // 触发事件  this.type 1 正常删除   2 点按某个去删除
      if (this.type == 1) {
        this.$emit("getCode", this.keyContent);
      } else if (this.type == 2) {
        this.$emit("getCode", {
          val: this.keyContent,
          type: obj.type
        });
      }
    },
    /**
     * @method
     * @description 设置键盘状态
     * @param val {String} 键盘模式
     */
    setBoardType(val) {
      if (!isNaN(val)) {
        this.current = val;
        return;
      }
      switch (val) {
        case "province":
          this.current = 1; // 选择省
          break;
        case "number":
          this.current = 2; // 选择数字及字母
          break;
      }
    },
    /**
     * @method
     * @description 设置键盘显示
     */
    showKeyBoard() {
      this.isShow = true;
    },
    /**
     * @method
     * @description 设置键盘隐藏
     */
    hideKeyBoard() {
      this.isShow = false;
    },
    /**
     * @method
     * @description 清空键盘内容
     */
    resetContent(val) {
      this.keyContent = val;
    }
  },
  mounted() {
    console.log(this.type)
  }
};
</script>

<style lang="less" scoped>
.keyboard {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 5.54rem;
  background: #d5d8dd;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(277px);
  opacity: 0;
}
//消失时间持续3s
.fade-enter-active {
  transition: all 0.2s;
}
//显示时间持续1.5s
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
