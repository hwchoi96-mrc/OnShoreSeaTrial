<template>
  <v-sheet class="ins-content-container rounded-lg">
    <div class="ecdis ecdis-image-container">
      <v-img class="ecdis-image" :src="ecdisImageUrl" aspect-ratio="16/9" />
    </div>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, onUnmounted } from 'vue'
import PopupSelectedShipSummary from '@/components/ship/PopupSelectedShipSummary.vue'
import ecdis from '/images/ins/ecdis.png'

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

  ecdisImageUrl.value = `http://172.16.181.14/${selectedImoNumber.value}/ECDIS1/Last_Image.png`
  // CCTV 조회
})

onUnmounted(() => {
  eventSource.close()
})
const ecdisImageUrl = ref()
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
      ecdisImageUrl.value = `http://172.16.181.14//${selectedImoNumber.value}/ECDIS1/Last_Image.png`
    }
  } else if (result.sseReturnCode == 'REFRESH_DATA_TIME') {
    reloadData()
  }
}

const ecdisUrl = computed(() => {
  // http://172.16.181.14/onshipdata/9917505/ECDIS1/EI0001_20240814074513.png
  return `http://172.16.181.14/${selectedImoNumber.value}/ECDIS1/Last_Image.png`
})

const reloadData = () => {
  ecdisImageUrl.value = ecdisUrl.value
}
</script>

<style scoped>
.title {
  font-size: 2em;
  line-height: 1;
}

.ins-content-container {
  height: 100vh;
  max-height: calc(100vh);
}

.ecdis-image-container {
  height: 100%;
  max-height: calc(100%);
}

.ecdis .v-img {
  min-height: 600px;
}
.v-responsive.v-img.ecdis-image .v-img__img--contain {
  object-fit: fill !important;
}
</style>
