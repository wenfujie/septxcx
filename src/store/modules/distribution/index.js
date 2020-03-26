/*
* createTime：2019/3/1
* author：en.chen
* description: 分销模块
*/

import { Distribution } from "../../../api/service";
import Storage from '../../../utils/storage'

export default {

    namespaced: true,

    state: {
        distributionId: null,  // 分销商id
        levelCodesList: {    // 上下级等级编码数组
            'D_MATRULELEVEL01':[
                {
                    code: 0,
                    name: '全部会员'
                },
                {
                    code: 1,
                    name: '下级会员'
                },
            ],
            'D_MATRULELEVEL02':[
                {
                    code: 0,
                    name: '全部会员'
                },
                {
                    code: 1,
                    name: '下级会员'
                },
                {
                    code: 2,
                    name: '次级会员'
                },
            ],
            'D_MATRULELEVEL03':[
                {
                    code: 0,
                    name: '全部会员'
                },
                {
                    code: 1,
                    name: '下级会员'
                },
                {
                    code: 2,
                    name: '次级会员'
                },
                {
                    code: 3,
                    name: '三级会员'
                },
            ],
        },
        accountInfo: {},  // 分销商中心选中的分销商信息
    },

    actions: {
        //  获取分销商id
        async getDistributionId({commit, state}) {
            if(!!state.distributionId) {
                return state.distributionId
            }else{
                let params = {
                    vipInfoHdId: Storage.get('USER_INFO').vipInfoId
                }
                let res = await Distribution.getVipInfo(params);
                let data = {
                    storeKey: 'distributionId',
                    storeValue: res.id
                }
                commit("setData", data)
                return res.id;
            }
        },
    },

    mutations: {
        //  设置数据
        setData(state,data) {
            state[data.storeKey] = data.storeValue
        },
    }
};
