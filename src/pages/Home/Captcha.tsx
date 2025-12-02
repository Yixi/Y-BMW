import React, { useState } from 'react'
import { Button, Slider, Space } from 'antd'
import styles from './index.module.less'

interface ICaptchaProps {
  backGroundImg: string
  cutImg: string
  checking?: boolean
  onSuccess?: (position: number) => void
  btnDisabled?: boolean
}
const Captcha: React.FC<ICaptchaProps> = ({
  backGroundImg,
  cutImg,
  checking = false,
  onSuccess,
  btnDisabled,
}) => {
  const [position, setPosition] = useState(0)

  return (
    <Space direction="vertical" style={{ width: '413px' }} size={16}>
      <div className={styles.capture}>
        <div
          className={styles['capture-bg']}
          style={{ backgroundImage: `url(data:image;base64,${backGroundImg})` }}
        >
          <img
            style={{ left: `${position * 100}%` }}
            src={`data:image;base64, ${cutImg}`}
          />
        </div>
      </div>
      <Slider
        min={0}
        max={1}
        step={0.01}
        onChange={setPosition}
        value={position}
        tooltip={{ formatter: (value) => `${Math.round(value * 100)}%` }}
      />
      <Button
        disabled={btnDisabled}
        type="primary"
        loading={checking}
        onClick={() => onSuccess(position)}
        size="large"
        style={{ borderRadius: '8px', width: '100%' }}
      >
        验证图形验证码
      </Button>
    </Space>
  )
}

export default React.memo(Captcha)
