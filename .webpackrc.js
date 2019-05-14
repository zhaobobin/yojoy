const path = require('path');
import { ENV } from './src/utils/utils';

export  default {
  "entry": "src/index.js",
  "outputPath": "./dist/",
  "publicPath": "/",
  "hash": true,
  "ignoreMomentLocale": true,
  "theme": "./src/theme/theme.js",
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }, "antd"],
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true }, "antd-mobile"],
  ],
  "alias": {
    "~": path.resolve(__dirname, "./src"),
    "~@": path.resolve(__dirname, "./src/theme"),
  },
  "env": {
    "development": {
      "extraBabelPlugins": ["dva-hmr"],
      "publicPath": "/"
    }
  },
  "html": {
    "template": "./src/index.ejs",
    "appname": ENV.appname,
    "title": ENV.hometitle,
    "keywords": ENV.keywords,
    "description": ENV.description,
  },
  "lessLoaderOptions": {
    "javascriptEnabled": true,
  },
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "externals": {
    "BMap": "BMap",
    "BMapLib": "BMapLib",
    "g2": "G2",
    "g-cloud": "Cloud",
    "g2-plugin-slider": "G2.Plugin.slider",
  },
  "proxy": {
    "/api": {
      "target": ENV.api.pro,
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}
