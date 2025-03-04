import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const insertVoyage = (voyageRegisterForm) => {
  return instance({
    url: '/ship/voyage/insert-voyage',
    method: 'POST',
    data: voyageRegisterForm
  })
}

export const updateVoyageInfo = (voyageEditForm) => {
  return instance({
    url: '/ship/voyage/update-voyage',
    method: 'POST',
    data: voyageEditForm
  })
}

export const updateVoyage = (voyageEditForm) => {
  return instance({
    url: '/ship/voyage/update-voyage-detail',
    method: 'POST',
    data: voyageEditForm
  })
}

export const insertVoyageDetailInfoHistory = (voyageInsertForm) => {
  return instance({
    url: '/ship/voyage/insert-voyage-detail-history',
    method: 'POST',
    data: voyageInsertForm
  })
}

export const getVoyageDetailInfoHistory = (voyageId) => {
  return instance({
    url: '/ship/voyage/get-voyage-detail-history',
    method: 'GET',
    params: { id: voyageId }
  })
}

export const deleteVoyageById = (voyageId) => {
  return instance({
    url: '/ship/voyage/remove-voyage',
    method: 'POST',
    params: { id: voyageId }
  })
}

export const getAllVoyageByImoNumber = (imoNumber) => {
  return instance({
    url: '/ship/voyage/get-all-voyage-by-ship',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getPeriodVoyage = (voyageForm) => {
  return instance({
    url: '/ship/voyage/get-period-voyage',
    method: 'GET',
    params: voyageForm
  })
}

export const getVoyageById = (voyageId) => {
  return instance({
    url: '/ship/voyage/get-voyage',
    method: 'GET',
    params: { id: voyageId }
  })
}

export const getVoyageTrack = (voyageId) => {
  return instance({
    url: '/ship/voyage/get-voyage-track',
    method: 'GET',
    params: { id: voyageId }
  })
}

export const getVoyageReport = (requestForm) => {
  return instance({
    url: '/ship/voyage/get-voyage-report',
    method: 'GET',
    params: requestForm
  })
}

export const getCurrentVoyage = (imoNumber) => {
  return instance({
    url: '/ship/voyage/get-cur-voyage-time',
    method: 'GET',
    params: { imoNumber }
  })
}
