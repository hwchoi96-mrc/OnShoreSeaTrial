import instance from '@/composables/useAxios.js'

export const getAccessMenu = () => {
  return instance({
    url: '/menu-group/get-accessible-menu',
    method: 'GET'
  })
}
