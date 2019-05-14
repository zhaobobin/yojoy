/**
 * loading
 */
import React from 'react';
import { Spin } from 'antd';

const Loading = () => {
  return(
    <div style={{padding: '200px 0', textAlign: 'center'}}>
      <Spin size="large" delay={200}/>
    </div>
  )
};

export default Loading;
