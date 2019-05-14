import { routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import request from '~/utils/request';
import {ENV, Storage, getUrlParams} from '~/utils/utils';

export default {

  namespace: 'global',

  state: {

    loading: true,             //全局loading状态

    isAuth: false,               //是否已登录

    currentUser: {              //当前账户
      userInfo: {},             //用户信息\
    },

    navData: [],                //导航菜单

    kaihuInfo: {                //开户专用
      userId: '',               //用户id
      cifName: '',              //姓名
      idNum: '',                //身份证号
      authAmt: '',              //授权金额（元）
      authDue: '',              //授权期限（月）
      equipmentType: 'pc'
    }

  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *register({ payload, callback }, { call, put }) {

      const res = yield call(
        (params) => {return request('/api/user/register', {method: 'POST', body: params})},
        payload
      );
      yield callback(res);
      if(res.code === '0'){
        Storage.set(ENV.storageAccessToken, res.data.login_code);               //保存token
        Storage.set(ENV.storageUserId, res.data.uid);                          //保存userId
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            userInfo: res.data,
          }
        });
      }

    },

    *login_sms({ payload, callback }, { call, put }) {

      const res = yield call(
        (params) => {return request('/api/user/code_login', {method: 'POST', body: params})},
        payload
      );
      yield callback(res);
      if(res.code === '0'){
        Storage.set(ENV.storageAccessToken, res.data.login_code);               //保存token
        Storage.set(ENV.storageUserId, res.data.uid);                          //保存userId
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            userInfo: res.data,
          }
        });
      }

    },

    *login_psd({ payload, callback }, { call, put }) {

      const res = yield call(
        (params) => {return request('/api/user/login', {method: 'POST', body: params})},
        payload
      );
      yield callback(res);
      if(res.code === '0'){
        Storage.set(ENV.storageAccessToken, res.data.login_code);               //保存token
        Storage.set(ENV.storageUserId, res.data.uid);                          //保存userId
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            userInfo: res.data,
          }
        });
      }

    },

    *token({ payload, callback }, { call, put }) {

      if(payload.login_code){
        const res = yield call(
          (params) => {return request('/api/user/get_code_user_info', {method: 'POST', body: params})},
          payload
        );
        yield callback(res);

        if(res.code === '0'){
          // Storage.set(ENV.storageAccessToken, res.data.login_code);               //保存token
          // Storage.set(ENV.storageUserId, res.data.uid);                          //保存userId
          yield put({
            type: 'changeLoginStatus',
            payload: {
              loading: false,
              isAuth: true,
              userInfo: res.data,
            }
          });
        }else{
          Storage.remove(ENV.storageAccessToken);               //删除token
          Storage.remove(ENV.storageUserId);                    //删除uid
          yield put({
            type: 'changeLoginStatus',
            payload: {
              loading: false,
              isAuth: false,
              userInfo: '',
            }
          });
        }
      }else{
        yield put({ type: 'changeLoading', payload: false });
      }

    },

    *logout({ payload, callback }, { call, put }) {
      Storage.remove(ENV.storageAccessToken);               //删除token
      Storage.remove(ENV.storageUserId);                    //删除uid
      yield put({
        type: 'changeLoginStatus',
        payload: {
          isAuth: false,
          userInfo: '',
        }
      });
      yield callback();
      yield put(routerRedux.push({ pathname: '/' }));
    },

    //查询账户详情
    *userinfo({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => {return request('/api/user/get_user_info', {method: 'POST', body: params})},
        payload
      );
      yield callback(res);
      if(res.code === '0'){
        yield put({
          type: 'changeUserInfo',
          payload: res.data
        });
      }
    },

    //exp如果不为空：在查询时，先检查本地存储数据是否过期，再读取远程数据；并且在查询成功后，本地存储查询结果。
    *post({ url, payload, callback }, { call, put }) {

      let res, exp = payload.exp, storage = Storage.get(url, exp);

      if(exp && storage){
        res = storage;
      }else{
        res = yield call(
          (params) => {return request(url, {method: 'POST', body: params})},
          payload
        );
        if(exp) Storage.set(url, res);
      }

      yield callback(res);

      // 登录过期等
      if(res.code === '9') yield put(routerRedux.push({ pathname: '/user/login' }));

    },

    *get({ url, payload, callback }, { call, put }) {

      //yield put({ type: 'changeLoading', payload: true });

      const res = yield call(
        (params) => {return request(url, {method: 'GET', body: params})},
        payload
      );

      yield callback(res);

      //yield put({ type: 'changeLoading', payload: false });

    },
  },

  reducers: {
    changeLoading(state, {payload}){
      return {
        ...state,
        loading: payload
      }
    },
    saveNavData(state, {payload}) {
      return {
        ...state,
        navData: payload
      };
    },
    changeLoginStatus(state, {payload}){
      return {
        ...state,
        loading: payload.loading,
        isAuth: payload.isAuth,
        currentUser: {
          ...state.currentUser,
          userInfo: payload.userInfo
        },
      };
    },
    //修改用户信息
    changeUserInfo(state, {payload}){
      return {
        ...state,
        loading: false,
        currentUser: {
          ...state.currentUser,
          userInfo: Object.assign(state.currentUser.userInfo, payload)
        },
      };
    },
  },

};
