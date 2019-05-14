import moment from 'moment';
import { parse, stringify } from 'qs';
const CryptoJS = require('crypto-js');  //引用AES源码js
const _ = require('lodash');

/**
 * 全局变量
 */
export const ENV = {

  api: {
    dev: 'http://47.94.100.232',                              //开发
    pro: 'https://data.moxinga.com',                              //生产
  },

  download: {
    android: 'http://moxingqun.oss-cn-beijing.aliyuncs.com/apk/quzuV1.2.4.apk',
    ios: 'https://www.pgyer.com/4KmZ',
  },

  appname: '趣族',
  hometitle: '趣族',
  keywords: '趣族',
  description: '趣族',

  company: '趣族',
  address: '趣族',
  youbian: '100105',
  hotline: '',
  email: '',
  worktime: '',

  web: 'www.moxinga.com',
  slogan: '',
  weixin: '',
  icp: '',
  beian: '京ICP备15018716号-2',
  copyright: '',

  storageAccessToken: 'qz-access-token',
  storageRefreshToken: 'qz-refresh-token',
  storageUserId: 'qz-userid',
  storageCurrentUser: 'qz-currentCurrentUser',
  storageLastTel: 'qz-lastTel',
  storageRemenber: 'qz-remenber',
  storageTheme: 'qz-theme',
  storageCurrentMenu: 'qz-currentMenu',
  storagePagesize: 'qz-pagesize',
  storageHistory: 'qz-history',          //路由历史
  storageLucky: 'qz-lucky',               // 抽奖记录
};

/**
 * Storage 本地存储 检验过期
 * @type {{set: Storage.set, get: Storage.get, remove: Storage.remove}}
 * exp 过期时间的秒数 一天的秒数 60 * 60 * 24
 */
export const Storage = {

  // 保存
  set: function(key, value) {
    let curTime = new Date().getTime();
    return window.localStorage.setItem(
      key,
      window.JSON.stringify({data:value, time:curTime})
    );
  },

  // 查询
  get: function(key, exp) {
    let obj = window.JSON.parse(localStorage.getItem(key));
    if(!obj || !obj.data) return false;                         //无记录
    if(exp && new Date().getTime() - obj.time > exp * 1000){    //过期
      return false
    }else{
      return obj.data;
    }
  },

  // 删除
  remove: function(key) {
    return window.localStorage.removeItem(key);
  },

};

/**
 * 加密方法
 * @param k
 * @param text
 * @returns {string}
 * @constructor
 */
