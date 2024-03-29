import { makeUseAxios } from 'axios-hooks'
import axios from 'axios'

const useRequest = makeUseAxios({
  axios: axios.create({
    baseURL: '/api',
    headers: {
      'x-user-agent': 'android(rq3a.211001.001 test-keys);bmw;3.6.1(23634);cn',
      'accept-language': 'zh-CN',
    },
  }),
})

export default useRequest
