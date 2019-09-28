<template>
	<div class="rank" v-if="currentStore.store_id">
    <div class="address clearfix" @click="goStore(currentStore.store_id)">
      <div class="left pull-left"></div>
      <div class="right pull-left">
        <div class="_top font-14">{{currentStore.store_name}}</div>
        <div class="_bottom font-12">{{currentStore.province_name}}{{currentStore.city_name}}{{currentStore.district_name}}{{currentStore.address}}</div>
      </div>
    </div>
		<!-- 没有数据 -->
		<default-page picture="nodata"
		              :text="noDataText"
		              v-if="isShowdefualt">
		</default-page>
		<scroller :on-infinite="infinite"
		          ref="myScroller"
              style="top: 1.22rem"
		          v-if="rankList.length && rankList.length > 0">
			<div class="cover"
			     v-bind:style="{ 'background-image':'url('+firstInfo.memFace+')','background-size':'cover',
    'background-position-x':'center','background-position-y':'center'}" v-if="firstInfo.memFace && firstInfo.memFace!==''"></div>
      <div class="cover"
			     v-bind:style="{ 'background-image':'url('+defaultImg+')','background-size':'cover',
    'background-position-x':'center','background-position-y':'center'}" v-if="firstInfo.memFace && firstInfo.memFace===''"></div>
			<div class="me m-t-30 m-b-30" v-if="myInfo">
					 	<div class="order">
						<span class="m-l-44  font-Fu-Bo"
						      v-bind:class="{'m-r-30':myInfo.rank < 9,'m-r-15':myInfo.rank >= 9}">{{myInfo.rank}}</span>
					</div>
				<div class="avat-box">
					<img class="avat"
					     :src="myInfo.memFace?myInfo.memFace:defaultHeader"
					     alt="">
				</div>
				<div class="info font-PC-re ">
					<div class="name m-b-10">
						<p class="ellipsis">{{myInfo.memUsername}}</p>
					</div>
					<div class="occup font-PC-re">
						<p class="ellipsis">{{myInfo.memJob}}</p>
					</div>
				</div>
				<div class="prase">
					<img :src="prase"
					     alt="">
					<div class="num">
						<span class="font-Fu-Bo">{{myInfo.recommend_num}}</span>
					</div>
				</div>
			</div>
			<template v-for="(item,index) in rankList">
				<div class="rank-list"
				     :key="index">
					<div class="order">
						<img :src=first
						     class="m-l-30"
						     alt=""
						     v-if="index == 0">
						<img :src=second
						     class="m-l-30"
						     alt=""
						     v-if="index == 1">
						<img :src=third
						     class="m-l-30"
						     alt=""
						     v-if="index == 2">
						<span v-if="index > 2"
						      class="m-l-44  font-Fu-Bo"
						      v-bind:class="{'m-r-30':index < 9,'m-r-15':index >= 9}">{{index + 1}}</span>
					</div>
					<div class="line"
					     v-bind:class="{'bor-b':index != rankList.length-1}">
						<div class="avat-box">
							<img class="avat"
							     :src="item.memFace?item.memFace:defaultHeader"
							     alt="">
						</div>
						<div class="info font-PC-re">
							<div class="name m-b-10 ellipsis">
								<p class="ellipsis">{{item.memUsername}}</p>
							</div>
							<div class="occup ellipsis">
								<p class="ellipsis">{{item.memJob}}</p>
							</div>
						</div>
						<div class="prase">
							<img :src="prase"
							     class=""
							     alt="">
							<div class="num">
								<span class="font-Fu-Bo">{{item.recommend_num}}</span>
							</div>
						</div>
					</div>
				</div>
			</template>
		</scroller>
	</div>
</template>
<script>
import defaultHeader from "../../assets/defualt_head.png";
import defaultImg from "../../assets/default-noimage.png";
import first from "../../assets/first@2x.png";
import second from "../../assets/second@2x.png";
import third from "../../assets/third@2x.png";
import prase from "../../assets/prase@2x.png";
import Api from "@/api/rankApi";
import defaultPage from "../../components/default";
import { mapGetters } from "vuex";