export function Encrypt(k, text) {

  const key = CryptoJS.enc.Utf8.parse("hqtw-" + k);                        //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse('1269571569321021');                  //十六位十六进制数作为密钥偏移量

  let encrypted = CryptoJS.AES.encrypt(
    text.toString(),
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return encrypted.ciphertext.toString();
}

/**
 * 解密方法
 * @param k
 * @param text
 * @returns {string}
 * @constructor
 */
export function Decrypt(k, text) {

  const key = CryptoJS.enc.Utf8.parse("hqtw-" + k);                        //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse('1269571569321021');                  //十六位十六进制数作为密钥偏移量

  let encryptedHexStr = CryptoJS.enc.Hex.parse(text);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

  let decrypt = CryptoJS.AES.decrypt(
    srcs,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return decrypt.toString(CryptoJS.enc.Utf8);
}

/**
 * 邀请码解密
 * @param text
 * @returns {string}
 */
export function yaoqingDecrypt(text) {

  const key = CryptoJS.enc.Utf8.parse("hqtw-yaoqingmajm");                        //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse('1269571569321021');                         //十六位十六进制数作为密钥偏移量

  let encryptedHexStr = CryptoJS.enc.Hex.parse(text);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

  let decrypt = CryptoJS.AES.decrypt(
    srcs,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return decrypt.toString(CryptoJS.enc.Utf8);
}

/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 通用工具函数 start!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object, base) {
  function changes(object, base) {
    return _.transform(object, function(result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

/**
 * 浏览器后退
 * -1后退、0去首页
 */
export function goBack(){
  if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
    if(window.history.length > 2){
      return -1
    }else{
      return 0
    }
  }else{ //非IE浏览器
    if (navigator.userAgent.indexOf('Firefox') >= 0 ||
      navigator.userAgent.indexOf('Opera') >= 0 ||
      navigator.userAgent.indexOf('Safari') >= 0 ||
      navigator.userAgent.indexOf('Chrome') >= 0 ||
      navigator.userAgent.indexOf('WebKit') >= 0){

      if(window.history.length > 2){
        return -1
      }else{
        return 0
      }
    }else{ //未知的浏览器
      return -1
    }
  }
}

/**
 * 拆解url参数转换为对象
 * @returns {Object}
 */
export function getUrlParams() {
  // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
  let url = window.location.href.split('?')[1];
  if(!url) return false;
  var arr = url.split("&");
  var obj = new Object();

  // 将每一个数组元素以=分隔并赋给obj对象
  for(var i = 0; i < arr.length; i++) {
    var tmp_arr = arr[i].split("=");
    obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
  }
  return obj;
}

/**
 * IOS
 */
export function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge); }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
  window.WVJBCallbacks = [callback];
  let WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  // WVJBIframe.src = ‘wvjbscheme://__BRIDGE_LOADED__’;
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => { document.documentElement.removeChild(WVJBIframe);}, 0);
}

/*************************** 表单工具函数 ***************************/


/**
 * 判断是否是手机号
 * @param tel
 * @returns {boolean}
 */
export function isPhone(tel) {
  let reg = /^1[0-9]{10}$/;
  return reg.test(tel);
}

/**
 * 动态检查输入值是不是手机号，1开头并且 <= 11位数值返回true
 * @param value
 */
export function checkPhone(value) {
  if (value.substr(0, 1) === '1') {
    return value.length <= 11;
  } else {
    return false;
  }
}

//字段错误校验
export function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

//校验密码强度
export function checkPsdLevel(value){
  // 0： 表示第一个级别， 1：表示第二个级别， 2：表示第三个级别， 3： 表示第四个级别， 4：表示第五个级别
  let modes = 0;
  if(value.length < 8){//最初级别
    return modes;
  }
  if(/\d/.test(value)){//如果用户输入的密码 包含了数字
    modes++;
  }
  if(/[a-z]/.test(value)){//如果用户输入的密码 包含了小写的a到z
    modes++;
  }
  if(/\W/.test(value)){//如果是非数字 字母 下划线
    modes++;
  }
  if(/[A-Z]/.test(value)){//如果用户输入的密码 包含了大写的A到Z
    modes++;
  }
  return modes;
}

/*************************** 字符串工具函数 ***************************/

/**
 * 过滤文字中的特殊符号
 * @param str
 * @returns {string}
 */
export function filterStr(str){
  let pattern = new RegExp("[`~@#$^&|\\<>/~@#￥&]");
  let specialStr = "";
  for(let i=0;i<str.length;i++){
    specialStr += str.substr(i, 1).replace(pattern, '');
  }
  return specialStr;
}

//过滤手机号
export function filterTel(str){

  return str.toString().replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");

}

//过滤卡号
export function filterCard(str){

  return str.toString().replace(/^(\d{3})\d{4}(\d+)/,"$1****$2");

}

/*************************** 图片工具函数 ***************************/

/**
 * 图片转base64
 * @param img
 * @returns {string}
 */
export function imgToBase64(img) {
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas.toDataURL("image/jpeg");
}

//文件转为base64
export function file2base64(file, cb){

  let base64 = '', reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function(e) {

    base64 = e.target.result;

    let img = new Image();
    img.src = base64;
    img.onload = function(){
      let data = {
        base64: base64,
        width: this.width,
        height: this.height
      };
      return cb(data);
    };

  };
}

/**
 * 将base64转换为文件
 * @param dataurl
 * @returns {Blob}
 */
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

/*************************** 空对象工具函数begin ***************************/

/**
 * 空对象判断
 * @param obj
 * @returns {boolean}
 */
export function isEmptyObject(obj){

  for(let key in obj){
    return false
  };
  return true
};
/*************************** 空对象工具函数end ***************************/

/*************************** 空值工具函数begin ***************************/
export function isEmptyValue(val){
  if(val===''||val===null||val==='null'||val===undefined||val==='undefined') return true
  return false;
};
/*************************** 空值工具函数end ***************************/

/*************************** 数值工具函数 ***************************/

/**
 * 金额字符串转数值
 * @param str
 * @returns {number}
 */
export function str2Number(str){
  let arr = str.split(',');
  return parseFloat(arr.join(''));
}

/**
 * 金额数值格式化
 * @param number
 * @param intFlag     正整数
 * @returns {*}
 */
export function numberFormat(number, intFlag) {

  if (typeof number === 'string' && number.includes(',')) return number;             //已格式化的直接反复

  let result = '',
    float = '.00',
    num = number.toString();

  if (parseInt(number, 10) !== number) {                          //是否是整数
    let split = num.split('.');
    num = split[0];
    float = '.' + (split[1] && split[1].length===1 ? split[1]+'0' : split[1])
  }
  if(intFlag){
    float = '';
  }

  //加入分隔符
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }

  return num + result + float;
}


/**
 * 金额大写
 * @param n
 * @returns {string}
 */
export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

/*************************** 数组工具函数 ***************************/

//多维数组判断是否存在某值
export function isArrVal(arr, value){
  for(let i = 0;i < arr.length;i++){
    if(arr[i] instanceof Array){            //判断是否为多维数组
      return isArrVal(arr[i], value);
    }else{
      if(arr[i] === value){
        return 1; //存在
      }
    }
  }
  return -1;      //不存在
}

/**
 * 多维数组转一维数组
 * var arr2 = flatten(arr1); // arr2 [0, 1, 2, 3, 4, 5]
 * @param arr
 * @returns {*[]}
 */
export function flatten(arr) {
  return [].concat( ...arr.map(x => Array.isArray(x) ? flatten(x) : x) )
}

/*************************** 对象工具函数 ***************************/


/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 通用工具函数 end!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/


export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * @param path
 * @param routerData
 * @returns {Array}
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

export function isUrl(path) {
  let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  return reg.test(path);
}
/*
*
* ios和android与h5交互
*
* */
export  function  interaction(action) {

  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //判断是否是 android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //判断是否是 ios终端
  if (isiOS) {
          /*交互固定代码*/
    const setupWebViewJavascriptBridge=(callback)=> {
      if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge); }
      if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
      window.WVJBCallbacks = [callback];
      let WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      // WVJBIframe.src = ‘wvjbscheme://__BRIDGE_LOADED__’;
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(() => { document.documentElement.removeChild(WVJBIframe);}, 0);
    };

    /*ios*/
  setupWebViewJavascriptBridge ( (bridge) => {
      /* bridge.registerHandler('h5Action', (data, responseCallback) => {
         responseCallback(data);
       });*/
      bridge.callHandler('h5Action', action, (response) => {
      });
    });
  }else if(isAndroid){
    /*Android*/
    window.app.h5Action(action);      //与原生交互
  }else{
    return ''
  }
}
