<template>
  <div class="order-card-detail font-PC-re" v-if="is_show_page">
    <!-- 卡信息 --> 
    <div class="card-info">
      <div class="project-title">
        <div class="project-name font-14">
          卡信息
        </div>
      </div>
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="card-item swiper-slide" v-for="(item,index) in card_list" :key="index" :style="'background-image: url(' + item.image_url +')'">
            <div class="card-top">
              <div class="card-name font-14">
                {{item.name}}
              </div>
              <div class="card-num-box">
                <div class="card-num" v-if="item.type === 1">
                  <div class="font-10">可使用</div>
                  <div class="num-bg font-10">{{item.num}}</div>
                  <div class="font-10">次</div>
                </div>
              </div>
            </div>
            <div class="card-bottom">
              <div class="card-order font-16">
                NO.{{item.upkeep_no_secret}}****
              </div>
              <div class="card-time">
                <div class="time font-10" v-if="item.end_time !== 0">
                  有效期至{{item.deadline}}
                </div>
                <div class="time font-10" v-if="item.end_time === 0">
                  无限制
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="card-info-bottom">
        <div class="font-14 card-price">
          销售价：¥{{card_info.price / 100}}
        </div>
      </div>
    </div>
    <!-- 选择壳保养卡核销项目 -->
    <div class="card-info" v-if="card_info.type === 1">
      <div class="project-title">
        <div class="project-name font-14">
          选择核销项目
        </div>
      </div>
      <div class="card-cancel-list" v-if="card_info.item.length !== 0">
        <div class="card-cancel-title font-12">免激活项目</div>
        <div class="item-box" v-for="(item,index) in card_info.item" :key="index">
          <div class="card-cancel-item">
            <div class="single-card-left">
              <div class="font-12" v-text="item.name">洗车</div>
              <div class="font-10" v-text="item.num === -1 ? '无限次' : ('数量'+ item.num)">数量1</div>
            </div>
            <div class="single-card-right">
              <div class="reduc font-16" :class="item.value <= 0 ? 'active' : ''" @click="reduc(item,1)">
                <img src="../../assets/card/reduc.png" alt="">
              </div>
              <div type="number" v-text="item.value" class="number-input font-14"></div>
              <div class="add font-16" :class="(item.value >= item.num && item.num !== -1) || item.is_expiry === 1 ? 'active' : ''" @click="add(item,1)">
                <img src="../../assets/card/add.png" alt="">
              </div>
            </div>
          </div>
          <div class="card-singlt-des">
            <div class="card-singlt-des-text font-10" :class="item.up_down ? 'active' : ''">
              <div><font color="#4B77B0">截止日期：</font><span v-text="item.expiry_time"></span></div>
              <div class="card-singlt-des-div" v-if="item.up_down"><font color="#4B77B0">说明：</font><span v-text="item.description"></span></div>
            </div>
            <div class="allow-up-down" @click="upDown(item, 1)">
              <img :src="item.up_down ? 'https://oss1.chedianai.com/images/assets/allow-up.png' : 'https://oss1.chedianai.com/images/assets/allow-down.png'" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="card-cancel-list">
        <div class="card-cancel-title card-cancel-title2 font-12">
          需激活项目
          <div class="card-cancel-title-text font-10">可用{{card_info.surplus - sum_of_use}}次</div>
        </div>
        <div class="item-box" :class="item.is_end === 1 ? (card_info.is_validate_end === 1 ? 'active-end' : (item.is_end === 1 && (sum_of_use + card_info.num) == card_info.count_num ? '' : 'active')) : ''" v-for="(item,index) in card_info.item_use" :key="index">
          <div class="card-cancel-item">
            <div class="single-card-left">
              <div class="font-12" v-text="item.name">洗车</div>
              <div class="font-10" v-text="item.num === -1 ? '无限次' : ('数量'+ item.num)">数量1</div>
            </div>
            <div class="single-card-right">
              <div class="reduc font-16" :class="item.value <= 0 ? 'active' : ''" @click="reduc(item,3)">
                <img src="../../assets/card/reduc.png" alt="">
              </div>
              <div type="number" v-text="item.value" class="number-input font-14"></div>
              <div class="add font-16" v-if="item.is_end === 2" :class="(item.value >= item.num || card_info.is_validate_end === 1 || (sum_of_use + card_info.num) === card_info.count_num) || ((sum_of_use == card_info.surplus) && card_info.surplus !== 0 ) || card_info.surplus === 0 ? 'active' : ''" @click="add(item,3)">
                <img src="../../assets/card/add.png" alt="">
              </div>
              <div class="add font-16" v-if="item.is_end === 1" :class="(item.value >= item.num) || (sum_of_use + card_info.num) !== card_info.count_num ? 'active' : ''" @click="add(item,3)">
                <img src="../../assets/card/add.png" alt="">
              </div>
            </div>
          </div>
          <div class="card-singlt-des">
            <div class="card-singlt-des-text font-10" :class="item.up_down ? 'active' : ''">
              <font color="#4B77B0">说明：</font><span v-text="item.description"></span>
            </div>
            <div class="allow-up-down" @click="upDown(item, 3)">
              <img :src="item.up_down ? 'https://oss1.chedianai.com/images/assets/allow-up.png' : 'https://oss1.chedianai.com/images/assets/allow-down.png'" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择次卡核销项目 -->
    <div class="card-info" v-if="card_info.type === 2">
      <div class="project-title">
        <div class="project-name font-14">
          选择核销项目
        </div>
      </div>
      <div class="card-cancel-list">
        <div class="item-box" v-for="(item,index) in card_info.item" :key="index">
          <div class="card-cancel-item">
            <div class="single-card-left">
              <div class="font-12" v-text="item.name">洗车</div>
              <div class="font-10" v-text="item.num === -1 ? '无限次' : ('数量'+ item.num)">数量1</div>
            </div>
            <div class="single-card-right">
              <div class="reduc font-16" :class="item.value <= 0 ? 'active' : ''" @click="reduc(item,2)">
                <img src="../../assets/card/reduc.png" alt="">
              </div>
              <div v-text="item.value" class="number-input font-14"></div>
              <!-- <input type="number" v-model="item.value" @change="judgeButton(item)" class="number-input font-14"> -->
              <div class="add font-16" :class="item.value >= item.num && item.num !== -1 ? 'active' : ''" @click="add(item,2)">
                <img src="../../assets/card/add.png" alt="">
              </div>
            </div>
          </div>
          <div class="card-singlt-des">
            <div class="card-singlt-des-text font-10" :class="item.up_down ? 'active' : ''">
              <font color="#4B77B0">说明：</font><span v-text="item.description"></span>
            </div>
            <div class="allow-up-down" @click="upDown(item,2)">
              <img :src="item.up_down ? 'https://oss1.chedianai.com/images/assets/allow-up.png' : 'https://oss1.chedianai.com/images/assets/allow-down.png'" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <card-confirm :list="confrim_item" @cancel="cancel" @confirm="confirm" v-if="is_show_confirm"></card-confirm>
    <!-- 核销按钮 -->
    <div class="fix-button font-12">
      <div class="card-button" v-if="card_info.type === 1" :class="disabled ? 'disabled' : ''" @click="againConfirm(1)">确认核销</div>
      <div class="card-button" v-if="card_info.type === 2" :class="single_disabled ? 'disabled' : ''" @click="againConfirm(2)">确认核销</div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import defualtHead from "../../assets/defualt_head.png";
