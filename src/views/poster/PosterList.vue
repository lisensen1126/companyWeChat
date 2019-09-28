<template>
  <div class="poster-list font-PC-re font-12">
    <!-- 导航 -->
    <div class="header">
      <div class="tab">
        <div
          class="left font-13"
          :class="{'active': item.id == tabState}"
          v-for="(item, index) in tabList"
          @click="tabClick(item)"
          :key="index"
        >
          {{item.name}}
          <span></span>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list-box">
      <scroller ref="myscroller" :on-infinite="infinite" v-if="list.length && list.length > 0">
        <div class="list">
          <template v-for="(item,index) in list">
            <div
              class="list-item"
              :class="{'left-item': index % 2 == 0}"
              :key="index"
              @click="goDetail(item)"
            >
              <img v-if="tabState != '0'" class="back-pic" :src="item.cover + '?imageView2/1/w/165/h/234/q/60'">
              <img v-if="tabState == '0'" class="back-pic" :src="item.image_url + '?imageView2/1/w/165/h/234/q/60'">
              <div class="item-name font-12">{{item.name}}</div>
            </div>
          </template>
        </div>
      </scroller>
      <div class="empty" v-if="list.length === 0 && init">
        <span class="font-12">暂无数据～</span>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/articleApi.js"
export default {
  name: "poster-list",
  data() {
    return {
      page: 1,
      pageSize: 20,
      showData: false,
      init: false,
      list: [], // 海报列表
      tabList: [
        {
          name: "活动海报",
          id: 4
        },
        {
          name: "宣传海报",
          id: 0
        },
        {
          name: "节日海报",
          id: 6
        },
        {
          name: "门店海报",
          id: 3
        }
      ],
      tabState: 4
    }
  },
  methods: {
    goDetail(item) {
      if (this.tabState == '0') {
        this.$router.push({
          name: "poster-detail",
          query: {
            type: 0,
            url: item.image_url,
          }
        })
      } else {
        if (item.type === 4) {
          this.$router.push({
            name: "event-list",
            query: {
              poster_id: item.id
            }
          })
        } else {
          this.$router.push({
            name: "poster-detail",
            query: {
              type: item.type,
              poster_id: item.id
            }
          })
        }
      }
    },
    tabClick(params) {
      this.init = false
      this.tabState = params.id
      this.list = []
      this.page = 1
      this.showData = false
      this.pageSize = 20
      if (params.id == '0') {
        this.getMaterialPosterList()
      } else {
        this.getList()
      }
    },
    // 上拉加载
    infinite(done) {
      if (this.showData) {
        done(true)
        return
      }
      this.page++
      this.getList(done)
    },
    getList(done) {
      let t = this
      t.$loading.show("加载中")
      Api.getPosterList({
        page: t.page,
        size: t.pageSize,
        type: t.tabState
      }).then(res => {
        if (res.code === 0) {
          t.$loading.hide()
          t.init = true
          if (res.meta) {
            if (res.meta.current_page == 1) {
              t.list = res.data
              done && done()
            } else if (res.meta.current_page !== 1) {
              res.data.data.forEach(element => {
                t.list.push(element);
              });
              t.$refs.myscroller.resize()
            }
            if (res.meta.current_page == res.meta.last_page) {
              t.showData = true
              done && done()
            } else {
              done && done()
            }
          }
        }
      })
    },
    getMaterialPosterList(done) {
      let t = this
      t.$loading.show("加载中")
      Api.getMaterialPosterListApi({
        page: t.page,
        size: t.pageSize,
      }).then(res => {
        if (res.code === 0) {
          t.$loading.hide()
          t.init = true
          if (res.meta) {
            if (res.meta.current_page == 1) {
              t.list = res.data
              done && done()
            } else if (res.meta.current_page !== 1) {
              res.data.data.forEach(element => {
                t.list.push(element);
              });
              t.$refs.myscroller.resize()
            }
            if (res.meta.current_page == res.meta.last_page) {
              t.showData = true
              done && done()
            } else {
              done && done()
            }
          }
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/report-common.less";
.poster-list {
  .header {
    width: 100%;
    height: 0.96rem;
    background-color: #ffffff;
    border-top: 0.01rem solid transparent;
    .tab {
      width: 100%;
      height: 0.96rem;
      color: #8a92a2;
      font-weight: 400;
      .left {
        width: 25%;
        height: 0.96rem;
        line-height: 0.96rem;
        text-align: center;
        font-weight: bold;
        float: left;
        position: relative;
        span {
          width: 0.36rem;
          height: 0.04rem;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          background-color: transparent;
        }
      }
      .active {
        color: #3d424c;
        span {
          background-color: #5e7bff;
        }
      }
    }
  }
  .list-box {
    width: 100%;
    min-height: 90vh;
    position: relative;
    .list {
      padding: 0.4rem 0.3rem;
      .list-item {
        display: inline-block;
        width: 3.3rem;
        height: 4.68rem;
        margin-bottom: 0.3rem;
        position: relative;
        .back-pic {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .item-name {
          width: 100%;
          height: 0.76rem;
          line-height: 0.76rem;
          color: #ffffff;
          background: #5e7bff;
          text-align: center;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .icon-type {
          width: 0.82rem;
          height: 0.46rem;
          position: absolute;
          right: -0.1rem;
          top: 0.2rem;
        }
      }
      .left-item {
        margin-right: 0.3rem;
      }
    }
  }
}
.empty{
    width: 100%;
    height: 576/100rem;
    background: url("../../assets/img-empty.png") no-repeat center;
    background-size: 240/100rem;
    background-position-y: 280/100rem;
    span{
      display: block;
      text-align: center;
      padding-top: 550/100rem;
      color: #3E434D;
    }
  }
</style>
