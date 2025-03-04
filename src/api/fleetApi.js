import axios from 'axios'
import instance from '@/composables/useAxios.js'

export const addFleet = (fleetRegisterForm) => {
  return instance({
    url: '/vocc/register-fleet-info',
    method: 'POST',
    data: fleetRegisterForm
  })
}

export const addShipsByFleet = (shipList) => {
  return instance({
    url: '/vocc/change-fleet-ship-list',
    method: 'POST',
    data: shipList
  })
}

export const getFleetsByVocc = () => {
  return instance({
    url: '/vocc/get-my-fleet-list',
    method: 'GET'
  })
}

export const getFleetsByVoccId = (voccId) => {
  return instance({
    url: '/vocc/get-fleet-list',
    method: 'GET',
    params: { voccId }
  })
}

export const deleteFleet = (fleetId) => {
  return instance({
    url: '/vocc/remove-fleet-info',
    method: 'POST',
    params: { id: fleetId }
  })
}
