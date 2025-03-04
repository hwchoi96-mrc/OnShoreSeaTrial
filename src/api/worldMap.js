import instance from '@/composables/useAxios.js'

export const changeShipByImoNumber = (requestForm) => {
  return instance({
    url: '/sse/changed-ship',
    method: 'POST',
    params: requestForm
  })
}

export const changePortByName = (requestForm) => {
  return instance({
    url: '/sse/changed-port',
    method: 'POST',
    params: requestForm
  })
}

export const getVoyageList = (imoNumber) => {
  return instance({
    url: '/world-map/get-simple-voyage',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getTotalInfo = (imoNumber) => {
  return instance({
    url: '/world-map/get-total-info',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipData = (imoNumberList) => {
  return instance({
    url: '/world-map/get-ship-data',
    method: 'GET',
    params: { imoNumberList: imoNumberList }
  })
}

export const getShipWakeCurrent = (imoNumber) => {
  return instance({
    url: '/world-map/get-ship-wake-current',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getShipWakePast = (imoNumber, startTime, endTime) => {
  return instance({
    url: '/world-map/get-ship-wake-past',
    method: 'GET',
    params: { imoNumber, startTime, endTime }
  })
}
