<script>
    import { UserService } from "@/api/service";

    export default {
        methods:{
            // 获取会员列表 弹窗传1  非弹窗传0
            async m_getMemberList(windowFlag = 0){
                let data = {
                    vipInfoHdId: global.Storage.get('USER_INFO').vipInfoId,
                    windowFlag: windowFlag,// 1弹窗 0非弹窗
                }
                let memberMergeList = await UserService.memberMergeList(data);
                return memberMergeList;
            },
        }
    }
</script>
