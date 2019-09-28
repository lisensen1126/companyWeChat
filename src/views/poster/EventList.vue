<template>
  <div class="event-list font-PC-re font-12">
    <!-- 列表 -->
    <div class="list-box">
      <scroller ref="myscroller" :on-infinite="infinite" v-if="list.length && list.length > 0">
        <div class="list">
          <template v-for="(item,index) in list">
            <div class="list-item" :key="index" @click="goDetail(item)">
              <img class="back-pic" :src="item.cover">
              <div class="right-content">
                <div class="item-title">{{item.title}}</div>
                <div class="item-content">{{item.description}}</div>
              </div>
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
  name: "event-list",
  data() {
    return {
      page: 1,
      pageSize: 20,
      showData: false,
      init: false,
      list: [], // 活动列表
      tabState: 1,
      poster_id: this.$route.query.poster_id
    }
  },
  methods: {
    /**
     * 去海报详情
     * item {object}
     */
    goDetail(item) {
      let self = this
      this.$router.push({
        name: "poster-detail",
        query: {
          type: 4,
          id: item.id,
          title: item.title,
          poster_id: self.poster_id,
          cover: item.cover,
          content_type: item.shop_id === 0 ? 1 : 2
        }
      })
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
      Api.getArticleList({
        page: t.page,
        pre_page: t.pageSize
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          t.$loading.hide()
          if (res.data.meta) {
            if (res.data.meta.current_page == 1) {
              t.list = res.data.data
              done && done()
            } else if (res.data.meta.current_page !== 1) {
              res.data.data.forEach(element => {
                t.list.push(element);
              });
              t.$refs.myscroller.resize()
            }
            if (res.data.meta.current_page == res.data.meta.last_pages) {
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
.event-list {
  background: white;
  .list-box {
    width: 100%;
    min-height: 100vh;
    position: relative;
    .list {
      padding-left: 0.3rem;
      .list-item {
        width: 100%;
        border-bottom: 0.02rem #eeeeee solid;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0.3rem;
        padding-left: 0;
        font-size: 0;
        .back-pic {
          width: 2.4rem;
          height: 1.6rem;
        }
        .right-content {
          width: 4.2rem;
          height: 1.6rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .item-title {
            color: #333333;
            width: 4.2rem;
            font-weight: bold;
            font-size: 0.28rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* number of lines to show */
            -webkit-box-orient: vertical;
          }
          .item-content {
            width: 4.2rem;
            color: #a6a6a6;
            line-height: 0.36rem;
            font-size: 0.24rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* number of lines to show */
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
}
</style>
