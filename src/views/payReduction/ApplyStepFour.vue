<template>
  <div class="apply-step-four" :class="{'of-h':show_modal}">
    <TimeLine step="4"/>
    <div class="step-desc">
      <div>
        <span class="round-num">4</span>
        <span class="desc">设置支付有礼、评价有礼券</span>
      </div>
      <div class="guide">
        <span>不知道怎么设置优惠券？</span>
        <span class="blue" @click="showPop(true)">点击查看</span>
      </div>
    </div>
    <div class="plain-text">根据行业历史活动的数据反馈，支付后配置门店通用优惠券，能提高用户回头、复购率25.5%。</div>
    <div class="step-desc">
      <div>
        <img class="img-msg" src="../../assets/application/newmail.png">
        <span class="desc">优惠券设置建议</span>
      </div>
    </div>
    <div class="recommend-table">
      <table>
        <thead>
          <tr>
            <th>营销类型</th>
            <th>优惠券名称</th>
            <th>建议类型</th>
            <th>适用范围</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>支付有礼</td>
            <td>
              <div>壳牌保养</div>
              <div>优惠券</div>
            </td>
            <td>
              <div>满599减50</div>
              <div>满699减60</div>
            </td>
            <td>
              <div>满599减50</div>
              <div>满699减60</div>
            </td>
          </tr>
          <tr>
            <td>支付有礼</td>
            <td>
              <div>壳牌保养</div>
              <div>优惠券</div>
            </td>
            <td>满99减20</td>
            <td>壳保养卡</td>
          </tr>
          <tr>
            <td>支付有礼</td>
            <td>
              <div>洗车/美容/</div>
              <div>贴膜等优惠券</div>
            </td>
            <td>门店自主制定</td>
            <td>门店自主制定</td>
          </tr>
          <tr>
            <td>评价有礼</td>
            <td>
              <div>评价有礼</div>
              <div>通用优惠券</div>
            </td>
            <td>
              <div>5元通用</div>
              <div>代金券</div>
            </td>
            <td>小程序通用</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="round-btn" @click="confirm()">我确认已配置</div>
    <!-- 指引弹窗 -->
    <div class="popup" v-show="show_modal">
      <div class="modal"></div>

      <div class="header">
        <span>优惠券配置操作指引</span>
        <img @click="showPop(false)" src="../../assets/application/close2.png">
      </div>
      <div class="img-box">
        <img src="../../assets/application/reduction-modal2.png" alt>
      </div>
    </div>
  </div>
</template>
<script>
import TimeLine from "@/components/payReduction/TimeLine.vue";
import Mixes from "./mixin/payReductionPublic";
export default {
  mixins: [Mixes],
  components: {
    TimeLine
  },
  data() {
    return {
      show_modal: false
    };
  },
  methods: {
    confirm() {
      this.updateInfo({ step: 4 }, "apply-step-done");
    },
    showPop(bool) {
      this.show_modal = bool;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/progress.less";

.plain-text {
  line-height: 0.42rem;
  padding: 0.4rem 0.3rem;
  margin: 0 0.3rem;
  font-size: 0.28rem;
  color: #3d424c;
  background: #fff;
  border-radius: 2px;
}
.img-msg {
  width: 0.32rem;
  height: 0.32rem;
  vertical-align: middle;
  margin-right: 0.1rem;
}
.recommend-table {
  margin: 0.3rem;
  font-size: 0.24rem;
  table {
    width: 100%;
    thead {
      tr {
        background: #5e7bff;
        border-radius: 2px;
        height: 1.24rem;
        th {
          width: 25%;
          text-align: center;
          color: #fff;
          border-right: 1px solid #fff;
        }
        th:last-child {
          border-right: none;
        }
      }
    }
    tbody {
      tr {
        border-bottom: 1px solid #eff0f3;
        height: 1.64rem;
        text-align: center;
        color: #3d424c;
        td {
          border-right: 1px solid #eff0f3;
          div {
            line-height: 0.42rem;
          }
        }
        td:nth-child(even) {
          background: #f6f8ff;
        }
        td:nth-child(odd) {
          background: #fff;
        }
      }
    }
  }
}
.round-btn {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}
.apply-step-four {
  padding-bottom: 1px;
}

// 弹窗
.of-h {
  overflow: hidden;
  height: 100vh;
}
.popup {
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  .header {
    text-align: center;
    line-height: 1.3rem;
    color: #fff;
    font-size: 0.32rem;
    background: #4b77b0;
    position: absolute;
    top: 0.8rem;
    left: 0.3rem;
    right: 0.3rem;
    img {
      position: absolute;
      width: 0.52rem;
      height: 0.52rem;
      top: 0.3rem;
      right: 0.3rem;
    }
  }
  .img-box {
    overflow: scroll;
    position: absolute;
    top: 2.1rem;
    left: 0.3rem;
    right: 0.3rem;
    max-height: 80vh;
    background: #fff;
    img {
      width: 100%;
    }
  }
}
</style>
