import React, { useMemo } from 'react'
import { App, Button, Input, Space } from 'antd'
import useRequest from '@root/api/api'
import Captcha from '@root/pages/Home/Captcha'
import styles from './index.module.less'
import { encodePwd } from '@root/utils/encodeBMWPwd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import md5 from 'md5'
import { LIST_CHAR } from '@root/utils/constants'
import { uuidv4 } from '@root/utils/help'

let BMW_HEADERS_X = {}

const HomePage: React.FC = () => {
  const { message } = App.useApp()
  const [phone, setPhone] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [pwdLoginLoading, setPwdLoginLoading] = React.useState<boolean>(false)
  const [smsCode, setSmsCode] = React.useState<string>('')
  const [smsLoginLoading, setSmsLoginLoading] = React.useState<boolean>(false)
  const [refreshTokenLoading, setRefreshTokenLoading] =
    React.useState<boolean>(false)
  const [{ data: captchaData, loading: captchaLoading }, getCaptcha] =
    useRequest(
      {
        url: '/bmw/eadrax-coas/v2/cop/create-captcha',
        method: 'POST',
      },
      { manual: true },
    )

  const [
    { data: checkCaptchaData, loading: checkCaptchaLoading },
    checkCaptcha,
  ] = useRequest(
    {
      url: '/bmw/eadrax-coas/v2/cop/verify-captcha',
      method: 'POST',
    },
    { manual: true },
  )

  const [, getPubKey] = useRequest(
    {
      url: '/bmw/eadrax-coas/v1/cop/publickey',
    },
    { manual: true },
  )

  const [{ data: smsResult, loading: smsCodeLoading }, sendSMSCode] =
    useRequest(
      {
        url: '/bmw/eadrax-coas/v1/cop/message',
        method: 'POST',
      },
      { manual: true },
    )

  const [{ data: smsLoginResult }, loginBySMS] = useRequest(
    {
      url: '/bmw/eadrax-coas/v2/login/sms',
      method: 'POST',
    },
    { manual: true },
  )

  const [, getLoginNonce] = useRequest(
    { url: '/util/nonce', method: 'POST' },
    { manual: true },
  )

  const [{ data: pwdLoginResult }, loginByPwd] = useRequest(
    { url: 'bmw/eadrax-coas/v2/login/pwd', method: 'POST' },
    { manual: true },
  )

  const [{ data: refreshTokenResult }, refreshToken] = useRequest(
    { url: '/bmw/eadrax-coas/v2/oauth/token', method: 'POST' },
    { manual: true },
  )

  const loginResult = useMemo(() => {
    return pwdLoginResult || smsLoginResult
  }, [pwdLoginResult, smsLoginResult])

  const mobile = useMemo(() => {
    return `86${phone}`
  }, [phone])

  const onGetCaptcha = async () => {
    for (let i = 0; i < LIST_CHAR.length; i++) {
      const uuid = uuidv4()
      BMW_HEADERS_X = {
        ...BMW_HEADERS_X,
        'x-correlation-id': uuid,
        'bmw-correlation-id': uuid,
        x: `${LIST_CHAR[i]}${md5(uuidv4())}${md5(uuidv4())}`.substr(0, 64),
      }

      try {
        await getCaptcha({
          data: { mobile, brand: 'BMW' },
          headers: {
            ...BMW_HEADERS_X,
          },
        })
        message.success('获取图形验证码成功')
        break
      } catch (err) {
        message.error({
          content: '获取图形验证码失败, 重试...',
          key: 'capture_error',
        })
        continue
      }
    }
  }

  const onPwdLogin = async () => {
    setPwdLoginLoading(true)
    try {
      const [nonceRes, pubKeyRes] = await Promise.all([
        getLoginNonce({ data: { mobile } }),
        getPubKey(),
      ])

      const encryptPwd = await encodePwd(pubKeyRes?.data?.data?.value, password)

      await loginByPwd({
        headers: {
          'x-login-nonce': nonceRes?.data?.nonce,
          ...BMW_HEADERS_X,
        },
        data: {
          mobile,
          password: encryptPwd,
          verifyId: captchaData.data.verifyId,
          deviceId: md5(mobile),
        },
      })

      message.success('登录成功')
    } catch (err) {
      message.error(err?.response?.data?.description || '登录失败')
    }
    setPwdLoginLoading(false)
  }
  const onSmsLogin = async () => {
    setSmsLoginLoading(true)
    try {
      const nonceRes = await getLoginNonce({ data: { mobile } })
      await loginBySMS({
        headers: {
          'x-login-nonce': nonceRes?.data?.nonce,
          ...BMW_HEADERS_X,
        },
        data: {
          mobile,
          otpId: smsResult?.data?.otpID,
          otpMsg: smsCode,
          deviceId: md5(mobile),
        },
      })

      message.success('登录成功')
    } catch (err) {
      message.error(err?.response?.data?.description || '登录失败')
    }
    setSmsLoginLoading(false)
  }

  const onRefreshToken = async () => {
    setRefreshTokenLoading(true)

    try {
      const nonceRes = await getLoginNonce({
        data: { mobile: loginResult?.data?.gcid },
      })
      await refreshToken({
        headers: {
          'x-login-nonce': nonceRes?.data?.nonce,
          ...BMW_HEADERS_X,
          'content-type': 'text/plain',
        },
        data: `grant_type=refresh_token&refresh_token=${loginResult?.data?.refresh_token}`,
      })
      message.success('刷新 Access Token 成功')
    } catch (err) {
      message.error(
        err?.response?.data?.description || '刷新 Access Token 失败',
      )
    }
    setRefreshTokenLoading(false)
  }

  return (
    <Space direction="vertical" size={32}>
      <Space direction="vertical">
        <div>1. 获取图形校验</div>
        <Space.Compact>
          <Input
            disabled={captchaData?.code === 200}
            placeholder="输入手机号"
            prefix="86"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={onGetCaptcha}
          />
          <Button
            type="primary"
            disabled={captchaData?.code === 200}
            loading={captchaLoading}
            onClick={onGetCaptcha}
          >
            获取图形验证码
          </Button>
        </Space.Compact>
      </Space>

      {captchaData?.code === 200 && (
        <Space direction="vertical">
          <div>2. 完成图形校验, 拖动滑动条完成图形校验</div>
          <Captcha
            btnDisabled={checkCaptchaData?.code === 200}
            backGroundImg={captchaData.data.backGroundImg}
            cutImg={captchaData.data.cutImg}
            checking={checkCaptchaLoading}
            onSuccess={(position) => {
              checkCaptcha({
                data: {
                  position,
                  verifyId: captchaData.data.verifyId,
                  mobile,
                },
                headers: {
                  ...BMW_HEADERS_X,
                },
              })
                .then(() => {
                  message.success('图形验证码校验成功')
                })
                .catch(() => {
                  message.error('图形验证码校验失败')
                })
            }}
          />
        </Space>
      )}

      {checkCaptchaData?.code === 200 && (
        <Space direction="vertical">
          <div>3. 选择密码或者短信验证码登录</div>
          <Space size={30} align="start">
            <Space direction="vertical">
              <div>密码登录</div>
              <Space.Compact>
                <Input
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onPressEnter={onPwdLogin}
                />
                <Button
                  loading={pwdLoginLoading}
                  disabled={loginResult?.code === 200 || !password}
                  type="primary"
                  onClick={onPwdLogin}
                >
                  登录
                </Button>
              </Space.Compact>
            </Space>
            <div className={styles.diver} />
            <Space direction="vertical">
              <div>短信验证码登录</div>
              <Space.Compact>
                <Button
                  type="primary"
                  loading={smsCodeLoading}
                  disabled={
                    loginResult?.code === 200 || smsResult?.code === 200
                  }
                  onClick={() => {
                    sendSMSCode({
                      data: {
                        mobile,
                        deviceId: md5(mobile),
                        verifyId: captchaData.data.verifyId,
                      },
                      headers: {
                        ...BMW_HEADERS_X,
                      },
                    })
                      .then(() => {
                        message.success('获取短信验证码成功')
                      })
                      .catch(() => {
                        message.error('获取短信验证码失败')
                      })
                  }}
                >
                  获取短信验证码
                </Button>
                <Input
                  placeholder="输入短信验证码"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  onPressEnter={onSmsLogin}
                />
                <Button
                  type="primary"
                  loading={smsLoginLoading}
                  disabled={
                    loginResult?.code === 200 ||
                    smsResult?.code !== 200 ||
                    !smsCode
                  }
                  onClick={onSmsLogin}
                >
                  登录
                </Button>
              </Space.Compact>
            </Space>
          </Space>
        </Space>
      )}

      {loginResult?.code === 200 && (
        <Space direction="vertical">
          <div>4. 获取登录refresh token</div>
          <pre className={styles.response}>
            {JSON.stringify(loginResult?.data, null, 2)}
          </pre>
          <Space>
            <CopyToClipboard
              text={loginResult?.data?.refresh_token}
              onCopy={() => message.success('复制 Refresh Token 成功')}
            >
              <Button type="primary">复制 Refresh Token</Button>
            </CopyToClipboard>

            <CopyToClipboard
              text={loginResult?.data?.access_token}
              onCopy={() => message.success('复制 Access Token 成功')}
            >
              <Button type="primary">复制 Access Token</Button>
            </CopyToClipboard>

            <Button
              type="primary"
              onClick={onRefreshToken}
              loading={refreshTokenLoading}
            >
              刷新 Access Token
            </Button>
          </Space>
        </Space>
      )}

      {refreshTokenResult && (
        <pre className={styles.response}>
          {JSON.stringify(refreshTokenResult, null, 2)}
        </pre>
      )}
    </Space>
  )
}

export default React.memo(HomePage)
