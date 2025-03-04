import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRealAlarm, getSummaryAlarm } from '@/api/alarmApi.js'
import { useToast } from '@/composables/useToast'

export const useAlarmStore = defineStore('alarm', () => {
  const { showResMsg } = useToast()
  const realAlarms = ref([])
  const summaryAlarms = ref([])
  const curShipAlarmColor = ref('')

  const fetchRealAlarm = async (imoNumber) => {
    try {
      // ({ status , data : { data : realAlarms.value } } = await getRealAlarm(imoNumber))

      const response = await getRealAlarm(imoNumber)

      realAlarms.value = response.data.data

      const normalCount = realAlarms.value.filter(
        (alarm) => alarm.alarmStateType == 'NORMAL'
      ).length
      const warningCount = realAlarms.value.filter(
        (alarm) => alarm.alarmStateType == 'WARNING'
      ).length
      const dangerCount = realAlarms.value.filter(
        (alarm) => alarm.alarmStateType == 'DANGER'
      ).length

      realAlarms.value.normalCount = normalCount
      realAlarms.value.warningCount = warningCount
      realAlarms.value.dangerCount = dangerCount

      return response.status
    } catch (error) {
      realAlarms.value = []
    }
  }

  const fetchSummaryAlarm = async (imoNumber) => {
    let result = {}
    let alarms = []
    try {
      ;({
        data: { data: result }
      } = await getSummaryAlarm(imoNumber))

      let equipmentName = ''
      let danger = 0
      let warning = 0
      for (let key in result) {
        ;({
          equipmentName,
          occurredAlarmCountMap: { DANGER: danger, WARNING: warning }
        } = result[key])

        let alarmInfo = {
          equipmentName,
          danger,
          warning
        }
        alarms.push(alarmInfo)
      }
      summaryAlarms.value = alarms
    } catch (error) {
      summaryAlarms.value = []
    }
  }

  return {
    realAlarms,
    summaryAlarms,
    curShipAlarmColor,
    fetchRealAlarm,
    fetchSummaryAlarm
  }
})
