<template>
  <div class="list">
    <!-- 有数据 -->
    <scroller :on-infinite="infinite"
              ref="my_scroller"
              v-if="infoList.length && infoList.length > 0">
      <ul :style="{paddingTop: paddingTop/100 + 'rem'}">
        <li v-for="(item, index) in infoList"
            :key="index"
            @click="goDetail(item)">
          <itembox :item="item"></itembox>
        </li>
      </ul>
    </scroller>
    <!-- 没有数据 -->
    <default-page picture="nodata"
                  text="暂无企业客户"
                  v-if="!infoList.length"></default-page>
  </div>
</template>

<script>
import itembox from "./listItem";
import Api from "../api/coustomerApi";
import defaultPage from "./default";

export default {
  name: "list",
  props: {
    apiName: String,
    paddingTop: {
      type: String,
      default: "0"
    }
  },
  components: {
    itembox,
    defaultPage
  },
  data() {
    return {
      infoList: [],
      keyWord: "",
      page: "1",
      per_page: "15",
      params: null
    };
  },
  methods: {
    getListInfo: async function(done) {
      let self = this;
      try {
        const { status, data } = await Api[self.apiName]({
          page: self.page,
          per_page: self.per_page,
          ...self.params
        });

        if (status !== 200) {
          return false;
        }

        // 没有数据
        if (data.data && data.data.length == 0) {
          done(true);
          return false;
        }

        // 有数据
        if (self.params && self.params.user_name) {
          self.infoList = data.data;
        } else {
          data.data.forEach(item => {
            self.infoList.push(item);
          });
        }

        // 最后一页
        if (data.data.length < Number(self.per_page)) {
          done(true);
          return false;
        }
        self.$refs.myscroller.resize();
        done();
      } catch (err) {
        console.log("err", err);
        done();
      }
    },
    // 上拉刷新
    infinite(done) {
      let self = this;
      self.page++;
      self.getListInfo(done);
    },
    // 外部调用
    search(obj = {}) {
      let self = this;
      self.page = 1;
      self.params = obj;
      self.infoList = [];
      self.getListInfo(me => me);
    },
    goDetail(item) {
      this.$emit("clickItem", item);
    }
  }
};
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: 100vh;
  ul {
    li {
      padding-left: 0.3rem;
    }
  }
  .list_default {
    width: 100%;
    height: 100vh;
    background: #fff;
    text-align: center;
    padding-top: 3rem;
    box-sizing: border-box;
    img {
      width: 2.56rem;
      height: 1.72rem;
      margin-right: 0.48rem;
    }
    p {
      padding-top: 13px;
      font-size: 14px;
      color: #b2b2b2;
    }
  }
}
</style>
