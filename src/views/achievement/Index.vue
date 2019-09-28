<template>
  <div class="index">
    <div class="tab">
      <div class="tab-scroll">
        <div class="left font-13" :class="{'active': item.id == tabState}" v-for="(item, index) in navList" @click="tabClick(item)" :key="index">
        {{item.name}}
          <span></span>
        </div>
      </div>
    </div>
    <!-- 月报和日报数据 -->
    <div v-if="tabState === 1 || tabState === 2">
      <!-- 日报时间选择 -->
      <div class="data-select text-center p-t-40 p-b-40 flex position-relative" v-if="tabState == 1">
        <div class="arrow-left left-img">
          <img class="icon-right" src="../../assets/arrow-white.png" @click="prevDay" />
        </div>
        <div class="position-relative time-wrapper">
          <input class="date-component position-absolute" type="date" name="date" id="date" @change="selectTimeFun" />
          <div class="font-16 font-Fu-me position-absolute curr-time">{{selectTime}}</div>
        </div>
        <div class="arrow-right right-img">
          <img v-if="isNext" class="right-arrow icon-right" src="../../assets/arrow-white.png" @click="nextDay" />
        </div>
      </div>

      <!-- 月报时间选择 -->
      <div class="data-select p-t-40 p-b-40 text-center flex position-relative" v-if="tabState == 2">
        <div class="arrow-left left-img">
          <img class="icon-right icon-right" src="../../assets/arrow-white.png" @click="prevMonth" />
        </div>
        <div class="position-relative time-wrapper">
          <input class="date-component position-absolute" type="month" name="date" id="date" @change="selectMonthFun" />"
          <div class="font-16 font-Fu-me position-absolute curr-time">{{selectTime}}</div>
        </div>
        <div class="arrow-right right-img">
          <img v-if="isNext" class="right-arrow icon-right" src="../../assets/arrow-white.png" @click="nextMonth" />
        </div>
      </div>

      <!-- 立减红包 -->
      <div class="card-box reduc-bag" v-if="dailyMonth.random_coupon && has_apply === 1">
        <div class="title">
          <span class="font-14">立减红包</span>
          <img class="help" src="../../assets/gray.png" @click="showModalBag()" />
        </div>
        <div class="clearfix">
          <div class="font-12 card-item right-border bottom-border">
            <p class="number font-18" v-if="tabState === 1">¥{{dailyMonth.random_coupon.day}}</p>
            <p class="number font-18" v-if="tabState === 2">¥{{dailyMonth.random_coupon.month}}</p>
            <p class="tips font-11">当{{tabState === 1 ? '日' : tabState === 2 ? '月' : ''}}门店活动红包</p>
          </div>
          <div class="font-12 card-item">
            <p class="number font-18">¥{{dailyMonth.random_coupon.total}}</p>
            <p class="tips font-11">累计门店活动红包</p>
          </div>
          <div class="font-12 card-item right-border">
            <p class="number m-t-30 font-18" v-if="tabState === 1">¥{{dailyMonth.random_coupon.panel_day}}</p>
            <p class="number font-18 m-t-30" v-if="tabState === 2">¥{{dailyMonth.random_coupon.panel_month}}</p>
            <p class="tips font-11">当{{tabState === 1 ? '日' : tabState === 2 ? '月' : ''}}门店活动(红包+奖励)</p>
          </div>
          <div class="font-12 card-item">
            <p class="number m-t-30 font-18">¥{{dailyMonth.random_coupon.panel_total}}</p>
            <p class="tips font-11">累计门店活动(红包+奖励)</p>
          </div>
        </div>
      </div>

      <!-- 线上人数 -->
      <div class="card-box reduc-bag" v-if="dailyMonth.userStat">
        <div class="title">
          <span class="font-14">线上用户</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(1)" />
          <div class="font-12 pull-right more" @click="goPeople()">
            <span>详细信息</span>
            <img class="" src="../../assets/message-right.svg" alt="">  
          </div>
        </div>
        <div class="clearfix">
          <div class="font-12 card-item right-border bottom-border">
            <p class="number font-18">{{dailyMonth.userStat.open}}次</p>
            <p class="tips font-11">打开次数</p>
          </div>
          <div class="font-12 card-item">
            <p class="number font-18">{{dailyMonth.userStat.view}}人</p>
            <p class="tips font-11">访问人数</p>
          </div>
          <div class="font-12 card-item right-border">
            <p class="number p-t-30 font-18">{{dailyMonth.userStat.data_register}}人</p>
            <p class="tips font-11">新注册</p>
          </div>
          <div class="font-12 card-item">
            <p class="number p-t-30 font-18">{{dailyMonth.userStat.all_register}}人</p>
            <p class="tips font-11">总注册</p>
          </div>
        </div>
      </div>

      <!-- 线上业绩 -->
      <div class="card-box" v-if="dailyMonth.performanceStat">
        <div class="title">
          <span class="font-14">线上业绩</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(2)" />
          <div class="font-12 pull-right more" @click="goAchieve()">
            <span>详细信息</span>
            <img class="" src="../../assets/message-right.svg" alt="">  
          </div>
        </div>
        <div class="clearfix">
          <div class="font-12 card-item right-border bottom-border">
            <p class="number font-18">￥{{dailyMonth.performanceStat.sum}}</p>
            <p class="tips font-11">销售金额</p>
          </div>
          <div class="font-12 card-item">
            <p class="number font-18">￥{{dailyMonth.performanceStat.actual}}</p>
            <p class="tips font-11">实收金额</p>
          </div>
          <div class="font-12 card-item card-item-height right-border bottom-border">
            <p class="number p-t-30 font-18">{{dailyMonth.performanceStat.count}}笔</p>
            <p class="tips font-11">订单数</p>
          </div>
          <div class="font-12 card-item card-item-height p-b-30">
            <p class="number p-t-30 font-18">￥{{dailyMonth.performanceStat.ave}}</p>
            <p class="tips font-11">订单均价</p>
          </div>
          <div class="font-12 card-item card-item-height p-b-30 right-border">
            <p class="number p-t-30 font-18">{{dailyMonth.performanceStat.inspect}}次</p>
            <p class="tips font-11">车检次数</p>
          </div>
        </div>
      </div>

      <!-- 线下业绩 -->
      <div class="card-box" v-if="dailyMonth.offlineAllPerformanceStat">
        <div class="title">
          <span class="font-14">线下业绩</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(3)" />
          <div class="font-12 pull-right more" @click="goOffline()">
            <span>详细信息</span>
            <img class="" src="../../assets/message-right.svg" alt="">  
          </div>
        </div>
        <div class="clearfix">
          <div class="font-12 card-item right-border bottom-border">
            <p class="number font-18">￥{{dailyMonth.offlineAllPerformanceStat.sum}}</p>
            <p class="tips font-11">应付金额</p>
          </div>
          <div class="font-12 card-item">
            <p class="number font-18">￥{{dailyMonth.offlineAllPerformanceStat.actual}}</p>
            <p class="tips font-11">实付金额</p>
          </div>
          <div class="font-12 card-item card-item-height right-border bottom-border">
            <p class="number p-t-30 font-18">￥{{dailyMonth.offlineAllPerformanceStat.preferential_sum}}</p>
            <p class="tips font-11">优惠金额</p>
          </div>
          <div class="font-12 card-item card-item-height">
            <p class="number p-t-30 font-18">￥{{dailyMonth.offlineAllPerformanceStat.rate_price_sum}}</p>
            <p class="tips font-11">手续费</p>
          </div>
          <div class="font-12 card-item card-item-height right-border">
            <p class="number p-t-30 font-18">{{dailyMonth.offlineAllPerformanceStat.count}}笔</p>
            <p class="tips font-11">订单数</p>
          </div>
          <div class="font-12 card-item card-item-height">
            <p class="number p-t-30 font-18">{{dailyMonth.offlineAllPerformanceStat.customer_count}}人</p>
            <p class="tips font-11">付款人数</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 模态框信息提示，线上用户，线上业绩 -->
    <div class="modal-container" v-if="isShowModal" style="text-align: center;">
      <div class="p-a-60 m-t-max m-r-40 m-l-40 modal-content">
        <div class="text-center line-50 m-b-60">
          <span class="font-18 font-PC-sd black">{{title}}</span>
        </div>
        <div class="line-44 m-b-30 text-left" v-for="(item, index) in showInfo" :key=index>
          <div class="font-16 font-PC-re black letter-space">{{item.content}}</div>
        </div>
      </div>
      <img style="margin-top: 1.5rem;" src="../../assets/close.png" @click="cancel" alt="">
    </div>
    <!-- 模态框信息提示，线上用户，线上业绩 -->
    <div class="modal-container" v-if="is_show_modal_bag" style="text-align: center;">
      <div class="p-a-60 m-t-max m-r-40 m-l-40 modal-content modal-bag">
        <div class="text-center line-50 m-b-30">
          <span class="font-18 font-PC-sd black">立减红包</span>
        </div>
        <div class="line-44 text-left">
          <p class="font-12 blud">门店双重奖励的机制介绍？</p>
          <p class="font-12">活动期间，车主所得立减红包将由门店暂时承担，门店每天可从企业微信工作台看到本店车主的累计红包金额。同时，门店所获的奖励等于该店车主累计红包金额（例：A门店的车主累计红包金额为1000元，则A门店的奖励金额为1000元。活动结束后门店将获得2000元）。</p>
          <p class="font-12 blud m-t-20">门店活动奖励如何兑现？</p>
          <p class="font-12">活动结束后（9月29日），壳牌将统计所有参与门店的奖励金额，并通过进货抵扣方式给到所属经销商；经销商将从10月起，通过进货抵扣的方式，把对应的活动奖励金额给到门店。</p>
        </div>
      </div>
      <img style="margin-top: 1.5rem;" src="../../assets/close.png" @click="cancelBag" alt="">
    </div>
    <!-- 同城/同行分析数据 -->
    <div class="some-city" v-if="(tabState === 3 || tabState === 4) && show_city && show_data">
      <div class="card-box-title">
        <h2 class="font-16">同{{tabState === 3 ? '城' : '行'}}分析</h2>
        <div class="font-12">对比本店的{{tabState === 3? '所在城市' : ''}}同行均值，超过均值为领先</div>
      </div>
      <!-- 立减红包 -->
      <div class="card-box" v-if="has_apply === 1">
        <div class="title">
          <span class="font-14">立减红包</span>
          <img class="help" src="../../assets/gray.png" @click="showModalBag()" />
        </div>
        <div class="clearfix card-box-city">
          <div class="card-item-city" v-for="(item,index) in info_list1" :key="index" @click="analyseType(item.analyse_type)" :class="analyse_type1 === item.analyse_type ? 'active' : ''">
            <p class="number font-12" v-if="item.analyse_type === 1">用户立减金额</p>
            <p class="number font-12" v-if="item.analyse_type === 2">门店立减金额</p>
            <p class="tips font-10">打败{{item.num}}%同行</p>
            <div class="city-up" v-if="item.num_type === 1">
              <img src="../../assets/achievement/up.png" alt="">
              <p class="font-12">领先</p>
            </div>
            <div class="city-down" v-if="item.num_type === 2">
              <img src="../../assets/achievement/down.png" alt="">
              <p class="font-12">落后</p>
            </div>
          </div>
        </div>
        <div class="charts">
          <xchart ref="envelope" id="envelope" high="270px" :option="envelope_option1"></xchart>
          <div class="advice">
            <div class="advice-block font-10">建议</div>
            <p class="font-10 advice-title">全员参与，积极主动拥抱智慧门店，引导客户参与</p>
          </div>
        </div>
      </div>
      <!-- 线上用户 -->
      <div class="card-box">
        <div class="title">
          <span class="font-14">线上用户</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(1)" />
        </div>
        <div class="clearfix card-box-city">
          <div class="card-item-city" v-for="(item,index) in info_list2" :key="index" @click="analyseType(item.analyse_type)" :class="analyse_type2 === item.analyse_type ? 'active' : ''">
            <p class="number font-12" v-if="item.analyse_type === 3">打开次数</p>
            <p class="number font-12" v-if="item.analyse_type === 4">访问人数</p>
            <p class="number font-12" v-if="item.analyse_type === 5">总注册</p>
            <p class="tips font-10">打败{{item.num}}%同行</p>
            <div class="city-up" v-if="item.num_type === 1">
              <img src="../../assets/achievement/up.png" alt="">
              <p class="font-12">领先</p>
            </div>
            <div class="city-down" v-if="item.num_type === 2">
              <img src="../../assets/achievement/down.png" alt="">
              <p class="font-12">落后</p>
            </div>
          </div>
        </div>
        <div class="charts">
          <xchart ref="onlineuser" id="onlineuser" high="270px" :option="envelope_option2"></xchart>
          <div class="advice">
            <div class="advice-block font-10">建议</div>
            <p class="font-10 advice-title">全员参与，积极主动拥抱智慧门店，引导客户参与</p>
          </div>
        </div>
      </div>
      <!-- 线上业绩 -->
      <div class="card-box">
        <div class="title">
          <span class="font-14">线上业绩</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(2)" />
        </div>
        <div class="clearfix card-box-city">
          <div class="card-item-city" v-for="(item,index) in info_list3" :key="index" @click="analyseType(item.analyse_type)" :class="analyse_type3 === item.analyse_type ? 'active' : ''">
            <p class="number font-12" v-if="item.analyse_type === 6">销售金额</p>
            <p class="number font-12" v-if="item.analyse_type === 7">实收金额</p>
            <p class="number font-12" v-if="item.analyse_type === 8">订单数</p>
            <p class="number font-12" v-if="item.analyse_type === 9">订单均价</p>
            <p class="number font-12" v-if="item.analyse_type === 10">车检次数</p>
            <p class="tips font-10">打败{{item.num}}%同行</p>
            <div class="city-up" v-if="item.num_type === 1">
              <img src="../../assets/achievement/up.png" alt="">
              <p class="font-12">领先</p>
            </div>
            <div class="city-down" v-if="item.num_type === 2">
              <img src="../../assets/achievement/down.png" alt="">
              <p class="font-12">落后</p>
            </div>
          </div>
        </div>
        <div class="charts">
          <xchart ref="onlineresult" id="onlineresult" high="270px" :option="envelope_option3"></xchart>
          <div class="advice">
            <div class="advice-block font-10">建议</div>
            <p class="font-10 advice-title">全员参与，积极主动拥抱智慧门店，引导客户参与</p>
          </div>
        </div>
      </div>
      <!-- 线下业绩 -->
      <div class="card-box">
        <div class="title">
          <span class="font-14">线下业绩</span>
          <img class="help" src="../../assets/gray.png" @click="showModal(3)" />
        </div>
        <div class="clearfix card-box-city">
          <div class="card-item-city" v-for="(item,index) in info_list4" :key="index" @click="analyseType(item.analyse_type)" :class="analyse_type4 === item.analyse_type ? 'active' : ''">
            <p class="number font-12" v-if="item.analyse_type === 11">应付金额</p>
            <p class="number font-12" v-if="item.analyse_type === 12">实付金额</p>
            <p class="number font-12" v-if="item.analyse_type === 13">优惠金额</p>
            <p class="number font-12" v-if="item.analyse_type === 14">订单数</p>
            <p class="number font-12" v-if="item.analyse_type === 15">付款人数</p>
            <p class="tips font-10">打败{{item.num}}%同行</p>
            <div class="city-up" v-if="item.num_type === 1">
              <img src="../../assets/achievement/up.png" alt="">
              <p class="font-12">领先</p>
            </div>
            <div class="city-down" v-if="item.num_type === 2">
              <img src="../../assets/achievement/down.png" alt="">
              <p class="font-12">落后</p>
            </div>
          </div>
        </div>
        <div class="charts">
          <xchart ref="offline" id="offline" high="270px" :option="envelope_option4"></xchart>
          <div class="advice">
            <div class="advice-block font-10">建议</div>
            <p class="font-10 advice-title">全员参与，积极主动拥抱智慧门店，引导客户参与</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="(tabState === 3 || tabState === 4) && !show_city && show_data">
      <div class="no-customer-bar">
        <img src="../../assets/default/no_content.png" class="default-img">
        <div class="no-result font-12">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../../api/dailyApi";
