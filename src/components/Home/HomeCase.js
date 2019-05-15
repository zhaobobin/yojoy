import React from 'react';
import { Row, Col } from 'antd'
import styles from './HomeCase.less'

const list = [
  {
    title: '紫龙-风之大陆',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case01.jpg')
  },
  {
    title: '小影app',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case02.jpg')
  },
  {
    title: '扫描全能王app',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case03.jpg')
  },
  {
    title: '火溶-真三国大战',
    desc: '介绍文案文案文案',
    img: require('~/assets/home/case04.jpg')
  }
];

export default function HomeCase () {

  return(
    <div className={styles.container} id="case">

      <Row>

        <Col xs={1} sm={2} md={4} lg={4}/>

        <Col xs={22} sm={20} md={16} lg={16}>

          <div className={styles.con}>
            <h2>经典案例</h2>



          </div>

        </Col>

        <Col xs={1} sm={2} md={4} lg={4}/>

      </Row>

    </div>
  )

}
