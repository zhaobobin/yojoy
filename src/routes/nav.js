import BaseRoutes from './base'
//import UserRoutes from './user'

// nav data
export const getNavData = app => {
  let base = BaseRoutes(app);
  //let user = UserRoutes(app);
  return [
    ...base,
    //...user,
  ]
};
