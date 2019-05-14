import React from 'react';
import { Link } from 'dva/router';
import Exception from '~/components/Exception';
import DocumentTitle from 'react-document-title';

export default () => (
  <DocumentTitle title="page404 - 趣族">
    <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
  </DocumentTitle>
);
