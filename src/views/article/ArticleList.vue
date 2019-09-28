<template>
  <div class="articleList font-PC-re">
    <scroller ref="myscroller" :on-infinite="infinite" v-if="artList.length && artList.length > 0">
      <template v-for="(item,index) in artList">
        <div class="list-item flex p-a-40" :key="index" @click="goItem(item)">
          <div class="item-left">
            <div
              class="item-title font-16"
              :class="item.read_status? 'gray-8a' : 'black-33' "
            >{{item.title}}</div>
            <div class="font-12 font-PC-lg gray-8a line-height-1 m-t-28">{{item.created_at}}</div>
          </div>
          <div
            class="item-right"
            :style="{'background-image':'url('+item.cover+')','background-size':'contain',
    'background-position-x':'center','background-position-y':'center'}"
          ></div>
        </div>
      </template>
    </scroller>
  </div>
</template>
<script>
import ListPage from "../../components/artList.vue"
// import temporaryPictures from "../../assets/avatar.jpeg";
import defaultHeader from "../../assets/default_header.png"
import { dateTime } from "./DateTimes.js"
import Api from "../../api/articleApi.js"
export default {
  name: "test",
  components: {
    ListPage
  },
  data() {
    return {
      artList: [],
      nowTime: "",
      defaultHeader: defaultHeader,
      page: 1,
      pageSize: 10,
      showData: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取文章列表
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
              res.data.data.forEach(ele => {
                ele.created_at = dateTime(ele.created_at)
              })
              t.artList = res.data.data
              done && done()
            } else if (res.data.meta.current_page !== 1) {
              res.data.data.forEach(element => {
                element.created_at = dateTime(element.created_at)
                t.artList.push(element)
              })
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
    },
    // 上拉加载
    infinite(done) {
      let self = this
      console.log(self.showData)
      if (self.showData) {
        done(true)
        return
      }
      self.page++
      self.getList(done)
    },
    // 下拉刷新
    refresh() {
      let self = this
      self.page = 1
    },
    goItem(data) {
      this.$router.push({
        path: "/article-detail",
        query: { id: data.id }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import "../../less/base/padding.less";
@import "../../less/base/flex.less";
.articleList {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  .list-item {
    overflow: hidden;
    border-bottom: 1px solid #eceef3;
    .item-left {
      width: 4.4rem;
      margin-right: 0.28rem;
      .item-title {
        height: 0.96rem;
        line-height: 0.48rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .item-right {
      width: 2rem;
      height: 1.6rem;
      overflow: hidden;
      background-color: transparent;
      background-repeat: no-repeat;
    }
    &:after {
      .Pseudo-border-after(#f0f0f0);
    }
  }
  :last-child {
    &:after {
      height: 0;
    }
  }
  .left30 {
    padding-right: 0;
    &:after {
      left: 0.3rem;
      right: 0.3rem;
    }
  }
}
</style>
