<template>
  <v-dialog v-model="isShowPopupModal" :width="width" :scrim="false" class="detail-page">
    <v-card :color="color" height="450">
      <slot name="header">
        <!-- 닫기 버튼 -->
        <v-btn
          :color="closeIconColor"
          class="d-flex justify-end"
          variant="plain"
          append-icon="mdi-close"
          @click="$emit('close')"
        >
        </v-btn>
        <!-- 팝업 타이틀 -->
        <v-card-title class="popup-title text-center font-weight-bold"> Voyage List </v-card-title>
      </slot>
      <v-card-text class="text-center font-weight-bold">
        <DxDataGrid
          id="voyageGrid"
          ref="voyageGrid"
          class=""
          :data-source="voyages"
          key-expr="id"
          @row-click="clickVoyage"
          :column-auto-width="false"
          :show-borders="true"
        >
          <DxSelection mode="single"></DxSelection>

          <DxColumn
            data-field="departure"
            caption="Departure"
            :allow-editing="false"
            alignment="center"
            cell-template="departure-template"
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

          <DxColumn
            data-field="id"
            caption=""
            alignment="center"
            cell-template="select-template"
            :allow-editing="false"
          />

          <template #select-template="{ data: templateOptions }">
            <i-btn
              text="선택"
              @click="
                selectVoyage(templateOptions.data.departureTime, templateOptions.data.arrivalTime)
              "
              color="#3D3D40"
            ></i-btn>
          </template>
          <!-- <DxPaging :page-size="10" /> -->
          <DxScrolling mode="virtual" />
        </DxDataGrid>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getPeriodVoyage } from '@/api/voyage.js'
import { convertUTCTimezone } from '@/composables/util'

import PortInfo from '@/components/voyage/PortInfo.vue'

const voyages = ref([])

const props = defineProps({
  imoNumber: {
    type: [String, Object]
  },
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#313131'
  },
  width: {
    type: [String, Number],
    default: '550'
  },
  closeIconColor: {
    type: String,
    default: '#fff'
  },
  departureTime: {
    type: String
  },
  arrivalTime: {
    type: String
  }
})

const emits = defineEmits(['seletcVoyage', 'close'])
onMounted(() => {
  let selectedShipImonumber = props.imoNumber
  if (selectedShipImonumber) {
    // fetchVoyagesByImoNumber()
  }
})

const fetchVoyagesByImoNumber = async () => {
  let startTime = convertUTCTimezone(props.departureTime)
  let endTime = convertUTCTimezone(props.arrivalTime)

  if (startTime != null && endTime != null) {
    const requestForm = {
      imoNumber: props.imoNumber,
      departureTime: startTime,
      arrivalTime: endTime
    }
    const response = await getPeriodVoyage(requestForm)

    // const {
    //   data: { data }
    // } = response?.data?.data ?? { data: [] }

    const {
      data: { data }
    } = response

    voyages.value = data
  }

  // ;({
  //   data: { data: voyages.value }
  // } = await getPeriodVoyage(requestForm))
}

const selectVoyage = (selectStartDate, selectEndDate) => {
  emits('selectVoyage', { selectStartDate, selectEndDate })
  emits('close')
}

defineExpose({
  fetchVoyagesByImoNumber
})

watch(() => props.imoNumber, fetchVoyagesByImoNumber)
</script>

<style scoped>
.popup-title {
  color: #fff;
}

.dx-datagrid .dx-row > td {
  padding: 7px 14px;
}
</style>
