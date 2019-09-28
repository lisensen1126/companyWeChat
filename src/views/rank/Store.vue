<template>
	<div class="rank">
    <div class="list" :class="index === 0 ? 'active' : 'default'" v-for="(item, index) in list" @click="setStore(item)">
      <div class="address clearfix">
        <div class="left pull-left"></div>
        <div class="right pull-left">
          <div class="_top font-14">{{item.store_name}}</div>
          <div class="_bottom font-12">{{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}</div>
        </div>
      </div>
    </div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "rank",
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "stores",
      currentStore: "currentStore"
    })
  },
  methods: {
    // 门店切换，设置当前门店
    setStore(params) {
      this.$store.dispatch("updateCurStore", params);
      this.$router.go(-1);
    }
  },
  mounted() {
    let _this = this;
    let num = null;
    this.list.forEach((v, index) => {
      if (_this.$route.query.id == v.store_id) {
        num = index;
      }
    });
    _this.list.splice(num, 1);
    _this.list.unshift(this.currentStore);
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
.rank {
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}
.address {
  margin: 0 auto;
  height: 142/100rem;
  width: 690/100rem;
  border-bottom: 1px solid #eceef3;
  .left {
    width: 60/100rem;
    height: 142/100rem;
  }
  .right {
    width: 6rem;
    ._top {
      font-weight: 600;
      padding-top: 30/100rem;
      line-height: 40/100rem;
      color: #332e2e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ._bottom {
      color: #8a92a2;
      line-height: 34/100rem;
      padding-top: 8/100rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.active {
  background-color: #f7f8fa;
  .left {
    background: url("../../assets/ad-yes.png") no-repeat;
    background-size: 32/100rem 36/100rem;
    background-position-y: 32/100rem;
  }
  .address {
    border: none;
  }
}
.default {
  .left {
    background: url("../../assets/ad-no.png") no-repeat;
    background-size: 32/100rem 36/100rem;
    background-position-y: 32/100rem;
  }
}
</style>
