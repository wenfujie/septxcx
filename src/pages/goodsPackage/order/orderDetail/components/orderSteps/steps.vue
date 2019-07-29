<!--
 * @Author: yongtian.hong
 * @LastEditors: yongtian.hong
 * @Description: 订单进度组件
 * @Date: 2019-04-17 19:06:57
 * @LastEditTime: 2019-05-29 19:36:39
 -->
 <style lang='scss' scoped>
.steps {
  position: relative;
  width: 100%;
  font-size: 0;
  padding: 0 10px 70px 10px;
  margin-bottom: computed(20);
  box-sizing: border-box;
}
</style>
 
 <template>
  <div class="steps">
    <step
      v-for="(step,index) in steps"
      :key="index"
      :cur-index="index"
      :node="step"
      :active="activeIndex"
      :length="stepLen"
    />
  </div>
</template>
 
 <script>
import getStepsText from "./stepText";
import check from "@/utils/check";
import step from "./step";
export default {
  name: "OrderStep",
  components: {
    step
  },
  props: {
    pkg: Object
  },
  data() {
    return {
      steps: [],
      errMsg: {
        kdps: "已取消发货",
        mdzq: "已取消发货"
      },
      activeIndex: 1
    };
  },
  methods: {
    //初始化步骤
    initState(pkg) {
      if(check.isEmpty(pkg)) return;  
      const stepsText = getStepsText();

      const steps = stepsText[pkg.shippingWayCode];
      // 加载配送方式映射表
     

      if (check.isEmpty(pkg.nodeTime)) {
        pkg.nodeCode = 3;
 
        steps[pkg.nodeCode - 1].name = this.errMsg[pkg.shippingWayCode];
      } else {

        steps[pkg.nodeCode - 1].time = pkg.nodeTime;
      }
      this.activeIndex = pkg.nodeCode - 1;
      this.steps = steps;
    }
  },
  computed: {
    stepLen: function() {
      return this.steps.length - 1;
    }
  },
  created() {

    this.initState(this.pkg);
  },


  watch: {
    pkg: {
      handler(pkg) {
        this.initState(pkg);
      },
      deep: true
    }
  }
};
</script>
 