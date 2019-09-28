<template>
  <div class="start-check">
    <!-- 头部的步骤进度条 -->
    <div class="header-check">
      <div class="step">
        <!-- 有操作三步 -->
        <ul class="font-12" v-if="check_info.category && check_info.category.length > 0" 
        :class="{
          'item-one': check_info.category.length == 3,
          'item-two': check_info.category.length == 2,
          'item-three': check_info.category.length == 1,
          'three-one': check_info.category.length == 3 && check_info.category[0].checked && !check_info.category[1].checked, 
          'three-two': check_info.category.length == 3 && check_info.category[1].checked && !check_info.category[2].checked, 
          'three-three': check_info.category.length == 3 && check_info.category[2].checked,
          'two-one': check_info.category.length == 2 && check_info.category[0].checked && !check_info.category[1].checked,
          'two-two': check_info.category.length == 2 && check_info.category[1].checked,
          'one-one': check_info.category.length == 1 && check_info.category[0].checked
        }">
          <li v-for="(item,index) in check_info.category" :key="index">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 项目列表 -->
    <div class="card-box">
      <div class="card" v-for="(item,index) in check_info.category" :key="index" v-if="item.id == checked_id">
        <project-card class="card-item" :steps_num="check_info.category.length" :last_steps="last_steps" :id="checked_id" :card_list="item.category_item" @confirmSubmit="confirmSubmit" @nextStep="nextStep" @jumpStep="jumpStep"></project-card>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectCard from "../../components/projectCard/ProjectCard";
