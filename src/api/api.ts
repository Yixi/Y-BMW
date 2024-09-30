import { makeUseAxios } from 'axios-hooks'
import axios from 'axios'

const useRequest = makeUseAxios({
  axios: axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-user-agent': 'android(29);bmw;4.9.1(36994);cn',
      'Accept-Language': 'zh-CN',
      'User-Agent': 'Dart/3.3 (dart:io)',
    },
  }),
})

export default useRequest
