<template>
  <v-dialog :width="950">
    <v-sheet class="pa-4" :height="560">
      <div class="d-flex justify-space-between">
        <div class="title d-flex align-center">항차 리포트 수정</div>
        <v-btn
          class="d-flex align-center"
          icon="mdi-close"
          height="35"
          size="small"
          variant="text"
          @click="closePopup"
        ></v-btn>
      </div>
      <div class="report-container d-flex flex-column flex-grow-1 flex-shrink-1">
        <v-tabs v-model="tab" color="#5789FE">
          <v-tab :value="port">출발지 목적지 수정</v-tab>
          <v-tab :value="detail" v-if="useAdmin">기타 항목 수정</v-tab>
          <v-tab :value="detailLog" v-if="useAdmin">기타 항목 수정 내역</v-tab>
        </v-tabs>
        <v-window v-model="tab" class="report-container-tab pa-2">
          <!--출발목적지수정-->
          <v-window-item>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Departure</span>
                <v-autocomplete
                  v-model="voyageEditForm.departure"
                  :items="ports"
                  item-title="name"
                  item-value="code"
                  density="compact"
                  bg-color="#434348"
                  placeholder="출발지를 선택하세요"
                  hide-details
                  variant="solo-filled"
                  no-data-text="데이터가 없습니다"
                />
              </div>
              <div class="w-50">
                <span>DepatureTime</span>
                <div>
                  <input
                    type="datetime-local"
                    v-model="voyageEditForm.departureTime"
                    class="w-100"
                  />
                </div>
              </div>
            </div>
            <div class="d-flex ga-2 mt-2">
              <div class="w-50">
                <span>Arrival</span>
                <v-autocomplete
                  v-model="voyageEditForm.arrival"
                  :items="ports"
                  item-title="name"
                  item-value="code"
                  density="compact"
                  bg-color="#434348"
                  placeholder="도착지를 선택하세요"
                  variant="solo-filled"
                  no-data-text="데이터가 없습니다"
                />
              </div>

              <div class="w-50">
                <span>ArrivalTime</span>
                <input type="datetime-local" class="w-100" v-model="voyageEditForm.arrivalTime" />
              </div>
            </div>

            <div class="d-flex justify-end w-100">
              <i-btn text="수정" @click="editVoyageInfo"></i-btn>
            </div>
          </v-window-item>
          <!--기타 항목 수정-->
          <v-window-item>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Load</span>
                <i-input
                  type="number"
                  v-model="voyageEditForm.load"
                  placeholder="Load를 입력하세요"
                ></i-input>
              </div>
              <div class="w-50">
                <span>RPM</span>
                <i-input
                  type="text"
                  v-model="voyageEditForm.rpm"
                  placeholder="RPM을 입력하세요"
                ></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Speed</span>
                <i-input
                  type="number"
                  v-model="voyageEditForm.speed"
                  placeholder="Speed를 입력하세요"
                ></i-input>
              </div>
              <div class="w-50">
                <span>Underway</span>
                <i-input
                  type="number"
                  v-model="voyageEditForm.underway"
                  placeholder="underway를 입력하세요"
                ></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>Distance</span>
                <i-input
                  v-model="voyageEditForm.distance"
                  placeholder="distance를 입력하세요"
                ></i-input>
              </div>
              <div class="w-50">
                <span>Slip</span>
                <i-input
                  type="number"
                  v-model="voyageEditForm.slip"
                  placeholder="slip을 입력하세요"
                ></i-input>
              </div>
            </div>
            <div class="d-flex ga-2">
              <div class="w-50">
                <span>BF</span>
                <i-input
                  type="number"
                  v-model="voyageEditForm.bf"
                  placeholder="BF를 입력하세요"
                ></i-input>
              </div>
              <div class="w-50">
                <span>FOC</span>
                <i-input
                  type="text"
                  v-model="voyageEditForm.foc"
                  placeholder="FOC를 입력하세요"
                ></i-input>
              </div>
            </div>

            <div class="d-flex ga-2">
              <div class="w-50">
                <span>EEOI</span>
                <i-input
                  type="text"
                  v-model="voyageEditForm.eeoi"
                  placeholder="EEOI 입력하세요"
                ></i-input>
              </div>
            </div>
            <div class="d-flex justify-end w-100">
              <i-btn text="수정" @click="editVoyage"></i-btn>
            </div>
          </v-window-item>
          <!--기타 항목 수정 내역-->
          <v-window-item>
            <v-data-table
              :headers="voyageHistoryHeaders"
              :items="voyageHistoryList"
              class="table-container voyage-history-table text-center"
            >
              <template v-slot:header.eeoi="{ column }">
                {{ column.text }}EEOI <br />(10<sup>-6</sup>)
              </template>
              <template v-slot:item="{ item, index }">
                <tr>
                  <!-- <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td> -->
                  <td>{{ item.editId }}</td>
                  <td class="w-25">{{ convertDateType(item.editTime) }}</td>
                  <td :bgcolor="index === 0 ? changedFormColor.load : ''">
                    {{ formatNumber(item.load) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.rpm : ''">
                    {{ formatNumber(item.rpm) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.speed : ''">
                    {{ formatNumber(item.speed) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.underway : ''">
                    {{ formatNumber(item.underway) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.distance : ''">
                    {{ formatNumber(item.distance) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.slip : ''">
                    {{ formatNumber(item.slip) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.bf : ''">
                    {{ formatNumber(item.bf) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.foc : ''">
                    {{ formatNumber(item.foc) }}
                  </td>
                  <td :bgcolor="index === 0 ? changedFormColor.eeoi : ''">
                    {{ formatNumber(item.eeoi) }}
                  </td>
                </tr>
              </template>
              <template v-slot:no-data>
                <tr>
                  <td></td>
                </tr>
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { getAllPort } from '@/api/operationapi.js'
import { useAuthStore } from '@/stores/authStore'
import { getVoyageById, getVoyageDetailInfoHistory } from '@/api/voyage.js'
import { convertDateType, convertDateTimeType, convertFloatFormatObject } from '@/composables/util'

const emit = defineEmits(['editVoyage', 'editVoyageInfo', 'closePopup'])
const props = defineProps({
  id: {
    type: Number,
    default: -1
  }
})

const tab = ref(null)
const voyageId = ref(props.id)
const ports = ref([])

const voyageEditForm = ref({
  id: null,
  departure: null,
  departureTime: null,
  arrival: null,
  arrivalTime: null,
  load: null,
  rpm: null,
  speed: null,
  underway: null,
  distance: null,
  slip: null,
  bf: null,
  foc: null,
  eeol: null
})

//데이터 불러오기
const fetchVoyage = async (newValue) => {
  const {
    data: {
      data: { departurePortInfo, departureTime, arrivalPortInfo, arrivalTime, ...rest }
    }
  } = await getVoyageById(newValue)

  const { code: departure } = departurePortInfo
  const { code: arrival } = arrivalPortInfo
  let etcData = { ...rest }
  voyageEditForm.value = convertFloatFormatObject(etcData)
  voyageEditForm.value.departure = departure
  voyageEditForm.value.departureTime = convertDateTimeType(departureTime)
  voyageEditForm.value.arrival = arrival
  voyageEditForm.value.arrivalTime = convertDateTimeType(arrivalTime)

  console.dir(voyageEditForm)
}

const fetchAllPort = async () => {
  ;({
    data: { data: ports.value }
  } = await getAllPort())
}

const closePopup = () => {
  emit('closePopup')
}

//출발목적지수정
const editVoyageInfo = () => {
  let editForm = {}
  let departureTime = new Date(voyageEditForm.value.departureTime)
  departureTime = departureTime.toISOString()
  let arrivalTime = new Date(voyageEditForm.value.arrivalTime)
  arrivalTime = arrivalTime.toISOString()
  editForm.id = props.id
  editForm.departure = voyageEditForm.value.departure
  editForm.departureTime = departureTime
  editForm.arrival = voyageEditForm.value.arrival
  editForm.arrivalTime = arrivalTime

  emit('editVoyageInfo', editForm)
}

//기타항목수정
const editVoyage = () => {
  let editForm = {}
  const { ...rest } = voyageEditForm.value
  editForm = rest

  //꾸밈 기호 제거
  Object.keys(editForm).forEach((key) => {
    let value = editForm[key]

    if (typeof value === 'string') {
      if (value.includes(',')) {
        value = value.replace(/,/g, '')
      }
      if (value.includes('-')) {
        value = value.replace(/-/g, '')
      }

      if (value.includes('.')) {
        //실수형이라면
        value = parseFloat(value)
      } else {
        //정수형이면
        value = parseInt(value)
      }
    }

    editForm[key] = value
  })
  editForm.id = props.id
  emit('editVoyage', editForm)
}

//기타항목수정은 사용자 접근 불가
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const useAdmin = ref(false)
if (userInfo.value.role == 'ROLE_VOCC_USER') {
  useAdmin.value = false
} else {
  useAdmin.value = true
}

//기타항목수정내역
const voyageHistoryHeaders = [
  // { title: 'Index', value: 'index'},
  { title: '수정자', value: 'editId', align: 'cetner' },
  { title: '수정날짜', value: 'editTime' },
  { title: 'Load\n(%)', value: 'load', align: 'cetner' },
  { title: 'RPM\n(rpm)', value: 'rpm', align: 'cetner' },
  { title: 'Speed\n(kn)', value: 'speed', align: 'cetner' },
  { title: 'Underway\n(h)', value: 'underway' },
  { title: 'Distance\n(nm)', value: 'distance' },
  { title: 'slip\n(%)', value: 'slip' },
  { title: 'BF\n(value)', value: 'bf', align: 'cetner' },
  { title: 'FOC\n(t)', value: 'foc' },
  { title: 'EEOI\n(10-6</sup>)', value: 'eeoi' }
]

const voyageHistoryList = ref([])
//const currentPage = ref(1); // 현재 페이지를 추적 v-model:page="currentPage"
//const itemsPerPage = ref(10); // 페이지 당 아이템 수를 설정 v-model:items-per-page="itemsPerPage"
const voyageKeys = ['load', 'rpm', 'speed', 'underway', 'distance', 'slip', 'bf', 'foc', 'eeoi']
const changedFormColor = ref({
  load: '',
  rpm: '',
  speed: '',
  underway: '',
  distance: '',
  slip: '',
  bf: '',
  foc: '',
  eeoi: ''
})
const getVoyageHistory = async (voyageId) => {
  try {
    const response = await getVoyageDetailInfoHistory(voyageId)
    if (response.data.msg === 'Success') {
      if (response.data.data !== null) {
        voyageHistoryList.value = response.data.data
        //기타항목을 수정했을때, 최근수정한 항목은 배경색을 나타내기
        if (voyageHistoryList.value.length >= 2) {
          //리스트에 값이 2개 이상일경우만 수행
          const firstItem = voyageHistoryList.value[0]
          const secondItem = voyageHistoryList.value[1]

          for (const key of voyageKeys) {
            if (firstItem[key] != secondItem[key]) {
              changedFormColor.value[key] = '#4E83FF'
            }
            //  else {
            //   changedFormColor.value[key] = '#434348'
            // }
          }

          //alert(JSON.stringify(changedFormColor.value))
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

//1000단위 넘어갈때 콤마 표시
const formatNumber = (number) => {
  if (typeof number === 'number') {
    return number.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }
  return number
}

onMounted(() => {
  voyageId.value = props.id
  fetchAllPort()
})

watch(
  () => props.id,
  (newValue) => {
    if (newValue != null) {
      voyageId.value = newValue
      fetchVoyage(newValue)
      getVoyageHistory(newValue) //기타항목수정내역
      voyageHistoryList.value = [] //기타항목수정내역
      tab.value = 'port'
    }
  }
)
</script>

<style lang="scss" scoped>
input[type='datetime-local'] {
  background: #434348;
  padding: 8px;
  border-radius: 4px;
}

.report-container-tab {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.report-container-tab .v-window__container {
  flex: 1 1 auto;
}

.report-container-tab .v-window-item {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.report-container .v-card-actions {
  display: none;
}

.title {
  font-size: 1.2em;
}

/* 기타 항목 수정 내역 스타일 */
.table-container {
  max-height: 400px; /* 최대 높이를 설정 */
  overflow-y: auto; /* 수직 스크롤을 추가 */
}

// .voyage-history-table {
//   > .v-table__wrapper {
//     > .v-data-table-header__content {
//       text-align: center;
//     }
//   }
// }
</style>
