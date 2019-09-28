<template>
  <div class="detail font-PC-re">
    <!-- 卡信息 -->
    <div class="card-info">
      <div class="card-item" :style="'background-image: url(' + bcImg +')'">
        <div>
          <div class="card-top">
            <div class="card-name font-14">
              {{card_info.info ? card_info.info.name : ''}}
              <div class="pasted font-9" v-if="card_info.info &&card_info.info.is_past === 1">过期</div>
              <div class="card-give-icon font-9" v-if="card_info.info && card_info.info.type === 2 && card_info.info.from === 2">获赠</div>
            </div>
            <div class="card-num-box">
              <div class="card-num" v-if="card_info.info && card_info.info.type === 1">
                <div class="font-10">可使用</div>
                <div class="num-bg font-10" v-text="card_info.info ? card_info.info.num : ''">9</div>
                <div class="font-10">次</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-bottom">
          <div class="card-order font-16">
            NO.{{card_info.info ? card_info.info.upkeep_no : ''}}****
          </div>
          <div class="card-time">
            <div class="time font-10" v-if="card_info.info && card_info.info.expiry !== 0">
              有效期至{{card_info.info ? card_info.info.deadline : ''}}
            </div>
            <div class="time font-10" v-if="card_info.info && card_info.info.expiry === 0">
              无限制
            </div>
          </div>
        </div>
      </div>
      <div class="font-14 card-price">
        销售价:¥{{card_info.info ? card_info.info.price / 100 : ''}}
      </div>
    </div>
    <!-- 免激活项目 -->
    <div class="project-item" v-if="card_info.info && card_info.info.type === 1 && card_free_length !== 0">
      <div class="project-title">
        <div class="project-name font-14">
          免激活项目
        </div>
      </div>
      <div class="project-content">
        <div class="project-content-item" v-if="item.type === 2" v-for="(item, index) in card_info.item" :class="(item.num !== 0 && item.item_use === item.num) || item.is_invalid === 1 ? 'disabled' : ''" :key="index">
          <div class="project-content-name font-12" v-text="item.name">免费用油</div>
          <div class="project-content-direction font-10" v-text="item.description">提供 4L装 -25 ℃ 产品一箱（4瓶）与工时</div>
          <div class="project-content-angle active font-10" v-if="item.is_end === 1 && card_info.info.type === 1">终极</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">已用{{item.item_use}}次</div>
          <div class="project-content-angle font-10 used" v-if="item.num === item.item_use">已用完</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num !== 0">已用{{item.item_use}} / {{item.num}}次</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">无限次</div>
          <div class="deadline-style font-10">
            截止日期：{{item.deadline}}
          </div>
        </div>
      </div>
    </div>
    <!-- 需激活项目 -->
    <div class="project-item" v-if="card_info.info && card_info.info.type === 1">
      <div class="project-title">
        <div class="project-name font-14">
          需激活项目
        </div>
      </div>
      <div class="project-content">
        <div class="project-content-item" v-if="item.type === 1" v-for="(item, index) in card_info.item" :class="item.num !== 0 && item.item_use === item.num ? 'disabled' : ''" :key="index">
          <div class="project-content-name font-12" v-text="item.name">免费用油</div>
          <div class="project-content-direction font-10" v-text="item.description">提供 4L装 -25 ℃ 产品一箱（4瓶）与工时</div>
          <div class="project-content-angle active font-10" v-if="item.is_end === 1 && card_info.info.type === 1">终极</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">已用{{item.item_use}}次</div>
          <div class="project-content-angle font-10 used" v-if="item.num === item.item_use">已用完</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num !== 0">已用{{item.item_use}} / {{item.num}}次</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">无限次</div>
        </div>
      </div>
    </div>
    <!-- 项目内容 -->
    <div class="project-item" v-if="card_info.info && card_info.info.type === 2">
      <div class="project-title">
        <div class="project-name font-14">
          项目内容
        </div>
      </div>
      <div class="project-content">
        <div class="project-content-item" v-for="(item, index) in card_info.item" :class="item.num !== 0 && item.item_use === item.num ? 'disabled' : ''" :key="index">
          <div class="project-content-name font-12" v-text="item.name">免费用油</div>
          <div class="project-content-direction font-10" v-text="item.description">提供 4L装 -25 ℃ 产品一箱（4瓶）与工时</div>
          <div class="project-content-angle active font-10" v-if="item.is_end === 1 && card_info.info.type === 1">终极</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">已用{{item.item_use}}次</div>
          <div class="project-content-angle font-10 used" v-if="item.num === item.item_use">已用完</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num !== 0">已用{{item.item_use}} / {{item.num}}次</div>
          <div class="project-content-angle font-10" v-if="item.is_end !== 1 && item.num === 0">无限次</div>
        </div>
      </div>
    </div>
    <!-- 使用须知 -->
    <div class="project-item">
      <div class="project-title">
        <div class="project-name font-14">
          使用须知
        </div>
      </div>
      <div class="project-content">
        <div class="instructions-item">
          <div class="instructions-name font-12">卡有效期</div>
          <div class="instructions-direction font-10">{{card_info.info ? card_info.info.created_at : ''}} 至 {{card_info.info ? card_info.info.deadline : ''}}（周末、法定节假日通用）</div>
        </div>
        <div class="instructions-item">
          <div class="instructions-name font-12">使用规则</div>
          <div class="instructions-direction">
            <p class="font-10" v-html="card_info.info ? card_info.info.description : ''">1.每次保养完可以选择激活其中一项服务</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 图文详情 -->
    <div class="project-item" v-if="card_info.info && (card_info.info.type === 2 && card_info.info.from !== 2) || card_info.info && card_info.info.type === 1">
      <div class="project-title">
        <div class="project-name font-14">
          图文详情
        </div>
      </div>
      <div class="project-content">
        <div class="instructions-item">
          <img class="graphic" :src="card_info.info ? card_info.info.content : ''"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import TemporaryPer from "../../assets/avatar.jpeg";
