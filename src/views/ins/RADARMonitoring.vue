<template>
  <v-sheet class="ins-content-container h-100 px-3 py-6 rounded-lg">
    <div class="radar-image-container">
      <v-img :src="radarImgUrl" aspect-ratio="21/7.7" class="responsive-img" />
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useShipStore } from '@/stores/shipStore'
import { useLoadingStore } from '@/stores/loadingStore'
import { useToast } from '@/composables/useToast'
import radar from '/images/ins/radar.jpg'

const loadingStore = useLoadingStore()
const { showResMsg } = useToast()
const { refreshDataTime } = storeToRefs(loadingStore)

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const radarImgUrl = ref('')

onMounted(() => {
  init()
})

const init = async () => {
  const imoNumber = curSelectedShip.value.imoNumber

  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  radarImgUrl.value = `http://172.16.181.14/${curSelectedShip.value.imoNumber}/RADAR1//Last_Image.png`
}

const radarUrl = computed(() => {
  // http://172.16.181.14/onshipdata/9917505/ECDIS1/EI0001_20240814074513.png
  return `http://172.16.181.14/${curSelectedShip.value.imoNumber}/RADAR1/Last_Image.png`
})
const setECDISImage = () => {}

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    radarImgUrl.value = radarUrl.value
  }
}
watch(curSelectedShip, init)
watch(refreshDataTime, reloadData)
</script>

<style scoped>
.radar-image-container .v-img {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 690px;
}

@media (max-width: 1200px) {
  .radar-image-container .v-img {
    max-height: 590px;
  }
}

@media (max-width: 992px) {
  .radar-image-container .v-img {
    max-height: 540px;
  }
}

@media (max-width: 768px) {
  .radar-image-container .v-img {
    max-height: 440px;
  }
}

.image-container.radar img.v-img__img--contain {
  object-fit: fill;
  background: #010f02;
}

@media (max-height: 800px) {
  .radar-image-container {
    overflow-y: auto;
  }
}
</style>
