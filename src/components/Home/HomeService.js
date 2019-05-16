import React from 'react';
import { Row, Col } from 'antd'
import styles from './HomeService.less'

export default function HomeService () {

  return(
    <div className={styles.container} id="service">

      <div className={styles.section1}>

        <Row>

          <Col xs={1} sm={2} md={5} lg={5}/>

          <Col xs={22} sm={20} md={14} lg={14}>

            <Row>
              <Col sm={24} xs={24} md={8} lg={8}>
                <h2>我们能做什么？</h2>
                <dl>
                  <dt>广告投放</dt>
                  <dd>帮助客户在指定媒体平台获取目标用户，为您架设合理的投放逻辑、展现方式、渠道、出价策略以及再营销的品牌定位，确保服务期间的有效信息触达受众。</dd>
                </dl>
              </Col>
              <Col sm={24} xs={24} md={16} lg={16}>
                <img className={styles.bg} src={require('~/assets/home/section1_bg.png')} alt="section1_bg"/>
              </Col>
            </Row>

          </Col>

          <Col xs={1} sm={2} md={5} lg={5}/>

        </Row>

      </div>

      <div className={styles.section2}>
        <Row>

          <Col xs={1} sm={2} md={5} lg={5}/>

          <Col xs={22} sm={20} md={14} lg={14}>

            <div className={styles.con}>
              <dl>
                <dt>创意设计</dt>
                <dd>为产品提供不同媒体环境、用户特征和地域文化的创意设计及视频</dd>
              </dl>
              <Row>
                <Col sm={24} xs={24} md={10} lg={10}>
                  <img className={styles.bg} src={require('~/assets/home/section2_bg.png')} alt="section2_bg"/>
                </Col>
                <Col sm={24} xs={24} md={14} lg={14}/>
              </Row>
            </div>

          </Col>

          <Col xs={1} sm={2} md={5} lg={5}/>

        </Row>
      </div>

      <div className={styles.section3}>
        <Row>

          <Col xs={1} sm={2} md={5} lg={5}/>

          <Col xs={22} sm={20} md={14} lg={14}>

            <div className={styles.con}>
              <dl>
                <dt>账户管理</dt>
                <dd>为客户提供顶级流量平台Google本地化快速开户支持</dd>
              </dl>
              <Row>
                <Col sm={24} xs={24} md={12} lg={12}/>
                <Col sm={24} xs={24} md={12} lg={12}>
                  <img className={styles.bg} src={require('~/assets/home/section3_bg.png')} alt="section3_bg"/>
                </Col>
              </Row>
            </div>

          </Col>

          <Col xs={1} sm={2} md={5} lg={5}/>

        </Row>
      </div>

      <div className={styles.section4}>
        <Row>

          <Col xs={1} sm={2} md={5} lg={5}/>

          <Col xs={22} sm={20} md={14} lg={14}>

            <div className={styles.con}>
              <h2>我们的优势</h2>

              <Row>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <dl>
                    <dt>
                      <img src={require('~/assets/home/team@2x.png')} alt="team"/>
                      <span>资深团队</span>
                    </dt>
                    <dd>
                      <p>团队汇聚数名经验丰富的资深优化师，平均优化经验3年以上，擅长多维度分析数据，高精准获取用户，大幅度提高广告效果</p>
                    </dd>
                  </dl>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <dl>
                    <dt>
                      <img src={require('~/assets/home/bulb@2x.png')} alt="bulb"/>
                      <span>原创能力</span>
                    </dt>
                    <dd>
                      <p>团队设计师均具备视频制作能力，掌握Facebook，Google等主流媒体的广告素材特点及要求 ，基于本地化立场，通过原创制作出优质素材</p>
                    </dd>
                  </dl>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8}>
                  <dl>
                    <dt>
                      <img src={require('~/assets/home/safety@2x.png')} alt="safety"/>
                      <span>专业高效</span>
                    </dt>
                    <dd>
                      <p>作为Google官方授权的中国区核心代理商，能够高效响应客户开户充值等需求；并配有专业人员指导账号授权、广告上线、转化关联等相关操作</p>
                    </dd>
                  </dl>
                </Col>
              </Row>
            </div>

          </Col>

          <Col xs={1} sm={2} md={5} lg={5}/>

        </Row>
      </div>

    </div>
  )

}
