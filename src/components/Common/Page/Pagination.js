/**
 * 具体参数参照antd：Pagination
 * 新增showTotalText：是否显示总页数
 */
import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {Pagination,LocaleProvider } from 'antd';
import styles from './Pagination.less';

export default class PageCompontent extends React.Component{
  showTotal=(total)=>{
    let pageSize = this.props.pageSize ? this.props.pageSize :10;
    const precent = total%pageSize;
    const totalPage = Math.floor(total/pageSize);
    return <p><span>{total}条记录</span><span >{this.props.current}/{(precent ? totalPage+1 : totalPage)}页</span></p>;
  }

  render(){
    const {showTotalText} = this.props;
    return(
      <div className={styles.page_wrapper}>
        <div className={styles['override-ant-pagination']}>
          {/* hideOnSinglePage */}
          <LocaleProvider locale={zhCN}>
            <Pagination {...this.props}  showTotal={showTotalText ? this.showTotal:''} ></Pagination >
          </LocaleProvider>
        </div>
      </div>
    )
  }
}
