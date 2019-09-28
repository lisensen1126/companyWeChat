<template>
  <div class="index">
    <!-- 头部 -->
    <div class="header">
      <div class="search">
        <span class="blod"></span>
        <input type="text" v-model="keyword" @keyup.enter="search" @input="search" class="font-13 search-phone" placeholder="搜索员工姓名或电话">
        <span class="clear" v-if="keyword.length > 0" @click="clearInput"></span>
      </div>
    </div>

    <!-- 员工列表 -->
    <div class="list">
      <p class="tips font-10">开关用于控制员工能否进行开单收款</p>
      <div class="list-item" v-for="(item,index) in temp_list" :key="index">
        <div class="top">
          <img :src="item.memFace" class="image pull-left" alt="">
          <div class="box pull-left">
            <p class="font-14 name">{{item.memUsername}}（{{item.memMobile}}）</p>
            <p class="postion font-12">{{item.memRole ? item.dpName+ '-'+item.memRole : item.dpName}}</p>
          </div>
        </div>
        <div class="bottom font-14">
          开单权限
          <div class="right pull-right" @click="ctrlModal(item)">
            <inline-x-switch v-model="item.hasBillPermission"></inline-x-switch>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限设置二次确认 -->
    <div class="modal" v-if="show_modal">
      <div class="content">
        <div class="box">
          <div class="title font-16">提示</div>
          <div class="text font-16">是否{{is_open ? '关闭' : '开启'}}“{{user_name}}”的权限？</div>
          <div class="footer">
            <div class="left font-16" @click="cancel">取消</div>
            <div class="right font-16" @click="setInfo">确认</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import Api from '../../api/offlineBookingApi';
import { InlineXSwitch } from 'vux'
export default {
  data() {
    return {
      keyword: '',
      value: false,
      show_modal: false,
      list: [],
      temp_list: [],
      user_name: '',
      is_open: false,
      cur_info: {},
    };
  },
  components: {
    InlineXSwitch,
  },
  methods: {
    // 清空搜索框
    clearInput () {
      this.keyword = ''
      this.temp_list = this.list
    },

    // 搜索数据
    search () {
      let self = this
      self.temp_list = self.list.filter(item => item.memMobile.indexOf(self.keyword) > -1 || item.memUsername.indexOf(self.keyword) > -1)
    },

    // 获取员工列表
    fetchList () {
      let self = this;
      self.$loading.show("加载中");
      Api.getStaffListApi().then(
        res =>{
          if (res.code === 0) {
            res.data.forEach(v => {
              v.hasBillPermission = v.hasBillPermission == 1 ? true : false
            })
            self.list = res.data
            self.temp_list = res.data
            self.$loading.hide()
          } else {
            self.$loading.hide()
            self.$router.replace({ path: "/error", query: {msg: res.message}})
          }
        },
        err =>{
          self.$loading.hide()
          self.$router.replace({ path: "/error", query: { msg: err } })
        }
      )
    },

    // 控制模态框
    ctrlModal (e) {
      this.cur_info = e
      this.user_name = e.memUsername
      this.is_open = e.hasBillPermission
      this.show_modal = true
    },

    // 取消
    cancel () {
      this.cur_info.hasBillPermission = !this.cur_info.hasBillPermission
      this.show_modal = false
    },

    // 确定修改权限
    setInfo () {
      let self = this
      self.show_modal = false
      self.$loading.show("加载中");
      Api.setStaffPwoerApi({mem_uid: this.cur_info.memUid}).then(
        res =>{
          if (res.code === 0) {
            self.$loading.hide()
            self.$toast.success('修改权限成功！')
          } else {
            self.$loading.hide()
            self.$router.replace({ path: "/error", query: {msg: res.message}})
          }
        },
        err =>{
          self.$loading.hide()
          self.$router.replace({ path: "/error", query: { msg: err } })
        }
      )
    }
  },

  mounted() {
    this.fetchList()
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #F7F8FA;
  .header {
    width: 100%;
    height: 110/100rem;
    background-color: #ffffff;
    border-top: 1/100rem solid transparent;
    .search {
      width: 690/100rem;
      height: 70/100rem;
      line-height: 70/100rem;
      margin: 0 auto;
      margin-left: 30/100rem;
      margin-top: 20/100rem;
      border: 1px solid #3D424C;
      border-radius: 4/100rem;
      background: url("../../assets/search-img.png") no-repeat center;
      background-position-x: 20/100rem;
      background-size: 28/100rem 26/100rem;
      position: relative;
      .clear {
        width: 70/100rem;
        height: 70/100rem;
        position: absolute;
        top: 0;
        right: 0;
        background: url("../../assets/search-clear.png") no-repeat center;
        background-size: 28/100rem;
      }
      .blod {
        margin-left: 66/100rem;
        float: left;
        height: 22/100rem;
        width: 1px;
        margin-top: 22/100rem;
        background-color: #3D424C;
      }
      .search-phone {
        float: left;
        margin-left: 16/100rem;
        height: 66/100rem;
        padding-top: 5/100rem;
      }
      input::-webkit-input-placeholder{
        color: rgba(61, 66, 76, .3);
      }
    }
  }
  .list{
    width: 100%;
    height: calc(100vh - 1.1rem);
    overflow-y: scroll;
    .tips{
      width: 100%;
      height: 64/100rem;
      line-height: 64/100rem;
      text-align: center;
      background-color: #CAD3FF;
      color: #5E7BFF;
    }
    .list-item{
      height: 230/100rem;
      width: 100%;
      margin-bottom: 20/100rem;
      background-color: #ffffff;
      padding-left: 30/100rem;
      .top{
        height: 140/100rem;
        border-bottom: 1px solid #EEEEEE;
        padding-top: 40/100rem;
        .image{
          width: 80/100rem;
          height: 80/100rem;
          border-radius: 80/100rem;
        }
        .box{
          padding-left: 18/100rem;
          height: 80/100rem;
          .name{
            color: #2C3039;
            line-height: 1;
            width: 500/100rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .postion{
            color: #8A92A2;
            line-height: 1;
            padding-top: 20/100rem;
          }
        }
      }
      .bottom{
        width: 100%;
        height: 88/100rem;
        color: #2C3039;
        line-height: 88/100rem;
        .right{
          width: 102/100rem;
          height: 88/100rem;
          margin-right: 30/100rem; 
          padding-top: 14/100rem;
        }
        .weui-switch:checked{
          background-color: #5E7BFF;
          border-color: #5E7BFF;
        }

      }

    }
  }
  .modal{
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    right: 0;
    .content{
      width: 660/100rem;
      min-height: 420/100rem;
      background-color: #fff;
      position: absolute;
      left: 45/100rem;
      top: 30%;
      .title{
        width: 100%;
        height: 124/100rem;
        line-height: 124/100rem;
        text-align: center;
        background-color: #4B77B0;
        color: #fff;
      }
      .text{
        width: 500/100rem;
        text-align: center;
        color: #3D424C;
        margin: 0 auto;
        margin-top: 60/100rem;
      }
      .box{
        width: 100%;
        height: 420/100rem;
        position: relative;
      }
      .footer{
        width: 100%;
        height: 106/100rem;
        border-top: 1px solid #F0F0F0;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        text-align: center;
        .left{
          width: 50%;
          line-height: 106/100rem;
          border-right: 1px solid #F0F0F0;
          color: #404040;
        }
        .right{
          width: 50%;
          line-height: 106/100rem;
          color: #4B77B0;
        }
      }
    }
  }
}
</style>
