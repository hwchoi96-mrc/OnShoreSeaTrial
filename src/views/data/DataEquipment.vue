<template>
  <v-sheet
    class="ma-3 rounded-lg"
    style="height: 100vh; max-height: calc(100vh - 65px - 24px)"
    color="#ffffff00"
  >
    <v-sheet class="mb-3 rounded-lg">
      <SelectedShipSummary />
    </v-sheet>

    <v-sheet class="data-equipment-container pa-3 rounded-lg detail-page">
      <v-sheet class="px-3 py-3 rounded-lg" color="#333334">
        <div class="d-flex justify-end align-center">
          <!-- <div class="align-center">Equipment</div> -->

          <div class="d-flex ga-2">
            <i-selectbox
              v-model="selectedEngineName"
              :items="shipEngineList"
              item-title="name"
              item-value="id"
              variant="solo-filled"
              density="compact"
              return-object
              class="equipmentSelector"
              bg-color="#434348"
              :hide-details="true"
              @update:modelValue="filterEquipmentData"
            ></i-selectbox>
            <i-input
              id="searchBox"
              v-model="searchDescription"
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              @input="searchByDescription"
              placeholder="검색어를 입력하세요"
              class="search-width"
            ></i-input>
            <input class="noticeList-datePicker" type="datetime-local" v-model="startDate" />
            <input class="noticeList-datePicker" type="datetime-local" v-model="endDate" />
            <i-btn @click="fetchPeriodEngineData" text="조회" height="43"></i-btn>

            <i-btn
              text="항차조회"
              @click="openVoyagesPopup"
              :imoNumber="curSelectedShip.imoNumber"
              color="#3D3D40"
            ></i-btn>
          </div>
        </div>
      </v-sheet>

      <v-sheet
        class="mt-3 pa-3 rounded-lg"
        color="#333334"
        style="height: 100%; max-height: calc(100% - 70px - 12px)"
      >
        <v-container class="h-100 pa-0" fluid>
          <v-row no-gutters class="h-100">
            <v-col cols="5" xl="6" xxl="7" class="h-100 pr-3">
              <div
                class="d-flex justify-center align-center h-100"
                v-if="selectedRowKeys.length == 0"
                style="font-size: 1.4em"
              >
                우측 태그 목록에서 태그를 선택해주세요
              </div>
              <div
                class="d-flex justify-center align-center h-100"
                v-else-if="option.series.length == 0"
                style="font-size: 1.4em"
              >
                데이터가 없습니다
              </div>

              <Echart ref="equipmentChart" v-else :option="option"></Echart>
            </v-col>
            <v-col cols="7" xl="6" xxl="5" class="h-100">
              <DxDataGrid
                id="equimentGrid"
                ref="equimentGrid"
                class="h-100"
                style="max-height: 100%"
                :show-borders="true"
                :data-source="equipmenTagtList"
                key-expr="tagId"
                :selected-row-keys="selectedRowKeys"
                :column-auto-width="true"
                @selection-changed="onSelectionChanged"
              >
                <DxSelection mode="multiple" show-check-boxes-mode="always"></DxSelection>
                <DxScrolling mode="virtual" />
                <!-- row-rendering-mode="virtual" -->
                <DxColumn
                  data-field="equipNo"
                  caption="Equip No"
                  alignment="center"
                  :allow-editing="false"
                  width="20%"
                />
                <DxColumn
                  data-field="tagId"
                  catpion="Tag ID"
                  alignment="center"
                  :allow-editing="false"
                  width="20%"
                />
                <DxColumn
                  data-field="description"
                  catpion="Dscription"
                  alignment="left"
                  :allow-editing="false"
                />
              </DxDataGrid>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-sheet>
  </v-sheet>
  <VoyagesPopup
    ref="voyagePopup"
    v-model="isShowPopupModal"
    :imoNumber="curSelectedShip.imoNumber"
    :departureTime="startDate"
    :arrivalTime="endDate"
    @selectVoyage="updateDate"
    @close="closeVoyagesPopup"
  />
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import moment from 'moment'

import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { getEquimentTagList, getEquimentChartData } from '@/api/dataApi'

import { convertDateTimeType, isSelectedShip, addOption } from '@/composables/util'
import { useToast } from '@/composables/useToast'
import { getDxGridInstance } from '@/composables/dxGridUtil'

import VoyagesPopup from '@/components/voyage/VoyagesPopup.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import Echart from '@/components/echart/Echarts.vue'

