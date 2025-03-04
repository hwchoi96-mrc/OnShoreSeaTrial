import instance from '@/composables/useAxios.js'
import { method } from 'lodash'

export const getMonitoring = (imoNumber) => {
  return instance({
    url: '/ship/engine/get-monitoring',
    method: 'GET',
    params: { imoNumber }
  })
}

export const getPeriodEngineData = (periodForm) => {
  return instance({
    url: '/ship/engine/get-period',
    method: 'GET',
    params: { ...periodForm }
  })
}

export const getEnginePerformanceData = (performanceForm) => {
  return instance({
    url: '/ship/engine/get-performance-new',
    method: 'GET',
    params: { ...performanceForm }
  })
}

export const getAnalysisData = (requestForm) => {
  return instance({
    url: '/ship/data-analysis/get-analysis-chart',
    method: 'GET',
    params: requestForm
  })
}

export const getEquimentTagList = () => {
  return instance({
    url: '/ship/essential-data/get-all-simple',
    method: 'GET'
  })
}

export const getEquimentChartData = (requestForm) => {
  return instance({
    url: '/ship/essential-data/get-trend-chart-by-field',
    method: 'POST',
    data: requestForm
  })
}
