<style lang='scss' scoped>
.good-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: computed(30) 0;
  box-sizing: border-box;
  border-bottom: dashed 1px #b3b3b3;
  .good {
    display: flex;
    margin-bottom: computed(20);
    .imgBox {
      width: computed(140);
      height: computed(140);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .good-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding-left: computed(10);
      .cloth-name-price {
        display: flex;
        justify-content: space-between;
        font-size: computed(28);
        .name {
          max-width: 75%;
        }
        .price {
          text-align: right;
        }
        .ord-qty {
          color: #666666;
        }
      }
      .size-color-number {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        color: #999999;
        font-size: computed(24);
        .color {
          margin-left: computed(10);
        }
      }
    }
  }
  .btn-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: computed(24);
    .btn-apply {
      font-size: computed(24);

      color: rgba(51, 51, 51, 1);
      text-align: center;
      height: computed(40);
      margin: 0 computed(6);
      outline: none;
      border: 1px solid rgba(102, 102, 102, 1);
      border-radius: computed(20);
      background: #fff;
      line-height: computed(40);
    }
  }
}
.good-wrap:last-child {
  margin-bottom: computed(20);
  border: none;
}
</style>

<template>
  <div class="good-wrap">
    <wxs module="filter" src="../../../../../../filter/filterCommon.wxs"></wxs>
    <div class="good" @click.stop="viewGoodDetail()">
      <div class="imgBox">
        <img class="img-responsive" :src="filter.imgFilter(good.thumb,companyId, '140*140')" alt />
      </div>
      <div class="good-info">
        <div class="cloth-name-price fs28">
          <p class="name">{{good.goodsName}}</p>
          <div class="price">
            <span>¥{{good.averagePrice}}</span>
            <div class="ord-qty">x{{good.ordQty}}</div>
          </div>
        </div>
        <div class="size-color-number">
          <div class="color">
            <span>尺码&nbsp;:&nbsp;{{good.sizeName}}&nbsp;&nbsp;&nbsp;</span>
            <span>颜色&nbsp;:&nbsp;{{good.colorName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <button v-if="btnApply" class="btn-apply" @click.stop="onBtnClick(btnApply)">{{btnApply}}</button>
      <button
        v-if="btnViewDetail"
        class="btn-apply"
        @click.stop="onBtnClick(btnViewDetail)"
      >{{btnViewDetail}}</button>
    </div>
  </div>
</template>

<script>
import check from "@/utils/check";
import {Goods} from '../../../../../../api/service';
export default {
  props: {
    good: Object,
    fpsCode: {
      type: String,
      default: ""
     },
    onlineHdId:{
      type: String,
      default: ""
     }
  },
  data() {
    return {
      companyId: global.Storage.get("COMPANYID").company_id,
      btnApply: null, //申请按钮,
      btnViewDetail: null, //查看详情按钮
      unApplyableOrdStatus: ["D_TRANSCLOSE", "D_ORDSPAYING", "D_ORDCANCEL"], //不允许售后的订单状态
      goDetail_lock:false,////跳转商品详情锁
      fissionType:'',// 裂变类型
    };
  },
  methods: {
    // 售后状态初始化
    initState() {
      const ordStateCode = this.$root.$mp.query.ordStatusCode;
      this.btnViewDetail = !check.isEmpty(this.good.reapplyCodes)
        ? "售后详情"
        : null;
      this.btnApply = this.good.applyable ? "申请售后" : null;
      this.btnApply = this.unApplyableOrdStatus.includes(ordStateCode)
        ? null
        : this.btnApply;
    },

    // 申请售后
    applyPostSale() {
      let good = Object.assign(this.good, { allQty: this.good.ordQty });
      this.$store.commit("afterSale/apply/updateApplyGood", good);
      this.$router.push("/pages/afterSalePackage/afterSale/pages/apply/page");
    },

    //查看售后详情
    viewPostSaleDetail() {
      let num = this.good.reapplyCodes.length;
      if (num === 1) {
        this.$router.push({
          path: "/pages/afterSalePackage/afterSale/pages/detail/page",
          query: {
            reapplycode: this.good.reapplyCodes[0]
          }
        });
      } else {
        this.$router.push({
          path: "/pages/afterSalePackage/afterSale/pages/list/page"
        });
      }
    },

    // 查看商品详情
    viewGoodDetail() {
      let params = {
        ownCompanyId: global.Storage.get("COMPANYID").company_id,
        goodsCode: this.good.goodsCode,
        buscontsCode: global.baseConstant.busContsCode
      };
      Goods.isShelves(params).then(
        res => {
          // 未导入微信平台和全平台跳转至商品未上架页面
          if (!res) {
            this.$router.push("/pages/goodsPackage/goods/off-shelves");
            this.goDetail_lock = false;
          } else {
            // fpsCode字段来判断是否为裂变促销
            if(!this.fpsCode){
              this.$router.push({
                path: "/pages/goodsPackage/wares/wares-detail",
                query: {
                 goodsCode: this.good.goodsCode,
                 isGift: this.good.isGift == 1 ? 1 : 0
               }
             });
            }else{
               let url = `&goodsCode=${this.good.goodsCode}&onlineHdId=${this.onlineHdId}`;
               if(this.fpsCode==='SECKILL'){
                //  秒杀
                 this.$router.push('/pages/goodsPackage/wares/wares-detail?fissionType=1' + url);
               }else if(this.fpsCode==='GROUP'){
                //  拼团
                  this.$router.push('/pages/goodsPackage/wares/wares-detail?fissionType=2' + url);
               }else if(this.fpsCode==='BARGAIN'){
                //  砍价
                  let queryUrl = `?goodsCode=${this.good.goodsCode}&onlineHdId=${this.onlineHdId}`;
                  this.$router.push('/pages/goodsPackage/fission/bargain/bargain-detail' + queryUrl);
               }
            }
            this.goDetail_lock = false;
          }
        },
        () => {
          this.goDetail_lock = false;
        }
      );
    },

    //点击事件
    onBtnClick(name) {
      switch (name) {
        case "申请售后":
          this.applyPostSale();
          break;
        case "售后详情":
          this.viewPostSaleDetail();
          break;
        default:
          this.btnApply = null;
          this.btnViewDetail = null;
      }
    }
  },
  created() {
    this.initState();
    console.log(this.onlineHdId,'onlineHdId')
  },
  onLoad() {
    this.fissionType = this.$route.query.fissionType;
  },
  onHide() {
    // 解决重复进页面数据未初始化
    Object.assign(this.$data, this.$options.data());
  },
  watch: {
    good: function() {
      this.initState();
    }
  }
};
</script>