const shipStore = useShipStore()
const { showResMsg } = useToast()
const loadingStore = useLoadingStore()
const { curSelectedShip, shipEngines } = storeToRefs(shipStore)
const { loadingStatus } = storeToRefs(loadingStore)

const selectedEngineName = ref(null)
const selectedRowKeys = ref([])

const startDate = ref(null)
const endDate = ref(null)
const equipmenTagtList = ref([])

const equipmentChart = ref()
const DAYS_AGO = 7
const voyagePopup = ref()

const shipEngineList = computed(() => {
  return addOption(shipEngines.value, 'All')
})

const initFetchData = async () => {
  const today = moment()
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  selectedRowKeys.value = []

  const selectStauts = isSelectedShip()

  if (!curSelectedShipImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  // 선박 엔진 조회
  let engineCount = shipEngines.value.length

  if (engineCount == 0) {
    await shipStore.fetchShipMachineInfo(curSelectedShipImoNumber)

    if (shipEngines.value.length == 0) {
      equipmenTagtList.value = []
      return
    }
  }

  // 필터 옵션에 All이 있는지 검사
  let isExistAllOption = shipEngines.value.includes('All')
  if (!isExistAllOption) {
    shipEngines.value.unshift('All')
  }

  // 엔진 초기 값 세팅

  selectedEngineName.value = shipEngines.value[0]

  let currentDay = today.clone().utc().format('YYYY-MM-DD hh:mm')
  let sevenDaysAgo = today.clone().utc().subtract(DAYS_AGO, 'days').format('YYYY-MM-DD hh:mm')

  startDate.value = sevenDaysAgo
  endDate.value = currentDay

  fetchEquimentTagList()
}


const option = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    top: '0%',
    right: '2%',
    feature: {
      dataZoom: {
        show: true,
        title: {
          zoom: 'Zoom',
          back: 'Restore'
        },
        yAxisIndex: 'none',
        iconStyle: {
          borderColor: '#fff', // Default icon border color
          emphasis: {
            borderColor: '#5789FE' // Icon border color when activated
          }
        }
      }
    }
  },
  grid: {
    top: '10%',
    left: '1%',
    right: '3%',
    bottom: '0%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // prettier-ignore
    data: []
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    boundaryGap: [0, '30%'],
    splitLine: {
      lineStyle: {
        width: 1,
        type: 'dashed',
        color: '#5C5C5E',
        opacity: 0.5
      }
    }
  },
  series: []
})

const fetchPeriodEngineData = async () => {
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  const shipSelectStatus = isSelectedShip()

  if (!shipSelectStatus) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  if (selectedRowKeys.value.length <= 0) {
    showResMsg('태그를 선택해주세요')
    return
  }

  let utcStartTime = moment(startDate.value).utc().toISOString()
  let utcEndTime = moment(endDate.value).utc().toISOString()
  let checkedIdList = selectedRowKeys.value

  let xAxisDatas = []
  let updateChartData = []

  let requestForm = {
    imoNumber: curSelectedShipImoNumber,
    fieldNameList: checkedIdList,
    startTime: utcStartTime,
    endTime: utcEndTime,
    timeContains: true
  }

  const {
    data: { data }
  } = await getEquimentChartData(requestForm)

  xAxisDatas = data['Time'].map((date) => convertDateTimeType(date))

  Object.keys(data).forEach((key) => {
    if (key !== 'Time') {
      // 현재 키에 해당하는 배열을 순회하며 data 배열에 객체 형태로 저장
      updateChartData.push({
        name: key,
        data: data[key],
        type: 'line'
      })
    }
  })

  option.value.series = []
  nextTick(() => {
    option.value.series = updateChartData
    option.value.xAxis.data = xAxisDatas
  })
}

// 필터 기능을 위해서 origin데이터 저장
let originEquimentTags = []
const fetchEquimentTagList = async () => {
  let equimentTags = []
  let engineName = selectedEngineName.value

  const {
    status,
    data: { data }
  } = await getEquimentTagList()

  if (data.length == 0) {
    equipmenTagtList.value = []
    return
  }
  originEquimentTags = data

  if (selectedEngineName.value != 'All') {
    equimentTags = data.filter((equiment) => equiment.equipNo == engineName)
  } else {
    equimentTags = data.filter((equiment) => shipEngines.value.includes(equiment.equipNo))
  }
  equipmenTagtList.value = equimentTags
  console.dir(equipmenTagtList)
}

