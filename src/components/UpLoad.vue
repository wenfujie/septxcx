<template>
    <div>
        <wxs module="filter" src="../filter/filterCommon.wxs"></wxs>
        <div class="i-pic-upload-tips">
            <span class="left">上传图片</span>
            <span class="right">最多支持上传{{max}}张</span>
        </div>
        <div class="j-pic-upload">
            <div
                class="j-upload-btn"
                @click="uploadImg()"
                :style="{'width':width || '120rpx','height':height || '120rpx'}"
                v-if="urls.length<max"
            >
                <text class="j-upload-add">+</text>
            </div>
            <div
                class="imgItem"
                v-for="(src,index) in urls"
                :key="src"
                :style="{'width':width || '120rpx','height':height || '120rpx'}"
            >
                <img
                    :src="filter.imgFilter(src,companyId)"
                    :style="{'width':width || '120rpx','height':height || '120rpx'}"
                    class="img"
                    onerror="errrImg(event)"
                />
                <text class="iconfont iconguanbixiao" @click="removeImg(index)"></text>
            </div>
        </div>
    </div>
</template>
 
<script>
import Toast from "vant-weapp/dist/toast/toast";
export default {
    props: ["width", "height", "max", "srcs"],
    data() {
        return {
            urls: [],
            images: [],
            companyId: global.Storage.get("COMPANYID").company_id
        };
    },
    mounted() {
        this.urls = this.srcs || [];
    },

    methods: {
        uploadImg() {
            // if (this.urls.length == this.max) {
            //     Toast("最多上传" + this.max + "张");
            //     return;
            // }
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ["original", "compressed"],
                sourceType: ["album", "camera"],
                success: function(res) {
                    wx.uploadFile({
                        url:
                            global.baseConstant.serverUrl +
                            "file-system/imgUpload", //仅为示例，非真实的接口地址
                        filePath: res.tempFilePaths[0],
                        name: "file",
                        formData: {
                            companyId: that.companyId,
                            file: res.tempFilePaths[0]
                        },
                        success(result) {
                            let resData = JSON.parse(result.data);
                            let resultData = resData.uploadDetail.successDetail;
                            that.urls.push(resultData.filePath);
                            that.images.push({
                                fileLength: resultData.fileSize,
                                md5: resultData.md5,
                                pictPath: resultData.filePath,
                                sourceFileName: resultData.fileName,
                                pictClass: "D_COMMENTPICT"
                            });
                            that.$emit("update:images", that.images);
                        }
                    });
                    // that.$emit("choosed",{all:that.urls,currentUpload:res.tempFilePaths});
                }
            });
        },
        removeImg(index) {
            this.urls.splice(index, 1);
            this.images.splice(index, 1);
        },
        previewImg(index) {
            let that = this;
            wx.showActionSheet({
                itemList: ["预览", "删除"],
                success: function(res) {
                    if (res.tapIndex === 0) {
                        wx.previewImage({
                            current: that.urls[index],
                            urls: that.urls
                        });
                    } else {
                        that.urls.splice(index, 1);
                        that.$emit("delete", that.urls);
                    }
                }
            });
        }
    },
    onUnload() {
        // 解决重复进页面数据未初始化
        Object.assign(this.$data, this.$options.data());
    }
};
</script>
 
<style lang="scss" scoped>
.i-pic-upload-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx;
    .left {
        font-size: 30rpx;
        color: $text-primary;
    }
    .right {
        font-size: 24rpx;
        color: $text-regular;
    }
}
.j-pic-upload {
    padding: 12rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    .imgItem {
        position: relative;
        margin: 0 20rpx 0 0;
        text {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
            font-size: 30rpx;
            color: #a1a2ab;
        }
    }
}
.j-upload-btn {
    border: 1px dashed #ddd;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 20rpx;
}
.j-upload-add {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40rpx;
    font-weight: 500;
    color: #c9c9c9;
}
</style>