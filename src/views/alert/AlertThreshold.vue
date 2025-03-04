<template>
  <v-sheet class="detail-page tabs-inner-content-container">
    <v-sheet class="rounded-lg px-3 my-3" color="#333334">
      <div class="d-flex ga-3 py-4 justify-end">
        <div class="alarm-type"><span class="caution mr-2">●</span>Caution</div>
        <div class="alarm-type"><span class="warning mr-2">●</span>Warning</div>
      </div>
    </v-sheet>
    <v-sheet class="my-3 px-3 py-3 rounded-lg h-100" color="#333334">
      <div class="d-flex justify-end align-center mb-6 ga-2">
        <v-sheet class="desc-search-area">
          <i-input
            id="searchBox"
            v-model="searchDescription"
            prepend-inner-icon="mdi-magnify"
            single-line
            hide-details
            @input="searchByDescription"
            placeholder="Description을 입력해주세요"
          ></i-input>
        </v-sheet>

        <i-btn
          text="저장"
          color="#3D3D40"
          prepend-icon="mdi-content-save"
          @click="updateAlertThreshold"
        ></i-btn>
        <!-- <i-btn text="추가" color="#3D3D40" prepend-icon="mdi-plus" @click="addThreshold"></i-btn>
        <i-btn
          text="삭제"
          color="#F04A4A"
          prepend-icon="mdi-trash-can"
          @click="showDeleteModal"
        ></i-btn> -->
      </div>

      <DxDataGrid
        id="alertThresholdGrid"
        ref="alertThresholdGrid"
        :data-source="alertThresholds"
        key-expr="id"
        :column-auto-width="true"
        :show-borders="true"
        :selected-row-keys="selectedRowKeys"
        @row-updating="editingRow"
        @row-updated="editRow"
        class="alarm-threshold-container no-stripe"
      >
        <DxSelection mode="multiple" show-check-boxes-mode="always"></DxSelection>
        <DxEditing mode="cell" :allow-editin="true" />

        <DxColumn
          data-field="id"
          caption="No"
          alignment="center"
          :visible="false"
          :allow-editing="false"
          width="5%"
        ></DxColumn>
        <DxColumn
          data-field="description"
          caption="Description"
          width="20%"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="equipNo"
          caption="Equip No"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="tagId"
          caption="Tag ID"
          alignment="center"
          :allow-editing="false"
        ></DxColumn>
        <DxColumn
          data-field="dataType"
          caption="Data Type"
          alignment="center"
          :allow-editing="false"
          width="10%"
        ></DxColumn>
        <DxColumn
          data-field="use"
          caption="Use"
          alignment="center"
          :allow-editing="true"
        ></DxColumn>
        <!-- Warning (On/Off) -->
        <DxColumn
          data-field="warningOnOff"
          caption="Caution"
          :visible="true"
          alignment="center"
          :allow-editing="true"
          header-cell-template="wariningOnOff-header"
        ></DxColumn>
        <template #wariningOnOff-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="danger">●</div>
            <div>
              Warning <br />
              (On/Off)
            </div>
          </div>
        </template>
        <!-- Low(Caution, Warning) -->
        <DxColumn caption="Low" alignment="center" :allow-editing="false">
          <DxColumn
            data-field="lowCaution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="cautionlow-header"
            cell-template="cautionlow-template"
          ></DxColumn>
          <DxColumn
            data-field="lowWarning"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="warninglow-header"
            cell-template="warninglow-template"
          ></DxColumn>
        </DxColumn>

        <template #cautionlow-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="caution">●</div>
            <div>Caution</div>
          </div>
        </template>
        <template #cautionlow-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.lowCaution">{{ templateOptions.data.lowCaution }}</div>
          <div v-else>-</div>
        </template>

        <template #warninglow-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Warning</div>
          </div>
        </template>

        <template #warninglow-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.lowWarning">{{ templateOptions.data.lowWarning }}</div>
          <div v-else>-</div>
        </template>

        <!-- High(Caution, Warning) -->

        <DxColumn caption="High" alignment="center" :allow-editing="false">
          <DxColumn
            data-field="highCaution"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="highCaution-header"
            cell-template="highCaution-template"
          ></DxColumn>
          <DxColumn
            data-field="highWarning"
            caption="Caution"
            :visible="true"
            alignment="center"
            :allow-editing="true"
            header-cell-template="highWarning-header"
            cell-template="highWarning-template"
          ></DxColumn>
        </DxColumn>

        <template #highCaution-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="caution">●</div>
            <div>Caution</div>
          </div>
        </template>
        <template #highCaution-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.highCaution">{{ templateOptions.data.highCaution }}</div>
          <div v-else>-</div>
        </template>
        <!-- Warning (High High) -->

        <template #highWarning-header="{ data }">
          <div class="d-flex align-center ga-2">
            <div class="warning">●</div>
            <div>Warning</div>
          </div>
        </template>

        <template #highWarning-template="{ data: templateOptions }">
          <div v-if="templateOptions.data.highWarning">{{ templateOptions.data.highWarning }}</div>
          <div v-else>-</div>
        </template>

        <DxScrolling mode="virtual" />
      </DxDataGrid>

      <AlertThresholdForm v-model="isShow" @closePopup="isShow = false" />
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { getAlertThreshold, saveAlertThreshold } from '@/api/alarmApi'

