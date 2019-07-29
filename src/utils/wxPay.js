// import { Toast } from "vant";
import Storage from "@/utils/storage";
import * as payApi from "@/api/service/payment";
import Payment from "./payment";
import Toast from 'vant-weapp/dist/toast/toast';

//  获取微信appId
function getAppid(str) {
    let result = str.match("<appid.*?>([\\s\\S]*)</appid>");
    let appid = result[0]
        .replace("<appid>", "")
        .replace("</appid>", "")
        .trim();

    console.log("appid", appid);

    return appid;
}
//  微信桥接工具准备完成
function onBridgeReady(params, resolve, reject) {
    let appid = getAppid(params.requestStr);
    WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
            appId: appid || "wx45b40e5b82bd74d2", //公众号名称，由商户传入
            timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
            nonceStr: params.nonceStr, //随机串
            package: params.prepayId,
            signType: "MD5", //微信签名方式：
            paySign: params.paySign //微信签名
        },
        function(res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                resolve(200);
            } else {
                reject(-1);
            }
        }
    );
}

// 调用微信支付
function wxPay(params) {
    let promise = new Promise(function(resolve, reject) {
        if (params.payAmount == 0) {
            resolve(200);
        } else if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener(
                    "WeixinJSBridgeReady",
                    onBridgeReady(params, resolve, reject),
                    false
                );
            } else if (document.attachEvent) {
                document.attachEvent(
                    "WeixinJSBridgeReady",
                    onBridgeReady(params, resolve, reject)
                );
                document.attachEvent(
                    "onWeixinJSBridgeReady",
                    onBridgeReady(params, resolve, reject)
                );
            }
        } else {
            onBridgeReady(params, resolve, reject);
        }
    });
    return promise;
}

// 小程序支付
function wxMiniProgramPay(params, price) {
    let wxParams = {
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.prepayId,
        paySign: params.paySign
    };

    let promise = new Promise(function(resolve, reject) {
        if (price == 0) {
            resolve(0);
        } else {
            resolve(wxParams);
        }
    });
    return promise;
}

// 支付函数
export default async (billCode, price, orderType, payTypeCode) => {
    price = Number(price);
    if (price === 0) return price;
    let payParam = {
        usrId: global.Storage.get("USER_INFO").usrId,
        paymentCode: "D_WEIXIN",
        tradeTypeCode: "JSAPI",
        paymentTypeCode: payTypeCode ? payTypeCode : "D_FULL",
        shopCode: global.Storage.get("USER_INFO").shopCode,
        orderList: billCode,
        orderType: orderType ? orderType : null,
        openId: global.Storage.get("WECHAT_INFO").openid,
        payAmount: Number(price),
        unionId: global.Storage.get("properties").publicAccount
    };
    let wxPayParam = await payApi.payOrder(payParam);

    // if (wxPayParam.code === "200") {
    //     return wxMiniProgramPay(wxPayParam, price);
    // } else {
    //     Toast(wxPayParam.message);
    //     return Promise.reject();
    // }

    if (wxPayParam.code === "200") {
        return Payment.miniProgramPay(wxPayParam);
    } else {
        Toast(wxPayParam.message);
        return Promise.reject();
    }
    
};
