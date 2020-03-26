/*
* createTime：2019/9/10
* author：zeping.jiang
* description:  商品未上架
*/
<template>
	<div class="off-shelves-page">
		<div class="content">
			<div class="off-shelves-img">
				<img :src="offShelvesImg" alt="商品未上架" lazy-load="true">
			</div>
			<p class="tip">抱歉，该商品还未上架</p>
		</div>
		<div class="btn-group">
			<div class="back-btn btn" @click="back">上一页 (<span>{{time}}s</span>)</div>
			<div class="index-btn btn" @click="toIndex">回到首页</div>
		</div>
	</div>
</template>
<script>
	export default {
        config: {
            navigationBarTitleText: '商品未上架',
        },
		data() {
			return {
				offShelvesImg: require('../images/off-shelves.png'),  // 灾备图片
				time: 3,  //倒计时时间
				timer: null  //倒计时定时器
			}
		},
		onShow() {
			this.navBack()
        },
        onUnload() {
            if (this.timer) clearInterval(this.timer)
            Object.assign(this.$data, this.$options.data())
		},
		methods: {
			// 返回倒计时
			navBack() {
				this.timer = setInterval(() => {
					if (--this.time <= 0) {
                        clearInterval(this.timer)
                        this.$router.go(-1)
						// 定制商品页面跳过来的要回退两页
						// if (this.$route.query.page === 'web-design') {
						// 	this.$router.go(-2)
						// } else {
						// 	this.$router.go(-1)
						// }
					}
				}, 1000)
			},

			// 返回上一页
			back() {
				if (this.timer) clearInterval(this.timer)
                // 定制商品页面跳过来的要回退两页
                this.$router.go(-1)
				// if (this.$route.query.page === 'web-design') {
				// 	this.$router.go(-2)
				// } else {
				// 	this.$router.go(-1)
				// }
			},

			// 返回首页
			toIndex() {
				if (this.timer) clearInterval(this.timer)
				global.switchTab('/index')
			}
		},
		
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" scoped>
	.off-shelves-page {
		position: relative;
		overflow: hidden;
		.content{
			overflow: hidden;
			.off-shelves-img{
				width: computed(202);
				height: computed(162);
				margin: computed(143) auto computed(75) auto;
				img{
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			.tip{
				font-size: computed(32);
				line-height: computed(36);
				color: #999999;
				text-align: center;
			}
		}
		.btn-group{
			margin-top: computed(85);
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn{
				width: computed(200);
				height: computed(100);
				font-size: computed(32);
				line-height: computed(100);
				text-align: center;
				color: #ffffff;
				overflow: hidden;
			}
			.back-btn{
				background: #808080;
			}
			.index-btn{
				margin-left: computed(30);
				background: #FF3636;
			}
		}
	}
</style>
