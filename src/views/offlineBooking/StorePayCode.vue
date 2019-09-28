<template>
  <div class="index" v-if="page_init">
    <div class="store-name font-15">{{store_name}}</div>
    <div class="code-centent">
      <img class="code-img" :src="store_code" alt="">
      <p class="font-14">微信扫描二维码付款</p>
      <div class="down font-14" @click="showCode">保存收款码</div>
    </div>

    <!-- 收款记录 -->
    <div class="list">
      <div class="title clearfix" v-if="list.list && list.list.length > 0">
        <div class="font-16 pull-left">收款总计</div>
        <div class="font-16 pull-right">￥{{list.total_amount / 100}}</div>
      </div>

      <div class="list-item" v-if="list.list && list.list.length > 0" v-for="(item, index) in list.list" :key="index">
        <div class="pull-left user-name font-14">
          <img :src="item.avatar" alt="">
          {{item.nick_name}}
        </div>
        <div class="pull-right price-num font-14">
          <div class="total">¥{{item.final_amount / 100}}</div>
          <div class="coupon font-12">优惠<span>￥{{item.preferential_price / 100}}</span></div>
        </div>
      </div>

      <div class="font-12 tips" v-if="list.list && list.list.length > 0">
        —— 更多收款可在收款记录查看 ——
      </div>

    </div>

    <!-- 收款码下载弹框 -->
    <div class="model" v-if="is_show" @click.self="closeCode">
      <div class="content">
        <div class="code-info" id="targetDom" v-if="img_url == ''">
          <div class="code-top">
            <p class="title font-16">微信扫码买单</p>
            <p class="tips font-10">支持信用卡</p>
            <div class="image">
              <img class="code-img" :src="store_code" alt="">
            </div>
            <p class="store-name font-12">{{store_name}}</p>
            <ul class="font-12 clearfix line">
              <li class="first pull-left">①微信扫码</li>
              <li class="second pull-left">②输入金额</li>
              <li class="third pull-left">③确认支付</li>
            </ul>
            
          </div>
          <p class="vm font-14">壳保养智慧收银</p>
          <p class="vn font-10">壳保养<span>·</span>真智慧<span>·</span>惠收银</p>
          <p class="address font-10">技术支持：畅移（上海）信息科技有限公司</p>
          <p class="phone font-10">400 860 6961</p>
        </div>
        <img v-if="img_url != ''" :src="img_url" class="code-info img-code" >
      </div>
    </div>

    <!-- 首次引导 -->
    <div class="yindao" v-if="is_first && is_show">
      <img src="../../assets/application/yidao.png" alt="">
      <div class="stop"></div>
      <div class="subbtn font-16" @click.stop="colseFrist">我知道了</div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/offlineBookingApi";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      img_url: '',
      store_code: '',
      store_name: '',
      is_show: false,
      is_first: false,     // 是否是员工首次生成二维码
      list: {
        total_amount: 0,
        list: [],
      },
      time_out: null,
      page_init: false,
    };
  },
  methods: {
    // 显示模态框，生成图片
    showCode () {
      let self = this;
      self.is_show = true
      if (self.img_url != '') return      // 如果图片已经生成，终止以下代码
      self.$loading.show("加载中");
      Api.getReadyApi().then(
        res =>{
          if (res.code === 0) {
            console.log(res.data)
            self.$loading.hide();
            if (res.data.is_first == 1) {
              self.is_first = true
            } else {
              self.createImg()
            }
          } else {
            self.$loading.hide();
            self.$router.replace({ path: "/error", query: {msg: res.message}});
          }
        },
        err =>{
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      ); 
    },

    // 生成图片
    createImg () {
      let self = this
      self.$loading.show("生成图片中");
      setTimeout(() =>{
        html2canvas(document.querySelector('#targetDom'), {useCORS: true, scale: 3})
        .then(canvas => {
          canvas.className = 'canvas'
          let data_url = canvas.toDataURL('image/png')
          self.img_url = data_url
          self.$loading.hide();
        })
      }, 2000);
    },

    // 关闭首次引导弹框
    colseFrist () {
      this.is_first = false
      this.createImg()
    },

    // 关闭二维码弹框
    closeCode () {
      this.is_show = false
    },

    // 获取门店收款二维码  getStoreCodeApi
    fetchCode () {
      let self = this;
      self.$loading.show("加载中");
      Api.getStoreCodeApi().then(
        res =>{
          if (res.code === 0) {
            self.$loading.hide()
            self.store_code = res.data.image
            self.store_name = res.data.store_name
            self.page_init = true
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

    // 获取支付成功列表
    fetchPayList () {
      let self = this;
      Api.getPayListApi({order_type: 6}).then(
        res =>{
          if (res.code === 0) {
            self.list = res.data
            self.time_out = setTimeout(() =>{
              self.fetchPayList()
            }, 10000)
          } else {
            // self.$router.replace({ path: "/error", query: {msg: res.message}})
            console.error('支付成功列表', res.message)
          }
        },
        err =>{
          console.error('支付成功列表', err)
        }
      )
    }
  },

  mounted() {
    this.fetchCode()
    this.fetchPayList()
  },
  beforeDestroy () {
    clearInterval(this.time_out)
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  width: 100%;
  min-height: 100vh;
  background-color: #F7F8FA;
  .store-name{
    padding: 50/100rem 0;
    text-align: center;
    font-weight: bold;
  }
  .code-centent{
    box-sizing: border-box;
    width: 690/100rem;
    margin-left: 30/100rem;
    padding-top: 80/100rem;
    background-color: #ffffff;
    padding-bottom: 60/100rem;
    .code-img{
      width: 300/100rem;
      height: 300/100rem;
      margin-left: 196/100rem;
    }
    p{
      color: #000;
      font-weight: bold;
      padding-left: 240/100rem;
      background: url('../../assets/application/wxpay.png') no-repeat center;
      background-size: 32/100rem 28/100rem;
      background-position-x: 200/100rem;
      margin-top: 60/100rem;
      line-height: 1;
    }
    .down{
      width: 610/100rem;
      height: 76/100rem;
      line-height: 76/100rem;
      border: 1px solid #5E7BFF;
      margin: 0 auto;
      border-radius: 76/100rem;
      margin-top: 60/100rem;
      color: #5E7BFF;
      background: url('../../assets/application/down.png') no-repeat center;
      background-size: 22/100rem 24/100rem;
      background-position-x: 218/100rem;
      padding-left: 250/100rem;
    }
  }
  .list{
    margin-top: 30/100rem;
    padding-bottom: 30/100rem;
    .title{
      padding: 40/100rem 30/100rem;
      color: #000;
      background-color: #ffffff;
    }
    .list-item{
      width: 100%;
      height: 160/100rem;
      padding: 0 30/100rem;
      position: relative;
      background-color: #ffffff;
      img{
        width: 88/100rem;
        height: 88/100rem;
        margin-right: 16/100rem;
        vertical-align: middle;
      }
      .user-name{
        line-height: 160/100rem;
        color: #2C3039;
        max-width: 480/100rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .price-num{
        text-align: right;
        .total{
          padding-top: 40/100rem;
          color: #8A92A2;
        }
        .coupon{
          padding-top: 20/100rem;
          color: #8A92A2;
          span{
            color: #DD1D21;
          }
        }
      }
    }
    .list-item:after{
      content: '';
      position: absolute;
      left: 30/100rem;
      top: 0;
      height: 1px;
      width: 690/100rem;
      background-color: #EEEEEE;
    }
    .tips{
      text-align: center;
      color: #8A92A2;
      margin-top: 40/100rem;
    }
  }
  .model{
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
    .content{
      width: 568/100rem;
      height: 906/100rem;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      background-color: #ffffff;
    }
    .code-info{
      width: 100%;
      height: 100%;
      .code-top{
        height: 656/100rem;
        background-color: #009169;
        .title{
          line-height: 53/100rem;
          font-weight: bold;
          text-align: center;
          padding-top: 40/100rem;
          color: #ffffff;
        }
        .tips{
          line-height: 29/100rem;
          text-align: center;
          padding-top: 4/100rem;
          color: #ffffff;
        }
        .image{
          width: 342/100rem;
          height: 342/100rem;
          padding: 12/100rem;
          background-color: #ffffff;
          margin: 0 auto;
          margin-top: 22/100rem;
        }
        .code-img{
          width: 318/100rem;
          height: 318/100rem;
        }
        .store-name{
          font-weight: 400;
          line-height: 34/100rem;
          text-align: center;
          padding-top: 16/100rem;
          padding-bottom: 0;
          color: #ffffff;
        }
        .line{
          display: flex;
          justify-content: space-around;
          margin: 0 auto;
          padding-top: 36/100rem;
          color: #ffffff;
        }
        
      }
    }
    .vm{
      line-height: 38/100rem;
      padding-top: 50/100rem;
      color: #353535;
      text-align: center;
    }
    .vn{
      line-height: 26/100rem;
      padding-top: 16/100rem;
      color: #353535;
      text-align: center;
      span{
        margin: 0 16/100rem;
      }
    }
    .address{
      color: #A6A6A6;
      padding-top: 44/100rem;
      text-align: center;
    }
    .phone{
      color: #A6A6A6;
      text-align: center;
    }
  }
  // 引导
  .yindao{
    width: 100%;
    min-height: 100vh;
    padding-top: 52/100rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0,0,0,.7);
    img{
      width: 588/100rem;
      height: 900/100rem;
      margin-left: 0.86rem;
    }
    .stop{
      width: 100%;
      height: 1008/100rem;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 11;
      background-color: transparent;
    }
    .subbtn{
      width: 336/100rem;
      height: 78/100rem;
      line-height: 78/100rem;
      text-align: center;
      color: #ffffff;
      border: 1px solid #fff;
      border-radius: 0;
      margin-top: 108/100rem;
      margin-left: 208/100rem;
    }
  }
}
</style>
