<template>
  <div class="check-type">
    <div class="type-header flex">
      <div class="header-content" @click='startCheck(process_info.id)'>
        <img class="type-default" src="../../assets/type-default.png" alt="">
        <img class="type-click" src="../../assets/type-click.png" alt="">
        <div class="header-text">
          <h3 class="font-16">{{process_info.name}}</h3>
          <p class="font-12">{{process_info.count}}项</p>
        </div>
      </div>
    </div>
    <div class="type-content">
      <p class="font-10 text-gray">{{process_info.desc}}</p>
      <div class="type-item flex" v-for='(item,index) in process_info.category' :key='index'>
        <img class="type-icon" :src="item.icon" alt="">
        <div class="type-item-text">
          <h4 class="font-12">{{item.name}}</h4>
          <p class="font-12 text-gray">{{item.desc}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/diagnosisApi";
export default {
  data() {
    return {
      process_info: {},
    };
  },
  computed: {
    
  },
  methods: {
    /**
     * id 选择的要进行车检流程的类型ID（本期迭代只有一个）
     */
    startCheck(id) {
      this.$router.push({
        name: "startcheck",
        query: { 
          id: id,
          customer_id: this.$route.query.customer_id,   //  客户ID
          mobile: this.$route.query.mobile,   //  客户手机号
          license_plate: this.$route.query.license_plate    //  车牌号
        }
      });
    },
    // 获取车检首页详情
    async getprocessIndex() {
      let _this = this
      _this.$loading.show("加载中");
      try {
        const {status, data, message, code} = await Api.processIndexApi()
        _this.$loading.hide();
        console.log(data)
        if (status === 200 && code === 0) {
          if (data.length === 0) {
            _this.$router.replace({ path: "/error", query: { msg: '暂无车检单' } });
          } else {
            _this.process_info = data[0]
          }
        }
      } catch (err) {
        console.log(err)
        _this.$loading.hide();
        _this.$router.replace({ path: "/error", query: { msg: err } });
      }
    }
  },
  mounted() {
    this.getprocessIndex()
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
.type-header{
  height: 3.92rem;
  width: 100%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  .header-content{
    position: relative;
    width: 5.34rem;
    height: 3.46rem;
    img{
      width: 100%;
      height: auto;
      position: absolute;
      left: 0;
      top: 0;
    }
    .type-default{
      z-index: 1;
    }
    .header-text{
      color: #fff;
      position: absolute;
      z-index: 3;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      .font-16{
        font-weight: bold;
      }
      p{
        margin-top: 0.1rem;
      }
    }
    &.hover{
      .type-click{
        z-index: 2;
      }
    }
  }
}
.type-content{
  width: 100%;
  padding: 0.42rem 0.7rem;
}
.type-item{
  justify-content: flex-start;
  padding: 0.3rem 0;
}
.type-item-text{
  padding-left: 0.3rem;
}
.type-icon{
  width: 0.9rem;
  height: 0.8rem;
}
.text-gray{
  color: #8A92A2;
  word-break: break-all;
}
.text-title{
  color: #3D424C;
  font-weight: bold;
}
</style>