import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const getRealAlarm = (imoNumber) => {
  return instance({
    url: '/ship/alarm/monitoring/get',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getSummaryAlarm = (imoNumber) => {
  return instance({
    url: '/ship/alarm/monitoring/summary',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipCondition = (imoNumbers) => {
  return instance({
    url: '/ship/alarm/monitoring/condition',
    method: 'GET',
    params: { imoNumberList: imoNumbers }
  }).then((response) => {
    const {
      data: { data }
    } = response
    return data
  })
}

export const getCurrentAlarmData = (alertForm) => {
  return instance({
    url: '/ship/alarm/monitoring/get',
    method: 'GET',
    params: alertForm
  })
}

export const getAlertDetailInfo = (alertDetailForm) => {
  return instance({
    url: '/ship/alarm/monitoring/get-detail',
    method: 'POST',
    data: alertDetailForm
  })
}

export const getAlertThreshold = (imoNumber) => {
  return instance({
    url: '/ship/alarm/threshold/get-ship',
    method: 'GET',
    params: { imoNumber }
  })
}

export const saveAlertThreshold = (requestForm) => {
  return instance({
    url: '/ship/alarm/threshold/save',
    method: 'POST',
    data: requestForm
  })
}

export const getAlarmHistory = (requestForm) => {
  return instance({
    url: '/ship/alarm/history/get-history',
    method: 'POST',
    data: requestForm
  })
}
