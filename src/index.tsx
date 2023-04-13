import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/style.less'
import { App, Button, Input, message, Slider, Space } from 'antd'
import './index.less'
import { encodePwd } from '@root/encode'
import { makeUseAxios } from 'axios-hooks'
import axios from 'axios'

const root = createRoot(document.getElementById('app'))

const DEVICE_ID = 'd37153e5dfe089ea'

const useRequest = makeUseAxios({
  axios: axios.create({
    // baseURL: 'https://myprofile.bmw.com.cn',
    headers: {
      'x-user-agent': 'android(rq3a.211001.001 test-keys);bmw;3.1.0(20658);cn',
    },
  }),
})

const APP: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [smsCode, setSmsCode] = useState<string>('')
  const [password, setPassword] = useState('')
  const [captchaPosition, setCaptchaPosition] = useState<number>(0)
  const [showPasswordInput, setShowPasswordInput] = useState(false)

  const [{ data: pubKeyData }] = useRequest({
    url: '/eadrax-coas/v1/cop/publickey',
  })

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

  const [{ data: pwdLoginResult }, loginByPwd] = useRequest(
    {
      url: '/eadrax-coas/v2/login/pwd',
      method: 'POST',
    },
    { manual: true },
  )

  const [{ data: refreshResult }, refreshToken] = useRequest(
    {
      url: '/eadrax-coas/v1/oauth/token',
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
          <Space.Compact style={{ width: '500px' }}>
            <Input
              style={{ width: '400px' }}
              placeholder="input phone number with 86"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Button
              type="primary"
              loading={captchaLoading}
              onClick={() => getCaptcha({ data: { mobile: phoneNumber } })}
            >
              slider captcha
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
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    checkCaptcha({
                      data: {
                        position: captchaPosition,
                        verifyId: captchaData.data.verifyId,
                      },
                    }).then(() => {
                      setShowPasswordInput(true)
                    })
                  }}
                >
                  Check Captcha with password login
                </Button>
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
                  Check Captcha and Send SMS Code
                </Button>
              </Space>
            </div>
          )}

          {smsResult?.code === 200 && (
            <Space.Compact>
              <Input
                placeholder="input sms code"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
              />

              <Button
                type="primary"
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

          {showPasswordInput && (
            <Space.Compact>
              <Input
                placeholder="Input Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="primary"
                onClick={() => {
                  getBMWKey({ params: { phone: phoneNumber } }).then((res) => {
                    encodePwd(pubKeyData?.data?.value, password).then(
                      (encodePwd) => {
                        loginByPwd({
                          headers: {
                            'x-login-nonce': res.data.data,
                          },
                          data: {
                            mobile: phoneNumber,
                            password: encodePwd,
                            verifyId: captchaData.data.verifyId,
                            deviceId: DEVICE_ID,
                          },
                        })
                      },
                    )
                  })
                }}
              >
                Login
              </Button>
            </Space.Compact>
          )}

          {loginResult && <pre>{JSON.stringify(loginResult, null, 2)}</pre>}
          {pwdLoginResult && (
            <pre>{JSON.stringify(pwdLoginResult, null, 2)}</pre>
          )}

          {(loginResult || pwdLoginResult) && (
            <Button
              onClick={() => {
                refreshToken({
                  data: `grant_type=refresh_token&refresh_token=${
                    pwdLoginResult?.data?.refresh_token ||
                    loginResult?.data?.refresh_token
                  }`,
                })
              }}
            >
              Refresh token
            </Button>
          )}

          {refreshResult && <pre>{JSON.stringify(refreshResult, null, 2)}</pre>}
        </Space>
      </div>
    </App>
  )
}

root.render(<APP />)
