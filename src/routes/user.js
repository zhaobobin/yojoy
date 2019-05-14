import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

const UserRoutes = app => [
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    layout: 'UserLayout',
    key: 'UserMenu',
    name: '用户',
    path: 'user',
    children: [
      {
        name: '用户登录',
        key: 'login',
        path: 'user/login',
        component: dynamicWrapper(app, [], () => import('../pages/User/Login')),
      },
      {
        name: '忘记密码',
        key: 'reset',
        path: 'user/reset/:step',
        component: dynamicWrapper(app, [], () => import('../pages/User/Reset')),
      },

    ],
  },
];

export default UserRoutes
