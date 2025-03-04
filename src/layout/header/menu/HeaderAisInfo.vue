<template>
  <div class="d-flex justify-space-between align-center text-center px-10 equiment_wrap pointer-cursor">
    <div>
      <div class="subTitle font-weight-light text-caption">LAT</div>
      <div class="font-weight-bold">{{ aisInfo.latitude }}</div>
    </div>
    <div>
      <div class="subTitle font-weight-light text-caption">LON</div>
      <div class="font-weight-bold">{{ aisInfo.longitude }}</div>
    </div>
    <div>
      <div class="subTitle font-weight-light text-caption">Course / Speed</div>
      <div class="font-weight-bold">{{ aisInfo.course }} ˚ / {{ aisInfo.speed }} kn</div>
    </div>
    <div>
      <div class="subTitle font-weight-light text-caption">Current Draft</div>
      <div class="font-weight-bold">{{ aisInfo.draft }} m</div>
    </div>
    <div>
      <div class="subTitle font-weight-light text-caption">Destination</div>
      <div class="font-weight-bold">{{ aisInfo.endPort }}</div>
    </div>
    <div>
      <div class="subTitle font-weight-light text-caption">ETA(UTC)</div>
      <div class="font-weight-bold">{{ aisInfo.arrivalTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

// 월드맵에서 선박 클릭 시, 헤더 정보 변경 필요
import emitter from '@/composables/eventbus.js'
const mapStore = useMapStore()
const { aisInfo } = storeToRefs(mapStore)
// emitter.on('clickedShipOnMap', () => {})

</script>

<style>
.equiment_wrap {
  width: 800px;
}
</style>