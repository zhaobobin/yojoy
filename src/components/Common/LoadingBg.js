import React from 'react';

export default function LoadingBg (props) {

  const style = {
    margin: 'auto',
    width: '100%',
    height: '100px',
    background: `url(${require('~/assets/com/loading_bg.png')}) no-repeat center center #f8f9fb`,
    ...props.style,
  };

  return(
    <div className={props.className} style={style}/>
  )
}
