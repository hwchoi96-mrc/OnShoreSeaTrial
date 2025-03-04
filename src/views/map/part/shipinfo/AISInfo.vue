<template>
  <div class="popup-container area-container pointer-cursor">
    <div class="d-flex justify-space-between align-center">
      <div style="font-size:1.2em">| AIS Info</div>
      <div class="align-center mr-1" style="font-size:1em">
        <span><v-icon icon="mdi-alarm"></v-icon></span>
        {{ updatedTime }}
      </div>
    </div>

    <div class="border rounded-lg my-1 px-4 py-8 pointer-cursor area-container content">
      <AISProgressInfo />
    </div>
    <div class="d-flex ga-4 pl-4 pointer-cursor">
      <div class="popupLineHeight ">
        <ShipInfoText fieldName="LAT" :fieldValue="aisInfo.latitude" />
        <div class="d-flex shipInfo-text">
          <div><span class="squareIcon">■</span><span class="shipInfo-fieldName">Course/Speed</span></div>
          <div>{{ aisInfo.course }} ˚ / {{ aisInfo.speed }} kn</div>
        </div>
        <ShipInfoText fieldName="Destination" :fieldValue="aisInfo.arrival" />
      </div>
      <div class="rightInfo popupLineHeight pointer-cursor">
        <ShipInfoText fieldName="LON" :fieldValue="aisInfo.longitude" />
        <ShipInfoText fieldName="Current Draft" :fieldValue="aisInfo.draft" unit="m" />
        <ShipInfoText fieldName="ETA(UTC)" :fieldValue="aisInfo.arrivalDateTime" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

import AISProgressInfo from '@/views/map/part/shipinfo/AISProgressInfo.vue'
import ShipInfoText from '@/components/map/ShipInfoText.vue'
import { convertDateTimeType } from '@/composables/util.js'
import emitter from '@/composables/eventbus.js'

const mapStore = useMapStore()
const { clickedShipInfo, aisInfo } = storeToRefs(mapStore)

const SECOND_IN_ONE_MINUTE = 1000 * 60

let dataFetchTime = ''
let updatedTime = ref('NAN')
let interval = ''

const relativeTime = ref('')

onMounted(()=>{
  fetchShipAisInfo()
  interval = setInterval(fetchShipAisInfo, SECOND_IN_ONE_MINUTE)
  emitter.emit('fetchAisInfo')
})

onUnmounted(() => {
  clearInterval(interval)
})



const fetchShipAisInfo = async() => {
  const imoNumber = clickedShipInfo.value.imoNumber
  await mapStore.fetchShipAisInfo(imoNumber)
  updatedTime.value = convertDateTimeType(new Date())
}

watch(clickedShipInfo, fetchShipAisInfo, { deep: true })

const getTimeDifference = (searchTime, updateTime) => {
  const searchDate = new Date(searchTime);
  const updateDate = new Date(updateTime);
  const timeDifference = updateDate.getTime() - searchDate.getTime();

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
  let formattedResult = ''

  if (hours == 0 && minutes == 0) {
    formattedResult = 'just Now'
    return formattedResult
  }

  if (hours > 0) {
    formattedResult += `${hours} hour${hours !== 1 ? 's' : ''} `
  }
  formattedResult += `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  return formattedResult;
}
</script>

<style>

</style>