import Api from "@/api/customerApi";
import BookApi from "@/api/bookingApi";
import CardConfirm from "./modal/CardConfirm.vue"
export default {
  name: "WriteOffCard",
  components: {
    CardConfirm,
    // defaultPages
  },
  data() {
    return {
      customerInfo: {},
      isRegister: true,
      list: [],
      card_info: {},
      cusId: 0,
      defualtHead: defualtHead,
      currentTabs: 1,
      customer_id: '',
      ec_user_id: "", //ec_id
      upkeep_no: 0,
      disabled: true,
      single_disabled: true,
      is_show_page: false,
      card_list: [],
      sum_of_use: 0,     // 需激活项目总和
      is_show_confirm: false,
      confrim_item: [],
    };
  },
  methods: {
    // 初始化养护卡轮播
    initMySwiper() {
      let self = this
      let my_swiper = new Swiper('.swiper-container',{
        loop: false,
        observer:true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView : 1,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination',
          type: 'custom',
          renderCustom: function ( swiper, current, total ) {
            let _html = '';
            for ( var i = 1; i <= total; i++ ) {
              if ( current == i ) {
                _html += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>';
              } else {
                _html += '<span class="swiper-pagination-customs"></span>';
              }
            }
            return _html; //返回所有的页码html
          },
        },
        on: {
          slideChange: function(){
            self.sum_of_use = 0
            self.upkeep_no = self.card_list[this.activeIndex].upkeep_no
            self.getCardDetail(self.card_list[this.activeIndex].upkeep_no, this.activeIndex)
          }
        }
      })
    },
    // 获取用户可核销的养护卡
    getCusCardList() {
      let self = this;
      self.$loading.show("加载中");
      Api.getCusCardListApi({
        customer_id: self.customer_id
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          res.data.forEach(ele => {
            ele.upkeep_no_secret = ele.upkeep_no.substring(0, ele.upkeep_no.length - 4)
            ele.deadline = self.formartDate(ele.end_time)
          })
          self.card_list = res.data
          if (self.card_list.length > 0) {
            self.upkeep_no = self.card_list[0].upkeep_no
            self.getCardDetail()
          }
        }
        // self.$nextTick(function(){
        //   // self.initMySwiper()
        // })
      });
    },
    // 卡详情
    getCardDetail: function(upkeep = 0, activeIndex = 0) {
      let self = this;
      self.disabled = true
      self.single_disabled = true
      self.$loading.show("加载中");
      Api.getWriteCardOffApi({
        upkeep_no: self.upkeep_no,
      }).then(res => {
        self.$loading.hide();
        self.is_show_page = true
        if (res.code === 0) {
          res.data.deadline = this.formartDate(res.data.expiry_time)
          if (res.data.type === 1) {
            res.data.item.forEach(element => {
              element.value = 0
              element.expiry_time = this.formartDate(element.expiry_time)
              element.up_down = false
            });
            res.data.item_use.forEach(element => {
              element.value = 0
              element.up_down = false
            });
          } else if (res.data.type === 2) {
            res.data.item.forEach(element => {
              element.value = 0
              element.up_down = false
            });
          }
          self.card_info = res.data;
        }
        self.$nextTick(function(){
          if (activeIndex == 0) {
            self.initMySwiper()
          }
        })
      });
    },
    // 确认核销
    getWriteOffCard: function() {
      let self = this;
      if (this.disabled) {
        return
      }
      self.$loading.show("加载中");
      let item_use = []
      let item = []
      this.card_info.item.forEach(ele => {
        item.push({
          id: ele.use_id,
          num: ele.value
        })
      })
      this.card_info.item_use.forEach(ele => {
        item_use.push({
          id: ele.use_id,
          num: ele.value
        })
      })
      BookApi.setCardWriteOffApi({
        upkeep_no: self.card_info.upkeep_no,
        item: item,
        item_use: item_use,
      }).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.$router.replace({
            name: 'WriteOffSuccess',
            query: {
              id: self.$route.query.customer_id,
              reservation: self.$route.query.reservation ? self.$route.query.reservation : '',
              offId: self.$route.query.offId,
              type: 2,
            }
          })
        } else {
          self.$toast.error("核销失败" + res.message, 4000)
        }
      });
    },
    // 确认核销
    getWriteOffSingleCard: function () {
      let self = this;
      if (this.single_disabled) {
        return
      }
      self.$loading.show("加载中");
      let params = {
        item: [],
        upkeep_no: self.card_info.upkeep_no,
      }
      this.card_info.item.forEach(element => {
        params.item.push({
          id: element.use_id,
          num: element.value
        })
      })
      BookApi.setCardWriteOffApi(params).then(res => {
        self.$loading.hide();
        if (res.code === 0) {
          self.$router.replace({
            name: 'WriteOffSuccess',
            query: {
              id: self.$route.query.customer_id,
              reservation: self.$route.query.reservation ? self.$route.query.reservation : '',
              offId: self.$route.query.offId,
              type: '2',
            }
          })
        } else {
          self.$toast.error("核销失败" + res.message, 4000)
        }
      });
    },
    // 二次确认核销弹框
    againConfirm: function (type) {
      this.confrim_item = []
      this.is_write_type = type
      let item = []
      if (this.is_write_type === 2 && this.single_disabled) {
        return
      } else {
        item = this.card_info.item.filter(element => element.value > 0)
      }
      if (this.is_write_type === 1 && this.disabled) {
        return
      } else {
        let arr = [], arr1 = []
        arr = this.card_info.item.filter(ele => ele.value > 0)
        arr1 = this.card_info.item_use.filter(ele => ele.value > 0)
        item = [...arr, ...arr1]
      }
      console.log(item)
      this.confrim_item = item
      this.is_show_confirm = true
    },
    // 核销
    confirm: function () {
      if (this.is_write_type === 1) {
        this.getWriteOffCard()
      } else if (this.is_write_type === 2) {
        this.getWriteOffSingleCard()
      }
    },
    // 关闭二次确认核销弹框
    cancel: function () {
      this.is_show_confirm = false
    },
    // 时间格式化
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
    // 修改核销项目数量
    judgeButton(item) {
      if (item.value > item.num && item.num !== -1) {
        item.value = item.num
      } else if (item.value > 99 && item.num === -1) {
        item.value = 99
      }
      if (this.card_info.item.some(element => element.value > 0)) {
        this.single_disabled = false
      }
    },
    // 获取class
    getClass (item) {
      if (item.is_end === 1 && this.sum_of_use !== this.card_info.surplus) {
        return 'active'
      }
      if (item.is_end === 1 && this.card_info.is_validate_end === 1) {
        return 'active-end'
      }
    },
    // 数组求和
    sum(arr) {
      return eval(arr.join("+"));
    },
    /**
     * @param type 1 免激活项目  2 次卡  3 需激活项目
     * @description 添加数量
     */
    add(item, type) {
      switch (type) {
        case 1:
          if (item.is_expiry === 1) {
            return
          }
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value < item.num || (item.num === -1 && item.value < 99)) {
                element.value++
              }
            }
          })
          if (this.card_info.item.some(element => element.value > 0) || this.card_info.item_use.some(element => element.value > 0)) {
            this.disabled = false
          } else {
            this.disabled = true
          }
          break;
        case 2:
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value < item.num || (item.num === -1 && item.value < 99)) {
                element.value++
              }
            }
          })
          if (this.card_info.item.some(element => element.value > 0)) {
            this.single_disabled = false
          } else {
            this.single_disabled = true
          }
          break;
        case 3:
          if (item.is_end === 1 && (this.sum_of_use - 0 + this.card_info.num - 0) !== this.card_info.count_num) {
            return
          }
          if (item.is_end !== 1 && (((this.sum_of_use + this.card_info.num) === this.card_info.count_num) || (this.sum_of_use == this.card_info.surplus &&this.card_info.surplus !== 0) || this.card_info.surplus === 0)) {
            return
          }
          this.card_info.item_use.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value < item.num && item.value < 99) {
                element.value++
              }
            }
          })
          let arr = []
          this.card_info.item_use.forEach(ele => {
            if (ele.is_end === 2) {
              arr.push(ele.value)
            }
          })
          this.sum_of_use = this.sum(arr)
          if (this.card_info.item_use.some(element => element.value > 0) || this.card_info.item.some(element => element.value > 0)) {
            this.disabled = false
          } else {
            this.disabled = true
          }
          break;
      }
    },
    /**
     * @param type 1 免激活项目  2 次卡  3 需激活项目
     * @description 减少数量
     */
    reduc(item, type) {
      switch (type) {
        case 1:
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value > 0) {
                element.value--
              }
            }
          })
          if (this.card_info.item_use.some(element => element.value > 0) || this.card_info.item.some(element => element.value > 0)) {
            this.disabled = false
          } else {
            this.disabled = true
          }
          break;
        case 2:
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value > 0) {
                element.value--
              }
            }
          })
          if (this.card_info.item.some(element => element.value > 0)) {
            this.single_disabled = false
          } else {
            this.single_disabled = true
          }
          break;
        case 3:
          this.card_info.item_use.forEach(element => {
            if (element.use_id === item.use_id){
              if (item.value > 0) {
                element.value--
              }
            }
          })
          let arr = []
          this.card_info.item_use.forEach(ele => {
            if (ele.is_end === 2) {
              arr.push(ele.value)
            }
          })
          this.sum_of_use = this.sum(arr)
          if (this.card_info.item_use.some(element => element.value > 0) || this.card_info.item.some(element => element.value > 0)) {
            this.disabled = false
          } else {
            this.disabled = true
          }
          break;
      }
    },
    /**
     * @param type 1 免激活项目  2 次卡  3 需激活项目
     * @description 查看描述
     */
    upDown(item, type) {
      switch (type) {
        case 1:
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              element.up_down = !element.up_down
            }
          })
          break;
        case 2:
          this.card_info.item.forEach(element => {
            if (element.use_id === item.use_id){
              element.up_down = !element.up_down
            }
          })
          break;
        case 3:
          this.card_info.item_use.forEach(element => {
            if (element.use_id === item.use_id){
              element.up_down = !element.up_down
            }
          })
          break;
      }
    }
  },
  created() {
    
  },
  mounted() {
    this.initMySwiper() // 初始化养护卡轮播
    this.customer_id = this.$route.query.customer_id
    this.getCusCardList() // 获取用户可核销的养护卡
  }
};
</script>
<style lang="less">
@import "../../less/config/mixins/border.less";
@import "../../less/base/utilities.less";
@import "../../less/base/base.less";
@import "../../less/base/margin.less";
@import '../../../node_modules/swiper/dist/css/swiper.css';
.order-card-detail{
  padding-bottom: 1.56rem;
  .customer-info{
    background: #fff;
    padding: 0 0.3rem 0.3rem;
  }
  .customer-detail {
    overflow: hidden;
    background-color: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .text-over {
      width: 70%;
      .text-over-hide {
        width: 100%;
        overflow: hidden;
        margin-bottom: 0.1rem;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .header-pic {
      width: 1rem;
      height: 1rem;
      margin-right: 0.3rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
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
  .card-info{
    background: #fff;
    padding: 0 0.3rem 0.3rem;
    margin-top: 0.2rem;
    .card-info-bottom{
      display: flex;
      margin-top: 0.5rem;
      justify-content: space-between;
      align-items: center;
      .card-use-time{
        font-weight: 300;
      }
    }
  }
  .card-item {
    width: 6.9rem;
    height: 4.28rem;
    margin: 0 auto;
    border-radius: 0.2rem;
    background-size: 6.9rem 4.28rem;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .card-top{
      padding: 0.46rem 0.24rem 0;
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
  .card-cancel-list{
    .card-cancel-title{
      color: #000000;
      font-weight: bold;
      padding-left: 0.2rem;
      margin-bottom: 0.2rem;
    }
    .card-cancel-title2{
      margin-top: 0.48rem;
      display: flex;
      justify-content: space-between;
      .card-cancel-title-text{
        color: #7F7F7F;
        font-weight: 400;
      }
    }
    .item-box{
      margin-bottom: 0.2rem;
      &:last-child{
        margin-bottom: 0;
      }
      &.active{
        background: #F7F7F7;
      }
      &.active-end{
        display: none;
      }
    }
    .card-cancel-item{
      border: 0.01rem solid #F5F5F5;
      padding: 0.32rem 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-checked{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .img_check{
          width: 0.32rem;
          height: 0.32rem;
          margin-right: 0.2rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .round{
          width: 0.32rem;
          height: 0.32rem;
          border-radius: 50%;
          border: 1px solid #B9BEC7;
          margin-right: 0.2rem;
        }
      }
      .card-cancel-name{
        font-weight: bold;
        color: #000;
      }
      .card-cancel-num{
        color: #808285;
        font-weight: 400;
      }
      .single-card-left{
        .font-10{
          color: #808285;
          font-weight: 400;
          margin-top: 0.08rem;
        }
        .font-12{
          color: #000000;
          font-weight: bold;
        }
      }
      .single-card-right{
        display: flex;
        align-items: center;
        width: auto;
        height: 0.56rem;
        border: 1px solid #F7F7F7;
        .reduc{
          width: 0.56rem;
          height: 0.56rem;
          position: relative;
          img{
            width: 0.2rem;
            height: 0.2rem;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
          }
        }
        .add{
          width: 0.56rem;
          height: 0.56rem;
          position: relative;
          img{
            width: 0.2rem;
            height: 0.2rem;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            margin: auto;
          }
        }
        .number-input{
          width: 0.96rem;
          height: 100%;
          background: #F7F7F7;
          color: #404040;
          border: none;
          line-height: 0.56rem;
          text-align: center;
        }
        .active{
          img{
            opacity: 0.25;
          }
        }
      }
    }
    .card-singlt-des{
      display: flex;
      justify-content: space-between;
      padding: 0.2rem;
      box-sizing: border-box;
      border: 0.01rem solid #F5F5F5;
      border-top: 0;
      .card-singlt-des-text{
        height: auto;
        color: #7F7F7F;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        text-align: left;
        .card-singlt-des-div{
          margin-top: 0.08rem;
        }
      }
      .allow-up-down{
        width: 0.3rem;
        height: 0.25rem;
        margin-left: 0.3rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .active{
        height: auto;
        white-space: normal;
      }
    }
  }
  .swiper-container, .swiper-wrapper {
    width: 100%;
    height: 4.58rem;
  }
  .fix-button{
    box-sizing: border-box;
    width: 100%;
    height: 1.56rem;
    padding: 0.4rem 0.3rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    .card-button{
      height: 0.76rem;
      width: 100%;
      box-shadow: 0px 12px 24px 0px rgba(94,123,255,0.3);
      border-radius: 0.5rem;
      background: #5E7BFF;
      text-align: center;
      line-height: 0.76rem;
      color: #fff;
      font-weight: 400;
      &.disabled{
        background: #AEB5C5;
      }
    }
  }
  .swiper-pagination {
    left: 0;
    width: 100%;
    bottom: 0;
    position: absolute;
    text-align: center;
    -webkit-transition: 300ms opacity;
    -o-transition: 300ms opacity;
    transition: 300ms opacity;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    z-index: 10;
  }
  .swiper-pagination-customs {
    width: 0.32rem ;
    height: 0.04rem;
    background: #D2D2D2;
    margin-left: 0.1rem;
    display: inline-block;
    margin: 0 0.1rem;
  } 
  .swiper-pagination-customs-active{
    background: #5E7BFF;
  }
}
</style>
