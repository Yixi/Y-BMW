import React from 'react'
import { createRoot } from 'react-dom/client'
import { App, ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import routes from '@root/routes'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
import './styles/style.less'

const root = createRoot(document.getElementById('app'))

root.render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#ff5000',
        colorLink: '#ff5000',
        borderRadius: 8,
        colorBgContainer: 'rgba(255, 255, 255, 0.04)',
      },
      components: {
        Button: {
          borderRadius: 8,
          controlHeight: 44,
          primaryShadow: '0 4px 14px 0 rgba(255, 80, 0, 0.3)',
        },
        Input: {
          borderRadius: 8,
          controlHeight: 44,
          colorBgContainer: 'rgba(0, 0, 0, 0.2)',
          activeBorderColor: '#ff5000',
        },
        Card: {
          colorBgContainer: 'rgba(255, 255, 255, 0.03)',
        },
      },
    }}
    locale={zhCN}
  >
    <App>
      <RouterProvider router={routes} />
    </App>
  </ConfigProvider>,
)
