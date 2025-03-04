<template>
  <v-menu
    v-model="isShowAlarmInfo"
    :close-on-content-click="false"
    location="bottom"
    transition="slide-y-transition"
    offset="10"
  >
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-bell" class="alarm-bell" :class="getAlarmColor" v-bind="props"></v-btn>
    </template>
    <v-card min-width="350" max-height="300" class="py-2 ga-3 border">
      <v-list>
        <v-list-item v-if="summaryAlarms.length == 0" class="text-center">
          <v-list-item>알람 발생 내역이 없습니다</v-list-item>
        </v-list-item>
        <v-list-item v-else value="notifications" class="d-flex justify-space-between">
          <!-- <template v-slot:prepend="{ props }">
            <div>{{ props }}</div>
            <div>{{ alarm.equipmentName ? alarm.equipmentName : '장비 데이터가 없습니다' }}</div>
          </template> -->

          <v-list-item-title v-if="shipAlarm.length != 0" class="mb-2" @click="goAlertListPage">
            <v-sheet class="rounded-lg py-2 px-4 mr-2" color="#212121">
              <div class="mb-2 alarm-title">ALERT</div>
              <div class="d-flex ga-12 justify-end align-center">
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type caution mr-2">●</div>
                  <div>CAUTION</div>
                  <div class="caution alarm-count ml-2">
                    {{ shipAlarm.danger ? shipAlarm.danger : 0 }}
                  </div>
                </div>
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type danger mr-2">●</div>
                  <div>WARNING</div>
                  <div class="alarm-count danger ml-2">
                    {{ shipAlarm.warning ? shipAlarm.warning : 0 }}
                  </div>
                </div>
              </div>
            </v-sheet>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title v-if="fdsAlarm.length != 0" @click="goFDSPage">
            <v-sheet class="rounded-lg py-2 px-4 mr-2" color="#212121">
              <div class="mb-2 alarm-title">FIRE DITECTION</div>
              <div class="d-flex ga-12 justify-end align-center">
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type caution">●</div>
                  <div class="ml-2">CAUTION</div>
                  <div class="caution alarm-count ml-2">
                    {{ fdsAlarm.danger ? fdsAlarm.danger : 0 }}
                  </div>
                </div>
                <div class="alarm-count-container d-flex align-center">
                  <div class="alarm-type danger mr-2">●</div>
                  <div>WARNING</div>
                  <div class="alarm-count danger ml-2">
                    {{ fdsAlarm.warning ? fdsAlarm.warning : 0 }}
                  </div>
                </div>
              </div>
            </v-sheet>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlarmStore } from '@/stores/alarmStore'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'

import { goPage } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'

import moment from 'moment'

const alertStore = useAlarmStore()
const { summaryAlarms, curShipAlarmColor } = storeToRefs(alertStore)

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const isShowAlarmInfo = ref(false)
const { showResMsg } = useToast()

const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

const goAlertListPage = () => {
  goPage('/monitoring/alert')
}

const goFDSPage = () => {
  goPage('/monitoring/fds')
}

const colorClass = ref('')
const getAlarmColor = computed(() => {
  let colorClass = changeText(curShipAlarmColor.value)

  return colorClass
})

const changeText = (colorType) => {
  switch (curShipAlarmColor.value) {
    case 'WARNING':
    case 'DANGER':
      colorType = 'normal'
      break
    case 'BLANK':
    case 'NORMAL':
      colorType = 'blank'
      break
  }
  return colorType
}

const fetchSummaryAlarm = async () => {
  if (isShowAlarmInfo.value == false) {
    return
  }
  const imoNumber = curSelectedShip.value.imoNumber
  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }

  await alertStore.fetchSummaryAlarm(imoNumber)
}

const shipAlarm = computed(() => {
  return summaryAlarms.value.find((el) => el.equipmentName == 'SHIP') || []
})

const fdsAlarm = computed(() => {
  return summaryAlarms.value.find((el) => el.equipmentName == 'FDS') || []
})

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    fetchSummaryAlarm()
  }
}
watch(curShipAlarmColor, getAlarmColor, { deep: true })
watch(isShowAlarmInfo, fetchSummaryAlarm)
watch(refreshDataTime, reloadData)
</script>

<style scoped>
.alarm-bell.warning {
  color: #fff900;
}

.alarm-bell.danger {
  color: #ff0000;
  border-color: #ff0000;
}

.alarm-bell.blank {
  color: #fff;
}

.alarm-bell.normal {
  color: #5789fe;
}

.alarm-title {
  font-size: 0.9rem;
  color: #aaa;
}
</style>
