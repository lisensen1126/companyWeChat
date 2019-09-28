<template>
  <div class="slide-question">
    <div class="question-list">
      <div class="question-header flex">
        <h2 class="font-12 title">{{title}}</h2>
        <button class="complete font-12" @click='complete'>完成</button>
      </div>
      <div class="question-items">
        <div class="question-item flex" :class="item.checked ? 'checked' : ''" v-for="(item, index) in reslist" :key='index' @click='checkQuestion(item.id,index)'>
          <p class="text font-12">{{item.name}}</p>
          <div v-if='item.checked' class="img_check">
            <img src="../../assets/checked.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * @description 车检流程 开始车检的项目问题选择
 */
export default {
  name: "SlideQuestion",
  components: {
    
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },  //  问题列表
    title: String,
    checklist: {
      type: Array,
      default () {
        return []
      }
    }    //   上一次选中的问题
  },
  data() {
    return {
      reslist: []
    }
  },
  computed: {
  },
  methods: {
    /**
     * id 点击选中的问题/建议id
     */
    checkQuestion(id, index) {
      this.reslist[index].checked = !this.reslist[index].checked
      // this.list = [...this.list]
      // this.$set(this.list[index], "checked", !this.list[index].checked)
    },
    // 完成
    complete() {
      let arr = this.reslist.filter(ele => ele.checked)
      this.$emit('complete', {
        list: arr
      })
    },
    // 拷贝数据
    deepClone(obj){
      let _obj = JSON.stringify(obj),
          objClone = JSON.parse(_obj);
      return objClone
    } 
  },
  mounted() {
    this.reslist = this.deepClone(this.list)
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/button.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.slide-question{
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
}
.question-list{
  padding: 0.4rem;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  .title{
    color: #3D424C;
    font-weight: 600;
  }
  .complete{
    color: #5E7BFF;
    font-weight: 500;
    padding: 0;
    background-color: #fff;
  }
}
.question-items{
  margin-top: 0.4rem;
}
.question-item{
  padding: 0.2rem 0;
  border-bottom: 1px solid #F0F0F0;
  .text{
    color: #3D424C;
  }
  .img_check{
    width: 0.32rem;
    height: 0.32rem;
    img{
      width: 0.32rem;
      height: 0.32rem;
    }
  }
  &.checked{
    .text{
      color: #5E7BFF;
    }
  }
  &:last-child{
    border-bottom: 0;
  }
}
</style>
