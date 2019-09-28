<template>
  <div class="operation-support" :class="artList.length == 0 ? 'active' : ''">
    <div class="tool-banner">
      <img src="../../assets/application/operation-support.png">
    </div>
    <div class="support-tab">
      <div
        class="support-tab-item font-14"
        :class="tabState === 1 ? 'active' : ''"
        @click="changeCurrent(1)"
      >专业培训</div>
      <div
        class="support-tab-item font-14"
        :class="tabState === 2 ? 'active' : ''"
        @click="changeCurrent(2)"
      >案例分享</div>
      <div
        class="support-tab-item font-14"
        :class="tabState === 3 ? 'active' : ''"
        @click="changeCurrent(3)"
      >促销通知</div>
    </div>
    <div class="support-list" v-if="artList.length !== 0">
      <div
        class="support-item"
        v-for="(item, index) of artList"
        :key="index"
        @click="goDetail(item.id)"
      >
        <div class="item-thumb">
          <img :src="item.cover" alt="">
        </div>
        <div class="item-content">
          <div class="item-title font-14" v-text="item.name">这是一封年会的邀请函，请查收</div>
          <div class="item-text font-10" v-text="item.description">喜迎新春，公司也迎来了一年一度的年会，本次年会我们…</div>
          <div class="item-time font-10" v-text="item.open_time">2019年1月12日 16:30</div>
        </div>
      </div>
    </div>
    <!-- 没有数据 -->
    <default-page picture="nodata" :text="noDataText" v-if="artList.length === 0"></default-page>
  </div>
</template>
<script>
import Api from "@/api/operationSupport.js"
import defaultPage from "../../components/default"
export default {
  name: "operationSupport",
  components: {
    defaultPage
  },
  data() {
    return {
      tabState: 1,
      artList: [],
      noDataText: "暂无数据"
    }
  },
  methods: {
    // 获取列表数据
    getList(done) {
      let _this = this
      _this.$loading.show("加载中")
      Api.getBrandArticleListApi({
        page: _this.page,
        per_page: 100000,
        type: _this.tabState
      }).then(res => {
        _this.$loading.hide()
        if (res.code === 0) {
          res.data.data.map(item => {
            item.open_time = _this.formartDate1("yyyy-MM-dd hh:mm:ss", item.open_time)
          })
          _this.artList = res.data.data
        }
      })
    },
    // tab切换
    changeCurrent(current) {
      this.tabState = Number(current)
      this.getList()
    },
    // 去详情
    goDetail(id) {
      this.$router.push({
        name: "support-detail",
        query: {
          id: id
        }
      })
    },
    // 时间格式化
    formartDate1(fmt, date) {
      if ((date + "").length === 10) {
        date = new Date(Number(date) * 1000)
      } else {
        date = new Date(Number(date))
      }
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
      return fmt
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
.operation-support.active {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.tool-banner {
  width: 100%;
  height: 3rem;
  img{
    width: 100%;
    height: 100%;
  }
}
.support-tab {
  width: 100%;
  height: 0.96rem;
  background: #fff;
  display: flex;
  justify-content: space-between;
  line-height: 0.96rem;
  padding: 0 0.8rem;
  box-sizing: border-box;
  .support-tab-item {
    min-width: 1.28rem;
    height: 100%;
    line-height: 0.96rem;
    color: #3d424c;
    font-weight: bold;
    position: relative;
    &.active {
      &:after {
        content: "";
        display: block;
        width: 0.62rem;
        height: 0.1rem;
        position: absolute;
        left: 46%;
        transform: translateX(-50%);
        bottom: 0;
        background: #4b77b0;
      }
    }
  }
}
.support-list {
  padding: 0.3rem;
  .support-item {
    background: #fff;
    width: 100%;
    margin-bottom: 0.15rem;
    .item-thumb {
      width: 100%;
      height: 3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item-content {
      padding: 0.3rem;
    }
    .item-title {
      color: #3d424c;
      font-weight: 400;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-text {
      color: #3d424c;
      font-weight: 400;
      line-height: 0.25rem;
      margin-top: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-time {
      color: #8a92a2;
      font-weight: 400;
      line-height: 1;
      margin-top: 0.2rem;
    }
  }
}
</style>
