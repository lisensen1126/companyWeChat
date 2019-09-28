<template>
  <div class="index">
    <div class="list" v-for="(item, index) in list" :key="index">
      <div class="title font-16">项目{{index + 1}}
        <div class="del font-14 pull-right" v-if="list.length > 1" @click="delItem(item, index)">删除</div>
      </div>
      <div class="content">
        <div class="list-item clearfix">
          <div class="left font-14 pull-left">
            项目名称
          </div>
          <div class="right font-14 pull-right">
            <input type="text" class="font-14" v-model.trim="item.item_title" placeholder="请输入项目名称上限15个字" maxlength="15">
          </div>
        </div>
        <div class="list-item clearfix">
          <div class="left font-14 pull-left">
            项目价格
          </div>
          <div class="right font-14 pull-right">
            <input type="text" class="font-14" v-model="item.unit_price" @input="moneyChange(item)" placeholder="请输入项目单价金额">
          </div>
        </div>
        <div class="list-item clearfix">
          <div class="left font-14 pull-left">
            项目数量
          </div>
          <div class="right-num pull-right">
            <div class="reduce" @click="reduce(item, index)"></div>
            <div class="value font-16">{{item.quantity}}</div>
            <div class="add" @click="add(item)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-item font-14" @click="addItem">+ 增加项目</div>
    <div class="submit active-sku font-14" @click="saveLocal">
      完成创建
    </div>

    <!-- 确认添加项目 -->
    <div class="modal" v-show="show_tips">
      <div class="content">
        <div class="box">
          <div class="title font-16">温馨提示</div>
          <div class="text font-16">是否将已创建的项目 加入至清单中？</div>
          <div class="footer">
            <div class="left font-16" @click="cancel">否</div>
            <div class="right font-16" @click="save">是</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目添加成功 -->
    <div class="success" v-show="show_success">
      <img src="../../assets/application/success.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          item_id: 0,
          item_type: 4,
          item_title: '',
          image_url: '',
          quantity: 1,
          unit_price: null,
        }
      ],
      show_tips: false,
      show_success: false,
      send_list: [],
    };
  },
  methods: {
    // 
    moneyChange (item) {
      if (item.unit_price.length > 0) item.unit_price = item.unit_price.replace(/[^\d/.]/g,'')
      if (item.unit_price.length > 9) item.unit_price = item.unit_price.slice(0,9)
    },
    // 增加数量
    add (item) {
      item.quantity ++
    },

    // 减少数量
    reduce (item, index) {
      if (item.quantity == 1 && this.list.length == 1) return
      item.quantity --
      if (item.quantity == 0 && this.list.length > 1) this.$delete(this.list, index)
    },

    // 删除项目
    delItem (item, index) {
      this.$delete(this.list, index)
    },

    // 添加项目
    addItem () {
      if (this.list.length == 10) {
        this.$toast.error('尊敬的用户，项目最多创建10个', 3000)
        return
      }
      let item = {
        item_id: 0,
        item_type: 4,
        item_title: '',
        image_url: '',
        quantity: 1,
        unit_price: null,
        show_tips: false,
      }
      this.list.push(item)
    },

    // 价格校验
    priceChange (item) {
      let reg = /^([1-9][\d]{0,8}|0)(\.[\d]{1,2})?$/
      return reg.test(item) && item > 0 && item <= 200000
    },

    // 取消
    cancel () {
      this.show_tips = false
    },

    // 保存数据到本地
    saveLocal () {
      let self = this
      let is_true = true
      self.send_list = []
      this.list.forEach( v => {
        if (v.item_title == '' || !self.priceChange(v.unit_price)) {
          is_true = false
        }
        if (v.item_type !='' && v.unit_price !='' && self.priceChange(v.unit_price)) {
          self.send_list.push(v)
        }
      })
      if (!is_true && self.send_list.length == 0) {
        this.$toast.error('名称、金额不能为空，且金额最多两位小数不能大于20万', 3000)
        return
      }
      this.show_tips = true
    },

    // 
    save () {
      let self = this
      // 保存到购物车
      let storage = window.localStorage
      if (storage.getItem('cy_car')) {
        let store_arr =  JSON.parse(storage.getItem('cy_car'))
        store_arr = [...store_arr, ...this.send_list]

        store_arr = JSON.stringify(store_arr)
        storage.setItem('cy_car', store_arr)
      } else {
        let store_arr = JSON.stringify(this.send_list)
        storage.setItem('cy_car', store_arr)
      }
      this.show_tips = false
      this.show_success = true
      // 保存成功返回上一页
      setTimeout(() =>{
        self.$router.go(-1)
      }, 2000)
    }
  },

  mounted() {
  },
};
</script>
<style lang="less" scoped>
@import "../../less/report-common.less";
.index{
  width: 100%;
  min-height: 100vh;
  background-color: #F7F8FA;
  padding-bottom: 140/100rem;
  .list{
    width: 690/100rem;
    margin: 0 auto;
    padding-top:20/100rem;   
    .title{
      padding: 20/100rem 0;
      font-weight: bold;
      color: #3D424C;
      .del{
        color: #8A92A2
      }
    }
    .content{
      background-color: #fff;
      box-shadow: 0 12/100rem 32/100rem 0 rgba(35,36,46,0.04);
      border-radius: 4/100rem;
      .list-item{
        height: 1rem;
        line-height: 1rem;
        width: 100%;
        border-bottom: 1px solid #F0F0F0;
        padding: 0 20/100rem;
        overflow: hidden;
        .left{
          color: #8A92A2;
        }
        .right{
          input{
            height: 1rem;
            line-height: 1rem;
            text-align: right;
            color: #3D424C;
            width: 480/100rem;
          }
        }
        .right-num{
          width: 208/100rem;
          height: 56/100rem;
          margin-top: 24/100rem;
          display: flex;
          justify-content: space-around;
          border: 1px solid #F7F7F7;
          .reduce{
            width: 56/100rem;
            height: 56/100rem;
            background: url('../../assets/application/reduce.png') no-repeat center;
            background-size: 20/100rem;
          }
          .value{
            width: 96/100rem;
            height: 56/100rem;
            line-height: 56/100rem;
            text-align: center;
            background-color: #F7F7F7;
            color: #404040;
          }
          .add{
            width: 56/100rem;
            height: 56/100rem;
            background: url('../../assets/application/add-shi.png') no-repeat center;
            background-size: 20/100rem;
          }
        }
      }
    }
  }
  .add-item{
    width: 690/100rem;
    height: 100/100rem;
    line-height: 100/100rem;
    text-align: center;
    box-shadow: 0 12/100rem 32/100rem 0 rgba(35,36,46,0.04);
    border-radius: 4/100rem;
    font-weight: bold;
    background-color: #fff;
    margin: 0 auto;
    margin-top: 20/100rem;
    color: #5E7BFF;
  }
  .submit{
    width: 690/100rem;
    height: 76/100rem;
    line-height: 76/100rem;
    border-radius: 76/100rem;
    color: #fff;
    background-color: #5E7BFF;
    margin: 0 auto;
    margin-top: 40/100rem;
    text-align: center;
    position: fixed;
    left: 30/100rem;
    bottom: 40/100rem;
    box-shadow:0px 12/100rem 24/100rem 0px rgba(94,123,255,0.3);
  }
  .modal{
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    right: 0;
    .content{
      width: 660/100rem;
      min-height: 420/100rem;
      background-color: #fff;
      position: absolute;
      left: 45/100rem;
      top: 30%;
      .title{
        width: 100%;
        height: 124/100rem;
        line-height: 124/100rem;
        text-align: center;
        background-color: #4B77B0;
        color: #fff;
      }
      .text{
        width: 400/100rem;
        text-align: center;
        color: #3D424C;
        margin: 0 auto;
        margin-top: 60/100rem;
      }
      .box{
        width: 100%;
        height: 420/100rem;
        position: relative;
      }
      .footer{
        width: 100%;
        height: 106/100rem;
        border-top: 1px solid #F0F0F0;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        text-align: center;
        .left{
          width: 50%;
          line-height: 106/100rem;
          border-right: 1px solid #F0F0F0;
          color: #404040;
        }
        .right{
          width: 50%;
          line-height: 106/100rem;
          color: #4B77B0;
        }
      }
    }
  }
  .success{
    width: 320/100rem;
    height: 280/100rem;
    position: fixed;
    top: 30%;
    left: 216/100rem;
    img{
      width: 320/100rem;
      height: 280/100rem;
    }
  }
}
</style>
