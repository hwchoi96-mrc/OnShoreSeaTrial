import axios from 'axios'
import { ref } from 'vue'

axios.defaults.baseURL = 'http://192.168.0.58:9000'

export const useAxios = (url, config = {}) => {
  const data = ref([])

  axios(url, config)
    .then((res) => {
      data.value = res.data
    })
    .catch((err) => {
      console.log(err)
    })

  return {
    data
  }
}
