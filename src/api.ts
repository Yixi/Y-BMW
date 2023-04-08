import { makeUseAxios } from 'axios-hooks'
import axios from 'axios'

export const request = axios.create({
  // baseURL: 'https://myprofile.bmw.com.cn',
  headers: {
    'x-user-agent': 'android(rq3a.211001.001 test-keys);bmw;3.1.0(20658);cn',
  },
})

export const useRequest = makeUseAxios({
  axios: request,
})
