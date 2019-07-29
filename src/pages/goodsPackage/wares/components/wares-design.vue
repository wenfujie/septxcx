<template>
    <div class="wares-design">
        <iframe :src="url" id="collationPage"></iframe>
        <van-popup v-model="showPopup">
            <phone-popup :showPopup.sync="showPopup" :showMessage.sync="showMessage"></phone-popup>
        </van-popup>
    </div>
</template>

<script>
    import { UserService } from "../../../api/service";
    import { Popup } from 'vant'
    import phonePopup from '@/components/popup-phone'
    export default {
        components: {
            'van-popup': Popup,
            phonePopup
        },
        name: 'wares-design',
        data() {
            return {
                url: '',
                showPopup: false,
                showMessage: ''
            }
        },
        watch: {
            showMessage:function () {
                if(this.showMessage === true) {
                    // 发送信息给子页面
                    this.postMessage(true);
                }
            }
        },
        created() {
            this.url = window.location.origin  + '/dp/mobile/collocate?' + this.$route.query.params;
            // 监听子页面发送的数据
            window.addEventListener('message', (event => {
                // 是否绑定手机号
                if (event.data.isBindPhone) {
                    // 开启绑定手机号弹窗
                    this.showPopup = true;
                }else if (event.data.operate) {
                    if (event.data.operate === "addCart") {    // 加入购物车
                        console.log("需要刷新购物车数量")
                    }
                }
                // console.log("收到" + event.origin + "消息", event.data)
            }), false);
        },
        methods: {
            postMessage(isBindPhone){
                let collationPage = document.getElementById('collationPage');
                collationPage.contentWindow.postMessage({
                    isBindPhone: isBindPhone,
                }, this.url)
            }
        }
    }
</script>

<style scoped lang="scss">
    .wares-design {
        width: 100%;
        height: 100%;
        overflow: hidden;
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    }
</style>
