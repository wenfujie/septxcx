<template>
    <div class="collocate-design">
        <web-view :src="webViewUrl"></web-view>
    </div>
</template>

<script>
  import { Base, Login } from "../../../api/service";
  export default {
    config: {
      navigationBarTitleText: '单品搭配',
    },
    name: "collocate-design",
    data() {
      return {
        webViewUrl: null,
        companyCode: null,
        code: null
      };
    },
    async onLoad() {
      wx.setNavigationBarTitle({
        title: '单品搭配 ' + this.$route.query.goodsName
      });

      // 获取单点登录code
      await Login.getSingleCode().then((res) => {
        this.code = res;
      });

      // 获取公司编码
      await Base.getCompanyById().then((res) => {
        this.companyCode = res.companyCode;
      });

      this.webViewUrl = 'https://wxxcx.qishon.com/dp/mobile/singleCollocate?flag=1'
        + '&code=' + this.code
        + '&companyCode=' + this.companyCode
        + '&shopCode=' + global.Storage.get('properties').shopCode
        + '&usrId=' + global.Storage.get('USER_INFO').usrId
        + '&vipInfoHdId=' + global.Storage.get('USER_INFO').vipInfoId
        + '&partCode=' + this.$route.query.partCode
        + '&busContsCode=' + global.baseConstant.busContsCode
        + '&showFlag=1'
        + '&theme=septwolves';
    },
    async onShow() {
      // 获取单点登录code
      await Login.getSingleCode().then((res) => {
        this.code = res;
      });

      this.webViewUrl = 'https://wxxcx.qishon.com/dp/mobile/singleCollocate?flag=1'
      + '&code=' + this.code
      + '&companyCode=' + this.companyCode
      + '&shopCode=' + global.Storage.get('properties').shopCode
      + '&usrId=' + global.Storage.get('USER_INFO').usrId
      + '&vipInfoHdId=' + global.Storage.get('USER_INFO').vipInfoId
      + '&partCode=' + this.$route.query.partCode
      + '&busContsCode=' + global.baseConstant.busContsCode
      + '&showFlag=1'
      + '&theme=septwolves'
      + '&isFirst=false';
    },
    onUnload() {
      // 触发购物车角标更新
      this.$store.dispatch('user/updateShoppingCart')
    }
  };
</script>

<style scoped lang="scss">

</style>
