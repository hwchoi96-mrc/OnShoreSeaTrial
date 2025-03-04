<template>
  <v-container fluid class="h-100 management-page detail-page">
    <v-row no-gutters class="ma-0">
      <v-col cols="12">
        <SelectedShipSummary />
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-3 content-container">
      <v-col cols="12">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>Voyage List</div>
            <!-- <v-btn @click="exportPdf">출력</v-btn> -->
            <div class="d-flex align-center ga-3">
              <div class="d-flex ga-2">
                <input
                  type="datetime-local"
                  v-model="startDate"
                  :max="todayDate"
                  class="noticeList-datePicker"
                />
                <input
                  type="datetime-local"
                  v-model="endDate"
                  :min="startDate"
                  class="noticeList-datePicker"
                />
                <!-- :disabled="endDateStatus" -->

                <i-btn @click="filterDate()" text="조회" width="90"></i-btn>
                <i-btn
                  @click="openVoyagePopup()"
                  text="등록"
                  width="80"
                  prepend-icon="mdi-plus"
                  color="#3D3D40"
                ></i-btn>
              </div>
            </div>
          </v-card-title>

          <v-card-text class="ship-summary">
            <!-- 리포트 -->
            <DxDataGrid
              id="voyageGrid"
              ref="voyageGrid"
              class="ship-summary-grid-container"
              :data-source="voyages"
              key-expr="id"
              @row-click="clickVoyage"
              :column-auto-width="true"
              :show-borders="true"
            >
              <DxSelection mode="single"></DxSelection>

              <DxColumn
                data-field="departure"
                caption="Departure"
                :allow-editing="false"
                alignment="center"
                cell-template="departure-template"
                width="10.5%"
              >
              </DxColumn>
              <template #departure-template="{ data: templateOptions }">
                <PortInfo
                  :portName="templateOptions.data.departurePortInfo.name"
                  :time="templateOptions.data.departureTime"
                  :country="templateOptions.data.departurePortInfo.country"
                  class="d-flex flex-column justify-center"
                >
                </PortInfo>
              </template>
              <DxColumn data-field="departureTime" :visible="false"> </DxColumn>

              <DxColumn
                data-field="arrival"
                caption="Arrival"
                cell-template="arrival-template"
                :allow-editing="false"
                alignment="center"
                width="10.5%"
              >
              </DxColumn>
              <template #arrival-template="{ data: templateOptions }">
                <PortInfo
                  :portName="templateOptions.data.arrivalPortInfo.name"
                  :time="templateOptions.data.arrivalTime"
                  :country="templateOptions.data.arrivalPortInfo.country"
                >
                </PortInfo>
              </template>
              <DxColumn data-field="arrivalTime" :visible="false"></DxColumn>
              <DxColumn
                data-field="load"
                caption="Load(%)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="load-header"
              ></DxColumn>
              <template #load-header="{ data }">
                <p>
                  Load <br />
                  (%)
                </p>
              </template>
              <DxColumn
                data-field="rpm"
                caption="RPM"
                alignment="center"
                :allow-editing="false"
                header-cell-template="rpm-header"
              ></DxColumn>
              <template #rpm-header="{ data }">
                <p>
                  RPM <br />
                  (rpm)
                </p>
              </template>
              <DxColumn
                data-field="speed"
                caption="Speed(kn)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="speed-header"
              ></DxColumn>
              <template #speed-header="{ data }">
                <p>
                  Speed <br />
                  (kn)
                </p>
              </template>
              <DxColumn
                data-field="underway"
                caption="Underway(h)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="underway-header"
              />
              <template #underway-header="{ data }">
                <p>
                  Underway <br />
                  (h)
                </p>
              </template>
              <DxColumn
                data-field="distance"
                caption="Distance(nm)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="distance-header"
              >
              </DxColumn>
              <template #distance-header="{ data }">
                <p>Distance<br />(nm)</p>
              </template>
              <DxColumn
                data-field="slip"
                caption="Slip(%)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="slip-header"
              />
              <template #slip-header="{ data }">
                <p>slip<br />(%)</p>
              </template>
              <DxColumn
                data-field="bf"
                caption="BF"
                alignment="center"
                :allow-editing="false"
                header-cell-template="bf-header"
              ></DxColumn>
              <template #bf-header="{ data }">
                <p>BF<br />(value)</p>
              </template>
              <DxColumn
                data-field="foc"
                caption="FOC(t)"
                alignment="center"
                :allow-editing="false"
                header-cell-template="foc-header"
              >
              </DxColumn>
              <template #foc-header="{ data }">
                <p>FOC<br />(t)</p>
              </template>
              <DxColumn
                data-field="eeoi"
                caption="EEOI"
                alignment="center"
                :allow-editing="false"
                header-cell-template="eeoi-header"
              ></DxColumn>
              <template #eeoi-header="{ data }">
                <p>EEOI<br />(10<sup>-6</sup>)</p>
              </template>

              <DxColumn
                caption="action"
                cell-template="edit-template"
                alignment="center"
              ></DxColumn>
              <template #edit-template="{ data: templateOptions }">
                <div class="d-flex justify-space-between">
                  <v-btn
                    class="d-inline-flex justify-center actionBtn"
                    icon="mdi-file-chart-outline"
                    @click="openVoyageReportPopup(templateOptions.data.id)"
                  ></v-btn>
                  <v-btn
                    class="d-inline-flex justify-center actionBtn"
                    icon="mdi-square-edit-outline"
                    @click="openEditPopup(templateOptions.data.id)"
                  ></v-btn>
                  <v-btn
                    class="d-inline-flex justify-center actionBtn"
                    icon="mdi-trash-can-outline"
                    @click="openDeleteModal(templateOptions.data.id)"
                  ></v-btn>
                </div>
              </template>
              <DxMasterDetail :enabled="false" template="detailTemplate"></DxMasterDetail>

              <template #detailTemplate="{ data: voyageDetail }">
                <VoyageReportDetail :template-data="voyageDetail" />
              </template>
              <!-- <DxPaging :page-size="10" /> -->
              <DxScrolling mode="virtual" />
            </DxDataGrid>

            <VoyageRegisterForm
              v-model="isShow"
              @addVoyage="addVoyage"
              @closePopup="isShow = false"
            >
            </VoyageRegisterForm>
            <VoyageEditForm
              v-model="isShowEditForm"
              :id="voyageId"
              :voyageHistoryList="voyageHistoryList"
              @editVoyage="editVoyage"
              @editVoyageInfo="editVoyageInfo"
              @closePopup="isShowEditForm = false"
            >
            </VoyageEditForm>
            <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">
              <template #default>
                <p>정말로 항차를 삭제하시겠습니까?</p>
              </template>
              <template #actions>
                <i-btnGroup
                  type="confirm"
                  @close="closeDeleteModal"
                  @confirm="removeVoyage"
                ></i-btnGroup>
              </template>
            </AppModal>
            <VoyageReportPopup
              v-model="isOpenVoaygeReport"
              :voyageId="voyageId"
              :imoNumber="curSelectedShip.imoNumber"
              @close="closeVoyageReportPopup"
            ></VoyageReportPopup>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useAuthStore } from '@/stores/authStore'
