import instance from '@/composables/useAxios.js'

export const getImoData = (requestForm) => {
  return instance({
    url: '/ship/report/imo-data-report/get',
    method: 'GET',
    params: requestForm
  })
}

export const downloadImoReportExcel = (requestForm) => {
  return instance({
    url: '/ship/report/imo-data-report/excel',
    method: 'POST',
    data: requestForm,
    responseType: 'blob'
  })
}

export const getBdnSummaries = (requestForm) => {
  return instance({
    url: '/ship/report/bdn-summaries/get',
    method: 'GET',
    params: requestForm
  })
}

export const downloadBdnSummariesExcel = (requestForm) => {
  return instance({
    url: '/ship/report/bdn-summaries/excel',
    method: 'POST',
    data: requestForm,
    responseType: 'blob'
  })
}

export const getCollectdSummaries = (requestForm) => {
  return instance({
    url: '/ship/report/collected-data-summaries/get',
    method: 'GET',
    params: requestForm
  })
}

export const downloadCollectdSummariesExcel = (requestForm) => {
  return instance({
    url: '/ship/report/collected-data-summaries/excel',
    method: 'POST',
    data: requestForm,
    responseType: 'blob'
  })
}

export const getEEDIPlanPart = (requestForm) => {
  return instance({
    url: '/ship/report/part-2-of-the-seemp/get',
    method: 'GET',
    params: requestForm
  })
}

export const downloadEEDIPlanPartExcel = (requestForm) => {
  return instance({
    url: '/ship/report/part-2-of-the-seemp/excel',
    method: 'POST',
    data: requestForm,
    responseType: 'blob'
  })
}
