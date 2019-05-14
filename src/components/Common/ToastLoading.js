/**
 * loading
 */
import React from 'react';
import { Spin } from 'antd';

const style = {
  container: {width: '100%', height: '100%', position: 'fixed', left: 0, top:0, zIndex: 9999},
  spin: {position: 'absolute', left: '50%', top: '50%', marginLeft: '-16px', marginTop: '-16px'}
};

const ToastLoading = () => {
  return(
    <div style={style.container}>
      <Spin size="large" delay={200} style={style.spin}/>
    </div>
  )
};

export default ToastLoading;
