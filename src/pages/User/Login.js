import React from 'react';
import { connect } from 'dva';
import { NavLink, Link, routerRedux } from 'dva/router';
import { Toast } from 'antd-mobile';
import { Form, Input, Button, Icon, Checkbox, Radio } from 'antd'
import {
  ENV, Storage, goBack, hasErrors,
  checkPhone, isPhone, checkPsdLevel,
  Encrypt, getUrlParams, yaoqingDecrypt, filterTel
} from "~/utils/utils";
import styles from './Login.less';

import {Confirm} from '~/components/Dialog/Dialog'
import InputPassword from '~/components/Form/InputPassword'
import InputSmscode from '~/components/Form/InputSmscode'

const FormItem = Form.Item;

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class QucikRegister extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.phoneFlag = true;
    this.state = {
      loading: false,
      loginType: 'sms',
      captcha: '',
      tel: '',
      isRegister: false,    //手机号已注册
      prevMobile: '',      //上一次校验的手机号

      xieyiChecked: true,
      smscodeSended: false,       //短信验证码是否已发送
    }
  }

  //监控手机号输入
  onChangeMobile = (rule, value, callback) => {
    value = value.replace(/\D/g,'');
    this.props.form.setFieldsValue({'tel': value});
    if(checkPhone(value)){
      //是手机号，并且不等于上次校验的手机号时，才执行接口校验
      if(isPhone(value) && value !== this.state.prevMobile){
        this.checkPhone(value, (res) => {
          if(!res) return;
          callback(res);
        })
      }else{
        callback();
      }
    }else{
      callback('请输入正确的手机号码')
    }
  };

  //手机失焦检测
  mobileOnBlur = (e) => {
    let value = e.target.value;
    if(value){
      if(!isPhone(value)){
        this.props.form.setFields({
          'tel': {
            value: value,
            errors: [new Error('请输入正确的手机号码')]
          }
        })
      }
    }else{
      this.props.form.setFields({
        'tel': {
          value: value,
          errors: [new Error('请输入手机号码')]
        }
      })
    }
  };

  //检查手机号是否注册
  checkPhone(tel, cb){

    if(!this.phoneFlag) return;
    this.phoneFlag = false;

    let {isRegister} = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/user/is_repeat',
      payload:{
        tel,
      },
      callback: (res) => {

        if(!res) return;
        if(res.code === '0'){           // 0代表未注册
          isRegister = false;
          cb()
        }
        else{
          isRegister = true;
          Storage.set(ENV.storageLastTel, tel);      //已注册过的手机号，保存到本地存储
          cb();
        }
        this.setState({
          isRegister,
          prevMobile: tel
        });

      }
    });

    setTimeout(() => { this.phoneFlag = true }, 500);

  }

  //密码
  passwordCallback = (value) => {
    this.props.form.setFieldsValue({'pwd': value});
    this.props.form.validateFields(['pwd'], (err, values) => {});
  };

  //短信验证码回调
  smscodeCallback = (value) => {
    //清空错误提示
    if(value === 'clearError'){
      this.props.form.setFields({
        'smscode': {
          value: '',
          errors: ''
        }
      });
      this.setState({smscodeSended: true});
    }
    else if(value === 'telError'){
      this.props.form.setFields({
        'tel': {
          value: '',
          errors: [new Error('请输入手机号')]
        }
      });
      this.setState({smscodeSended: true});
    }
    else{
      this.props.form.setFieldsValue({'smscode': value});
      this.props.form.validateFields(['smscode'], (err, values) => {});
    }
  };

  //协议勾选
  xieyiChecked = () => {
    let xieyiChecked = !this.state.xieyiChecked;
    this.setState({
      xieyiChecked
    })
  };

  //清空输入框
  emitEmpty(key){
    this.props.form.resetFields([key]);
  };

  //切换登录方式
  changeLoginType = () => {
    const {loginType} = this.state;
    this.setState({
      loginType: loginType === 'psd' ? 'sms' : 'psd'
    })
  };

  //表单确认
  handleFormSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    const {loginType} = this.state;

    let keys = loginType === 'psd' ? ['tel', 'pwd'] : ['tel', 'smscode'];

    this.props.form.validateFields(keys, (err, values) => {
      if (!err) {
        this.login(values);
      }
    });
    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  // 登录
  login = (values) => {
    const {loginType} = this.state;
    let type, payload;
    if(loginType === 'sms'){
      type = 'global/login_sms';
      payload = {
        tel: values.tel,
        verity: values.smscode
      }
    }else{
      type = 'global/login_psd';
      payload = {
        tel: values.tel,
        pwd: values.pwd,
      }
    }
    this.props.dispatch({
      type: type,
      payload: payload,
      callback: (res) => {
        if(res.code === '0'){
          Storage.set(ENV.storageLastTel, values.tel);      //手机号保存到本地存储;
          this.props.dispatch(routerRedux.push('/account'))
        }else{
          Toast.info(res.msg, 2);
        }
      }
    })
  };

  register = () => {

  };

  render(){

    const {loading, loginType, isRegister} = this.state;
    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    const winWidth = window.innerWidth - 30;

    return(
      <div className={styles.container}>


        <div className={styles.formBox + " " + styles.login}>

          <Form onSubmit={this.handleFormSubmit}>

            <FormItem>
              {getFieldDecorator('tel', {
                validateFirst: true,
                rules: [
                  { required: true, message: '请输入手机号码' },
                  { validator: this.onChangeMobile },
                  //{ pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' },
                ],
              })(
                <Input
                  size="large"
                  maxLength="11"
                  autoComplete="off"
                  placeholder="请输入手机号码"
                  onBlur={this.mobileOnBlur}
                  suffix={
                    getFieldValue('tel') ?
                      <Icon
                        type="close-circle"
                        className={styles.clearInput}
                        onClick={() => this.emitEmpty('tel')}
                      />
                      :
                      null
                  }
                />
              )}
            </FormItem>

            {
              loginType === 'psd' ?
                <FormItem>
                  {getFieldDecorator('pwd', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码长度只能在6-20位字符之间' },
                      { max: 20, message: '密码长度只能在6-20位字符之间' },
                    ],
                  })(
                    <InputPassword psdLevelStyle={{width: '365px'}} callback={this.passwordCallback}/>
                  )}
                </FormItem>
                :
                <FormItem>
                  {getFieldDecorator('smscode', {
                    validateFirst: true,
                    rules: [
                      { required: true, message: '请输入短信验证码' },
                      { pattern: /^[0-9]{4}$/, message: '短信验证码错误' },
                    ],
                  })(
                    <InputSmscode
                      tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
                      api={'/api/user/get_code'}
                      isrepeat={isRegister ? '3' : '1'}       // 1是注册, 2找回密码, 3验证码登录
                      callback={this.smscodeCallback}
                    />
                  )}
                </FormItem>
            }

            <div>

              <p className={styles.xieyi}>
                <span>注册即表示已阅读并同意</span>
                <Link to="/guide">《用户注册协议》</Link>
              </p>

              {
                loginType === 'psd' ?
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className={styles.btn}
                    style={{width: '100%', height: '50px', lineHeight: '48px'}}
                    disabled={
                      hasErrors(getFieldsError()) ||
                      !getFieldValue('tel') ||
                      !getFieldValue('pwd')
                    }
                  >
                    登录 / 注册
                  </Button>
                  :
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    className={styles.btn}
                    style={{width: '100%', height: '50px', lineHeight: '48px'}}
                    disabled={
                      hasErrors(getFieldsError()) ||
                      !getFieldValue('tel') ||
                      !getFieldValue('smscode')
                    }
                  >
                    登录 / 注册
                  </Button>
              }


              {/*<p className={styles.desc}>*/}
                {/*<Link to="/user/reset">忘记密码</Link>*/}
                {/*<a onClick={this.changeLoginType} className={styles.loginType}>*/}
                  {/*{loginType === 'psd' ? '快捷登录' : '密码登录'}*/}
                {/*</a>*/}
              {/*</p>*/}

            </div>

          </Form>
        </div>

      </div>
    )
  }

}
