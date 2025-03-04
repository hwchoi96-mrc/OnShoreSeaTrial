import axios from 'axios'
import instance from '@/composables/useAxios.js'

export const getShipOperationInfo = (imoNumber) => {
  // return axios
  //   .get(`/api/ship/info/get-detail?imoNumber=${imoNumber}`)
  //   .then((response) => {
  //     return response.data.data
  //   })
  //   .catch((error) => {
  //     throw error
  //   })

  return instance({
    url: '/ship/info/get-detail',
    method: 'GET',
    params: { imoNumber }
  })
}

export const updateFuelInfo = (data) => {
  return axios
    .post('/api/ship/info/update-detail', data)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const updateImoDcsInfo = (data) => {
  return axios
    .post('/api/ship/info/update-detail', data)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw error
    })
}

export const getAllPort = (imoNumber) => {
  return instance({
    url: '/ship/voyage/get-all-port',
    method: 'GET',
    params: { imoNumber }
  })
}
