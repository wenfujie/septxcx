/*
 * @Author: wxx 
 * @Date: 2019-06-21 11:28:22 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-07-07 16:34:33
 * @Description: 物流进度组件
   @传入数据结构说明 
   data:{
     shippingWayCode:"kdps",//快递配送方式
     expressCode:"",//快递运营商代码编号，如YTO(圆通)
     expressNo:""//快递单号
   } 
 */


 <style lang='scss' scoped>
.logis-wrap {
  font-size: computed(24);
  margin-bottom: computed(30);
  background: #fff;
  border-top: dashed 1px #b3b3b3;
  border-bottom: dashed 1px #b3b3b3;
  .logis-company {
    font-size: computed(24);
    padding: computed(10) 0;
    &-name {
      margin-bottom: computed(10);
    }
    &-code {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-copy {
      outline: none;
      border: solid 1px #333333;
      border-radius: 10px;
      background: #fff;
      padding: computed(3) computed(5) ;
      
    }
  }
  .title {
    font-size: computed(30);
    font-weight: bold;
    margin-top: computed(30);
    text-align: center;
  }
  .content {
    max-height: 300px;
    .van-steps--vertical {
      font-size: computed(24);
      padding: 0 0 0 20px;
    }
  }
  .toggle {
    font-size: computed(26);
    text-align: center;
    background: #fff;
    margin-bottom: computed(20);
  }
  .text {
    color: #999999;
    font-size: computed(20);
    margin-bottom: computed(20);
  }
}
.rotatingUp {
  transition: all 0.5s;
  transform: rotate(-180deg);
  display: inline-block;
}
.rotatingDown {
  transition: all 0.5s;
  display: inline-block;
}
</style>
 
 <template>
  <div class="logis-wrap" v-if="isReady">
    <div class="logis-company">
      <div class="logis-company-name">物流公司:&nbsp;{{data.expressName}}</div>
      <div class="logis-company-code">
        <span>
          物流单号:&nbsp;
          <span id="logis-expressNo">{{data.expressNo}}</span> &nbsp;
        </span>
        <div class="btn-copy" @click="copyTBL()">复制单号</div>
      </div>
    </div>

    <div class="content overflow-scroll" v-if="!noResult">
      <van-steps direction="vertical" :steps="steps" :active="0" active-color="#000"></van-steps>
    </div>
    <div class="toggle" @click="toggle()" v-if="traceList.length>1">
      <span v-if="!noResult">{{actionName}}</span>
      <i class="iconfont icon-down" :class="direction? 'rotatingUp' : 'rotatingDown' "></i>
    </div>
    <div class="text" v-if="noResult">
      尊敬的客户您好，您的商品已发货，系统无法查询到物流信息.
      如您需 要查询，可复制快递单号进行查询，给您带来的不便，敬请谅解！
    </div>
  </div>
</template>
 
 <script>
// import { Step, Steps, Toast } from "vant";
import check from "@/utils/check";
import thirdPartyApi from "@/api/service/thirdParty";
export default {
  props: {
    data: {},
    title: {
      type: String,
      default: "物流信息"
    }
  },
  data() {
    return {
      steps: [],
      logis: {},
      logisCache: {},
      traceList: [],
      steps: [],
      actionName: "查看更多",
      direction: false,
      isReady: false
    };
  },

  methods: {
    copyTBL(e) {
      var self = this;
      wx.setClipboardData({
        data: self.data.expressNo,
        success: function(res) {
          wx.showModal({
            title: "提示",
            content: "复制成功"
          });
        }
      });
    },
    // 获取物流
    async getLogisInfo() {
      this.logis = {};
      let params = {
        expressCode: this.data.expressCode,
        logisticCode: this.data.expressNo
      };
      // 检查是否获取过该单号结果
      if (!check.isEmpty(this.logisCache[this.data.expressNo])) {
        this.logis = this.logisCache[this.data.expressNo];
      } else {
        this.logis = await thirdPartyApi.getLogis(params).catch(() => {
          Toast("获取物流信息失败");
        });
        this.logisCache[this.data.expressNo] = this.logis;
      }
      if (check.isEmpty(this.logis)) return;
      this.isReady = true;
      this.traceList = this.logis.traceList;
      this.traceList.forEach(item => {
        item.text = item.acceptTime;
        item.desc = item.acceptStation;
      });
      this.steps = this.traceList.slice(0, 1);
      console.log(this.steps, " this.steps");

      console.log(this.direction, "direction");
      console.log(this.actionName, "actionName");
    },
    toggle() {
      if (this.steps.length <= 2) {
        this.steps = this.traceList;

        this.actionName = "收起";
        this.direction = true;
      } else {
        this.steps = this.traceList.slice(0, 1);
        this.direction = false;
        this.actionName = "查看更多";
      }
    },

    initData() {
      this.isReady = false;
      if (this.data.shippingWayCode === "kdps" && this.data.expressNo) {
        this.getLogisInfo();
      }
    }
  },
  onShow() {
    this.direction = false;
    this.actionName = "查看更多";
    this.initData();
  },
  computed: {
    noResult: function() {
      return this.logis.state == "暂无轨迹信息" ? true : false;
    }
  },
  watch: {
    data: {
      handler() {
        this.initData();
      },
      deep: true
    }
  }
};
</script>