import { insertVoyageDetailInfoHistory } from '@/api/voyage.js'

import { useVoyageStore } from '@/stores/voyageStore'
import { getDxGridInstance } from '@/composables/dxGridUtil.js'
import {
  convertDateType,
  isValidDateRange,
  addDay,
  convertFloatFormatObject,
  isStatusOk
} from '@/composables/util.js'
import emitter from '@/composables/eventbus.js'
import { useToast } from '@/composables/useToast'
import { insertVoyage, updateVoyage, updateVoyageInfo } from '@/api/voyage'
import { jsPDF } from 'jspdf'

import VoyageReportDetail from '@/views/voyage/VoyageReportDetail.vue'
import VoyageReportPopup from '@/views/voyage/VoyageReportPopup.vue'
import VoyageRegisterForm from '@/views/voyage/form/VoyageRegisterForm.vue'
import VoyageEditForm from '@/views/voyage/form/VoyageEditForm.vue'
import SelectedShipSummary from '@/components/ship/SelectedShipSummary.vue'
import PortInfo from '@/components/voyage/PortInfo.vue'
import AppModal from '@/components/modal/AppModal.vue'

const shipCondition = ref('all')
const startDate = ref('')
const endDate = ref('')
const endDateStatus = ref(true)

const voyageGrid = ref('')
const voyageInstance = ref('')

