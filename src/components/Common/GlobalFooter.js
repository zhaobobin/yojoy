import React from 'react';
import { Link } from 'dva/router'
import { Row, Col } from 'antd'
import { ENV } from '~/utils/utils'
import styles from './GlobalFooter.less'

import logo from '~/assets/com/logo2@2x.png'
import GlobalFooterMenu from '~/components/Common/GlobalFooterMenu'

export default function GlobalFooter ({navData}) {

  return(
    <div className={styles.container}>

      <Row>

        <Col xs={1} sm={2} md={4} lg={4}/>

        <Col xs={22} sm={20} md={16} lg={16}>

          <div className={styles.nav}>

            <div className={styles.logo}>
              <a href="/">
                <img src={logo} alt="logo"/>
              </a>
              <span>{ENV.company}</span>
            </div>

            {
              navData ?
                <div className={styles.menu}>
                  <GlobalFooterMenu navData={navData}/>
                </div>
                :
                null
            }

          </div>

          <div className={styles.copyright}>
            <p>Copyright &copy; 2019 yojoy Inc. 保留所有权利。</p>
          </div>

        </Col>

        <Col xs={1} sm={2} md={4} lg={4}/>

      </Row>

    </div>
  )

}
