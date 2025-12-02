import React from 'react'
import { createRoot } from 'react-dom/client'
import { App, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import routes from '@root/routes'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
import './styles/style.less'

const root = createRoot(document.getElementById('app'))

root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#f56e03',
        colorLink: '#f56e03',
        borderRadius: 8,
      },
      components: {
        Button: {
          borderRadius: 8,
          controlHeight: 40,
        },
        Input: {
          borderRadius: 8,
          controlHeight: 40,
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
