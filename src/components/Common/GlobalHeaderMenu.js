/**
 * 主导航菜单
 */
import React from 'react';
import {NavLink} from 'dva/router';
import {Row, Col, Menu, Dropdown, Icon} from 'antd'
import styles from './GlobalHeaderMenu.less';

function getMenuList(menusData, type) {
  if (!menusData) return [];
  return menusData.map((item, index) => {
    if (!item.name || item.isHide) return null;
    return (
      type === 'main' ?
        <li key={item.key}>
          <NavLink
            exact={item.exact}
            className={styles.link}
            activeClassName={styles.current}
            to={`/${item.path}`}
          >
          <span>
            {item.name}
          </span>
            <i className={styles.border}/>
          </NavLink>
        </li>
        :
        <Menu.Item key={item.key}>
          <NavLink
            exact={item.exact}
            className={styles.link}
            activeClassName={styles.current}
            to={`/${item.path}`}
          >
          <span>
            {item.name}
          </span>
            <i className={styles.border}/>
          </NavLink>
        </Menu.Item>
    )
  })
}

export default function GlobalHeaderMenu({navData}) {

  return (
    <Row>

      <Col xs={0} sm={0} md={0} lg={24}>
        <ul className={styles.mainMenu}>
          {getMenuList(navData, 'main')}
        </ul>
      </Col>

      <Col xs={24} sm={24} md={24} lg={0}>
        <div className={styles.miniMenu}>
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            overlay={
              <Menu>
                {getMenuList(navData, 'mini')}
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

};

