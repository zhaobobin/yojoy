import React from 'react';
import { Link } from 'dva/router'
import styles from './HomeBanner.less'

export default function HomeBanner () {

  return(
    <div className={styles.container} id="home">

      <div className={styles.banner}>
        <img src={require('~/assets/home/banner.jpg')} alt="banner"/>
        <h1>悠洛网络 <br/> 为您的产品出海保驾护航</h1>
        <a className={styles.down}/>
      </div>

      <div className={styles.desc}>
        <p>北京悠洛网络技术有限公司（Yojoy Network Technology Co., Limited），成立于2018年，是一家为工具、游戏、电商、旅游文化等企业，提供海外效果广告营销和解决方案的提供商。</p>
        <p>为客户提供Facebook，Google Ads，Twitter，Applovin，Unity，Ironsource等主流平台的定制化营销解决方案以及广告托管服务，是Google中国区广告核心代理商。</p>
        <p>凭借行业领先的投放团队和高品质服务，依托大数据技术为全球客户提供高质量的流量以及高额的ROI回报。</p>
      </div>

    </div>
  )

}
