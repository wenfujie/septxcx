/*
* createTime：2019/8/27
* author：fujie.wen
* description: 已整合用户下拉组件
*/
<template>
    <div>
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>

        <div class="drop-label" @click="handlerClickLabel">
            {{activeItem.text}}
            <span class="iconfont iconicondown-copy"></span>
        </div>

        <van-popup :show="showDropdown" position="bottom">
            <van-picker
                v-if="showDropdown"
                :show-toolbar="true"
                value-key="text"
                :columns="accountList"
                :default-index="activeIndex"
                @confirm="onConfirm"
                @cancel="onCancel"
            ></van-picker>
        </van-popup>
    </div>
</template>

<script>
    import { UserService } from "@/api/service";

    export default {
        components:{},
        data() {
            return {
                showDropdown: false,// 显示下拉弹窗
                accountList: [],// 用户列表
                activeIndex: -1,// 选中行索引
            }
        },
        props:{
            // 是否过滤不是分销商账号
            hasFilterDistribution:{
                type: Boolean,
                default:false
            },
            // 选中'所有账号'选项id（该值>0表示显示 '所有账号'选项，否则不显示）
            allAccountId:{
                type: Number,
                default: 0
            },
            // 默认选中项的id
            defaultSelectedId:{
                type: Number,
                default: ()=>{
                    return global.Storage.get('USER_INFO').vipInfoId;
                }
            }
        },
        computed:{
            activeItem() {
                if(this.activeIndex >= 0) {
                    return this.accountList[this.activeIndex];
                }
                return {};
            }
        },
        methods: {
            /** 点击下拉label **/
            handlerClickLabel(){
                this.$emit('onOpen');
                this.showDropdown = true;
            },
            /** 取消 **/
            onCancel(event){
                this.$emit('onCancel');
                this.showDropdown = false;
            },
            /** 确认 **/
            onConfirm(event){
                let item = event.mp.detail;
                this.activeIndex = item.index;
                this.showDropdown = false;

                // 抛出确认事件 params：item,index
                this.$emit('onConfirm',item.value,item.index);
            },
            /** 获取已整合数据 **/
            getAccountList(){
                const vipInfoId =  global.Storage.get('USER_INFO').vipInfoId;
                let data = {
                    vipInfoHdId: vipInfoId,
                    isMdt: this.hasFilterDistribution?1:0 // 为1时过滤掉不是分销商用户
                }
                // 增加缓存变量(会员整合用户长度)
                UserService.getRelationAccountList(data).then(res => {
                    // 抛出处理前的数据
                    let list = res.slice(0);
                    this.$emit('getList', list);
                    // 手机号码增加掩码
                    res.forEach(item=>{
                        if(item.id === vipInfoId) {
                            item.text = '当前账号';
                        }else{
                            item.text = this.filter.phoneMask(item.mobilePhone) || '该用户无手机号';
                        }
                    })
                    // 增加所有账号选项
                    if(this.allAccountId) {
                        res.unshift({id:this.allAccountId, text: '所有账号'});
                    }
                    this.accountList = res;
                    this.$nextTick(()=>{
                        // 默认选中当前用户
                        this.accountList.some((item, index)=>{
                            if(item.id == this.defaultSelectedId) {
                                this.activeIndex = index;
                                return true;
                            }
                        })
                    })
                },()=>{this.$emit('getList', []);})
            },
        },
        onLoad() {
            this.getAccountList();
        }
    }
</script>

<style scoped lang="scss">
    .drop-label {
        text-align: center;
        line-height: computed(80);
        background: $color-white;
        width: 100%;
        font-size: $font-regular;
        color: $text-regular;
    }
    .iconicondown-copy{
        font-weight: bold;
    }
</style>
