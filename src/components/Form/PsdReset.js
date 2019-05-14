/**
 * 重置密码 - 登录密码 或 交易密码
 * psdType [String] 密码类型
 * step [String]   Steps组件初始化
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Redirect } from 'dva/router';
import { Toast } from 'antd-mobile';
import { Form, Input, Button, Icon } from 'antd'
import { hasErrors, checkPhone, isPhone, checkPsdLevel, Encrypt, filterTel } from '~/utils/utils'
import styles from './PsdReset.less';

import PintuValidate from '~/components/Form/PintuValidate'
import InputSmscode from '~/components/Form/InputSmscode'

const FormItem = Form.Item;
//const keys = ['mobile', 'pintu', 'smscode', 'password', 'rpassword'];
const btnStyle = {display: 'block', width: '100%', height: '50px', lineHeight: '48px', margin: '0 auto'};

const steps = [
  {
    title: '填写用户信息',
    key: 'index',
    content: 'First-content',
  },
  {
    title: '验证用户信息',
    key: 'smscode',
    content: 'Second-content',
  },
  {
    title: '重置密码',
    key: 'password',
    content: 'Thrid-content',
  },
  {
    title: '完成',
    key: 'finish',
    content: 'Last-content',
  }
];

@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class Reset extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.phoneFlag = true;
    this.loading = false;
    this.state = {
      current: 0,
      disabled: true,
      mobile: '',
      pintu: '',
      pintuNo: new Date().getTime(),          //拼图序列号
      smsCheckCode: '',
      password: '',
      rpassword: '',
      psdLevelVisible: true,
      psdLevel: '',
      psdLevelStyle: '',
      autoSubmitTimer: 5,
      smscodeSended: false,       //短信验证码是否已发送
    }
  }

  componentDidMount(){
    let step = this.props.step;
    this.initStep(step);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.step !== this.props.step) {
      let step = nextProps.step;
      this.initStep(step);
    }
  }

  //清空输入框
  emitEmpty(key){
    this.props.form.resetFields([key]);
    if(key === 'mobile') this.setState({mobile: ''});
  };

  //初始化步骤条
  initStep = (step) => {
    for(let i in steps){
      if(steps[i].key === step) this.setState({current: parseInt(i)})
    }
  };

  //监控手机号输入
  onChangeMobile = (rule, value, callback) => {
    value = value.replace(/\D/g,'');
    this.props.form.setFieldsValue({'mobile': value});
    if(checkPhone(value)){
      if(isPhone(value)){
        this.checkPhone(value, (res) => {
          if(res) {
            callback(res);
          }else{
            callback();
            this.setState({
              mobile: value
            });
          }
        })
      }else{
        callback('请输入正确的手机号码');
      }
      callback();
    }else{
      callback('请输入正确的手机号码')
    }
  };

  //手机失焦检测
  mobileOnBlur = (e) => {
    let value = e.target.value;
    if(isPhone(value)){
      this.checkPhone(value, (res) => {
        if(res) {
          this.props.form.setFields({
            'mobile': {
              value: value,
              errors: [new Error(res)]
            }
          })
        }else{
          this.setState({
            mobile: value
          });
        }
      })
    }else{
      this.props.form.setFields({
        'mobile': {
          value: value,
          errors: [new Error('请输入正确的手机号码')]
        }
      })
    }
  };

  //检查手机号是否注册
  checkPhone(mobile, cb){

    if(!this.phoneFlag) return;
    this.phoneFlag = false;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/userRegister/checkPhone',
      payload:{
        mobile: mobile
      },
      callback: (res) => {

        if(!res) return;
        if(res.code === 21010){
          cb('该手机号码尚未注册')
        }else{
          cb()
        }

      }
    });

    setTimeout(() => { this.phoneFlag = true }, 500);
  }

  //拼图
  pintuResult = (value) => {
    this.props.form.setFieldsValue({'pintu': value});
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

  //step 1
  next1 = () => {
    const current = this.state.current + 1;
    let step = steps[current].key;
    this.props.dispatch(routerRedux.push(`/user/reset/${step}`))
  };

  //step 2 - 检验短信验证码
  next2 = () => {
    const current = this.state.current + 1;
    let step = steps[current].key;

    //检查验证码是否过期
    let { mobile, smsCheckCode } = this.state;

    this.props.dispatch({
      type: 'global/post',
      url: '/api/userAuth/checkCode',
      payload: {
        mobile,
        smsCheckCode,
      },
      callback: (res) => {
        if(res.code === 0){
          this.props.dispatch(routerRedux.push(`/user/reset/${step}`))
        }else{
          this.setState({smscodeSended: false});            //重置短信验证码已发送的标志
          this.props.form.setFields({
            'smscode': {
              value: '',
              errors: [new Error(res.message)]
            }
          });
        }
      }
    })

  };

  //step 3 - 修改密码
  changePsdSubmit = (e) => {
    e.preventDefault();

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.loading = true;
    let { mobile, smsCheckCode } = this.state;

    this.props.form.validateFields(['password', 'rpassword'], (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'global/post',
          url: '/api/userAuth/forgetPwd',
          payload:{
            account: mobile,
            smsCheckCode: smsCheckCode,
            newPassword: Encrypt(mobile, values.password),
            affirmPassword: Encrypt(mobile, values.rpassword),
          },
          callback: (res) => {
            this.loading = false;
            setTimeout(() => { this.ajaxFlag = true }, 500);
            if(res.code === 0){
              this.props.dispatch(routerRedux.push('/user/reset/finish'))
            }else{
              //修改失败，重置表单和拼图
              //this.props.form.resetFields();
              //this.setState({pintuNo: new Date().getTime()});
              Toast.info(res.message);
              this.props.dispatch(routerRedux.push('/user/reset/index'))
            }
          }
        })
      }
    });

  };

  //比对密码
  checkConfirm = (rule, value, callback) => {
    let password = this.props.form.getFieldValue('password'),
      rpassword = this.props.form.getFieldValue('rpassword');
    if(password && rpassword && password !== rpassword){
      callback('两次输入的密码不一致')
    }else{
      this.props.form.setFields({
        password: {value: password, errors: ''},
        rpassword: {value: rpassword, errors: ''},
      });
      callback()
    }
  };

  //检查密码强度
  checkPsd = (e) => {
    let psdLevel, psdLevelStyle, value = e.target.value;

    if(value) {
      let psdModes = checkPsdLevel(value);
      switch(psdModes){
        case 1 :
          psdLevel = '';
          psdLevelStyle = '';
          break;
        case 2 :
          psdLevel = '弱';
          psdLevelStyle = styles.psdLevelError;
          break;
        case 3 :
          psdLevel = '中';
          psdLevelStyle = styles.psdLevelMiddle;
          break;
        case 4 :
          psdLevel = '强';
          psdLevelStyle = styles.psdLevelStrong;
          break;
        default:
          psdLevel = '';
          psdLevelStyle = '';
          break;
      }
    }
    this.setState({
      psdLevel,
      psdLevelStyle
    });
  };

  //切换密码框显示
  changePsdType1 = (value) => {
    let psdLevelVisible = !this.state.psdLevelVisible;
    this.setState({
      //psdType1: value,
      psdLevelVisible
    })
  };

  changePsdType2 = (value) => {
    this.setState({
      psdType2: value,
    })
  };

  //step 4 - 自动执行
  autoSubmit = () => {
    let {autoSubmitTimer} = this.state;
    let timer = setInterval(() => {
      if(autoSubmitTimer === 1){
        clearInterval(timer);
        this.toLogin();
      }else{
        autoSubmitTimer--;
        this.setState({autoSubmitTimer})
      }
    }, 1000)
  };

  //去登录
  toLogin = () => {
    this.props.dispatch(routerRedux.push('/user/login'))
  };

  render(){

    const {
      mobile, current, autoSubmitTimer, pintuNo,
      psdLevelVisible, psdLevel, psdLevelStyle, smscodeSended
    } = this.state;

    const { getFieldDecorator, getFieldValue, getFieldsError } = this.props.form;

    steps[0].content = (
      <div className={styles.step1}>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('mobile', {
              initialValue: mobile,
              validateFirst: true,
              rules: [
                { required: true, message: '请输入手机号码' },
                { validator: this.onChangeMobile },
              ],
            })(
              <Input
                autoFocus
                size="large"
                maxLength="11"
                autoComplete="off"
                placeholder="请输入手机号码"
                suffix={
                  getFieldValue('mobile') ?
                    <Icon
                      type="close-circle"
                      className={styles.clearInput}
                      onClick={() => this.emitEmpty('mobile')}
                    />
                    :
                    null
                }
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('pintu', {
              rules: [
                { required: true, message: '请完成拼图' },
              ],
            })(
              <PintuValidate no={pintuNo} callback={this.pintuResult}/>
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[1].content = (
      <div className={styles.step2}>
        <div className={styles.desc}>
          <p>验证码短信已发送至{filterTel(mobile)}</p>
        </div>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('smscode', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入短信验证码' },
                { pattern: /^[0-9]{6}$/, message: '请输入正确的短信验证码' },
              ],
            })(
              <InputSmscode
                tel={hasErrors(getFieldsError(['tel'])) ? '' : getFieldValue('tel')}
                api={'/api/user/get_code'}
                callback={this.smscodeCallback}
              />
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[2].content = (
      <div className={styles.step3}>
        <div className={styles.formItemBox}>
          <FormItem>
            {getFieldDecorator('password', {
              validateFirst: true,
              rules: [
                { required: true, message: '请输入新密码' },
                { min: 8, message: '请输入8-16位字母、数字或符号的组合' },
                { max: 16, message: '请输入8-16位字母、数字或符号的组合' },
                { validator: this.checkConfirm },
                // { pattern: /^[A-Za-z0-9_]+$/, message: '不能输入敏感字符，只能输入下划线' },
                // { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9_]{8,16}$/, message: '请输入8-16位字母、数字或符号的组合' },
              ],
            })(
              <Input
                type="password"
                maxLength="16"
                onFocus={() => this.changePsdType1('text')}
                onBlur={() => this.changePsdType1('password')}
                onChange={this.checkPsd}
                placeholder="请输入新密码"
                suffix={
                  <span className={styles.suffix}>
                    {
                      getFieldValue('password') ?
                        <Icon
                          type="close-circle"
                          className={styles.clearInput}
                          onClick={() => this.emitEmpty('password')}
                        />
                        :
                        null
                    }
                  </span>
                }
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('rpassword', {
              rules: [
                { required: true, message: '请再次输入新密码' },
                { validator: this.checkConfirm }
              ],
            })(
              <Input
                type="password"
                // onFocus={() => this.changePsdType2('text')}
                // onBlur={() => this.changePsdType2('password')}
                placeholder="请再次输入新密码"
                suffix={
                  <span className={styles.suffix}>
                    {
                      getFieldValue('rpassword') ?
                        <Icon
                          type="close-circle"
                          className={styles.clearInput}
                          onClick={() => this.emitEmpty('rpassword')}
                        />
                        :
                        null
                    }
                  </span>
                }
              />
            )}
          </FormItem>
        </div>
      </div>
    );

    steps[3].content = (
      <div className={styles.step4}>
        <div className={styles.desc}>
          <p className={styles.p1}>恭喜您成功找回密码！您需要重新登录系统。</p>
          <p className={styles.p2}><span>{autoSubmitTimer}</span>s后将自动跳转到登录页面</p>
        </div>
      </div>
    );

    return(

      <div className={styles.psdReset}>

        {
          current > 0 && !mobile ?
            <Redirect to="/user/reset/index" />
            :
            <Form className={styles.form}>

              <div className={styles.formContent}>
                <div className={styles.stepsContent}>
                  {steps[current].content}
                </div>

                <FormItem>
                  <div className={styles.btns}>
                    {
                      current === 0 ?
                        <Button
                          type="primary"
                          className={styles.btn}
                          style={btnStyle}
                          onClick={this.next1}
                          disabled={hasErrors(getFieldsError(['mobile'])) || !getFieldValue('mobile') || !getFieldValue('pintu')}
                        >
                          下一步
                        </Button>
                        :
                        null
                    }

                    {
                      current === 1 ?
                        <Button
                          type="primary"
                          className={styles.btn}
                          style={btnStyle}
                          onClick={this.next2}
                          disabled={
                            hasErrors(getFieldsError(['smscode'])) ||
                            !getFieldValue('smscode') ||
                            smscodeSended === false
                          }
                        >
                          下一步
                        </Button>
                        :
                        null
                    }

                    {
                      current === 2 ?
                        <Button
                          loading={this.loading}
                          type="primary"
                          className={styles.btn}
                          style={btnStyle}
                          onClick={this.changePsdSubmit}
                          disabled={
                            hasErrors(getFieldsError(['password', 'rpassword'])) ||
                            !getFieldValue('password') ||
                            !getFieldValue('rpassword')
                          }
                        >
                          下一步
                        </Button>
                        :
                        null
                    }

                    {
                      current === 3 ?
                        <Button
                          type="primary"
                          className={styles.btn}
                          style={btnStyle}
                          onClick={this.toLogin}
                        >
                          立即登录
                          {this.autoSubmit()}
                        </Button>
                        :
                        null
                    }
                  </div>
                </FormItem>
              </div>
            </Form>
        }
      </div>

    )
  }

}