const isShow = ref(false)
const isShowEditForm = ref(false)
const isShowDeleteModal = ref(false)

const voyageStore = useVoyageStore()
const { voyages, voyageHistoryList } = storeToRefs(voyageStore)

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const { showResMsg } = useToast()
const voyageId = ref()

const todayDate = ref()
const isOpenVoaygeReport = ref(false)

let selectedShipImoNumber = ''

onMounted(() => {
  voyageInstance.value = getDxGridInstance(voyageGrid)
  // getAllVoyageByImoNumber()

  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  if (curSelectedShipImoNumber) {
    getAllVoyageByImoNumber(curSelectedShipImoNumber)
  } else {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }

  let today = new Date()
  todayDate.value = convertDateType(today)
})

const clickVoyage = (e) => {
  const isExpanded = e.component.isRowExpanded(e.key)

  console.dir(e)
  if (e.rowType == 'detail') {
    e.preventDefault()
  }

  if (isExpanded) {
    e.component.collapseRow(e.key)
  } else {
    e.component.collapseAll(-1)
    e.component.expandRow(e.key)
  }
}

watch(startDate, () => {
  if (startDate.value) {
    endDateStatus.value = false
  } else {
    endDateStatus.value = true
  }
})

const getAllVoyageByImoNumber = async (imoNumber) => {
  selectedShipImoNumber = imoNumber
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  await voyageStore.fetchAllVoyageByImoNumber(curSelectedShipImoNumber)
}

emitter.on('selectShipOnDetailPage', getAllVoyageByImoNumber)
const openVoyagePopup = () => {
  isShow.value = true
}

const addVoyage = async (newVoyageData) => {
  const { departure, arrival, departureTime, arrivalTime } = newVoyageData
  newVoyageData.imoNumber = curSelectedShip.value.imoNumber

  if (!departure || !arrival) {
    showResMsg('출발지 또는 목적지는 필수 입력 항목입니다')
    return
  }

  if (departure == arrival) {
    showResMsg('출발지와 목적지가 같습니다')
    return
  }

  if (!isValidDateRange(departureTime, arrivalTime)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return
  }

  const response = await insertVoyage(newVoyageData)

  if (response.status == 201) {
    isShow.value = false
    await getAllVoyageByImoNumber(selectedShipImoNumber)
    showResMsg('항차 정보가 등록되었습니다')
  }
}

const editVoyage = async (voyageEditForm) => {
  const response = await updateVoyage(voyageEditForm)

  if (response.status == 200) {
    isShowEditForm.value = false
    insertVoyageHistory(voyageEditForm)
    voyageId.value = null
    await getAllVoyageByImoNumber(selectedShipImoNumber)
    showResMsg('해당 항차 정보가 수정되었습니다')
  }
}