import _ from 'lodash'

import alertThreshold from '@/assets/mockup/alertThreshold.json'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const alertThresholdGrid = ref(null)
const alertThresholdInstance = ref()
const alertThresholds = ref()

const isShow = ref(false)
const selectedRowKeys = ref([])
import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

onMounted(() => {
  fetchAlertThreshold()
  alertThresholdInstance.value = alertThresholdGrid.value.instance
})

const fetchAlertThreshold = async () => {
  let imoNumber = curSelectedShip.value.imoNumber

  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  const {
    status,
    data: { data }
  } = await getAlertThreshold(imoNumber)

  if (parseInt(status / 100) == 2) {
    //alertThresholds.value = data
    alertThresholds.value = data
    .filter((threshold) => threshold.equipNo != 'PROP' && threshold.equipNo != 'AIS')
    .map((threshold) => {//데이터 변경 X, 텍스트만 변경 O
      if (threshold.equipNo === 'FDS') {
        threshold.dataType = 'BOOLEAN'; 
      }
      return threshold;
    });
  }
}

const updateAlertThreshold = async () => {
  console.dir(alertThresholdGrid.value.instance.getSelectedRowsData)
  let selectedRows = alertThresholdGrid.value.instance.getSelectedRowsData()
  let updatedData = _.cloneDeep(selectedRows)

  for (let i = 0; i < updatedData.length; ++i) {
    let data = updatedData[i]

    if (data.dataType === 'NUMBER') {
      if (data.use) {
        if (
          data.lowCaution !== null &&
          data.lowWarning !== null &&
          data.highCaution === null &&
          data.highWarning === null
        ) {
          if (data.lowCaution <= data.lowWarning) {
            showResMsg(`[${data.description}] Low Caution은 Low Warning보다 커야 합니다`)
            return
          }
        } else if (
          data.lowCaution === null &&
          data.lowWarning === null &&
          data.highCaution !== null &&
          data.highWarning !== null
        ) {
          if (data.highCaution >= data.highWarning) {
            showResMsg(`[${data.description}] High Caution은 High Warning보다 작아야 합니다`)
            return
          }
        } else if (data.lowCaution !== 0 && (data.highCaution !== 0 || data.highWarning !== 0)) {
          showResMsg(
            `[${data.description}] Low Caution에 값이 있는 경우에는 High Caution/Waring에는 값이 없어야 합니다`
          )
          return
        } else if (data.lowCaution !== 0 && data.lowWarning === 0) {
          showResMsg(`[${data.description}] Low Warning에 값을 입력해야 합니다`)
          return
        } else if (data.lowWarning !== 0 && (data.highCaution !== 0 || data.highWarning !== 0)) {
          showResMsg(
            `[${data.description}] Low Warning에 값이 있는 경우에는 High Caution/Waring에는 값이 없어야 합니다`
          )
          return
        } else if (data.lowWarning !== 0 && data.lowCaution === 0) {
          showResMsg(`[${data.description}] Low Caution 값을 입력해야 합니다`)
          return
        } else if (data.highCaution !== 0 && (data.lowCaution !== 0 || data.lowWarning !== 0)) {
          showResMsg(
            `[${data.description}] High Caution에 값이 있는 경우에는 Low Caution/Waring에는 값이 없어야 합니다`
          )
          return
        } else if (data.highCaution !== 0 && data.highWarning === 0) {
          showResMsg(`[${data.description}] High Warning에 값을 입력해야 합니다`)
          return
        } else if (data.highWarning !== 0 && (data.lowCaution !== 0 || data.lowWarning !== 0)) {
          showResMsg(
            `[${data.description}] High Warning에 값이 있는 경우에는 Low Caution/Waring에는 값이 없어야 합니다`
          )
          return
        } else if (data.highWarning !== 0 && data.highCaution === 0) {
          showResMsg(`[${data.description}] High Caution 값을 입력해야 합니다`)
          return
        } else if (
          data.lowCaution !== 0 &&
          data.lowWarning !== 0 &&
          (data.highCaution !== 0 || data.highWarning !== 0)
        ) {
          showResMsg(
            `[${data.description}] Low Caution/Warning에 값이 존재하는 경우에는 High Caution/Waring에 값이 존재하면 안됩니다`
          )
          return
        } else if (
          data.highCaution !== 0 &&
          data.highWarning !== 0 &&
          (data.lowCaution !== 0 || data.lowWarning !== 0)
        ) {
          showResMsg(
            `[${data.description}] High Caution/Warning에 값이 존재하는 경우에는 Low Caution/Waring에 값이 존재하면 안됩니다`
          )
          return
        } else if (
          data.lowCaution === 0 &&
          data.lowWarning === 0 &&
          data.highCaution === 0 &&
          data.highWarning === 0
        ) {
          showResMsg(`[${data.description}] 값을 입력해야 합니다`)
          return
        }
      }
    } else if (data.dataType === 'BOOLEAN') {
      if (data.warningOnOff !== 'On' || data.warningOnOff !== 'Off') {
        showResMsg(
          `[${data.description}] 데이터 타입이 BOOLEAN일 경우에는 Warning(On/Off)가 On 혹은 Off로 되어 있어야 합니다`
        )
        return
      }
    }

    data.imoNumber = curSelectedShip.value.imoNumber
    delete data.id
    delete data.description
    delete data.equipNo
    delete data.dataType
  }

  const { status } = await saveAlertThreshold(updatedData)

  if (status == 200 || status == 204) {
    fetchAlertThreshold()
    showResMsg('THRESHOLD 정보가 업데이트 되었습니다')
    selectedRowKeys.value = []
  }
  console.log('선택한 Row')
  console.dir(updatedData)
}

const editingRow = (e) => {
  console.dir(e)

  let rowKey = e.key
  let updateCellKey = Object.keys(e.newData)
  let updateCell = e.newData.key

  console.log('수정 전')
  console.dir(alertThresholdGrid.value)
  console.dir(alertThresholdInstance.value)

  const index = selectedRowKeys.value.findIndex((row) => row == e.key)

  console.dir(e)

  if (index != -1) {
    selectedRowKeys.value[index] = { ...e.key }
  } else {
    selectedRowKeys.value.push(e.key)
    alertThresholdInstance.value.selectRows(e.key, true)
  }
  console.log(updateCell)
}

const searchDescription = ref('')
const searchByDescription = () => {
  alertThresholdInstance.value.searchByText(searchDescription.value)
}
watch(curSelectedShip, fetchAlertThreshold)
</script>

<style scoped>
.alarm-type {
  font-size: 0.8rem;
}

div#alertThresholdGrid td#dx-col-37 {
  text-align: center !important;
}

.desc-search-area {
  width: 15%;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
