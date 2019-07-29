/**
 * Promise化小程序接口
 */
class Wechat {
  /**
   * 登陆
   * @return {Promise} 
   */
  static login() {
    return new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
  };

  /**
     * 
     * @return {Promise} 
     */
  static getSetting() {
    return new Promise((resolve, reject) => wx.getSetting({ success: resolve, fail: reject }));
  };

  /**
   * 获取用户信息
   * @return {Promise} 
   */
  static getUserInfo() {
    return new Promise((resolve, reject) => wx.getUserInfo({ success: resolve, fail: reject }));
  };

  /**
     * 检查登录态是否过期
     * @return {Promise} 
     */
  static checkSession() {
    return new Promise((resolve, reject) => wx.checkSession({ success: resolve, fail: reject }));
  };

  /**
   * 设置Request Get
   * @return {Promise} 
   */
  static getRequest(url, data) {
    return new Promise((resolve, reject) => wx.request({
      url: url,
      data: data,
      method: 'GET',
      success: function(res){
        resolve(res)
      },
      fail: function(e){
        reject('请求失败！！！')
      }
    }))
    };


  /**
 * 设置Request Put
 * @return {Promise} 
 */
  static putRequest(url, data) {
    return new Promise((resolve, reject) => wx.request({
      url: url,
      data: data,
      method: 'PUT',
      success: function (res) {
        resolve(res)
      },
      fail: function (e) {
        reject('请求失败！！！')
      }
    }))
  };
};

export default Wechat;