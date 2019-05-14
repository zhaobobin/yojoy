/**
 * 表单 - 图形验证码
 */
import React from 'react';
import { Row, Col, Input, Icon } from 'antd';
import styles from './InputPassword.less'

import eye_close from '~/assets/sign/invisible@2x.png'
import eye_open from '~/assets/sign/signremind_open@2x.png'

export default class InputPassword extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {
      value: '',            //输入框的值
      inputType: 'password'
    }
  }

  //监控输入值
  changeValue = (e) => {
    let value = e.target.value.replace(/ /g,'');
    this.props.callback(value);
    this.setState({
      value
    });
  };

  //清空输入框
  emitEmpty(){
    this.setState({ value: '' });
    this.props.callback();
  };

  changeInputType = () => {
    let {inputType} = this.state;
    this.setState({
      inputType: inputType === 'text' ? 'password' : 'text'
    })
  };

  render(){

    const { value, inputType } = this.state;

    return(
      <Input
        type={inputType}
        size="large"
        minLength="6"
        maxLength="20"
        autoComplete="off"
        placeholder="密码"
        onChange={this.changeValue}
        value={value}
        className={styles.password}
        suffix={
          <span>
            {
              value ?
                <Icon
                  type="close-circle"
                  onClick={() => this.emitEmpty()}
                />
                :
                null
            }
            <img
              className={styles.eye}
              src={inputType === 'text' ? eye_open : eye_close}
              onClick={this.changeInputType}
              width="20px"
              height="auto"
              alt="eye"
            />
          </span>
        }
      />
    )
  }

}