import Xchart from "../../components/charts/chart.vue";
import options from "../../components/charts/envelope-option";
export default {
  // let 
  data() {
    return {
      navList: [
        {
          name: '经营日报',
          id: 1,
        },
        {
          name: '经营月报',
          id: 2,
        },
        {
          name: '同城分析',
          id: 3,
        },
        {
          name: '同行分析',
          id: 4,
        },
      ],
      tabState: 1,
      selectTime: "",
      timestamp: "",
      currTime: "",
      saveCurTime: "",
      isNext: false,
      today: "",
      currentDate: {
        month: 0,
        year: 0,
        time: ""
      },
      currentDateNow: {
        month: 0,
        year: 0
      },
      isShowModal: false,
      showInfo: [],
      dailyMonth: {},   // 日报,月报数据
      userInfo: [
        { content: `打开次数：当日访问小程序的总次数`},
        { content: `访问人数：当日访问小程序的总用户数，同一用户多次访问不重复计数`},
        { content: `新注册：当日访问小程序注册成功的用户数` },
        { content: `总注册：访问小程序注册成功的总用户数` }
      ],
      userInfo1: [
        { content: `打开次数：访问小程序的总次数`},
        { content: `访问人数：访问小程序的总用户数，同一用户多次访问不重复计数`},
        { content: `总注册：访问小程序注册成功的总用户数` }
      ],
      linePerformance: [
        { content: `线上销售金额：线上小程序当日的所有订单销售总额` },
        { content: `线上实收金额：线上小程序当日的所有订单实收总额` },
        { content: `订单数：当日成交订单数` },
        { content: `订单均价：平均每单销售金额` }
      ],
      offLine: [
        { content: `线下扫码买单收款当日的所有订单销售总额` },
        { content: `买单实收金额：线下扫码买单收款当日的所有订单实收总额` },
        { content: `订单数：当日所有线下买单订单数` },
        { content: `订单均价：平均每单销售金额` }
      ],
      envelope_option1: JSON.parse(JSON.stringify(options.option)),
      envelope_option2: JSON.parse(JSON.stringify(options.option)),
      envelope_option3: JSON.parse(JSON.stringify(options.option)),
      envelope_option4: JSON.parse(JSON.stringify(options.option)),
      is_show_modal_bag: false,
      info_list1: [],
      info_list2: [],
      info_list3: [],
      info_list4: [],
      analyse_type1: 1,
      analyse_type2: 3,
      analyse_type3: 6,
      analyse_type4: 11,
      has_apply: 0,
      show_data: false,
      show_city: true,
    };
  },
  components: {
    Xchart
  },
  methods: {
    // tab切换
    tabClick(params) {
      this.tabState = params.id
      this.getApply()
      this.initChartData()
      this.show_data = false
      switch (params.id) {
        case 1:
          let now = new Date();
          let str = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
          this.today = Date.parse(str) / 1000;
          this.timestamp = this.today;
          this.selectTime = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate();
          this.saveCurTime = this.selectTime;
          this.isNext = false
          this.dailyMonth = {};
          this.fetchDailyInfo();
          break;
        case 2:
          let date = new Date();
          this.currentDateNow.month = date.getMonth() + 1;
          this.currentDateNow.year = date.getFullYear();
          this.currentDate.year = this.currentDateNow.year;
          this.currentDate.month = this.currentDateNow.month;
          this.isNext = false
          this.dateFun(this.currentDateNow.year, this.currentDateNow.month);
          this.dailyMonth = {};
          this.fetchMonthInfo();
          break;
        case 3:
          this.getPeerList(2)
          break;
        case 4:
          this.getPeerList(1)
          break;
      }
      if (this.tabState === 1|| this.tabState === 2) {
        this.userInfo = [
          { content: `打开次数：当${this.tabState == 1 ? '日' : '月'}访问小程序的总次数`},
          { content: `访问人数：当${this.tabState == 1 ? '日' : '月'}访问小程序的总用户数，同一用户多次访问不重复计数`},
          { content: `新注册：当${this.tabState == 1 ? '日' : '月'}访问小程序注册成功的用户数` },
          { content: `总注册：访问小程序注册成功的总用户数` }
        ]
        this.linePerformance = [
          { content: `线上销售金额：线上小程序当${this.tabState == 1 ? '日' : '月'}的所有订单销售总额` },
          { content: `线上实收金额：线上小程序当${this.tabState == 1 ? '日' : '月'}的所有订单实收总额` },
          { content: `订单数：当${this.tabState == 1 ? '日' : '月'}成交订单数` },
          { content: `订单均价：平均每单销售金额` }
        ]
        this.offLine = [
          { content: `线下扫码买单收款当${this.tabState == 1 ? '日' : '月'}的所有订单销售总额` },
          { content: `买单实收金额：线下扫码买单收款当${this.tabState == 1 ? '日' : '月'}的所有订单实收总额` },
          { content: `订单数：当${this.tabState == 1 ? '日' : '月'}所有线下买单订单数` },
          { content: `订单均价：平均每单销售金额` }
        ]
      } else {
        this.userInfo = [
          { content: `打开次数：访问小程序的总次数`},
          { content: `访问人数：访问小程序的总用户数，同一用户多次访问不重复计数`},
          { content: `总注册：访问小程序注册成功的总用户数` }
        ]
        this.linePerformance = [
          { content: `线上销售金额：线上小程序所有的订单销售总额` },
          { content: `线上实收金额：线上小程序所有的订单实收总额` },
          { content: `订单数：线上小程序成交订单数` },
          { content: `订单均价：线上小程序平均每单销售金额` }
        ]
        this.offLine = [
          { content: `应付金额：所有线下买单的订单销售总额` },
          { content: `实付金额：所有线下买单的订单实收总额` },
          { content: `优惠金额：所有线下买单订单，付款时所使用的优惠金额` },
          { content: `订单数：所有线下买单的订单数` },
          { content: `付款人数：所有线下买单的付款总人数` },
        ]
      }
    },

    // 初始化图表
    initChartData() {
      this.envelope_option1 = JSON.parse(JSON.stringify(options.option))
      this.envelope_option2 = JSON.parse(JSON.stringify(options.option))
      this.envelope_option3 = JSON.parse(JSON.stringify(options.option))
      this.envelope_option4 = JSON.parse(JSON.stringify(options.option))
      this.info_list1 = []
      this.info_list2 = []
      this.info_list3 = []
      this.info_list4 = []
      this.analyse_type1 = 1
      this.analyse_type2 = 3
      this.analyse_type3 = 6
      this.analyse_type4 = 11
    },
    selectTimeFun(e) {
      let changeVal = e.target.value;
      if (changeVal == "") {
        this.selectTime = this.save_curtime;
      } else {
        this.currTime = e.target.value.toString();
        let now = new Date().getTime();
        if (now < new Date(this.currTime).getTime()) {
          let now = new Date();
          let str = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
          this.today = Date.parse(str) / 1000;
          this.timestamp = this.today;
          this.selectTime = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate();
          this.saveCurTime = this.selectTime;
          this.isNext = false
          this.fetchDailyInfo()
        } else {
          this.selectTime = this.save_curtime;
          this.changeCommonFun(new Date(this.currTime));
        }
      }
    },

    /**
     * @method optDay 天操作 主要进行一天的加减，点击前一天或者后一天时触发   参数days配置可进行 点击前n天或者后n天时触发
     * @param {string} date 当前时间点 如：2018/08/28
     * @param {number} days 天数个数 表示每次加几天或者减几天
     * @param {sting} opt 表示加一天或者减一天标志
     * @return {Date}
     *      curTime  处理后的时间格式为时间格式可以直接使用
     * */
    optDay(date, opt) {
      let curTime = new Date(date);
      if (opt === "+") {
        let now = new Date();
        let str =
          now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
        let nowTime = Date.parse(str);

        if (nowTime <= curTime.getTime()) {
          return;
        }
        curTime.setDate(curTime.getDate() + 1);
      } else {
        curTime.setDate(curTime.getDate() - 1);
      }
      this.changeCommonFun(curTime);
    },

    changeCommonFun(curTime) {
      let str =
        curTime.getFullYear() +
        "/" +
        (curTime.getMonth() + 1) +
        "/" +
        curTime.getDate();
      this.timestamp = Date.parse(str) / 1000;
      if (this.timestamp == this.today || this.timestamp > this.today) {
        this.isNext = false;
        this.selectTime = this.save_curtime;
      } else {
        this.isNext = true;
      }
      this.selectTime =
        curTime.getFullYear() +
        "." +
        (curTime.getMonth() + 1) +
        "." +
        curTime.getDate();
      this.save_curtime = this.selectTime;
      this.fetchDailyInfo()
    },

    prevDay() {
      let str = this.selectTime.replace(/\./g, "/");
      this.optDay(str, "-");
    },

    nextDay() {
      let str = this.selectTime.replace(/\./g, "/");
      this.optDay(str, "+");
    },
    // 选择月份
    selectMonthFun(e) {
      let month = e.target.value;
      if (month == "") {
        this.selectTime =
          this.currentDateNow.year + "." + this.currentDateNow.month;
      } else {
        let newYear = month.slice(0, 4);
        let newMonth = month.slice(5);
        if (
          newYear > this.currentDateNow.year ||
          (newYear >= this.currentDateNow.year &&
            newMonth > this.currentDateNow.month)
        ) {
          // 重置时间
          this.currentDate.year = this.currentDateNow.year;
          this.currentDate.month = this.currentDateNow.month;
          this.selectTime = this.currentDateNow.year + "." + this.currentDateNow.month;
          this.isNext = false
          let str = this.currentDateNow.year + "/" + this.currentDateNow.month + "/01";
          this.timestamp = Date.parse(str) / 1000;
          this.fetchMonthInfo();
        } else {
          this.currentDate.year = month.slice(0, 4);
          this.currentDate.month = month.slice(5);
          this.dateFun(this.currentDate.year, this.currentDate.month);
        }
      }
    },
    // 上个月
    prevMonth() {
      this.currentDate.month -= 1;
      if (this.currentDate.month < 1) {
        this.currentDate.month = 12;
        this.currentDate.year -= 1;
      }
      this.dateFun(this.currentDate.year, this.currentDate.month);
    },
    // 下个月
    nextMonth() {
      this.currentDate.month++;
      if (this.currentDate.month > 12) {
        this.currentDate.month = 1;
        this.currentDate.year++;
      }
      this.dateFun(this.currentDate.year, this.currentDate.month);
    },
    // 时间转换 
    dateFun(year, month) {
      let date = new Date();
      let cyear = date.getFullYear();
      let cmonth = date.getMonth() + 1;
      if (this.currentDate.year == cyear && this.currentDate.month == cmonth) {
        this.isNext = false;
      } else {
        this.isNext = true;
        if (this.currentDate.year >= cyear && this.currentDate.month > cmonth) {
          this.currentDate.month -= 1;
          if (this.currentDate.month < 0) {
            this.currentDate.month = 12;
            this.currentDate.year -= 1;
          }
          return;
        }
      }
      this.selectTime = year + "." + month;
      let str = year + "/" + month + "/01";
      this.timestamp = Date.parse(str) / 1000;
      this.fetchMonthInfo();
    },

    // 提示信息展现
    showModal(type) {
      console.log(type)
      this.isShowModal = !this.isShowModal
      if(type == 1) (this.title = "线上用户") && (this.showInfo = this.userInfo)
      if(type == 2) (this.title = "线上业绩") && (this.showInfo = this.linePerformance)
      if(type == 3) (this.title = "线下业绩") && (this.showInfo = this.offLine)
    },
    // 立减红包提示信息展现
    showModalBag() {
      this.is_show_modal_bag = true
    },
    // 提示信息关闭
    cancel() {
      this.isShowModal = false;
    },
    // 提示信息关闭
    cancelBag() {
      this.is_show_modal_bag = false
    },

    // 获取日报数据
    fetchDailyInfo() {
      let self = this
      self.$loading.show("加载中");
      Api.getDailyInfoApi({
        start_time: self.timestamp
      }).then(res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.dailyMonth = res.data
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },

    // 获取月报数据
    fetchMonthInfo() {
      let self = this
      self.$loading.show("加载中");
      Api.getMonthlyInfoApi({
        start_time: self.timestamp
      }).then(res => {
          if (res.code === 0) {
            self.$loading.hide();
            self.dailyMonth = res.data
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    },

    // 查看线上人数统计
    goPeople() {
      this.$router.push({
        name: 'peopleNum',
        query: {
          type: this.tabState,
          time: this.timestamp,
          tip: this.selectTime,
        },
      });
    },

    // 查看线上业绩统计
    goAchieve() {
      this.$router.push({
        name: 'achieveNum',
        query: {
          type: this.tabState,
          time: this.timestamp,
          tip: this.selectTime,
        },
      });
    },
    goOffline(){
      this.$router.push({
        name:'offlinePerformance',
        params:{
          type:this.tabState,
          start_time:this.timestamp
        }
      })
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    },
    // 获取同城/同行数据
    getPeerList(type) {
      let self = this
      self.$loading.show("加载中");
      Api.getCityDataApi({
        count_type: type
      }).then(res => {
        self.show_data = true
        if (res.code === 0) {
          self.$loading.hide();
          self.show_city = true
          let arr = res.data.sort(self.compare('analyse_type'))
          arr.forEach(ele => {
            if (ele.analyse_type <= 2) {
              self.info_list1.push(ele)
            } else if (ele.analyse_type > 2 && ele.analyse_type <= 5) {
              self.info_list2.push(ele)
            } else if (ele.analyse_type > 5 && ele.analyse_type <= 10) {
              self.info_list3.push(ele)
            } else if (ele.analyse_type > 10 && ele.analyse_type <= 15) {
              self.info_list4.push(ele)
            }
          })
          self.envelope_option1.xAxis[0].categories = self.info_list1[0].chart.date
          self.envelope_option1.series[0].data = self.info_list1[0].chart.day_average
          self.envelope_option1.series[1].data = self.info_list1[0].chart.day_store_data
          self.envelope_option2.xAxis[0].categories = self.info_list2[0].chart.date
          self.envelope_option2.series[0].data = self.info_list2[0].chart.day_average
          self.envelope_option2.series[1].data = self.info_list2[0].chart.day_store_data
          self.envelope_option3.xAxis[0].categories = self.info_list3[0].chart.date
          self.envelope_option3.series[0].data = self.info_list3[0].chart.day_average
          self.envelope_option3.series[1].data = self.info_list3[0].chart.day_store_data
          self.envelope_option4.xAxis[0].categories = self.info_list4[0].chart.date
          self.envelope_option4.series[0].data = self.info_list4[0].chart.day_average
          self.envelope_option4.series[1].data = self.info_list4[0].chart.day_store_data
        } else {
          self.$loading.hide();
          self.show_city = false
        }
      },
      function(err) {
        self.$loading.hide();
        self.$router.replace({ path: "/error", query: { msg: err } });
      });
    },
    // 根据type赋值
    analyseType (type) {
      if (type <= 2) {
        this.analyse_type1 = type
        let arr = this.info_list1.filter(ele => ele.analyse_type === type)[0]
        this.envelope_option1.xAxis[0].categories = arr.chart.date
        this.envelope_option1.series[0].data = arr.chart.day_average
        this.envelope_option1.series[1].data = arr.chart.day_store_data
        this.$refs.envelope.initChart()
      } else if (type > 2 && type <= 5) {
        this.analyse_type2 = type
        let arr = this.info_list2.filter(ele => ele.analyse_type === type)[0]
        this.envelope_option2.xAxis[0].categories = arr.chart.date
        this.envelope_option2.series[0].data = arr.chart.day_average
        this.envelope_option2.series[1].data = arr.chart.day_store_data
        this.$refs.onlineuser.initChart()
      } else if (type > 5 && type <= 10) {
        this.analyse_type3 = type
        let arr = this.info_list3.filter(ele => ele.analyse_type === type)[0]
        this.envelope_option3.xAxis[0].categories = arr.chart.date
        this.envelope_option3.series[0].data = arr.chart.day_average
        this.envelope_option3.series[1].data = arr.chart.day_store_data
        this.$refs.onlineresult.initChart()
      } else if (type > 10 && type <= 15) {
        this.analyse_type4 = type
        let arr = this.info_list4.filter(ele => ele.analyse_type === type)[0]
        this.envelope_option4.xAxis[0].categories = arr.chart.date
        this.envelope_option4.series[0].data = arr.chart.day_average
        this.envelope_option4.series[1].data = arr.chart.day_store_data
        this.$refs.offline.initChart()
      }
    },
    // 获取是否报名
    getApply() {
      let self = this
      self.$loading.show("加载中");
      Api.getApplyApi().then(res => {
          if (res.code === 0) {
            self.has_apply = res.data.hasApply
          }
        },
        function(err) {
          self.$loading.hide();
          self.$router.replace({ path: "/error", query: { msg: err } });
        }
      );
    }
  },

  mounted() {
    let now = new Date();
    let str = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
    this.today = Date.parse(str) / 1000;
    this.timestamp = this.today;
    this.selectTime = now.getFullYear() + "." + (now.getMonth() + 1) + "." + now.getDate();
    this.saveCurTime = this.selectTime;
    let input = document.getElementById("date");
    input.addEventListener("input", function() {
      this.blur();
    });
    this.getApply()
    this.fetchDailyInfo();
    this.getPeerList()
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  background: #F7F8FA;
  width: 100%;
  min-height: 100vh;
  .date-component {
    opacity: 0;
  }
  .tab{
    width: 100%;
    height: 90/100rem;
    color: #8A92A2;
    font-weight: 500;
    background-color: #ffffff;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    .tab-scroll{
      min-width: 1196/100rem;
      height: 100%;
      padding: 0 78/100rem;
    }
    .left{
      width: 260/100rem;
      height: 90/100rem;
      line-height: 90/100rem;
      text-align: center;
      float: left;
      position: relative;
      span{
        width: 36/100rem;
        height: 4/100rem;
        position: absolute;
        left:50%;
        bottom: -0.01rem;
        transform:translate(-50%,-50%);
        background-color: transparent;
      }
    }
    .active{
      color: #3D424C;
      font-weight: bold;
      span{
        background-color: #5E7BFF;
      }
    }
    ::-webkit-scrollbar{
      display:none;
    }
  }
  .select-time {
    width: 100%;
    height: 120/100rem;
  }
  .left-img {
    margin-left: 1.8rem;
    margin-top: 0.1rem;
  }
  .right-img {
    margin-right :1.8rem;
    margin-top: 0.1rem;
  }
  .curr-time {
    width: 100%;
    height:100%;
    color:#4B77B0;

  }
  .card-box-title{
    width: 690/100rem;
    margin: 0 auto;
    margin-top: 40/100rem;
    margin-bottom: 14/100rem;
    .font-16{
      color: #3D424C;
      font-weight: bold;
    }
    .font-12{
      color: #8A92A2;
      font-weight: 400;
    }
  }
  .some-city{
    .title{
      height: 85/100rem !important;
    }
  }
  .card-box {
    width: 690/100rem;
    box-shadow: 0px 12px 32px 0px rgba(35,36,46,0.04);
    background-color: #ffffff;
    margin: 0 auto;
    margin-bottom: 40/100rem;
    padding-bottom: 45/100rem;
    &:last-child{
      margin-bottom: 0;
    }
    .card-box-city{
      padding: 0 30/100rem 40/100rem;
      border-bottom: 1px solid #F6F8FB;
    }
    .title {
      height: 120/100rem;
      line-height: 120/100rem;
      padding-left: 30/100rem;
      color: #3D424C;
      font-weight: bold;
      .help {
        width: 28/100rem;
        height: 28/100rem;
        margin-left: 20/100rem;
      }
      .more {
        color: #8A92A2;
        margin-right: 30/100rem;
      }
    }
    .card-item {
      width: 345/100rem;
      height: 110/100rem;
      float: left;
      .number:extend(.font-Fu-me) {
        text-align: center;
        line-height: 48/100rem;
        font-weight: 500;
        color: #3D424C;
      }
      .tips {
        text-align: center;
        line-height: 36/100rem;
        color: #8A92A2;
      }
    }
    .card-item-height{
      height: 140/100rem !important;
    }
    &.reduc-bag{
      .card-item {
        height: 110/100rem;
      }
      .right-border:after {
        height: 110/100rem !important;
      }
    }
    .card-item-city {
      width: 196/100rem;
      margin-right: 20/100rem;
      margin-top: 20/100rem;
      float: left;
      height: 156/100rem;
      text-align: center;
      border: 1px solid #F7F7F7;
      box-shadow: 0 0 20px 0 rgba(35,36,46,0.04);
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      &.active{
        border: 1px solid #5E7BFF;
      }
      .number {
        font-weight: bold;
        color: #3D424C;
        line-height: 32/100rem;
        margin-top: 20/100rem;
      }
      .tips {
        color: #8A92A2;
        font-weight: 400;
        line-height: 28/100rem;
        margin-top: 6/100rem;
      }
      .city-up, .city-down {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 14/100rem;
        img{
          width: 32/100rem;
          height: 32/100rem;
          margin-right: 6/100rem;
        }
        .font-12 {
          font-weight: 400;
        }
      }
      .city-down .font-12 {
        color: #21D033;
      }
      .city-up .font-12 {
        color: #F53737;
      }
    }
    .p-t-32 {
      padding-top: 32/100rem;
    }
    .right-border {
      position: relative;
    }
    .right-border:after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 1px;
      background-color: rgba(75, 119, 176, 0.05);
    }
    .bottom-border {
      position: relative;
    }
    .bottom-border:before {
      content: '';
      position: absolute;
      right: -174/100rem;
      bottom: 0;
      height: 1px;
      width: 348/100rem;
      background-color: rgba(75, 119, 176, 0.05);
    }
  }
  .icon-right {
    width: 18/100rem;
    height: 20/100rem;
  }
  .charts {
    width: 100%;
    height: 280px;
  }
  .advice{
    display: flex;
    align-items: center;
    padding: 0 30/100rem;
    .advice-block{
      width: 68/100rem;
      height: 38/100rem;
      border-radius: 0.04rem;
      background: #FF9300;
      color: #ffffff;
      font-weight: 400;
      text-align: center;
      line-height: 38/100rem;
    }
    .advice-title {
      color: #3D424C;
      font-weight: 400;
      margin-left: 10/100rem;
    }
  }
  .blud{
    color: #5E7BFF;
  }
  .modal-content{
    height: auto;
    min-height: 7.78rem;
  }
  .no-customer-bar {
    padding-top: 97/50rem;
  }
  .no-result {
    width: 100%;
    color: #3e434d;
    margin-top: 27/50rem;
    margin-bottom: 15/50rem;
    top: 40/50rem;
    text-align: center;
  }
  .default-img {
    display: block;
    width: 120/50rem;
    height: 120/50rem;
    margin: 0 auto;
    top: 97/50rem;
  }
}
</style>
