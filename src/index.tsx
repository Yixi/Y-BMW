import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.less'
import { App, Button, Col, Input, message, Slider, Space } from 'antd'
import { request, useRequest } from '@root/api'
import { testdata } from '@root/testjson'
import './index.less'

const root = createRoot(document.getElementById('app'))

const DEVICE_ID = 'd37153e5dfe089ea'

const APP: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [smsCode, setSmsCode] = useState<string>('')
  const [captchaPosition, setCaptchaPosition] = useState<number>(0)

  const [{ data: captchaData, loading: captchaLoading }, getCaptcha] =
    useRequest(
      {
        url: '/eadrax-coas/v2/cop/slider-captcha',
        method: 'post',
      },
      { manual: true },
    )

  const [{ data: checkCaptchaResult }, checkCaptcha] = useRequest(
    {
      url: '/eadrax-coas/v1/cop/check-captcha',
      method: 'POST',
    },
    { manual: true },
  )

  const [{ data: smsResult }, sendSMSCode] = useRequest(
    {
      url: '/eadrax-coas/v1/cop/message',
      method: 'POST',
    },
    { manual: true },
  )

  const [{ data: loginResult }, loginBySMS] = useRequest(
    {
      url: '/eadrax-coas/v2/login/sms',
      method: 'POST',
    },
    { manual: true },
  )

  const [, getBMWKey] = useRequest(
    {
      url: '/bmwKey.php',
      method: 'GET',
    },
    { manual: true },
  )

  return (
    <App>
      <div style={{ padding: '0 40px' }}>
        <Space direction="vertical">
          <Space.Compact>
            <Input
              placeholder="input phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Button
              type="primary"
              loading={captchaLoading}
              onClick={() => getCaptcha({ data: { mobile: phoneNumber } })}
            >
              slider captcha (send sms code)
            </Button>
          </Space.Compact>
          {captchaData && (
            <div className="capture">
              <div
                className="capture-bg"
                style={{
                  backgroundImage: `url(data:image;base64,${captchaData?.data.backGroundImg})`,
                }}
              >
                <img
                  style={{ left: `${captchaPosition * 100}%` }}
                  src={`data:image;base64,${captchaData?.data.cutImg}`}
                  className="capture-cutImg"
                />
              </div>
              <Slider
                tooltip={{ open: true, placement: 'bottom' }}
                min={0}
                max={1}
                step={0.01}
                onChange={setCaptchaPosition}
                value={captchaPosition}
              />
              <Button
                onClick={() => {
                  checkCaptcha({
                    data: {
                      position: captchaPosition,
                      verifyId: captchaData.data.verifyId,
                    },
                  }).then((res) => {
                    if (res.data.code === 200) {
                      message.success('check captcha success')

                      sendSMSCode({
                        data: {
                          mobile: phoneNumber,
                          deviceId: DEVICE_ID,
                          verifyId: captchaData.data.verifyId,
                        },
                      }).then((res) => {
                        message.success('send sms code success')
                      })
                    }
                  })
                }}
              >
                Check Captcha
              </Button>
            </div>
          )}

          {smsResult?.code === 200 && (
            <Space.Compact>
              <Input
                placeholder="input sms code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
              />

              {/*<Input*/}
              {/*  placeholder="x-login-noce"*/}
              {/*  value={nonce}*/}
              {/*  onChange={(e) => setNonce(e.target.value)}*/}
              {/*/>*/}

              <Button
                type="primary"
                loading={captchaLoading}
                onClick={() => {
                  getBMWKey({ params: { phone: phoneNumber } }).then((res) => {
                    loginBySMS({
                      headers: {
                        'x-login-nonce': res.data.data,
                      },
                      data: {
                        mobile: phoneNumber,
                        otpId: smsResult.data.otpID,
                        otpMsg: smsCode,
                        deviceId: DEVICE_ID,
                      },
                    })
                  })
                }}
              >
                Login
              </Button>
            </Space.Compact>
          )}
          {loginResult && <pre>{JSON.stringify(loginResult, null, 2)}</pre>}
        </Space>
      </div>
    </App>
  )
}

root.render(<APP />)
