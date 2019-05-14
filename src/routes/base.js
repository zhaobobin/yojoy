import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

const BaseRoutes = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/BaseLayout')),
    layout: 'BaseLayout',
    key: 'MainMenu',
    name: '前台',
    path: '/',
    children: [
      {
        name: '首页',
        key: 'home',
        path: '',
        exact: true,
        component: dynamicWrapper(app, [], () => import('../pages/Home/Home')),
      },

    ]
  },
];

export default BaseRoutes
