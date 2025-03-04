import axios from 'axios'

import { storeToRefs } from 'pinia'
import { goPage } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'
import { useLoadingStore } from '@/stores/loadingStore'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true
  // timeout: 20000
})

let backgroundApies = [
  '/ship/alarm/monitoring/condition',
  '/world-map/get-ship-data',
  '/world-map/get-total-info',
  '/ship/cii/get-cii-past',
  '/ship/cii/get-cii-future',
  '/ship/cii/get-cii-boundary',
  '/ship/info/get',
  '/ship/fire-detection-sensor/deck/get-image',
  '/ship/engine/get-performance',
  '/ship/data-analysis/get-analysis-chart'
]

instance.interceptors.request.use((config) => {
  // const loadingStore = useLoadingStore()
  // const { loadingStatus } = storeToRefs(loadingStore)

  // const isBackgroudApi = backgroundApies.includes(config.url)

  // if (!isBackgroudApi) {
  //   loadingStatus.value = true
  // }
  return config
})

instance.interceptors.response.use(
  (response) => {
    // const loadingStore = useLoadingStore()
    // const { loadingStatus } = storeToRefs(loadingStore)
    // const isBackgroudApi = backgroundApies.includes(response.config.url)

    // if (!isBackgroudApi) {
    //   loadingStatus.value = false
    // }

    if (response.status == 204) {
      response.data = {}
      response.data.data = []
    }
    return response
  },
  (error) => {
    const { showResMsg } = useToast()
    // const loadingStore = useLoadingStore()
    // const { loadingStatus } = storeToRefs(loadingStore)
    // const isBackgroudApi = backgroundApies.includes(error.config.url)
    let errorCode = ''
    let errMsg = ''
    if (!navigator.onLine) {
      // loadingStatus.value = false
      showResMsg('네트워크 연결이 끊겼습니다. 네트워크 연결상태를 확인하세요')
      return
    }

    if (error.response.data) {
      if (error.response.data.errorMsg) {
        errorCode = error.response.data.errorCode
        errMsg = error.response.data.errorMsg
      }
      showResMsg(errMsg)
    } else if (error.response.statusText) {
      errMsg = error.response.statusText

      if (error.response.status == 500) {
        errMsg = '데이터를 처리하는 동안 오류가 발생했습니다'
      }
      if (error.response.status == 400) {
        errMsg = '잘못된 요청입니다'
      }
    } else {
      if (error.response.status == 500) {
        errMsg = '데이터를 처리하는 동안 오류가 발생했습니다'
      }
      if (error.response.status == 400) {
        errMsg = '잘못된 요청입니다'
      }
    }

    if (errorCode == 'UNAUTHENTICATED_USER') {
      localStorage.clear()
      goPage('/auth/login')
    }

    showResMsg(errMsg)
    // if (!isBackgroudApi) {
    //   loadingStatus.value = false
    // }

    return error
  }
)

export default instance
