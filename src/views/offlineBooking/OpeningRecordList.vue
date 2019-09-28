<template>
  <div class="index">

    <div v-if="page_init && list.length > 0">
      <div v-for="(item,index) in list" :key="index">
        <div class="list" :key="index" >
          <div class="title">
            <div class="left pull-left font-14">{{item.date}}</div>
            <div class="right pull-right font-14" v-if="index == 0" @click.stop="goSarch">指定日期</div>
          </div>
          <div class="list-item" v-for="(info, index) in item.list" :key="index" @click="goDetail(info)">
            <div class="top">
              <div class="left font-14 pull-left">
                <img :src="info.avatar || 'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png'" alt="">
                {{info.nick_name || '--'}}
              </div>
              <div class="right font-16 pull-right">
                ￥{{info.final_amount / 100}}
              </div>
            </div>
            <div class="bottom font-12">{{info.order_content}}</div>
          </div>
        </div>
      </div>
      <div class="tips font-12">—— 以上是全部收款记录 ——</div>
    </div>

    <div class="empty-page" v-if="page_init && list.length == 0">
      <div class="empty">
        <img src="../../assets/empty_page.png" alt="">
        <p class="font-10">暂无您的开单记录~</p>
      </div>
    </div>


  </div>
</template>
<script>
import Api from '../../api/offlineBookingApi';
export default {
  data() {
    return {
      list: [],
      page_init: false,
    };
  },
  methods: {
    goSarch () {
      this.$router.push({
        name: 'OpeningRecordSearch'
      })
    },

    // 获取列表
    fetchList () {
      let self = this;
      self.$loading.show('加载中')
      Api.getOrderListApi({data_type: 1}).then(
        res => {
          self.$loading.hide();
          if (res.code === 0) {
            self.$loading.hide()
            self.list = res.data
            self.page_init = true
          } else {
            self.$loading.hide()
            self.$router.replace({ path: "/error", query: {msg: res.message}})
          }
        },
        err => {
          self.$loading.hide()
          self.$router.replace({ path: "/error", query: { msg: err } })
        }
      )
    },

    // 去详情
    goDetail (id) {
      this.$router.push({
        name: 'OpeningRecordDetail',
        query: {
          id: id.trade_order_no
        }
      })
    },
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
  min-height: 100vh;
  background-color: #F7F8FA;
  .list{
    min-height: 294/100rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 30/100rem;
    .title{
      height: 92/100rem;
      width: 100%;
      padding-top: 40/100rem;
      line-height: 1;
      .left{
        font-weight: bold;
        color: #3D424C;
      }
      .right{
        color: #5E7BFF;
        font-weight: 500;
        padding-right: 38/100rem;
        background: url('../../assets/application/dataily.png') right 50% no-repeat;
        // background-position-x: 140/100rem;
        background-size: 28/100rem;
      }
    }
    .list-item{
      width: 100%;
      height: 202/100rem;
      background-color: #ffffff;
      box-shadow:0 12/100rem 32/100rem 0 rgba(35,36,46,0.04);
      border-radius: 4/100rem;
      padding: 40/100rem 30/100rem 30/100rem 30/100rem;
      position: relative;
      .top{
        width: 100%;
        height: 80/100rem;
        .left{
          img{
            width: 80/100rem;
            height: 80/100rem;
            vertical-align: middle;
            border-radius: 100%;
            margin-right: 18/100rem;
          }
          max-width: 420/100rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .right{
          line-height: 1;
          padding-top: 46/100rem;
          padding-right: 26/100rem;
          background: url('../../assets/arrow_right2.png') no-repeat right;
          background-size: 10/100rem 20/100rem;
          background-position-y: 54/100rem;
        }
      }
      .bottom{
        color: #8A92A2;
        padding-top: 14/100rem;
        width: 386/100rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .list-item:before{
      content: " ";
      position: absolute;
      left: 30/100rem;
      bottom: 0;
      height: 1px;
      width: 630/100rem;
      background-color: #F0F0F0;
    }
  }
  .tips{
    color: #8A92A2;
    padding-top: 40/100rem;
    text-align: center;
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
}
</style>
