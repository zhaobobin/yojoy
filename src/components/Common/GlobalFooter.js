import React from 'react';
import { connect } from 'dva';
import { ENV } from '~/utils/utils'
import styles from './GlobalFooter.less'

export default function GlobalFooter () {

  return(
    <div className={styles.footer}>
      <p>
        <span>© 2019 {ENV.appname}</span>
        <span>{ENV.web}</span>
        <span>{ENV.beian}</span>
      </p>
    </div>
  )

}