export default {
  name: "rank",
  components: {
    defaultPage
  },
  data() {
    return {
      defaultHeader: defaultHeader,
      defaultImg: defaultImg,
      first: first,
      second: second,
      third: third,
      prase: prase,
      rankList: [],
      myInfo: {},
      firstInfo: {},
      page: 1,
      pageSize: 10,
      noData: false,
      isShowdefualt: false,
      noDataText: "暂无技师排名"
    };
  },
  computed: {
    ...mapGetters({
      currentStore: "currentStore"
    })
  },
  methods: {
    getRankListInfo: function(request, done) {
      let self = this;
      request.store_id = this.currentStore.store_id;
      request.is_all = 0;
      if (request.page === 1) {
        self.$loading.show("加载中");
      }
      Api.getRankListInfo(request).then(
        function(response) {
          self.$loading.hide();
          if (response.status !== 200 || !response.data) {
            return false;
          }
          let data = response.data;
          if (data.meta && data.meta.current_page == 1) {
            self.myInfo = data.my_info;
            self.firstInfo = data.first_info;
            self.rankList = data.data;
            done && done();
          } else if (data.meta && data.meta.current_page != 1) {
            data.data.forEach(element => {
              self.rankList.push(element);
            });
            self.$refs.myScroller.resize();
          }
          if (
            data.data.length < self.per_page ||
            data.meta.total == self.rankList.length
          ) {
            self.noData = true;
            done && done(true);
          } else {
            self.noData = false;
            done && done();
          }
          if (self.rankList.length == 0) {
            self.isShowdefualt = true;
          } else {
            self.isShowdefualt = false;
          }
          self.$loading.hide();
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },
    // 上拉加载
    infinite(done) {
      let self = this;
      if (self.noData) {
        done(true);
        return;
      }
      self.page++;
      self.getRankListInfo(
        {
          page: self.page,
          per_page: self.pageSize
        },
        done
      );
    },
    // 下拉刷新
    refresh() {
      let self = this;
      self.page = 1;
    },
    goStore(store_id) {
      this.$router.push({
        name: "store",
        query: {
          id: store_id
        }
      });
    }
  },
  created() {
    this.getRankListInfo({
      page: this.page,
      per_page: this.pageSize
    });
  },
  mounted() {
    if (!this.currentStore.store_id) this.$store.dispatch("synchronizeStores");
  }
};
</script>
<style lang="less" scoped>
@import "../../less/base/utilities.less";
@import "../../less/config/_variables.less";
@import "../../less/base/margin.less";
@import "../../less/config/mixins/border-radius.less";
@import "../../less/config/vendor-prefixes.less";
@import "../../less/config/mixins/border.less";
.address {
  height: 122/100rem;
  width: 100%;
  background-color: #4b77b0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  .left {
    width: 80/100rem;
    height: 122/100rem;
    background: url("../../assets/dizhi-img.png") no-repeat;
    background-size: 32/100rem 36/100rem;
    background-position: 30/100rem 12/100rem;
  }
  .right {
    width: 6.5rem;
    ._top {
      font-weight: 600;
      color: #ffffff;
      padding-top: 10/100rem;
      line-height: 40/100rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ._bottom {
      color: #c7d4e8;
      line-height: 34/100rem;
      padding-top: 8/100rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.fl-r {
  float: right;
}
.m-t-12 {
  margin-top: 0.12rem;
}
.m-l-62 {
  margin-left: 0.62rem;
}
.m-t-42 {
  margin-top: 0.42rem;
}
.m-t-34 {
  margin-top: 0.34rem;
}
.m-l-44 {
  margin-left: 0.44rem;
}
.rank {
  width: 100%;
  min-height: 100vh;
  padding-top: 122/100rem;
}
.cover {
  width: 100%;
  height: 4rem;
}
.me {
  .display-flex();
  background: @body-bg;
  height: 1.2rem;
  .align-items(center);
}
.avat-box {
  display: inline-block;
}
.avat {
  height: 0.8rem;
  width: 0.8rem;
  .border-radius(50%);
  margin-right: 0.32rem;
}
.name {
  max-width: 3rem;
  p {
    line-height: 0.32rem;
    color: #2c3039;
    font-size: 0.28rem;
  }
}
.occup {
  max-width: 3rem;
  p {
    color: #8a92a2;
    line-height: 0.32rem;
    font-size: 0.24rem;
  }
}

.prase {
  position: absolute;
  right: 0.3rem;
  margin-right: 0.34rem;
  min-width: 1.35rem;
  img {
    height: 0.25rem;
    width: 0.28rem;
    margin-right: 0.26rem;
    margin-bottom: 0.04rem;
  }
}
.num {
  display: inline-block;
  span {
    color: #332e2e;
    font-size: 0.4rem;
    line-height: 0.54rem;
  }
}
.order {
  img {
    width: 0.44rem;
    height: 0.48rem;
    margin-right: 0.18rem;
  }
  span {
    font-size: 0.24rem;
    line-height: 0.36rem;
    color: #332e2e;
  }
}
.rank-list {
  .display-flex();
  .align-items(center);
  width: 100%;
  background-color: @body-bg;
}

.line {
  .display-flex();
  .align-items(center);
  width: 90%;
  padding-bottom: 0.3rem;
  padding-top: 0.3rem;
}

.bor-b {
  .border-bottom(1px, solid, #eceef3);
}
</style>
