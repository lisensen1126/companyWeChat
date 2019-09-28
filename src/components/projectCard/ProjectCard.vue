<template>
  <div>
    <!-- 项目列表 -->
    <div class="card_box">
      <div class="project-card" v-for="(item,index) in card_list" :key="index">
        <header-title :title="item.name" :title_content="item.tip" :info="item"></header-title>
        <checkbox 
          :question_list="item.exception" 
          :advice_list="item.exception_advice" 
          :is_multi="item.is_multi" 
          :categoryId="item.id" 
          :resList="item.point" 
          @checkItem="checkItem" 
          @complete="complete" 
          @completeAdvice="completeAdvice" 
          @completeNote="completeNote" 
          @uploadPic="uploadPic" 
          @deleteImg="deleteImg"
          @uploadVideo="uploadVideo" 
          @deleteVideo="deleteVideo"
          ></checkbox>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="footer-btn">
      <button class="btn font-12" @click="jumpStep(1)" v-if="!last_steps">跳过此场景</button>
      <!-- 不是最后一步的此场景正常 -->
      <button class="btn font-12 m-l-30" @click="jumpStep(2)" v-if="!last_steps">此场景正常</button>
      <button class="btn font-12" @click='confirm(2)' v-if="last_steps && steps_num != 1">重新检测</button>
      <!-- 最后一步的此场景正常，提交数据 -->
      <button class="btn font-12 m-l-30" :class="{'width m-l-0': steps_num == 1}" @click="initCheckItem(2, true)" v-if="last_steps">此场景正常</button>
      <button class="btn primary over font-12" :class="{'width': steps_num == 1}" @click='confirm(1, true)' v-if="last_steps">提交车检报告</button>
      <button class="btn primary font-12" @click="nextStep" v-if="!last_steps">完成并下一步</button>
    </div>
    <!-- 确定提交/重新检测 -->
    <confirm-modal v-if='confirm_modal' :title='confrom_info.confirm_title' :confirmText='confrom_info.confirm_text' @cancel='confirmCancel' @confirm='confirmSubmit' :type='confrom_info.confirm_type' :is_title='true'></confirm-modal>
  </div>
