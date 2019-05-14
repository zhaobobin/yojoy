import fetch from 'dva/fetch';
import { notification } from 'antd';
import { ENV, Storage } from "./utils";

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

  //打包正式接口
  let api = url;
  if(process.env.NODE_ENV === 'production'){
    api = ENV.api.pro + url;
  }

  let newOptions = {
    credentials: 'include',                           //跨域访问携带cookie
    ...options,
  };

  if (newOptions.method === 'POST') {

    let newOptionsHeaders = {
      Accept: 'application/json',
      //'accessToken': Storage.get(ENV.storageAccessToken) || null,
      ...newOptions.headers,
    };

    newOptions.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptionsHeaders,
    };
    newOptions.body = JSON.stringify(newOptions.body);

  }

  return fetch(api, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => {
      if (error.code) {
        notification.error({
          message: error.name
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: '请求错误'
        });
      }
      return error;
    });
}
