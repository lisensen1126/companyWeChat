<template>
  <div class="check-type">
    <div class="tip font-13">提示：点击场景可查看介绍</div>
    <div class="black-box font-15" v-for="(item, index) in list" :key="index" @click="goDetail(item.id)">
      <div class="title">
        <div class="name font-18 pull-left">{{item.name}}</div>
        <div class="number font-12 pull-right">{{item.count}}项</div>
      </div>
      <div class="disc">
        <div class="show-box clearfix" v-if="!item.is_show && item.desc.length > 0">
          <div class="line font-12 pull-left">{{item.desc}}</div>
          <div class="more font-12 pull-right" v-if="!item.is_show && item.desc.length > 17" @click.stop="unfold(index)">更多</div>
        </div>
        <div class="hide-box clearfix" v-show="item.is_show && item.desc.length > 17">
          <div class="line font-12">{{item.desc}}</div>
          <div class="more font-12 pull-right" @click.stop="unfold(index)">收起</div>
        </div>
      </div>
      <div class="scene">
        <ul>
          <li class="pull-left font-12" 
          :style="{background: `url(${info.icon}) no-repeat center`, backgroundPositionY: '0.3rem', backgroundSize: '0.48rem 0.49rem'}" 
          v-for="(info, index) in item.category" 
          :key="index" 
          @click.stop="ctrlModel(info)">{{info.name}}</li>
        </ul>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div class="modal" v-if="is_show">
      <div class="content-box">
        <div class="title font-16">
          {{curr_info.name}}
          <div class="close" @click.stop="ctrlModel"></div>
        </div>
        <div class="text font-12">
          {{curr_info.desc}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/diagnosisApi";
import { close } from 'fs';
export default {
  data() {
    return {
      is_show: false,
      list: [],           // 车检单列表
      curr_info: {}       // 当前车检场景介绍
    }
  },
  methods: {
    ctrlModel (info) {
      this.is_show = !this.is_show
      if (info) this.curr_info = info
    },

    // 获取车检单列表
    async getProcessList () {
      this.$loading.show("加载中");
      try {
        const {status, data, message, code} = await Api.processIndexApi()
        if (status === 200 && code === 0) {
          if (data.length === 0) {
            this.$router.replace({ path: "/error", query: { msg: '暂无车检单' } });
          } else {
            data.forEach(v => {v.is_show = false})
            this.list = data
          }
        } else {
          this.$router.replace({ path: "/error", query: { msg: message } });
        }
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.error('车检单选择-车检单列表', err)
      }
    },

    // 展开收起
    unfold (index) {
      this.list[index].is_show = !this.list[index].is_show
    },

    // 去详情
    goDetail (id) {
      this.$router.push({
        name: "startcheck",
        query: { 
          id: id,
          customer_id: this.$route.query.customer_id,        //  客户ID
          mobile: this.$route.query.mobile,                  //  客户手机号
          license_plate: this.$route.query.license_plate,    //  车牌号
        }
      })
    },
  },
  mounted() {
    this.getProcessList()
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
.check-type {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background-color: #F7F8FA;
  .tip {
    width: 100%;
    height: 86/100rem;
    line-height: 86/100rem;
    color: #8A92A2;
    text-align: center;
  }
  .black-box {
    width: 690/100rem;
    background-color: #ffffff;
    box-shadow: 0 12/100rem 32/100rem 0 rgba(35,36,46,0.04);
    border-radius: 4/100rem;
    margin: 0 auto;
    padding-top: 40/100rem;
    margin-bottom: 20/100rem;
    .title {
      height: 50/100rem;
      line-height: 50/100rem;
      padding: 0 30/100rem;
      margin-bottom: 20/100rem;
      .name {
        font-weight: 600;
        color: #3D424C;
      }
      .number {
        color: #5E7BFF;
      }
    }
    .disc {
      padding: 0 30/100rem 30/100rem 30/100rem;
      border-bottom: 1px solid #F0F0F0;
      height: auto;
      .show-box {
        height: 34/100rem;
        .line {
          color: #8A92A2;
          line-height: 34/100rem;
          width: 504/100rem;
          overflow: hidden;    
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .more {
          color: #667288;
          line-height: 34/100rem;
        }
      }
      .hide-box {
        height: auto;
        .line {
          color: #8A92A2;
          line-height: 34/100rem;
        }
        .more {
          color: #667288;
          line-height: 34/100rem;
          margin-top: 4/100rem;
        }
      }
    }
    .scene {
      width: 690/100rem;
      height: 170/100rem;
      li {
        width: 230/100rem;
        height: 170/100rem;
        text-align: center;
        padding-top: 96/100rem;
        color: #3D424C;
      }
    }
  }
}
.modal {
  width: 100%;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  .content-box {
    width: 630/100rem;
    min-height: 324/100rem;
    background-color: #ffffff;
    position: absolute;
    top: 300/100rem;
    left: 60/100rem;
    border-radius: 4/100rem;
    .title {
      padding-top: 50/100rem;
      padding-bottom: 30/100rem;
      text-align: center;
      background-color: #5E7BFF;
      color: #FFFFFF;
      position: relative;
      .close {
        position: absolute;
        top: 30/100rem;
        right: 30/100rem;
        width: 52/100rem;
        height: 52/100rem;
        background: url('../../assets/write-close.png') no-repeat center;
        background-size: 52/100rem 52/100rem;
      }
    }
    .text {
      padding: 30/100rem 60/100rem 60/100rem 60/100rem;
      color: #3D424C;
    }
  }
}
</style>