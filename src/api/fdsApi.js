import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const registerDeck = (imoNumber, deckName) => {
  return instance({
    url: '/ship/fire-detection-sensor/deck/register',
    method: 'POST',
    params: { imoNumber, deckName }
  })
}

export const updateDeckImage = (imoNumber, deckName, deckImage, imageWidth, imageHeight) => {
  return instance({
    url: '/ship/fire-detection-sensor/deck/update',
    method: 'POST',
    params: { imoNumber, deckName, imageWidth, imageHeight },
    data: deckImage,
    headers: {
      'Content-Type': 'application/octet-stream' // or appropriate content type
    }
  })
}

export const deleteDeck = (imoNumber, deckName) => {
  return instance({
    url: '/ship/fire-detection-sensor/deck/remove',
    method: 'POST',
    params: { imoNumber, deckName }
  })
}

export const getDeckList = (imoNumber) => {
  return instance({
    url: '/ship/fire-detection-sensor/deck/get-list',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getDeckImage = (imoNumber, deckName) => {
  return instance({
    url: '/ship/fire-detection-sensor/deck/get-image',
    method: 'GET',
    params: { imoNumber, deckName }
  })
}

export const saveFDSSensor = (registerInfo) => {
  console.log('요청 폼')
  console.dir(registerInfo)

  return instance({
    url: '/ship/fire-detection-sensor/sensor/register',
    method: 'POST',
    data: registerInfo
  })
}

export const getUnregisteredSensorList = (imoNumber) => {
  return instance({
    url: '/ship/fire-detection-sensor/sensor/get-unregistered-list',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getFDSSensorInfo = (requestForm) => {
  return instance({
    url: '/ship/fire-detection-sensor/sensor/get-one',
    method: 'GET',
    params: requestForm
  })
}

export const updateFDSSensor = (updateInfo) => {
  return instance({
    url: '/ship/fire-detection-sensor/sensor/update',
    method: 'POST',
    data: updateInfo
  })
}

export const deleteFDSSensor = (requestForm) => {
  return instance({
    url: '/ship/fire-detection-sensor/sensor/remove',
    method: 'POST',
    params: requestForm
  })
}

export const getFDSSensorList = (imoNumber, deckName) => {
  return instance({
    url: '/ship/fire-detection-sensor/sensor/get-list',
    method: 'GET',
    params: { imoNumber, deckName }
  })
}

export const getFDSMonitoring = (imoNumber, deckName) => {
  console.log(imoNumber, deckName)
  let params = {
    imoNumber: imoNumber,
    deckName: deckName
  }

  console.dir(params)
  return instance({
    url: '/ship/fire-detection-sensor/sensor/get-monitoring',
    method: 'GET',
    params: params
  })
}
