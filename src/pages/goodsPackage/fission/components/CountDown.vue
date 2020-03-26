/*
* createTime：2019/9/19
* author：fujie.wen
* description: 倒计时
*/
<template>
    <div class="main">
        <!--showType!==0表示倒计时未结束，展示倒计时-->
        <div class="main-doing" v-if="showType !== 0">
            <p class="time-title" :style="{'text-align': titleAlign, 'color': titleColor}">{{title}}</p>

            <!--2时显示时分秒倒计时-->
            <ul :class="['time-list', 'flex-center',{'flex-start': titleAlign==='left','flex-end': titleAlign==='right'}]"
                v-if="showType === 2">
                <li class="time-item flex-box" v-for="(item,key) in timeObj" :key="key">
                    <div class="time-item-cont flex-center" :style="{'background': timeBgColor}">{{item}}</div>
                    <div v-if="key !== 'second'" class="time-cut">:</div>
                </li>
            </ul>

            <!--1显示6月25日05：59-->
            <p v-if="showType === 1"
               class="minute-date"
               :style="{color: minuteDateColor,'text-align': titleAlign}">{{minuteDate}}</p>

        </div>

        <!--showType=0表示倒计时结束，内容隐藏，展示结束slot-->
        <div class="main-done" v-else>
            <slot></slot>
        </div>

    </div>
</template>

<script>
    import { Fission } from '@/api/service';

    export default {
        components:{},
        props:{
            // 标题
            title: {
                type: String,
                default: ''
            },
            // 标题颜色
            titleColor: {
                type: String,
                default: '#FF3636'
            },
            // 标题对齐方式(该值被设置到text-align上)
            titleAlign: {
                type: String,
                default: 'center'
            },
            // 时分秒倒计时的背景色
            timeBgColor:{
                type: String,
                default: '#666666'
            },
            // 时分计时 字体色
            minuteDateColor:{
                type: String,
                default: '#FF3636'
            },
            // 目标时间（可以是时间戳或Date类型） 必须是未来时间
            targetTime: 0,
            // 当前服务器时间，不传则调接口获取（可以是时间戳或Date类型）
            spreadServerTime: 0,
            // 与目标时间的时间差小于该时间 则展示时分秒倒计时
            showCountDownStamp:{
                type: Number,
                default: 7200000 // 2h
            },
            //
            // 与目标时间的时间差小于该时间 则展示6月25日05：59时间
            showDateStamp:{
                type: Number,
                default: 172800000 // 48h
            },
            /**
             * 指定计时器类型
             * 1.secondCountDown时分秒倒计时；
             * 2.stringCountDown6月25日05：59；
             * 3.为空时按照文档逻辑走2h<targetTime<48h
             * */
            countDownType: {
                type: String,
                default:''
            }
        },
        data() {
            return {
                timeStampData: 0,// 当前时间到目标时间的时间差
                showType: 0,// 2时显示时分秒倒计时 1显示6月25日05：59  0都不显示
                timeObj: {
                    hour: 0,
                    minute: 0,
                    second: 0,
                },
                minuteDate: '',// 目标时间text
            }
        },
        computed:{
        },
        methods: {
            /** 初始化成时分秒倒计时 **/
            initSecondCountDown(){
                this.timeObj.hour = Math.floor(this.timeStampData/3600000);
                this.timeObj.minute = Math.floor((this.timeStampData%3600000)/60000);
                this.timeObj.second = Math.floor((this.timeStampData%3600000)%60000/1000);

                // 时分秒为个位数时 为其添加0  如01
                for(let key in this.timeObj) {
                    if((this.timeObj[key] + '').length === 1) {
                        this.timeObj[key] = '0' + this.timeObj[key];
                    }
                }
                this.showType = 2;
            },
            /** 初始化成6月25日05：59 文案计时 **/
            initStringCountDown(targetDate){
                let month = targetDate.getMonth() + 1,
                    date = targetDate.getDate(),
                    hour = targetDate.getHours() + '',
                    minute = targetDate.getMinutes() + '';
                this.minuteDate = `${month}月${date}日${hour.length > 1 ? hour : '0'+hour}:${minute.length > 1 ? minute : '0'+minute}`;
                this.showType = 1;
            },
            /** 获取服务器时间 **/
            async getServerDate(){
//                console.log('传的当前服务时间啊啊啊啊啊啊啊啊啊啊啊啊啊=====》',this.spreadServerTime)
                if(this.spreadServerTime) {
                    this.serverTime = new Date(this.spreadServerTime);
                    return
                }
                this.serverTime = +new Date();
                return
                // todo 存在多层传递时间undefined问题
                return await Fission.getServerDate().then(res=>{
                    this.serverTime = new Date(res.replace(/-/g,'/'));
                })
            },
            /** 初始化 **/
            async initComponent(){
                if(!this.targetTime) {
                    this.showType = 0;
                    this.interval && clearInterval(this.interval);
                    return;
                }
                var targetDate = new Date(this.targetTime);

                // 计算当前时间到目标时间的时间差
                this.timeStampData = targetDate - this.serverTime;

                this.interval && clearInterval(this.interval);

                this.interval = setInterval(()=>{
                    this.timeStampData -= 1000;
                    if(this.timeStampData > 0) {

                        // 指定显示时分秒倒计时
                        if(this.countDownType === 'secondCountDown') {
                            this.initSecondCountDown();
                            return
                        }
                        // 指定6月25日05：59倒计时
                        if(this.countDownType === 'stringCountDown'){
                            this.initStringCountDown(targetDate);
                            return
                        }


                        // 2h <= 距离目标时间的时间差 <= 48h
                        if(this.showCountDownStamp <= this.timeStampData && this.timeStampData <= this.showDateStamp) {
                            if(this.showType != 1 || !this.minuteDate) {
                                this.initStringCountDown(targetDate);
                            }

                        }else if(this.timeStampData < this.showCountDownStamp) {// 小于2h时
                            this.initSecondCountDown();
                        }
                    }else{
                        this.showType = 0;
                        clearInterval(this.interval);
                        // 倒计时结束事件
                        this.$emit('over');
                    }
                },1000)
            },
        },
        onLoad() {

        },
        watch:{
            targetTime: {
                immediate: true,
                handler(date) {
                    let callback = ()=>{
                        // 目标时间改变 重新初始化组件
                        this.$nextTick(async ()=>{
                            await this.getServerDate();
                            this.initComponent();
                        })
                    }

                    global.c_debounce(callback,500,this);
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .main{
        .main-doing{
            .time-title {
                color: $domaincolor;
                font-size: $font-small;
            }
            .time-list{
                margin-top: computed(10);
            }
            .time-item{
                font-size: $font-little;
            }
            .time-item-cont {
                color: $color-white;
                width: computed(32);
                height: computed(32);
                border-radius: 50%;
            }
            .minute-date{
                color: $domaincolor;
                font-size: $font-small;
                text-align: center;
            }
        }
    }
    .time-cut{
        margin: 0 computed(7);
    }
</style>
