import './polyfill';
import dva from 'dva';
import browserHistory from 'history/createBrowserHistory';
import './theme/base.less';

const history = process.env.NODE_ENV === 'production' ?
  {history: browserHistory()}
  :
  {};

// 1. Initialize2
const app = dva(history);

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./routes/router').default);

// 5. Start
app.start('#root');

export default app;
