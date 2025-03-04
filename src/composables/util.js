import router from '@/routes/index.js'
import moment from 'moment'
import { getActivePinia, storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'

import { cancleSSE } from '@/api/shipApi'
import { useToast } from '@/composables/useToast'
import { remove } from 'lodash'

export const dateFormatter = (param) => {}
export const goPage = (url, metaName, metaValue) => {
  // console.log('경로' + url + '메타명' + metaName + '메타값' + metaValue)
  router.push(url)
}

export const logout = () => {
  localStorage.clear()
  sessionStorage.clear()
  getActivePinia()._s.forEach((store) => {
    console.dir(store)
    // store.$dispose()
  })

  goPage('/auth/login')
}

/**
 * 객체 초기화
 * @param {} object
 */
export const resetObject = (object) => {
  // 초기화
  for (const key in object) {
    object[key] = null
  }
}

/**
 * SSE 이벤트 구독
 */
export const sse = (eventSource) => {
  const loadingStore = useLoadingStore()
  const { refreshDataTime } = storeToRefs(loadingStore)
  eventSource.addEventListener('open', (e) => {})

  eventSource.addEventListener('sse', (e) => {
    const obj = JSON.parse(e.data)
    if (obj.sseReturnCode == 'DUPLICATED_LOGIN') {
      logout()
    }

    if (obj.sseReturnCode == 'SESSION_EXPIRED') {
      logout()
    }

    if (obj.sseReturnCode == 'ALREADY_LOGGED_IN_USER') {
      const errMsg = obj.msg
      router.push({
        path: '/noAccess',
        params: {
          message: errMsg
        }
      })
    }

    if (obj.sseReturnCode == 'CHANGED_SHIP') {
      return obj.msg
    }

    if (obj.sseReturnCode == 'CHANGED_PORT') {
      return obj.msg
    }

    if (obj.sseReturnCode == 'REFRESH_DATA_TIME') {
      refreshDataTime.value = convertDateTimeSecondType(obj.msg)
    }
  })

  eventSource.addEventListener('error', async (e) => {
    const authStore = useAuthStore()
    const { userInfo } = storeToRefs(authStore)
    const uuid = userInfo.value.uuid

    if (e.readyState == EventSource.CLOSED) {
      eventSource.close()
    }
  })
}

/**
 * SSE 이벤트 구독
 */
export const sse2 = (eventSource) => {
  eventSource.addEventListener('sse2', (e) => {
    const obj = JSON.parse(e.data)
    if (obj.sseReturnCode == 'DUPLICATED_LOGIN') {
      logout()
    }

    if (obj.sseReturnCode == 'SESSION_EXPIRED') {
      logout()
    }

    if (obj.sseReturnCode == 'ALREADY_LOGGED_IN_USER') {
      const errMsg = obj.msg
      router.push({
        path: '/noAccess',
        params: {
          message: errMsg
        }
      })
    }
  })

  eventSource.addEventListener('error', (e) => {
    if (e.readyState == EventSource.CLOSED) {
      eventSource.close()
    }
  })
}

export const isSelectedShip = () => {
  const shipStore = useShipStore()
  const { showResMsg } = useToast()
  const { curSelectedShip } = storeToRefs(shipStore)

  let selectedShipImoNumber = curSelectedShip.value
  return !!selectedShipImoNumber
}

/**
 * 숫자 3자리 단위로 끊는 기능
 * ex) 123000 => 123,000
 */
export const convertNumberFormat = (data) => {
  let formattedData = new Intl.NumberFormat('ko', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(data)

  return formattedData
}

export const convertStringToFloat = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    let type = typeof value
    if (Number.isInteger(value) || type == 'boolean') {
      return
    }

    if (isNaN(value)) {
      if (value == null || value == '-') {
        object[key] = 0.0
        return
      }
      const isExistComma = value.includes(',')
      if (isExistComma) {
        value = value.replace(',', '')
      } else {
        return
      }
    }

    if (!Number.isInteger(value)) object[key] = parseFloat(value)
    else object[key] = parseInt(value)
  })
  return object
}

export const removeComma = (data) => {
  if (data.includes(',')) {
    data = data.replace(',', '')
  }
  return data
}

/**
 * 날짜 포맷 변경
 * @param {} date
 * @returns
 */

export const convertDateType = (date) => {
  const utcDate = moment(date).utc()
  const formattedDate = utcDate.format('YYYY-MM-DD')

  return formattedDate
}

