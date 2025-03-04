<template>
  <v-sheet class="popup-container rounded-lg">
    <v-container fluid class="">
      <v-row class="h-100">
        <v-col cols="12" class="pa-0">
          <v-sheet class="">
            <video-js
              id="realTime-cctv"
              width="100%"
              height="300"
              class="vjs-default-skin"
              controls
              style="width: 100%; height: calc(100vh)"
            >
              <source :src="cctvUrl" type="application/x-mpegURL" />
            </video-js>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, onBeforeMount, onUnmounted, onMounted, computed } from 'vue'
import { v4 } from 'uuid'
import videojs from 'video.js'

const vidoUrl = ''
const selectedImoNumber = ref('')

let eventSource = ''
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

let cctvVideo = ''
onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('imoNumber')
  selectedImoNumber.value = imoNumber

  cctvVideo = videojs('realTime-cctv', {
    autoplay: 'muted',
    controls: true,
    controlBar: {
      children: ['playToggle', 'progressControl', 'volumePanel']
    }
  })

  setCCTVUrl()
})

const cctvUrl = computed(() => {
  return `http://172.16.181.14/${selectedImoNumber.value}/CCTV/stream.m3u8`
})

const setCCTVUrl = () => {
  cctvVideo.src({
    src: cctvUrl.value,
    type: 'application/x-mpegURL'
    // withCredentials: true
  })
}

onUnmounted(() => {
  eventSource.close()
})

const recieveImoNumber = (e) => {
  console.log('구독 이벤트')
  console.dir(e)
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_SHIP') {
    console.log('선박 변경')
    console.dir(e)
    console.log(e.msg)
    console.log(result.msg)
    if (result.msg) {
      selectedImoNumber.value = result.msg
      setCCTVUrl()
    }
  } else if (result.sseReturnCode == 'REFRESH_DATA_TIME') {
    setCCTVUrl()
  }
}
</script>

<style scoped>
.popup-container {
  height: 100vh;
  max-height: calc(100vh);
}
.cctv-container {
  flex: 1 1 20%;
}

.cctv-item {
  flex: 0 1 25%;
}

.cctv-list-container {
  flex: 1 1 0;
}

.cctvs-container {
  flex: 3 3 0;
  /* overflow : auto; */
}

.cctv-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.item-container {
  width: 70%;
  height: 100%;
}

.data-container {
  width: 30%;
}

video {
  object-fit: fill;
  /* height: 100%; */
  min-height: 32vh;
}

.cctv-grid {
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid #585a6187;
}

.video-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
}

.cctvlist-grid {
  height: 100%;
}
</style>
