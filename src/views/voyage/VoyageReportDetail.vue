<template>
  <div class="d-flex ga-4 voyageDetail" v-if="detailInfo != null">
    <div class="mapImage-container">
      <VoyageOlmap
        style="min-width: 450px"
        :imoNumber="imoNumber"
        :departureTime="departureTime"
        :arrivalTime="arrivalTime"
      ></VoyageOlmap>
    </div>

    <DxDataGrid id="voyageDetailGrid" ref="voyageGrid" :data-source="detailInfo" key-expr="id">
      <DxColumn
        data-field="load"
        caption="Load(%)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn data-field="rpm" caption="RPM" alignment="center" :allow-editing="false"></DxColumn>
      <DxColumn
        data-field="speed"
        caption="Speed(kn)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn
        data-field="underway"
        caption="Underway(h)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn
        data-field="distance"
        caption="Distance(nm)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn
        data-field="slip"
        caption="SLIP(%)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn data-field="bf" caption="BF" alignment="center" :allow-editing="false"></DxColumn>
      <DxColumn
        data-field="foc"
        caption="FOC(hours)"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn
        data-field="eeoi"
        caption="EEOI"
        alignment="center"
        :allow-editing="false"
      ></DxColumn>
      <DxColumn data-field="id" :visible="false"></DxColumn>
      <DxScrolling mode="infinite" />
    </DxDataGrid>
  </div>
  <div v-else>
    <p class="text-center desc">데이터가 없습니다</p>
  </div>
  <!-- {{ props.templateData.data }} -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VoyageOlmap from '@/components/voyage/VoyageOlmap.vue'
import { getVoyageTrack } from '@/api/voyage'

import { convertFloatFormatObject } from '@/composables/util'

const props = defineProps({
  templateData: {
    type: Object
  }
})

const detailInfo = ref(null)

let imoNumber = ref(null)
let departureTime = ref(null)
let arrivalTime = ref(null)

onMounted(() => {
  imoNumber.value = props.templateData.data.imoNumber
  departureTime.value = props.templateData.data.departureTime
  arrivalTime.value = props.templateData.data.arrivalTime

  let key = props.templateData.key

  console.dir(props.templateData)

  fetchReportDetail(key)
})

const fetchReportDetail = async (voyageId) => {
  const {
    data: { data }
  } = await getVoyageTrack(voyageId)

  detailInfo.value = data.map((track) => convertFloatFormatObject(track))
}
</script>

<style>
#voyageDetailGrid {
  height: 270px;
}

#voyageDetailGrid td {
  height: 45px;
}

.mapImage-container {
  width: 60%;
}
.mapImage-container img {
  width: 100%;
}

.desc {
  font-size: 1.2em;
}
</style>
