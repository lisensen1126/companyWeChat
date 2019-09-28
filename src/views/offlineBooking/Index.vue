<template>
  <div class="index">
    <ul class="font-12">
      <li class="pull-left item1" @click="goStorePayCode">门店收款码</li>
      <li class="pull-right item2" @click="goOpeningOrder">开单收款</li>
    </ul>
    <ul class="font-12">
      <li class="pull-left item3" @click="goReceivablesList">收款记录</li>
      <li class="pull-right item4" @click="goStaffManageList" v-if="user_info == '老板'">员工开单管理</li>
    </ul>

    <!-- 权限弹框 -->
    <div class="model" v-show="show_modal">
      <div class="content">
        <p class="font-12">暂无权限！请联系管理员开通</p>
        <button class="font-14" @click="closeModal">我知道了</button>
      </div>
    </div>
  </div>
</template>
<script>
import AppConfig from "../../app.config.js";
export default {
  data() {
    return {
      show_modal: false,
      user_info: '',                 // 用户角色
      authority: {},                 // 权限
    };
  },
  methods: {
    // 去往门店收款码页面
    goStorePayCode () {
      this.$router.push({
        name: "StorePayCode"
      })
    },

    // 去收款记录页面
    goReceivablesList () {
      this.$router.push({
        name: "ReceivablesList"
      })
    },

    // 去员工开单权限管理页面
    goStaffManageList () {
      this.$router.push({
        name: "StaffManageList"
      })
    },

    // 去快速开单
    goOpeningOrder () {
      // 点击人员是否有权限，有权限跳转，无权限终止操作
      if (this.authority.KDSKO.permission == 2 && this.authority.KDSKO.hasPermission == 0) {
        this.show_modal = true
        return
      } 
      this.$router.push({
        name: "OpeningOrderList"
      })
    },

    // 关闭权限弹框
    closeModal () {
      this.show_modal = false
    },
  },

  beforeRouteEnter:(to, from, next)=>{
    if(from.name && from.name == 'StaffManageList') {
      window.location.reload()
    }
    next()
  },

  mounted() {
    this.user_info = AppConfig.user.member.role.roleName
    this.authority = AppConfig.user.permission
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  width: 100%;
  min-height: 100vh;
  background-color: #F7F8FA;
  padding: 30/100rem;
  li{
    width: 334/100rem;
    height: 286/100rem;
    box-shadow: 0 8/100rem 20/100rem 0 rgba(222,224,229,0.5);
    border-radius: 4/100rem;
    margin-bottom: 22/100rem;
    color: #3D424C;
    padding-top: 206/100rem;
    font-weight: bold;
    text-align: center;
    box-sizing: border-box;
  }
  .item1{
    background: url('../../assets/application/s-code.png') no-repeat center;
    background-size: 114/100rem 114/100rem;
    background-position: 110/100rem 62/100rem;
    background-color: #ffffff;
  }
  .item2{
    background: url('../../assets/application/s-order.png') no-repeat center;
    background-size: 114/100rem 114/100rem;
    background-position: 110/100rem 62/100rem;
    background-color: #ffffff;
  }
  .item3{
    background: url('../../assets/application/s-recode.png') no-repeat center;
    background-size: 114/100rem 114/100rem;
    background-position: 110/100rem 62/100rem;
    background-color: #ffffff;
  }
  .item4{
    background: url('../../assets/application/s-ry.png') no-repeat center;
    background-size: 114/100rem 114/100rem;
    background-position: 110/100rem 62/100rem;
    background-color: #ffffff;
  }
  
  .model{
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
  }
  .content{
    width: 630/100rem;
    height: 380/100rem;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: url('../../assets/application/quanxian.png') no-repeat center;
    background-size: 100/100rem;
    background-position-y: 48/100rem;
    background-color: #ffffff;
    p{
      padding-top: 186/100rem;
      color: #3D424C;
      text-align: center;
    }
    button{
      width:258/100rem;
      height:76/100rem;
      background:rgba(94,123,255,1);
      box-shadow:0/100rem 12/100rem 24/100rem 0/100rem rgba(94,123,255,0.3);
      border-radius:50/100rem;
      color: #ffffff;
      margin-top: 54/100rem;
      margin-left: 186/100rem;
    }
  }
}
</style>
