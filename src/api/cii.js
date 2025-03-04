import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const getCiiListByImoNumber = (imoNumber) => {
  return instance({
    url: '/ship/cii/get-all-cii',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getAnnualCiiData = (imoNumber, year) => {
  return instance({
    url: '/ship/cii/get-cii-year',
    method: 'GET',
    params: {
      imoNumber,
      year
    }
  })
}

export const getMonthlyCiiData = (imoNumber, year) => {
  return instance({
    url: '/ship/cii/get-cii-month',
    method: 'GET',
    params: {
      imoNumber,
      year
    }
  })
}

export const getQuarterlyCiiData = (imoNumber, year) => {
  return instance({
    url: '/ship/cii/get-cii-quarter',
    method: 'GET',
    params: {
      imoNumber,
      year
    }
  })
}

export const getPastCiiData = (form) => {
  return instance({
    url: '/ship/cii/get-cii-past',
    method: 'POST',
    data: form
  })
}

export const updateCiiFutureData = (form) => {
  return instance({
    url: '/ship/cii/get-cii-future',
    method: 'POST',
    data: form
  })
}

export const getCiiBoundary = (imoNumber) => {
  return instance({
    url: '/ship/cii/get-cii-boundary',
    method: 'GET',
    params: { imoNumber }
  })
}
