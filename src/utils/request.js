import axios from 'axios'
import { SERVICE_URL } from './config'
import { useUserStore } from '@/stores/user'

const instance = axios.create({
  baseURL: SERVICE_URL,
  timeout: 30000,
  withCredentials: true
})

instance.interceptors.request.use(
  async ({ withToken = true, silent = false, ...config }) => {
    if (withToken) {
      config.headers.Authorization = await useUserStore().forceGetToken()
    }
    return { silent, ...config }
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    if (+response.data.code === 0) {
      return response.data.data
    }
    throw new Error(response.data.message)
  },
  async (error) => {
    const config = error.config
    const response = error.response
    if (response.status === 401) {
      // 任意一个请求，出现401时，会自动调用一下登录接口，重新请求一次。
      if (!config.isRetry) {
        await useUserStore().login()
        return instance({ ...config, isRetry: true })
      }
      // 对于已经重试过的请求，则会报错
      alert('登录信息超时，请重新进入系统')
      throw new Error('登录信息超时，请稍后再试')
    }

    if (!config.silent) {
      // 是否静默请求，对于非静默请求，会自动弹出错误消息
      alert(error.message || '服务器响应失败，请稍后再试')
    }
    return Promise.reject(error)
  }
)

// 请求中的登录态设置
export const setToken = (token) => {
  instance.defaults.headers.common.Authorization = token
}

export const get = (url, params, config = {}) => {
  return instance.get(url, { ...config, params: { ...params, ...config.params } })
}

export const post = (url, data, config) => {
  return instance.post(url, data, config)
}

export const patch = (url, data, config) => {
  return instance.patch(url, data, config)
}

export const postForm = (url, data, config) => {
  return instance.postForm(url, data, config)
}

export const del = (url, config) => {
  return instance.delete(url, config)
}

export const put = (url, data, config) => {
  return instance.put(url, data, config)
}

export default instance
