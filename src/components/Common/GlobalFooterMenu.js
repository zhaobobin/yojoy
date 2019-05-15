/**
 * 底部导航菜单
 */
import React from 'react';
import {NavLink} from 'dva/router';
import {Row, Col, Menu, Dropdown, Icon} from 'antd'
import styles from './GlobalFooterMenu.less';

export default class GlobalFooterMenu extends React.Component {

  constructor(props){
    super(props);
    this.state = {

    }
  }

  scrollToAnchor = (anchorName) => {
    let anchorElement = document.getElementById(anchorName);
    // 如果对应id的锚点存在，就跳转到锚点
    if(anchorElement) {
      anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'});
    }
  };

  getMenuList = (menusData, type) => {
    if (!menusData) return [];
    return menusData.map((item, index) => {
      if (!item.name || item.isHide) return null;
      return (
        type === 'main' ?
          <li key={item.key}>
            <a
              className={styles.link}
              onClick={() => this.scrollToAnchor(item.key)}
            >
              <span>
                {item.name}
              </span>
              <i className={styles.border}/>
            </a>
          </li>
          :
          <Menu.Item key={item.key}>
            <a
              className={styles.link}
              onClick={() => this.scrollToAnchor(item.key)}
            >
              <span>
                {item.name}
              </span>
              <i className={styles.border}/>
            </a>
          </Menu.Item>
      )
    })
  };

  render(){

    const {navData} = this.props;

    return (
      <Row>

        <Col xs={0} sm={0} md={0} lg={24}>
          <ul className={styles.mainMenu}>
            {this.getMenuList(navData, 'main')}
          </ul>
        </Col>

        <Col xs={24} sm={24} md={24} lg={0}>
          <div className={styles.miniMenu}>
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              overlay={
                <Menu>
                  {this.getMenuList(navData, 'mini')}
                </Menu>
              }
              overlayStyle={{
                width: '100px'
              }}
            >
              <div className={styles.menuButton}>
                <Icon type="minus" />
                <Icon type="minus" />
                <Icon type="minus" />
              </div>
            </Dropdown>
          </div>
        </Col>

      </Row>
    )
  }

};