</template>
<script>
/**
 * @description 车检流程 开始车检的card
 */
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import HeaderTitle from './HeaderTitle';
import Checkbox from './Checkbox';
export default {
  name: "ProjectCard",
  components: {
    HeaderTitle,
    Checkbox,
    ConfirmModal,
  },
  props: {
    card_list: {
      type: Array,
      default () {
        return []
      }
    },
    id: null,
    last_steps: Boolean,
    steps_num: null,
  },
  data() {
    return {
      confrom_info: {
        confirm_title: "提交车辆报告后，车主可以在小程序同步收到！",  // 确定提交的title文案
        confirm_text: "确定提交",  // 确定提交的确定按钮文案
        confirm_type: null,    // 用来控制是重新检测还是确定提交
      },
      confirm_modal: false,   // 控制确定提交和重新检测弹框显隐
      category_item: [],    // 每一步骤的项目的要提交的信息集合
      is_all_normal: false,
    }
  },
  methods: {
    // 调出重新检测/确定提交的二次确认弹框
    confirm(type, normal) {
      if (type === 1) {
        let flag = false
        // 判断选择异常之后有没有选择异常问题和异常建议，未选则不能继续进行
        for (let i in this.category_item) {
          for (let j in this.category_item[i].point) {
            if (this.category_item[i].point[j].value === 2) {
              if (this.category_item[i].exception.length === 0 || this.category_item[i].exception_advice.length === 0) {
                flag = true
                break
              }
            }
          }
        }
        if (flag) {
          this.$toast.error("异常问题和异常建议必选")
          return
        }
        if (this.is_all_normal && !normal) {
          this.confrom_info = {
            confirm_title: "当前场景已全部记录为正常，提交后车主可在小程序同步收到车检报告！",
            confirm_text: "确定提交",
            confirm_type: 1,
          }
        } else {
          this.confrom_info = {
            confirm_title: "提交车辆报告后，车主可以在小程序同步收到！",
            confirm_text: "确定提交",
            confirm_type: 1,
          }
        }
      } else if (type === 2) {
        this.confrom_info = {
          confirm_title: "重新检测后，已记录的车检内容将会丢失哦！",
          confirm_text: "重新检测",
          confirm_type: 2,
        }
      }
      this.confirm_modal = true
    },

    // 取消关闭弹框
    confirmCancel() {
      this.confirm_modal = false
    },

    /**
     * 弹框的确定回调
     * res  组建传值 当前点击的是提交还是重新检测  1提交 2重新检测
     */
    confirmSubmit(res) {
      if (res.type === 1) {
        this.$emit('confirmSubmit', {
          type: res.type,
          category_item: [...this.category_item],
          id: this.id
        })
      } else {
        this.$emit('confirmSubmit', {
          type: res.type,
        })
      }
      this.confirm_modal = false
    },

    /**
     * 跳过此步骤&& 此场景正常
     * value {Number} 1.跳过此步骤 2.此场景正常
     */
    jumpStep(value) {
      this.initCheckItem(value)
      this.$emit('jumpStep', {
        category_item: this.category_item,
        id: this.id
      })
    },

    // 下一步
    nextStep() {
      let flag = false
      // 判断选择异常之后有没有选择异常问题和异常建议，未选则不能继续进行
      for (let i in this.category_item) {
        for (let j in this.category_item[i].point) {
          if (this.category_item[i].point[j].value === 2) {
            if (this.category_item[i].exception.length === 0 || this.category_item[i].exception_advice.length === 0) {
              flag = true
              break
            }
          }
        }
      }
      if (flag) {
        this.$toast.error("异常问题和异常建议必选")
        return
      }
      this.$emit('nextStep', {
        category_item: this.category_item,
        id: this.id
      })
    },

    /**
     * 检测点的选择回调
     * data 组建传回来的当前所选按钮值以及当前监测点的ID
     */
    checkItem(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          if (ele.point.length === 1) {
            if (data.value !== 2) {
              ele.exception = []
              ele.exception_advice = []
              ele.technician_comment = ''
              ele.exception_image = []
            }
            ele.point.splice(0,1,{id: data.id, value: data.value})
          } else {
            // 判断当前项目有没有异常状态，如果没有 异常问题和异常建议置空
            let arr = ele.point.filter(item => item.value === 2)
            ele.point.forEach(element => {
              if (element.id === data.id) {
                element.value = data.value
              }
            })
            if (arr.length === 0) {
              ele.exception = []
              ele.exception_advice = []
              ele.technician_comment = ''
              ele.exception_image = []
            }
          }
        }
      })
    },

    /**
     * 选择异常问题回调
     * data 组建传回来的异常问题列表
     */
    complete(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.exception = data.arr.map(v => v.id)
        }
      })
    },

    /**
     * 选择异常建议回调
     * data 组建传回来的异常建议列表
     */
    completeAdvice(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.exception_advice = data.arr.map(v => v.id)
        }
      })
    },

    /**
     * 技师输入备注信息点完成回调
     * data 组建传回来的备注
     */
    completeNote(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.technician_comment = data.technician_comment
        }
      })
    },

    // 上传图片回调
    uploadPic(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.exception_image.push(data.image_url)
        }
      })
    },

    // 删除图片
    deleteImg(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.exception_image.splice(data.index, 1)
        }
      })
    },

    // 上传图片回调
    uploadVideo(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          console.log('ele', ele)
          ele.exception_video.push(data.video_url)
        }
      })
    },

    // 删除图片
    deleteVideo(data) {
      this.category_item.forEach(ele => {
        if (ele.id === data.categoryId) {
          ele.exception_video.splice(data.index, 1)
        }
      })
    },

    // 初始化该分类下的参数 将所有信息先值成未检测状态 有修改之后再修改某一个状态（最后一步的此场景正常）
    initCheckItem(param, normal) {
      let arr = []
      this.card_list.forEach((ele,index) => {
        arr.push({
          id: ele.id,
          category_id: ele.category_id,
          pivot_id: ele.pivot_id,
          relation_id: ele.relation_id,
          point: [],
          exception: [],
          exception_advice: [],
          technician_comment: '',
          exception_image: [],
          exception_video: [],
        })
        // is_multi   1 多选   2 单选
        if (ele.is_multi === 1) {
          ele.point.forEach(item => {
            arr[index].point.push({
              id: item.id,
              value: (param === 1 || param === undefined) ? 4 : 1,
            })
          })
        } else if (ele.is_multi === 2) {
          arr[index].point.push({
            id: ele.point[0].id,
            value: (param === 1 || param === undefined) ? 4 : 1,
          })
        }
      })
      this.category_item = [...arr]
      if(normal) {
        this.is_all_normal = true   // 最后一步，点击此场景正常，提交数据时展示特定的提示信息
        this.confirm(1, false)             // 此场景正常，并且提交数据
      }
    }
  },
  mounted() {
    this.initCheckItem()
  }
};
</script>
<style lang="less" scoped>
.project-card{
  background-color: #fff;
  box-shadow:0px 12px 32px 0px rgba(35,36,46,0.04);
  border-radius:4px;
  margin-top: 0.2rem;
}
.card_box{
  padding-bottom: 2rem;
}
.footer-btn{
  margin-top: 0.6rem;
  background-color: #f0eff5;
  padding: 0.5rem 0.3rem;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  .btn{
    width: 2.1rem;
    height: 0.76rem;
    line-height: 0.76rem;
    border-radius: 50px;
    padding: 0;
    background-color: #fff;
    border: 1px solid #5E7BFF;
    color: #5E7BFF;
    &.primary{
      background-color: #5E7BFF;
      color: #fff;
      float: right;
      box-shadow: 0px 12px 24px 0px rgba(94,123,255,0.3);
    }
  }
  .over {
    width: 2.1rem;
  }
  .width {
    width: 3.3rem;
  }
  .m-l-0 {
    margin-left: 0px;
  }
}
</style>
