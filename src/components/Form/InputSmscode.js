/**
 * 表单 - 短信验证码
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Input, Icon, notification } from 'antd';
import { Modal, Toast } from 'antd-mobile'
import {filterTel} from '~/utils/utils'
import styles from './InputSmscode.less';

import PintuValidate from '~/components/Form/PintuValidate'

let timer;

@connect(state => ({
  global: state.global
}))
export default class InputSmscode extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      tel: '',
      btnText: '获取验证码',
      btnStyle: styles.null,

      pintuNo: new Date().getTime(),
      modalVisible: false,    //拼图
    }
  }

  componentDidMount(){
    this.initBtnStyle(this.props.tel);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //按钮在激活状态，才重置倒计时
    if (nextProps.tel !== this.props.tel && this.state.btnStyle !== styles.disabled) {
      this.initBtnStyle(nextProps.tel);
    }
  }

  //初始化按钮样式
  initBtnStyle(tel){
    let btnStyle = tel ? styles.actived : styles.null;
    this.setState({
      tel,
      btnStyle,
    })
  }

  //改变输入值
  changeValue = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g,'');
    this.setState({ value });
    this.props.callback(value);
  };

  //确定
  submit = () => {

    let {tel} = this.props;
    if(!tel) {
      this.props.callback('telError');
      return;
    }

    if(this.state.btnStyle !== styles.actived) return;

    if(!this.ajaxFlag) return;
    this.ajaxFlag = false;

    this.setState({
      modalVisible: true
    });

    setTimeout(() => { this.ajaxFlag = true }, 500);
  };

  //拼图回调
  pintuResult = (value) => {
    if(!value) return;
    this.sendSmsCode();
  };

  //发送验证码
  sendSmsCode = () => {
    let {tel, api, isrepeat} = this.props;
    // console.log(isrepeat)
    this.props.dispatch({
      type: 'global/post',
      url: api,
      payload: {
        tel: tel,     //15201441209
        isrepeat
      },
      callback: (res) => {
        if (res.code === '0') {
          this.interval();                                      //执行倒计时
          this.props.callback('clearError');
          Toast.info(`已将短信验证码发送到您${filterTel(tel)}的手机当中，请注意查收！`, 2);
        }else{
          Toast.info(res.msg, 2);
        }
      }
    });
  };

  //短信倒计时
  interval(){
    let num = 60;
    this.setState({btnText: '重新发送(' + num + 's)', btnStyle: styles.disabled, modalVisible: false});
    timer = setInterval(() => {
      if(num === 1){
        this.ajaxFlag = true;
        this.setState({btnText: '获取验证码', btnStyle: styles.actived});
        clearInterval(timer);
      }else{
        num--;
        this.setState({btnText: '重新发送(' + num + 's)'});
      }
    }, 1000)
  }

  //清空输入框
  emitEmpty(){
    this.setState({ value: '' });
    this.props.callback();
  };

  modalCancel = () => {
    this.setState({
      modalVisible: false
    });
  };

  render(){

    const {value, btnText, btnStyle, pintuNo, modalVisible} = this.state;

    const buttonStyle = this.props.buttonStyle || {height: '50px', lineHeight: '50px'};

    const modalWidth = document.body.clientWidth < 750 ? '95%' : '360px';

    return(
      <Row gutter={10} className={styles.smscode}>
        <Col xs={14} sm={14} md={16} lg={16}>
          <Input
            size="large"
            maxLength="4"
            autoComplete="off"
            placeholder="短信验证码"
            onChange={this.changeValue}
            value={value}
            suffix={
              value ?
                <Icon
                  type="close-circle"
                  className={styles.clearInput}
                  onClick={() => this.emitEmpty()}
                />
                :
                null
            }
          />
        </Col>
        <Col xs={10} sm={10} md={8} lg={8}>
          <span
            className={styles.btn + " " + btnStyle}
            style={buttonStyle}
            onClick={this.submit}
          >
            {btnText}
          </span>
        </Col>

        <Col span={0}>
          <Modal
            style={{width: modalWidth}}
            title="请先完成下方验证"
            footer={false}
            closable={true}
            maskClosable={false}
            transparent={true}
            visible={modalVisible}
            onClose={this.modalCancel}
            className={styles.pintuModal}
          >
            <PintuValidate no={pintuNo} callback={this.pintuResult}/>
          </Modal>
        </Col>

      </Row>
    )
  }

}