import ConfirmModal from "../../components/confirmModal/ConfirmModal";
import ApiCard from "@/api/cardApi";
import Api from "@/api/diagnosisApi";
import { ChangeDateTime } from "../article/DateTimes.js";
import AppConfig from "../../app.config.js";
export default {
  components: {
    ProjectCard,
    ConfirmModal
  },
  data() {
    return {
      confrom_info: {
        confirm_title: "提交车辆报告后，车主可以在小程序同步收到！",  // 确定提交的title文案
        confirm_text: "确定提交",  // 确定提交的确定按钮文案
        confirm_type: null,    // 用来控制是重新检测还是确定提交
        is_title: true,
      },
      confirm_modal: false,   // 控制确定提交弹框显隐
      check_id: null,    // 车检类型ID
      checked_id: null,    // 分类步骤ID
      check_info: {},    // 车检详情
      category: [],     // 提交参数
      last_steps: false,
    };
  },
  methods: {
    /**
     * 弹框的确定回调
     * res {Number } 组建传值 当前点击的是提交还是重新检测  1提交 2重新检测
     */
    confirmSubmit(res) {
      if (res.type === 1) {
        let arr = this.check_info.category.filter(ele => ele.checked)
        this.category.push({
          id: arr[arr.length - 1].id,
          category_item: [...res.category_item],
        })
        this.submit()
      } else if (res.type === 2) {
        this.again()
      }
    },

    // 提交车检报告
    async submit() {
      this.$loading.show("加载中")
      let arr = []
      this.category.forEach(v => {
        v.category_item.forEach(n => {
          let obj = {}
          obj = {
            id: n.id,
            category_id: n.category_id,
            pivot_id: n.pivot_id,
            relation_id: n.relation_id,
            points: n.point,
            exceptions: n.exception,
            suggests: n.exception_advice,
            technician_comment: n.technician_comment,
            exception_image: n.exception_image,
            exception_video: n.exception_video,
          }
          arr.push(obj)
        }) 
      })
      try {
        const {status, data, message, code} = await Api.processGenerateApi({
          id: this.check_id,
          customer_id: this.$route.query.customer_id,
          mobile: this.$route.query.mobile,
          license_plate: this.$route.query.license_plate,
          items: arr,
        })
        if (status === 200 && code === 0) {
          this.$router.replace({
            name: "checksuccess",
            query: { id: '123' },
          })
        } else {
          this.$toast.error(message)
        }
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        this.$router.replace({ path: "/error", query: { msg: err } });
      }
    },

    // 重新检测
    again() {
      this.$router.go(-1)
    },

    // 获取车检详情
    async getProcessInspect() {
      let _this = this
      _this.$loading.show("加载中");
      try {
        const {status, data, message, code} = await Api.processInspectApi({
          id: this.check_id
        })
        if (status === 200 && code === 0) {
          if (data && data.category.length === 0) {
            _this.$router.replace({ path: "/error", query: { msg: '暂无车检分类' } });
          } else {
            data.category.length === 1 ? this.last_steps = true : this.last_steps = false
            data.category.forEach((v, index) => {
              // 车检逻辑太复杂，保持和上次数据结构相同
              v.category_item.forEach(n => {
                n.point = n.points
                n.exception_advice = n.suggests
                n.exception = n.exceptions
                n.exception.forEach(item => {
                  item.checked = false
                })
                n.exception_advice.forEach(item => {
                  item.checked = false
                })
              })
              if(index === 0) {
                v.checked = true
                _this.checked_id = v.id
              }else {
                v.checked = false
              }
            })
            _this.check_info = data
          }
        } else {
          this.$toast.error(message)
        }
        _this.$loading.hide();
      } catch (err) {
        _this.$loading.hide();
        _this.$router.replace({ path: "/error", query: { msg: err } });
      }
    },

    // 点击下一步
    nextStep(data) {
      window.scrollTo(0,0);
      let arr = this.check_info.category.filter(ele => ele.checked)
      this.category.push({
        id: arr[arr.length - 1].id,
        category_item: [...data.category_item],
      })
      if (arr.length === this.check_info.category.length - 1) {
        this.last_steps = true
      } else {
        this.last_steps = false
      }
      this.check_info.category.forEach((ele, index) => {
        if (ele.id === arr[arr.length - 1].id) {
          this.check_info.category[index+1].checked = true
          this.checked_id = this.check_info.category[index+1].id
        }
      })
    },

    // 跳过此步骤
    jumpStep(data) {
      let arr = this.check_info.category.filter(ele => ele.checked)
      this.checked_id = arr[arr.length - 1].id
      this.category.push({
        id: arr[arr.length - 1].id,
        category_item: [...data.category_item],
      })
      if (arr.length === this.check_info.category.length - 1) {
        this.last_steps = true
      } else {
        this.last_steps = false
      }
      this.check_info.category.forEach((ele, index) => {
        if (ele.id === arr[arr.length - 1].id) {
          this.check_info.category[index+1].checked = true
          this.checked_id = this.check_info.category[index+1].id
        }
      })
    },
  },
  mounted() {
    let _this = this
    _this.check_id = this.$route.query.id
    this.getProcessInspect()
  }
}
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/button.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";
.header-check{
  width: 100%;
  background-color: #fff;
  padding: 0.3rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 89;
  .header-line{
    justify-content: flex-start;
    padding: 0 0.4rem;
  }
  .header-item{
    justify-content: flex-start;
    .steps-1{
      width: 0.32rem;
      height: 0.32rem;
      background-color: #AEB5C5;
      color: #fff;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50px;
      margin-right: 0.08rem;
      margin-left: 0.08rem;
    }
    &:last-child{
      .steps-1{
        margin-right: 0;
      }
    }
    &:first-child{
      .steps-1{
        margin-left: 0;
      }
    }
    .steps-line{
      width: 2.4rem;
      height: 0.04rem;
      background-color: #AEB5C5;
    }
    &.active{
      .steps-1{
        background-color: #5E7BFF;
      }
      .steps-line{
        background-color: #5E7BFF;
      }
    }
  }
  .header-text{
    margin-top: 0.1rem;
    justify-content: space-between;
    p{
      color: #AEB5C5;
      // width: 2.88rem;
      &.active{
        color: #3D424C;
      }
      &:last-child{
        width: auto;
      }
    }
  }
}
.card-box{
  padding-top: 1.5rem;
}
.card{
  padding: 0 0.3rem;
}

// 步骤条
.header-check{
  width: 100%;
  background-color: #fff;
  padding: 0.3rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 89;
  .step {
    width: 690/100rem;
    height: 68/100rem;
    .item-one {
      width: 690/100rem;
      height: 68/100rem;
      li {
        width: 230/100rem;
        height: 68/100rem;
        float: left;
        line-height: 68/100rem;
        text-align: center;
        color: #fff;
      }
    }
    .three-one {
      background: url('../../assets/three-no1.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
    .three-two {
      background: url('../../assets/three-no2.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
    .three-three {
      background: url('../../assets/three-no3.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
    .item-two {
      width: 690/100rem;
      height: 68/100rem;
      li {
        width: 345/100rem;
        height: 68/100rem;
        float: left;
        line-height: 68/100rem;
        text-align: center;
        color: #fff;
      }
    }
    .two-one {
      background: url('../../assets/two-no1.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
    .two-two {
      background: url('../../assets/two-no2.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
    .item-three {
      width: 690/100rem;
      height: 68/100rem;
      li {
        width: 690/100rem;
        height: 68/100rem;
        float: left;
        line-height: 68/100rem;
        text-align: center;
        color: #fff;
      }
    }
    .one-one {
      background: url('../../assets/one-no1.png') no-repeat center;
      background-size: 690/100rem 68/100rem;
    }
  }
  
}

</style>