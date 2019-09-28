<template>
  <div>
    <div class="message-notice font-PC-re">
      <!-- <div class="message-header flex">
        <div class="message-avater">
          <img v-if="firstFinish" :src="cardInfo.local_head_image?cardInfo.local_head_image:defaultHeader">
        </div>
        <div class="message-info flex">
          <div class="message-name font-16">{{cardInfo.user_name}}</div>
          <div class="message-job font-11">{{cardInfo.role_name}}</div>
        </div>
      </div> -->
      <div class="message-nav">
        <div class="message-nav-window">
          <div v-if='memRoleId === 3 || memRoleId === 4 || memRoleId === 5' class="message-item" v-for='(item, index) in navList' :key='index' :class="index === activeIndex ? 'active' : ''" @click='switchTab(index)'>
            <span class="font-13 message-item-text">{{item.title}}</span>
          </div>
          <div v-if='memRoleId === 1 || memRoleId === 2' class="message-item" v-for='(item, index) in vip_nav_list' :key='index' :class="index === activeIndex ? 'active' : ''" @click='switchTab(index)'>
            <span class="font-13 message-item-text">{{item.title}}</span>
          </div>
        </div>
      </div>
      <scroller class="message-list-scoller" ref="myscroller" :on-infinite="infinite" v-if="message_list.length > 0">
        <div class="message-list" v-if="message_list.length > 0">
          <div class="message-card" v-for="(item, index) in message_list" :key='index'>
            <div class="card-header flex" v-if="item.type !== 'system_notice'" @click="showModal(item)">
              <div class="card-header-title font-14">{{item.title}}</div>
              <!-- 消费，预约，核销需要展示详情（弹框展示） -->
              <div class="card-header-detail font-14" v-if="item.type == 'order_appoint' || item.type == 'order_verify' || item.type == 'order_consume'">
                <span>详细</span>
                <img class="" src="../../assets/message-right.svg" alt="">  
              </div>
              <div class="card-header-time font-12" v-else>{{item.send_at}}</div>
            </div>
            <div class="card-content" v-if="item.type !== 'system_notice'">

              <div class="card-flex flex" v-if='item.type == "order_appoint" || item.type == "order_verify" || item.type == "order_consume"'>
                <div class="card-label font-12">客户名称</div>
                <div class="card-text font-12">{{item.info.name}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_recharge" || item.type === "card_transact" || item.type === "card_consume"'>
                <div class="card-label font-12">会员名称</div>
                <div class="card-text font-12">{{item.info.name}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_recharge" || item.type === "card_transact" || item.type === "card_consume"'>
                <div class="card-label font-12">会员手机号</div>
                <div class="card-text font-12">{{item.info.mobile}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_recharge" || item.type === "card_transact" || item.type === "card_consume"'>
                <div class="card-label font-12">车辆信息</div>
                <div class="card-text font-12">{{item.info.vehicle}}</div>
              </div>

              <!-- <div class="card-flex flex" v-if='item.type !== "small_register" && item.type !== "card_recharge" && item.type !== "card_transact" && item.type !== "card_consume"'>
                <div class="card-label font-12">车辆信息</div>
                <div class="card-text font-12">{{item.info.vehicle}}</div>
              </div> -->

              <!-- 订单相关 -->
              <div class="card-flex flex" v-if='item.type === "order_consume" || item.type === "order_verify" || item.type === "order_appoint"'>
                <div class="card-label font-12">订单编号</div>
                <div class="card-text font-12">{{item.info.order}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "order_consume" || item.type === "order_verify"'>
                <div class="card-label font-12">订单类型</div>
                <div class="card-text font-12">{{item.info.type}}</div>
              </div>

              <!-- 消费时间 -->
              <div class="card-flex flex" v-if='item.type === "order_consume"'>
                <div class="card-label font-12">消费时间</div>
                <div class="card-text font-12">{{item.send_at}}</div>
              </div>

              <!-- 核销时间 -->
              <div class="card-flex flex" v-if='item.type === "order_verify"'>
                <div class="card-label font-12">核销时间</div>
                <div class="card-text font-12">{{item.info.date}}</div>
              </div>

              <!-- 预约时间 -->
              <div class="card-flex flex" v-if='item.type === "order_appoint"'>
                <div class="card-label font-12">预约门店</div>
                <div class="card-text font-12">{{item.info.store}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "order_appoint"'>
                <div class="card-label font-12">预约时间</div>
                <div class="card-text font-12">{{item.info.date}}</div>
              </div>

              <!-- 消费、办卡、充值 -->
              <div class="card-flex flex" v-if='item.type === "card_transact"'>
                <div class="card-label font-12">会员卡名称</div>
                <div class="card-text font-12">{{item.info.vip_name}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_consume" || item.type === "card_transact"'>
                <div class="card-label font-12">会员编号</div>
                <div class="card-text font-12">{{item.info.card}}</div>
              </div>

              <!-- 充值 -->
              <div class="card-flex flex" v-if='item.type === "card_recharge"'>
                <div class="card-label font-12">服务名称</div>
                <div class="card-text font-12">{{item.info.service}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_recharge"'>
                <div class="card-label font-12">到期时间</div>
                <div class="card-text font-12">{{item.info.end_date}}</div>
              </div>

              <!-- 订单相关 -->
              <div class="card-flex flex card-postion" v-if='item.type === "order_consume" || item.type === "order_verify" || item.type === "order_appoint"'>
                <div class="card-label font-12">实付金额</div>
                <div class="card-text font-12 color-red">
                  ¥ {{item.info.price}}
                </div>
              </div>

              <!-- 会员消费 -->
              <div class="card-flex flex" v-if='item.type === "card_consume"'>
                <div class="card-label font-12">会员消费：</div>
                <div class="card-text font-12 color-red">¥{{item.info.price}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "card_consume"'>
                <div class="card-label font-12">门店信息：</div>
                <div class="card-text font-12">{{item.info.store}}</div>
              </div>

              <!-- 注册 -->
              <div class="card-flex flex" v-if='item.type === "small_register"'>
                <div class="card-label font-12">注册时间</div>
                <div class="card-text font-12">{{item.info.date}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "small_register"'>
                <div class="card-label font-12">注册方式</div>
                <div class="card-text font-12">{{item.info.type}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "small_register"'>
                <div class="card-label font-12">注册类型</div>
                <div class="card-text font-12">{{item.info.from}}</div>
              </div>

              <div class="card-flex flex" v-if='item.type === "small_register" && item.info.referee'>
                <div class="card-label font-12">推荐人</div>
                <div class="card-text font-12">{{item.info.referee}}</div>
              </div>
            </div>

            <div class="announcement" v-if="item.type === 'system_notice'" @click="goDetail(item)">
              <div class="announcement-header">
                <img class="thumb" :src="item.info.image" alt="">
                <img class="set-top" v-if="item.is_top === 2" src="../../assets/is_top.png" alt="">
              </div>
              
              <div class="announcement-text">
                <div class="announcement-title font-14" v-text="item.info.summary"></div>
                <div class="announcement-time font-10" v-text="item.send_at"></div>
              </div>
            </div>

          </div>
        </div>
      </scroller>
      <div class="empty-page" v-if="message_list.length === 0">
        <div class="empty">
          <img src="../../assets/empty_page.png" alt="">
          <p class="font-10">暂未收到你的通知</p>
        </div>
      </div>
    </div>

    <!-- 预约，消费，核销消息详情 -->
    <div class="model" v-if="isShowDetail">
      <div class="box">
        <div class="content">
          <div class="title">
            <span class="font-16">{{detail.title}}</span>
            <div class="close" @click="closeModal"></div>
          </div>
          <div class="money-box">
            <p class="font-12 one">实付金额</p>
            <p class="font-30 two">￥{{detail.info.price}}</p>
          </div>
          <div class="height-auto">
            <div class="card-content">
              <div class="card-flex flex">
                <div class="card-label font-12">客户名称</div>
                <div class="card-text font-12">{{detail.info.name}}</div>
              </div>
              <!-- <div class="card-flex flex">
                <div class="card-label font-12">车牌号码</div>
                <div class="card-text font-12">陕A88888</div>
              </div> -->
              <div class="card-flex flex bottom-border">
                <div class="card-label font-12">车辆信息</div>
                <div class="card-text font-12">{{detail.info.vehicle}}</div>
              </div>

              <!-- 预约 -->
              <div class="card-flex flex" v-if='detail.type === "order_appoint"'>
                <div class="card-label font-12">预约时间</div>
                <div class="card-text font-12">{{detail.info.date}}</div>
              </div>
              <div class="card-flex flex bottom-border" v-if='detail.type === "order_appoint"'>
                <div class="card-label font-12">预约门店</div>
                <div class="card-text font-12">{{detail.info.store}}</div>
              </div>

              <div class="card-flex flex">
                <div class="card-label font-12">订单编号</div>
                <div class="card-text font-12">{{detail.info.order}}</div>
              </div>
              <div class="card-flex flex">
                <div class="card-label font-12">订单类型</div>
                <div class="card-text font-12">{{detail.info.type}}</div>
              </div>
              <div class="card-flex flex" v-if="detail.type === 'order_consume'">
                <div class="card-label font-12">消费时间</div>
                <div class="card-text font-12">{{detail.send_at}}</div>
              </div>

              <div class="card-flex flex" v-if="detail.type === 'order_verify'">
                <div class="card-label font-12">核销时间</div>
                <div class="card-text font-12">{{detail.info.date}}</div>
              </div>
            </div>

            <div class="card-content no-padding">
              <div class="card-flex">
                <div class="card-label font-12">订单内容</div>
                <div class="card-label-text">
                  <div class="card-text font-12 card-100" v-for='(info,index) in detail.info.content' :key='index'>
                    {{index+1}}、{{info}}
                    <!-- <span class="pull-right">&times; {{info | filterNum}}</span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "@/api/messageApi";
import ApiDia from "@/api/diagnosisApi";
import ApiCard from "@/api/cardApi";
import { ChangeDateTime } from "../article/DateTimes.js";
import AppConfig from "../../app.config.js";
export default {
  name: "MessageNotice",
  data() {
    return {
      navList: [
        {
          title: "全部",
          type: ""
        },
        {
          title: "系统",
          type: "system_notice"
        },
        {
          title: "注册",
          type: "small_register"
        },
        {
          title: "预约",
          type: "order_appoint"
        },
        {
          title: "核销",
          type: "order_verify"
        },
        {
          title: "消费",
          type: "order_consume"    // 订单消费
        },
        {
          title: "办卡",
          type: "card_transact"
        },
        {
          title: "充值",
          type: "card_recharge"
        },
      ],   //  内部员工的tab
      vip_nav_list: [
        {
          title: "全部",
          type: ""
        },
        {
          title: "系统",
          type: "system_notice"
        },
        {
          title: "注册",
          type: "small_register"
        },
        {
          title: "消费",
          type: "card_consume"   // 会员消费
        },
        {
          title: "办卡",
          type: "card_transact"
        },
        {
          title: "充值",
          type: "card_recharge"
        },
      ],   // vip的tab
      message_list: [],    // 消息列表
      activeIndex: 0,    // nav下标
      page: 1,
      pageSize: 10,
      showData: false,     // 控制列表
      type: "",     // nav的type值
      firstFinish: false,
      cardInfo: {},      // 用户信息
      memUid: "",     // 用户ID 
      memRoleId: null,
      isShowDetail: false,
      detail: {},
    };
  },
  methods: {
    /**
     * tab切换
     * index   对应的tab下标
     */
    switchTab(index) {
      if (index === this.activeIndex) {
        return
      }
      this.activeIndex = index
      this.page = 1
      this.pageSize = 10
      this.message_list = []
      this.showData = false
      if (this.memRoleId === 1 || this.memRoleId === 2) {
        this.type = this.vip_nav_list[index].type
      } else if (this.memRoleId === 3 || this.memRoleId === 4 || this.memRoleId === 5) {
        this.type = this.navList[index].type
      }     
      this.getList()
    },
    // 获取文章列表
    getList(done) {
      let _this = this;
      _this.$loading.show("加载中");
      Api.getArticleList({
        page: _this.page,
        pre_page: _this.pageSize,
        type: _this.type
      }).then(res => {
        if (res.code === 0) {
          _this.$loading.hide();
          if (res.data.meta) {
            if (res.data.meta.current_page == 1) {
              res.data.data.forEach(ele => {
                ele.send_at = ChangeDateTime(ele.send_at);
                ele.created_at = ChangeDateTime(ele.created_at);
              });
              _this.message_list = res.data.data;
              done && done();
            } else if (res.data.meta.current_page !== 1) {
              res.data.data.forEach(element => {
                element.send_at = ChangeDateTime(element.send_at);
                _this.message_list.push(element);
              });
              _this.$refs.myscroller.resize();
            }
            if (res.data.meta.current_page === res.data.meta.last_page) {
              _this.showData = true;
              done && done();
            } else {
              done && done();
            }
          }
        }
      });
    },
    // 去详情
    goDetail(item) {
      let id = item.id
      if (item.info.content_type == 1) {
        this.$router.push({
          name: "message-detail",
          query: {
            id: id
          }
        })
      } else if (item.info.content_type == 2) {
        window.open(item.info.content)
      }
    },
    // 上拉加载
    infinite(done) {
      let _this = this;
      if (_this.showData) {
        done(true);
        return;
      }
      _this.page++;
      _this.getList(done);
    },
    // 获取用户信息
    getQRCode: function() {
      let _this = this;
      _this.$loading.show("加载中");
      let params = {};
      if (!(AppConfig.user.member && AppConfig.user.member.memUid)) {
        params.memUid = _this.memUid;
      }
      ApiCard.getQRCode(params).then(
        function(data) {
          _this.$loading.hide();
          _this.firstFinish = true;
          if (data.data && data.code == 0 && data.status == 200) {
            _this.cardInfo = data.data;
          }
        },
        function(err) {
          _this.$loading.hide();
          _this.firstFinish = true;
          _this.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    async isLogin () {
      let _this = this
      _this.$loading.show("加载中")
      try {
        const {status, data, code} = await ApiDia.isLoginApi({})
        _this.$loading.hide();
        if (status === 200) {
          if (code === 0) {
            this.memRoleId = data.member_role.memRoleId
            this.getList()
          }
        }
      } catch (err) {
        _this.$loading.hide();
        _this.$router.replace({ path: "/error", query: { msg: err } });
      }
    },
    // 获取用户id
    getRequest() {
      var url = location.search; //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    // 展示详情模态框
    showModal(info) {
      this.detail = info
      this.isShowDetail = true
    },
    // 关闭详情模态框
    closeModal() {
      this.isShowDetail = false
    }

  },
  filters: {
    filterNum (value) {
      if (!value) return ''
      return value[value.indexOf('[数量') + 3]
    },
    filterStr (value) {
      if (!value) return ''
      return value.substring(0, value.indexOf('[数量'))
    },
  },
  created() {
    let _this = this;
    _this.urlQuery = _this.getRequest();
    if(
      AppConfig.user.hasOwnProperty("member") &&
      AppConfig.user.member.hasOwnProperty("memUid") &&
      AppConfig.user.member.memUid
    ) {
      _this.memUid = AppConfig.user.member.memUid;
    }
    if (_this.urlQuery.hasOwnProperty("memUid")) {
      _this.memUid = _this.urlQuery.memUid;
    }
    // _this.getQRCode();     // 3.8.5用户信息不做展示
    _this.isLogin()
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
@import "../../less/base/flex.less";

.message-notice {
  width: 100%;
  min-height: 100vh;
  background-color: #F7F8FA;
  overflow: hidden;
}
.message-header{
  padding: 0.4rem 0.3rem;
  background-color: #fff;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
  .message-avater{
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: gray;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .message-info{
    margin-left: 0.3rem;
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-start;
    height: 1rem;
    .message-name{
      font-weight: 600;
      color: #3D424C;
    }
    .message-job{
      color: #8A92A2;
    }
  }
}
.message-nav{
  position: relative;
  z-index: 1;
  padding: 0 0.3rem;
  background-color: #fff;
  width: 100%;
  height: 0.84rem;
  overflow-x: scroll;
  overflow-y: hidden;
  .message-nav-window{
    width: 11rem;
    position: absolute;
    z-index: 2;
  }
  .message-item{
    text-align: center;
    width: 0.67rem;
    // flex:0 0 auto;
    background-color: #fff;
    margin-right: 0.7rem;
    display: inline-block;
    color: #8A92A2;
    box-sizing: border-box;
    .message-item-text{
      padding: 0.17rem 0;
      display: inline-block;
      width: auto;
      height: 100%;
      border-bottom: 0.04rem solid #fff;
      color: #8A92A2;
      font-weight: 300;
    }
    &.active{
      .message-item-text{
        color: #3D424C;
        font-weight: 500;
        border-bottom: 0.04rem solid #5E7BFF;
      }
    }
  }
  .message-item:last-child{
    margin-right: 0;
  }
}
.message-list{
  padding: 0.3rem;
  .message-card{
    background-color: #fff;
    margin-top: 0.3rem;
    border-radius: 0.04rem;
    box-shadow: 0px 12px 32px 0px rgba(35,36,46,0.04);
    &:first-child{
      margin-top: 0.84rem;
    }
    .card-header{
      padding: 0.3rem;
      border-bottom: 1px solid #F0F0F0;
      justify-content: space-between;
      align-items: center;
      .card-header-title{
        color: #3D424C;
        font-weight: 600;
      }
      .card-header-time{
        color: #424751;
      }
      .card-header-detail{
        color: #8A92A2;
        span{
          margin-right: 10/100rem;
        }
        img{
          width: 10/100rem;
          height: 20/100rem;
        }
      }
    }
  }
  .card-moeny{
    color: #D42E12 !important;
  }
  .announcement{
    width: 100%;
    height: auto;
    border-radius: 0.06rem;
    overflow: hidden;
    .announcement-header{
      width: 100%;
      height: 3.85rem;
      position: relative;
      .thumb{
        width: 100%;
        height: 100%;
      }
      .set-top{
        width: 0.72rem;
        height: 0.36rem;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .announcement-text{
      padding: 0.2rem 0.3rem;
      .announcement-title{
        color: #3D424C;
      }
      .announcement-time{
        color: #8A92A2;
        margin-top: 0.2rem;
      }
    }
  }
}
.card-content{
  padding: 0.2rem 0.3rem;
  .card-flex{
    justify-content: space-between;
    align-items: flex-start;
    line-height: 0.7rem;
    .card-label{
      color: #3D424C;
      width: 1.5rem;
    }
    .card-text{
      color: #8A92A2;
      max-width: 4.8rem;
      word-break: break-all;
    }
    .card-100{
      width: 100%;
    }
    .card-label-text{
      line-height: 0.55rem;
    }
    .color-red{
      color: #DD1D21;
    }
  }
  .card-postion{
    position: relative;
    padding-top: 0.15rem;
  }
  .card-postion:after{
    content: '';
    position: absolute;
    left: -30/100rem;
    top: 0;
    height: 1px;
    width: 690/100rem;
    background-color: #F0F0F0;
  }
  .bottom-border{
    position: relative;
  }
  .bottom-border:after{
    content: '';
    position: absolute;
    left: -30/100rem;
    bottom: 0;
    height: 1px;
    width: 690/100rem;
    background-color: #F0F0F0;
  }
}
.no-padding {
  padding: 30/100rem 30/100rem 20/100rem 30/100rem;
  background: #F7F7F7;
  max-height: 260/100rem;
  overflow-y: auto;
  .card-flex{
    .card-text{
      color: #8A92A2;
      max-width: 6.9rem;
      word-break: break-all;
    }
  }
}
.height-auto{
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}
.empty-page{
  background-color: #F7F8FA;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  .empty{
    img{
      width: 2.4rem;
      height: 2.4rem;
    }
    p{
      text-align: center;
    }
  }
}
._v-container>._v-content{
  padding-bottom: 1.7rem;
}
// 模态框
.model{
  width: 100%;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  .box{
    width: 100%;
    height: 100vh;
    position: relative;
    .content{
      width: 690/100rem;
      height: auto;
      background-color: #fff;
      position: absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      .title{
        height: 114/100rem;
        line-height: 114/100rem;
        width: 100%;
        font-weight: 600;
        color: #3D424C;
        text-align: center;
        position: relative;
        .close{
          width: 114/100rem;
          height: 114/100rem;
          position: absolute;
          top: 0;
          right: 0;
          background: url('../../assets/message-close.svg') no-repeat center;
        }
      }
      .money-box{
        width: 100%;
        height: 186/100rem;
        background: url(../../assets/money-box.svg) no-repeat center;
        .one{
          text-align: center;
          line-height: 1;
          padding-top: 40/100rem;
          padding-bottom: 14/100rem;
          color: #FFFFFF;
        }
        .two{
          line-height: 1;
          font-weight:500;
          color: #FFFFFF;
          text-align: center;
        }
      }
    }
  }
}
</style>
