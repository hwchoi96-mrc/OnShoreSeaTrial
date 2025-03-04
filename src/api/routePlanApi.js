import axios from 'axios'

//const baseUrl = 'http://192.168.45.158:8080/emapMin'
//const baseUrl = 'http://localhost:8081/emapMin'
const baseUrl = 'http://localhost:8080/emapMin'



export const getPlanList = () => {
  return axios.get(baseUrl+"/api/route/all").then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}

export const getRouteInfoById = (id) => {
  return axios.get(baseUrl+"/api/route/master",{
    params: {
      id: id
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}

export const saveRouteM = (id, name, mkname) => {
  return axios.get(baseUrl+"/api/route/mastersave",{
    params: {
      rt_id: id,
      rt_rname: name,
      rt_mkname: mkname
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}

export const deleteRouteM = (id) => {
  return axios.get(baseUrl+"/api/route/delete",{
    params: {
      id: id
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}

export const getRouteD = (id) => {
  return axios.get(baseUrl+"/api/route/detail",{
    params: {
      id: id
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}

export const saveRouteD = (id, a_lon, a_lat, cnt) => {
  return axios.get(baseUrl+"/api/route/detailsave",{
    params: {
      id: id,
      arr_lon: a_lon,
      arr_lat: a_lat,
      cnt: cnt
    }}).then((response) => {
    if (response.data.length != 0) {
      const result = response.data;
      return result;
    } else {
      return response;
    }
  })
}
