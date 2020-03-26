/*
* createTime：2019/6/20
* author：fujie.wen
* description: 会员整合弹窗
*/
<template>
    <div>
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>

        <van-popup :show="show" custom-style="border-radius: 20rpx; overflow: hidden;">
            <div class="cont">
                <p class="merge-describe">
                    经系统检测，以下账号同属于您，请您确认，确认后，系统会将您的部分信息整合在一起
                </p>
                <ul class="merge-list">
                    <li class="merge-item"
                        :key="index"
                        v-for="(item,index) in memberList">
                        {{filter.phoneMask(item.mobilePhone)}}（{{item.vipAccount}}）
                    </li>
                </ul>
                <ul class="btn-list flex-hcenter">
                    <li class="btn-li" @click="cancelDialog">不整合</li>
                    <li class="btn-li main-btn" @click="confirmDialog">去确认</li>
                </ul>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import MemberMergeMixins from '@/pages/UserPackage/merge/mixins/MemberMergeMixins'
    import { UserService } from "@/api/service";
    import Toast from "vant-weapp/dist/toast/toast";

    export default {
        mixins: [ MemberMergeMixins ],
        components:{
        },
        props:{

        },
        data() {
            return {
                show: false,// 控制弹窗显示
                memberList: [], //会员列表

            }
        },
        methods: {
            /** 获取整合数据 **/
            async getMergeList(needShow){
                // 传1 表示弹窗调用
                this.memberList = await this.m_getMemberList(1);
                if(needShow && this.memberList.length){
                    this.dialogVisibleState();
                }
            },
            // 弹窗取消事件
            cancelDialog(){
                let data = {
                    vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                    confirmFlag: 0,// 0 表示不整合
                    ids: this.memberList.map(item => item.id)
                }
                UserService.memberMergeOperator(data).then(async (res)=>{
                    if(res != 1){
                        Toast('操作失败');
                        return;
                    }
                    this.dialogVisibleState(false);
                }, err=>{
                    Toast(err.errorMsg);
                })
            },
            // 弹窗确认事件
            confirmDialog(){
                this.dialogVisibleState(false);
                this.$router.push('/pages/UserPackage/merge/member-merge-form?useParent=dialog');
            },
            // 控制弹窗显示状态
            dialogVisibleState(boolean=true){
                this.show = boolean;
            },
        },
        watch:{
            memberList: {
                deep:true,
                immediate: true,
                handler(list){
                    global.updateRelationAccountLength();
                    this.$emit('changeList',list);
                }
            }
        },
        created() {
            this.getMergeList();
        },
    }
</script>

<style scoped lang="scss">
    .cont {
        padding: computed(50);
        width: computed(560);
        box-sizing: border-box;
        border-radius: computed(20);
        overflow: hidden;
        .merge-describe {
            color: #666;
            font-size: computed(24);
            line-height: computed(40);
            text-align: left;
        }
    }
    .merge-list{
        font-size: computed(24);
        padding: computed(15) 0;
        .merge-item{
            line-height: computed(46);
        }
    }
    .btn-list{
        padding-top: computed(30);
        .btn-li {
            line-height: computed(50);
            width: computed(180);
            text-align: center;
            border: computed(1) solid $domaincolor;
            border-radius: computed(25);
            overflow: hidden;
            font-size: computed(24);
            color: $domaincolor;
            &.main-btn{
                background: $domaincolor;
                color: $color-white;
                margin-left: computed(36);
            }
        }
    }
</style>
