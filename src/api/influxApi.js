import axios from 'axios'
// const baseUrl = 'http://localhost:9090/Influx/Read'

const baseUrl = '/api/influx/get-data'

export const getInfluxDB = (range) => {
  // const range = "-30s";
  const measurement = 'temperature'
  const sortOption = 'desc'

  const param = {
    range: range,
    measurement: measurement,
    sort: sortOption
  }

  return axios
    .post(baseUrl, param)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

export const getGELoad = (param) => {
  param['measurementName'] = 'Taehwa'
  return axios
    .post(baseUrl, param)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}