const editVoyageInfo = async (voyageEditForm) => {
  const { departure, arrival, departureTime, arrivalTime } = voyageEditForm
  console.dir(voyageEditForm)
  if (!departure || !arrival) {
    showResMsg('출발지 또는 목적지는 필수 입력 항목입니다')
    return
  }

  if (departure == arrival) {
    showResMsg('출발지와 목적지가 같습니다')
    return
  }

  if (!isValidDateRange(departureTime, arrivalTime)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return
  }

  const response = await updateVoyageInfo(voyageEditForm)

  if (response.status == 201) {
    isShowEditForm.value = false
    voyageId.value = null
    await getAllVoyageByImoNumber(selectedShipImoNumber)
    showResMsg('해당 항차 정보가 수정되었습니다')
  }
}

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
let voyageInsertForm = {
  id: null,
  load: null,
  rpm: null,
  speed: null,
  underway: null,
  distance: null,
  slip: null,
  bf: null,
  foc: null,
  eeoi: null,
  editId: ''
}
const insertVoyageHistory = async (voyageEditForm) => {
  // voyageInsertForm 객체에 데이터 주입
  Object.keys(voyageInsertForm).forEach((key) => {
    if (key in voyageEditForm) {
      voyageInsertForm[key] = voyageEditForm[key]
    }
  })

  //꾸밈 기호 제거
  Object.keys(voyageInsertForm).forEach((key) => {
    let value = voyageEditForm[key]

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

    voyageInsertForm[key] = value
  })

  voyageInsertForm.editId = userInfo.value.username

  await insertVoyageDetailInfoHistory(voyageInsertForm)
}

const openEditPopup = (id) => {
  voyageId.value = id
  isShowEditForm.value = true
}

let deleteVoyageId = null
const openDeleteModal = (id) => {
  isShowDeleteModal.value = true
  deleteVoyageId = id
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}
const removeVoyage = async () => {
  console.log(deleteVoyageId)
  const result = await voyageStore.removeVoyageById(deleteVoyageId)

  if (isStatusOk(result)) {
    await getAllVoyageByImoNumber(selectedShipImoNumber)
    showResMsg('해당 항차가 성공적으로 삭제되었습니다')
    closeDeleteModal()
  }
}

const exportPdf = (id) => {
  let el = document.querySelector('.detail-page')
  const doc = new jsPDF()

  doc.text('Hello world!', 10, 10)
  doc.html(el, {
    callback: function (doc) {
      doc.save()
    },
    x: 10,
    y: 10
  })
}

const filterShipCondition = () => {
  console.dir(voyageInstance.value)
  let condition = shipCondition.value
  if (condition == 'all') {
    voyageInstance.value.clearFilter()
  } else {
    voyageInstance.value.filter(['condition', '=', condition])
  }
}

const filterDate = () => {
  if (!startDate.value || !endDate.value) {
    voyageInstance.value.clearFilter()
    return
  }
  if (!isValidDateRange(startDate.value, endDate.value)) {
    showResMsg('도착시각이 출발시각보다 빠릅니다')
    return
  }

  let addedEndDate = addDay(endDate.value, 1)
  addedEndDate = convertDateType(addedEndDate)

  voyageInstance.value.filter(['departureTime', '>=', startDate.value], 'and', [
    'departureTime',
    '<=',
    addedEndDate
  ])
}

const openVoyageReportPopup = (id) => {
  voyageId.value = id
  isOpenVoaygeReport.value = true
}
const closeVoyageReportPopup = () => {
  isOpenVoaygeReport.value = false
}

watch(shipCondition, filterShipCondition)
watch(curSelectedShip, getAllVoyageByImoNumber)
</script>

<style scoped>
input[type='date'] {
  border: 1px solid #49494e;
  padding: 5px;
  border-radius: 8px;
  /* cursor: default; */
  font-size: 0.9rem;
}
.title {
  font-size: 1.2em;
}

.cargoCapacityContainer {
  background-color: #111115;
}

.v-btn.inactive {
  background-color: #111115;
  color: #ffffff80;
}

.v-btn.active {
  color: #fff;
}

#voyageGrid tr.dx-row.dx-data-row > td {
  height: 45px;
}

.report-container {
  height: calc(100vh - 65px - 32px);
}

/* #voyageGrid {
  height: calc(100% - 60px);
} */

.v-btn--icon.v-btn--density-default.actionBtn {
  width: 35px;
  height: 35px;
  /* padding: 4px; */
}

.actionBtn i {
  font-size: 20px;
}

input[type='datetime-local'] {
  background: #434348;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
