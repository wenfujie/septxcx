
export default {
    confirm: (options) => {
        let modelOption = {
            confirmText: "确定",
            confirmColor: "#FF3636",
            cancelColor: "#c6c6c6"
        }

        modelOption = Object.assign(modelOption, options)

        return new Promise((resolve, reject) => {

            modelOption.success = function (res) {
                if (res.confirm) {
                    resolve()

                } else if (res.cancel) {
                    reject()
                }
            }
            wx.showModal(modelOption)
        })

    }
}