import defualtHead from "../../assets/defualt_head.png";
import Api from "@/api/customerApi";
export default {
  name: "cardDetail",
  components: {
    // defaultPages
  },
  data() {
    return {
      bcImg: '',
      card_info: {},
      upkeep_no: 0,
      card_free_length: 0,    // 免激活项目的长度
    };
  },
  methods: {
    // 卡详情
    getCardDetail: function() {
      let self = this;
      self.$loading.show("加载中");
      Api.getCardDetail({
        id: self.$route.query.id,
        card_no: self.$route.query.upkeep_no,
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.data.info.deadline = this.formartDate(res.data.data.info.deadline)
          res.data.data.info.created_at = this.formartDate(res.data.data.info.created_at-0)
          res.data.data.info.upkeep_no = res.data.data.info.upkeep_no.substring(0, res.data.data.info.upkeep_no.length - 4)
          res.data.data.item.forEach(ele => {
            if (ele.type && ele.type === 2) {
              ele.deadline = this.formartDate(ele.deadline)
            }
          })
          if (res.data.data.info.type === 1) {
            self.card_free_length = res.data.data.item.filter(ele => ele.type === 2).length
          }
          self.bcImg = res.data.data.info.image_url
          self.card_info = res.data.data;
        }
      });
    },
    formartDate: function(date) {
      var dates = new Date(date * 1000);
      var year = dates.getFullYear();
      var month = dates.getMonth() + 1;
      var day = dates.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
  },
  mounted() {
    this.upkeep_no = this.$route.query.id
    this.getCardDetail()
  }
};
</script>
<style lang="less" scoped>
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
.card-info{
  padding: 0.4rem 0.3rem;
  background: #fff;
  .card-price{
    margin-top: 0.32rem;
  }
}
.card-item {
  width: 6.9rem;
  height: 4.28rem;
  margin: 0 auto;
  margin-top: 0.4rem;
  border-radius: 0.2rem;
  background-size: 6.9rem 4.28rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .card-top{
   padding: 0.46rem 0.24rem 0;
  }
  .pasted{
    width: 0.68rem;
    height: 0.32rem;
    text-align: center;
    line-height: 0.32rem;
    color: #FFF6E1;
    border: 1px solid #FFF;
    border-radius: 0.04rem;
    font-weight: 400;
    margin-left: 0.1rem;
  }
  .card-give-icon{
    width: 0.68rem;
    height: 0.32rem;
    line-height: 0.32rem;
    text-align: center;
    border-radius: 0.04rem;
    border: 1px solid #FFF;
    color: #FFF6E1;
    font-weight: 400;
    margin-left: 0.1rem;
  }
  .card-bottom{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 0.24rem 0.3rem;
  }
  .card-num-box{
    display: flex;
    justify-content: flex-end;
    margin-top: 0.08rem;
    height: 0.28rem;
  }
  .card-num{
    color: #FFF6E1;
    display: flex;
    align-items: center;
    .num-bg{
      background-color: #FFF6E1;
      color: #000000;
      margin-left: 0.04rem;
      margin-right: 0.04rem;
      text-align: center;
      height: 0.28rem;
      display: flex;
      align-items: center;
      padding: 0 0.08rem;
    }
  }
  .card-name{
    color: #FFF6E1;
    line-height: 1;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .card-time{
    color: #FFF6E1;
    line-height: 1;
  }
  .card-order{
    color: #FFF6E1;
    line-height: 1;
    font-weight: bold;
    margin-top: 0.02rem;
  }
}
.card-item:last-child{
  margin-bottom: 0;
}
.project-item{
  width: 100%;
  height: auto;
  background: #fff;
  padding: 0 0.3rem 0.3rem;
  box-sizing: border-box;
  margin-top: 0.3rem;
  .project-content-item{
    width: 100%;
    border: 0.01rem dashed #F5F5F5;
    padding: 0.26rem 0.3rem;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 0.3rem;
    &.disabled{
      background: #F5F5F5;
    }
    &:last-child{
      margin-bottom: 0;
    }
    .deadline-style{
      color: #7F7F7F;
      font-weight: 400;
      border-top: 1px solid #EEEEEE;
      padding-top: 0.3rem;
      margin-top: 0.3rem;
    }
    .project-content-name{
      font-weight: bold;
      color: #000;
    }
    .project-content-direction{
      font-weight: 400;
      color: #808285;
      margin-top: 0.2rem;
    }
    .project-content-angle{
      min-width: 0.9rem;
      padding: 0 0.15rem;
      box-sizing: border-box; 
      height: 0.4rem;
      text-align: center;
      line-height: 0.4rem;
      position: absolute;
      right: 0;
      top: 0;
      background: #5E7BFF;
      color: #ffffff;
      font-weight: 400;
      &.active{
        background: #D42E12;
        color: #ffffff;
      }
      &.used{
        background: #DDDDDD;
        color: #ffffff;
      }
    }
  }
}
.instructions-item{
  width: 100%;
  border-bottom: 0.01rem solid #F5F5F5;
  padding: 0.3rem 0.2rem;
  box-sizing: border-box;
  &:last-child{
    border-bottom: 0;
  }
  &:first-child{
    padding-top: 0;
  }
  .instructions-name{
    font-weight: 400;
    color: #000;
  }
  .instructions-direction{
    font-weight: 400;
    color: #808285;
    margin-top: 0.2rem;
  }
}
.graphic{
  width: 100%;
}
.project-title{
  padding: 0.4rem 0 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .project-name{
    position: relative;
    color: #000000;
    padding-left: 0.2rem;
    font-weight: 400;
    &:before{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0.08rem;
      width: 0.1rem;
      height: 0.28rem;
      background: #5E7BFF;
    }
  }
}
</style>