export const convertDateTimeType = (date) => {
  const utcDate = moment(date).utc()
  const formattedDate = utcDate.format('YYYY-MM-DD HH:mm')
  return formattedDate
}

export const convertDateTimeSecondType = (date) => {
  const utcDate = moment(date).utc()
  const formattedDate = utcDate.format('YYYY-MM-DD HH:mm:ss')

  return formattedDate
}

export const convertUTCTimezone = (date) => {
  return moment.parseZone(date).toISOString()
}

/**
 * 객체 내 속성 값이 Float인 경우, 소수점 단위 끊어서 반환
 * @param {*} object
 * @returns
 */
const excludeNumberToFloatFormat = ['id', 'userId', 'voccId', 'year', 'month']
export const convertFloatFormatObject = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    let type = typeof value

    if (Array.isArray(typeof value)) {
      object[key] = covertFloatFormatArray(value)
    } else if (typeof value == 'object' && value != null) {
      convertFloatFormatObject(value)
    }

    if (type != 'number') {
      if (value == null || value == 'NaN') {
        object[key] = '-'
      }
      return
    }

    if (value === '' || value === null || value === 'NaN') {
      object[key] = '-'
    } else {
      console.log(key)
      if (!excludeNumberToFloatFormat.includes(key)) {
        object[key] = convertNumberFormat(value)
      }
      console.log(key, object[key])
    }
  })
  return object
}

export const convertFloatValueFromObject = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    let type = typeof value

    if (Array.isArray(typeof value)) {
      object[key] = convertFloatValueArray(value)
    } else if (value != null && type == 'object') {
      convertFloatValueFromObject(value)
    } else {
      object[key] = roundFloatValue(value)
    }
  })

  return object
}

export const roundFloatValue = (floatValue) => {
  if (floatValue != null && floatValue != 'NaN') return parseFloat(floatValue.toFixed(1))
  else return 0.0
}

export const convertFloatValueArray = (array) => {
  array.forEach((item, index) => (item[index] = roundFloatValue(item)))
  return array
}

export const covertFloatFormatArray = (array) => {
  array.forEach((item, index) => (item[index] = convertNumberFormat(item)))
  return array
}

export const addDay = (date, days) => {
  const originDate = moment(date)
  let addedDate = originDate.add(days, 'days')

  return addedDate
}

/**
 * 날짜 범위 유효성 검사
 * 시작날짜는 종료날짜보다 과거여야한다
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
export const isValidDateRange = (startDate, endDate) => {
  let startDateTime = moment(startDate)
  let endDateTime = moment(endDate)

  let result = startDateTime.isBefore(endDateTime)

  return result
}

export const fetchMachineData = async (imoNumber) => {
  const shipStore = useShipStore()
  await shipStore.fetchShipMachineInfo(imoNumber)
}

export const isStatusOk = (status) => {
  console.log(status / 100)
  return parseInt(status / 100) == 2 ? true : false
}

export const displayByUserRole = () => {
  const authStore = useAuthStore()
  let result = null

  const { userInfo } = storeToRefs(authStore)
  const role = userInfo.value.role

  if (!role) {
    authStore.getMyInfo()
  }

  result = role != 'ROLE_VOCC_USER' ? true : false
  return result
}

export const displayOnlySuperAdmin = () => {
  const authStore = useAuthStore()
  let result = null

  const { userInfo } = storeToRefs(authStore)
  const role = userInfo.value.role

  console.log(role)

  if (!role) {
    authStore.getMyInfo()
  }

  result = role != 'ROLE_LCC_ADMIN' ? false : true

  console.log(result)
  return result
}

export const openNewPopup = (url) => {
  window.open(
    url,
    '_blank',
    'menubar=no, toolbar=no, width=1920, height=1080, scrollbars=0, location=no, width=500, height=300'
  )
}

export const addOption = (data, optionName) => {
  if (!data.includes(optionName)) {
    data.unshift(optionName)
  }

  return data
}

/**
 * 항차가 과거 항차인지 구분하는 함수
 */
export const isPastVoyageState = (voyageLastDate) => {
  const today = moment()
  let todayDate = convertUTCTimezone(today)

  let recentVoyageEndDate = convertUTCTimezone(voyageLastDate)
  const result = moment(recentVoyageEndDate).isBefore(todayDate)

  return result
}
