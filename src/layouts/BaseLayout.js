import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ENV, Storage, getUrlParams } from '~/utils/utils';
import DocumentTitle from 'react-document-title';
import styles from './BaseLayout.less'

import NotFound from "~/pages/Other/404";
import Loading from '~/components/Common/Loading';
import GlobalHeader from '~/components/Common/GlobalHeader';
import GlobalContent from '~/components/Common/GlobalContent';
import GlobalFooter from '~/components/Common/GlobalFooter';

const paramsObj = getUrlParams() || '';

@connect(state => ({
  global: state.global,
}))
export default class BaseLayout extends React.Component {

  componentDidMount(){
    const { isAuth } = this.props.global;
    //处理app调用h5
    if(paramsObj.platform === 'app'){
      this.validateToken(paramsObj.accessToken)
    }else{
      if(isAuth) return;                              //isAuth为true时不校验token
      let accessToken = Storage.get(ENV.storageAccessToken);
      let userId = Storage.get(ENV.storageUserId);
      setTimeout(() => {
        this.validateToken(accessToken, userId);     //页面F5刷新时执行token验证
      }, 200);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !== this.props.location.pathname){
      window.scrollTo(0, 0);
      let routerHistory = Storage.get(ENV.storageHistory) || [];
      routerHistory.push(nextProps.location.pathname);
      Storage.set(ENV.storageHistory, routerHistory);
    }
  }

  //验证token
  validateToken = (accessToken, userId) => {
    this.props.dispatch({
      type: 'global/token',
      payload: {
        login_code: accessToken,
        uid: userId
      },
      callback: (res) => {}
    })
  };

  //获取页面标题
  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    const routeData = getRouteData('BaseLayout');

    let appname = paramsObj.platform === 'app' ? '' : ' - ' + ENV.appname;

    let title = '';
    if(pathname === '/'){
      title = paramsObj.platform === 'app' ? '' : ENV.hometitle;
    }else{
      title = this.foreachTitle(routeData, pathname).slice(3) + appname;
    }
    return title;
  }

  //循环标题
  foreachTitle(routeData, pathname){
    let title = '';
    for(let i in routeData){
      if (pathname.indexOf(routeData[i].key) > -1) {
        title = this.foreachTitle(routeData[i].children, pathname) + ' - ' + routeData[i].name;
      }
    }
    return title;
  }

  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  };

  render(){

    const { getRouteData, navData, location } = this.props;
    const { loading } = this.props.global;

    const layout = (
      <div className={styles.layout}>

        {
          paramsObj.platform === 'app' || location.pathname === '/download' ?
            null
            :
            <GlobalHeader navData={navData[0].children}/>
        }

        {
          loading ?
            <Loading/>
            :
            <div
              className={styles.content}
              style={paramsObj.platform === 'app' ? null : {paddingTop: '60px'}}
            >
              <GlobalContent>

                <Switch>
                  {
                    getRouteData('BaseLayout').map(item =>
                      (
                        <Route
                          exact={item.exact}
                          key={item.path}
                          path={item.path}
                          component={item.component}
                        />
                      )
                    )
                  }
                  <Redirect exact from="/account" to="/account/total" />
                  <Route component={NotFound} />
                </Switch>

              </GlobalContent>
            </div>
        }

        {
          location.pathname === '/' ?
            null
            :
            <GlobalFooter/>
        }

      </div>
    );

    return(
      <DocumentTitle title={this.getPageTitle()}>
        {layout}
      </DocumentTitle>
    )
  }

}