const filterEquipmentData = () => {
  let engineName = selectedEngineName.value
  let filterList = []

  if (engineName != 'All') {
    filterList = originEquimentTags.filter((el) => el.equipNo == engineName)
  } else {
    filterList = originEquimentTags.filter((equiment) =>
      shipEngines.value.includes(equiment.equipNo)
    )
  }

  equipmenTagtList.value = filterList
}

const onSelectionChanged = async (e) => {
  // 현재 체크 해제한 태그 아이디 목록
  let deselctedKey = e.currentDeselectedRowKeys
  // 현재 체크한 태그 아이디
  let curSelectedKey = e.currentSelectedRowKeys
  // 현재 체크된 태그 아이디 목록
  let selectedKeys = e.selectedRowKeys
  selectedRowKeys.value = selectedKeys

  // 현재 선박 IMO 번호
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  // 시작날짜, 종료날짜 UTC 시간
  let utcStartTime = moment(startDate.value).utc().toISOString()
  let utcEndTime = moment(endDate.value).utc().toISOString()

  // 현재 차트 데이터
  const curChartData = _.cloneDeep(option.value)

  let updateChartData = []
  let xAxisLength = curChartData.xAxis.data.length
  let xAxisDatas = []
  let isIncludeTime = false

  try {
    loadingStatus.value = true
    if (curSelectedKey.length <= 0) {
      // deselectedOriginData가 0인지 아닌지 판단
      // 0이 아닌 경우, originData에서 해당 키 값의 TagID 일치한 데이터를 찾기
      // 차트 시리즈 옵션에서 name이 해당 TagID와 일치한게 있는지 확인
      // 일치하는게 있으면 제거
      if (deselctedKey.length <= 0) {
        return
      }

      updateChartData = curChartData.series.filter((item) => {
        return !deselctedKey.includes(item.name)
      })

      option.value.series = []
      option.value.series = updateChartData
    } else {
      if (xAxisLength == 0) {
        isIncludeTime = true
      }

      let requestForm = {
        imoNumber: curSelectedShipImoNumber,
        fieldNameList: selectedKeys,
        startTime: utcStartTime,
        endTime: utcEndTime,
        timeContains: isIncludeTime
      }

      const {
        data: { data }
      } = await getEquimentChartData(requestForm)

      if ('Time' in data) {
        xAxisDatas = data['Time'].map((date) => convertDateTimeType(date))
      }

      Object.keys(data).forEach((key) => {
        if (key !== 'Time') {
          // 현재 키에 해당하는 배열을 순회하며 data 배열에 객체 형태로 저장
          const tagDescription = equipmenTagtList.value.find((tag) => tag.tagId == key).description

          console.log(data)
          updateChartData.push({
            name: tagDescription,
            data: data[key],
            type: 'line'
          })
        }
      })
    }

    let updatedAxis = []

    if (isIncludeTime) {
      updatedAxis = xAxisDatas
    } else {
      updatedAxis = curChartData.xAxis.data
    }

    option.value.series = []
    // option.value.series = updateChartData

    nextTick(() => {
      option.value.series = updateChartData
    })

    option.value.xAxis.data = updatedAxis
  } catch (error) {
    if (error.response.data) {
      showResMsg(errMsg)
      const errMsg = error.reponse.data.errorMsg
    }
  } finally {
    loadingStatus.value = false
  }
}

const updateDate = async (dateInformation) => {
  let { selectStartDate, selectEndDate } = dateInformation
  startDate.value = convertDateTimeType(selectStartDate)
  endDate.value = convertDateTimeType(selectEndDate)

  fetchPeriodEngineData()
}

const isShowPopupModal = ref(false)
const openVoyagesPopup = async () => {
  isShowPopupModal.value = true
  voyagePopup.value.fetchVoyagesByImoNumber()
}

const closeVoyagesPopup = () => {
  isShowPopupModal.value = false
}

const historyInstance = ref()
const equimentGrid = ref()
const searchDescription = ref('')
const searchByDescription = () => {
  historyInstance.value = getDxGridInstance(equimentGrid)
  historyInstance.value.searchByText(searchDescription.value)
}

watch(curSelectedShip, initFetchData)

onMounted(() => {
  initFetchData()
})

</script>

<style>
.equiment-chart-container {
  flex: 2 2 0;
}

.equiment-select-container {
  flex: 1 1 0;
}

.search-width{
  width:180px
}
</style>
