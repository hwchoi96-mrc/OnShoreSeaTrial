<template>
  <v-sheet class="ins-content-container">
    <v-container fluid class="">
      <v-row class="h-100">
        <v-col cols="12" class="pl-0">
          <v-sheet class="">
            <!-- video-js-hls-streaming -->
            <video-js
              id="realTime-cctv"
              width="100%"
              height="300"
              class="vjs-default-skin"
              controls
              style="width: 100%; height: calc(100vh - 245px)"
            >
              <source :src="cctvUrl" type="application/x-mpegURL" />
            </video-js>

            <!-- vue-hls-video-player -->
            <!-- <VideoPlayer
              type="default"
              link="http://172.16.181.14/9917505/CCTV/stream.m3u8"
              class="customClassName"
              style="width: 100%; height: calc(100vh - 240px)"
            /> -->

            <!-- hls.js -->
            <!-- <video
              id="realTime-cctv"
              width="100%"
              height="300"
              class="vjs-default-skin"
              controls
              style="width: 100%; height: calc(100vh - 24px)"
            ></video> -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import videojs from 'video.js'

// import { VideoPlayer } from 'vue-hls-video-player'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

let cctvVideo = ''
let video = ''
let player = ''
const playlist = ref('http://172.16.181.14/9917505/CCTV/stream.m3u8')
onMounted(() => {
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
  return `http://172.16.181.14/${curSelectedShip.value.imoNumber}/CCTV/stream.m3u8`
})

const setCCTVUrl = () => {
  // sample Url : http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8
  console.log(cctvUrl.value)
  video = document.getElementById('realTime-cctv')

  cctvVideo.src({
    src: cctvUrl.value,
    type: 'application/x-mpegURL'
    // withCredentials: true
  })

  // if (Hls.isSupported()) {
  //   console.log('Hls 지원 o ')
  //   console.log(cctvUrl.value)

  //   var hls = new Hls()
  //   hls.loadSource(cctvUrl.value)
  //   hls.attachMedia(video)
  //   hls.startLoad()

  //   hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  //     console.log('video and hls.js are now bound together !')
  //   })
  // }

  //   // video.play()
  // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //   video.src = cctvUrl.value
  // }

  // videojs-hls-streaming

  // cctvVideo.on('error', () => {
  //   console.error('VideoJS error:', cctvVideo.error())
  // })
}

watch(curSelectedShip, setCCTVUrl)
</script>

<style scoped>
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
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.item-container {
  width: 70%;
  height: 100%;
}

.data-container {
  width: 30%;
}

/* #cctvListGrid {
  height: 100%;
} */

video {
  object-fit: fill;
  height: 100%;
}

/* #cctvListGrid .dx-datagrid .dx-column-lines>td {
  border: 0px;
} */

.cctv-grid {
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid #585a6187;
}

.video-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 12px;
}

.cctvlist-grid {
  height: 100vh;
  /* max-height: calc(100% - 24px); */
  max-height: calc(100vh - 65px - 12px - 60px - 12px - 62px - 36px);
}

.vjs-big-play-button {
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

.vjs-control-bar {
  display: none;
}

.video-js:hover .vjs-control-bar {
  display: flex;
}
</style>
