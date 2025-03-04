<template>
  <v-sheet class="ins-content-container rounded-lg">
    <div class="rader-image-container">
      <v-img class="radar-image" :src="radarImgUrl" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onUnmounted, computed } from 'vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'
import radar from '/images/ins/radar.jpg'

import { v4 } from 'uuid'

let eventSource = ''
const selectedImoNumber = ref()

let interval = ''

onBeforeMount(() => {
  clearInterval(interval)
  interval = null
  // let uuid = crypto.randomUUID()
  let uuid = v4()
  let sseRequestUrl = import.meta.env.VITE_APP_API_URL + `/sse/subscribe?subScribeId=${uuid}`
  eventSource = new EventSource(sseRequestUrl, {
    withCredentials: true
  })

  eventSource.addEventListener('sse', (e) => {
    recieveImoNumber(e)
  })
})

onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber

  // CCTV 조회
  radarImgUrl.value = `http://172.16.181.14/${selectedImoNumber.value}/RADAR1//Last_Image.png`
})

onUnmounted(() => {
  eventSource.close()
})

const radarImgUrl = ref()
const recieveImoNumber = (e) => {
  console.log('구독 이벤트')
  console.dir(e)
  let curSelectedShipImoNumber = null
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_SHIP') {
    console.log('선박 변경')
    console.dir(e)
    console.log(e.msg)
    console.log(result.msg)
    if (result.msg) {
      selectedImoNumber.value = result.msg
      radarImgUrl.value = `http://172.16.181.14/${selectedImoNumber.value}/RADAR1/Last_Image.png`
    }
  } else if (result.sseReturnCode == 'REFRESH_DATA_TIME') {
    reloadData()
  }
}

const radarUrl = computed(() => {
  // http://172.16.181.14/onshipdata/9917505/ECDIS1/EI0001_20240814074513.png
  return `http://172.16.181.14/${selectedImoNumber.value}/RADAR1/Last_Image.png`
})

const reloadData = () => {
  radarImgUrl.value = radarUrl.value
}
</script>

<style scoped>
.image-container.radar img.v-img__img--contain {
  object-fit: fill;
  background: #010f02;
}

.ins-content-container {
  height: 100vh;
  max-height: calc(100vh);
}

.rader-image-container {
  height: 100%;
  max-height: calc(100%);
}

/* @media (max-height: 800px) {
  .radar-image-container {
    overflow-y: auto;
  }
} */
</style>
