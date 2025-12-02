import React from 'react'
import styles from './index.module.less'
import { NavLink } from 'react-router-dom'
import cls from 'classnames'
import { GithubOutlined } from '@ant-design/icons'

const Titan: React.FC = () => {
  return (
    <div className={styles.titan}>
      <div className={styles.logo}>Y BMW Tools</div>
      <div className={styles.navs}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            cls(styles.nav, { [styles.active]: isActive })
          }
        >
          首页
        </NavLink>
      </div>
      <div className={styles.actions}>
        <span
          className={styles.git}
          onClick={() => {
            window.open('https://github.com/Yixi/Y-BMW')
          }}
        >
          <GithubOutlined />
        </span>
      </div>
    </div>
  )
}

export default React.memo(Titan)
