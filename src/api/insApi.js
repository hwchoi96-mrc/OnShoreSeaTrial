import instance from '@/composables/useAxios.js'

export const getEcdisUrl = (requestUrl) => {
  return instance({
    url: requestUrl,
    method: 'GET'
  })
}
