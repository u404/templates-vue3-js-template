import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/api/common'
import { createThrottlePromiseFunction } from '@/utils/helper'

export const useUserStore = defineStore('user', () => {
  const info = ref(null)
  const token = computed(() => info.value?.token)
  const roleId = computed(() => info.value?.roleId || [])

  // 登录 - 注意，接口做了节流，同一时间只会有一个登录请求
  const login = createThrottlePromiseFunction(async () => {
    // dev环境中，针对性处理login
    if (import.meta.env.DEV) {
      const res = await apiLogin()
      info.value = res
    } else {
      const res = await apiLogin()
      info.value = res
    }
  })

  // 强制获取token，store中没有token，则调用登录接口获取。多次调用，只会发出一个请求，并等待该请求返回。
  const forceGetToken = async () => {
    if (!token.value) await login()
    return token.value
  }

  return { info, token, roleId, login, forceGetToken }
})
