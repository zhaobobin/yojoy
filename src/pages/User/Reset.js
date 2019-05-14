/**
 * 重置登录密码
 */
import React from 'react';
import { Link } from 'dva/router';
import styles from './Reset.less';

import PsdReset from '~/components/Form/PsdReset'

export default class Reset extends React.Component {

  constructor(props){
    super(props);
    this.ajaxFlag = true;
    this.state = {

    }
  }

  render(){

    const step = this.props.match.params.step;

    return(

      <div className={styles.reset}>

        <PsdReset psdType="login" step={step}/>

      </div>

    )
  }

}
