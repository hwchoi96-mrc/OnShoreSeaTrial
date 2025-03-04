<template>
  <v-sheet class="ins-content-container rounded-lg">
    <div class="ecdis pt-3">
      <!-- <v-img :src="ecdis" aspect-ratio="21/9" class="responsive-img" /> -->
      <v-img :src="ecdisImageUrl"></v-img>
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

import { getEcdisUrl } from '@/api/insApi.js'

const loadingStore = useLoadingStore()
const { showResMsg } = useToast()
const { refreshDataTime } = storeToRefs(loadingStore)

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

import ecdis from '/images/ins/ecdis.png'
import axios from 'axios'

const ecdisImageUrl = ref('')

onMounted(() => {
  init()
})

const init = async () => {
  const imoNumber = curSelectedShip.value.imoNumber

  if (!imoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }

  ecdisImageUrl.value = `http://172.16.181.14/${curSelectedShip.value.imoNumber}/ECDIS1/Last_Image.png`
}

const ecdisUrl = computed(() => {
  // http://172.16.181.14/onshipdata/9917505/ECDIS1/EI0001_20240814074513.png
  return `http://172.16.181.14/${curSelectedShip.value.imoNumber}/ECDIS1/Last_Image.png`
})
const setECDISImage = () => {}

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let result = dateTime.isBefore(refreshDataTime.value)

  if (result) {
    console.log('새로고침')
    console.log(ecdisUrl.value)
    ecdisImageUrl.value = ecdisUrl.value
  }
}
watch(curSelectedShip, init)
watch(refreshDataTime, reloadData)
</script>

<style scoped>
.title {
  font-size: 2em;
  line-height: 1;
}

.ecdis .v-img {
  width: 100%;
  height: auto;
  max-width: 100%;

  max-height: 700px;
}

@media (max-width: 1200px) {
  .ecdis .v-img {
    max-height: 600px;
  }
}

@media (max-width: 992px) {
  .ecdis .v-img {
    max-height: 500px;
  }
}

@media (max-width: 768px) {
  .ecdis .v-img {
    max-height: 400px;
  }
}
</style>
