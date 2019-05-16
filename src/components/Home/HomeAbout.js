import React from 'react';
import { Row, Col } from 'antd'
import styles from './HomeAbout.less'

export default function HomeAbout () {

  return(
    <div className={styles.container} id="about">

      <Row>

        <Col xs={1} sm={2} md={6} lg={6}/>

        <Col xs={22} sm={20} md={12} lg={12}>

          <dl>
            <dt>联系我们</dt>
            <dd>
              <p>
                <label>地址：</label>
                <span>北京市朝阳区霄云里8号院16层15095</span>
              </p>
              <p>
                <label>邮箱：</label>
                <span>bd@yojoynet.com</span>
              </p>
            </dd>
          </dl>

        </Col>

        <Col xs={1} sm={2} md={6} lg={6}/>

      </Row>

    </div>
  )

}
