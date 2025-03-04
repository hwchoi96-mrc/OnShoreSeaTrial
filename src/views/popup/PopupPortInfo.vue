<template>
  <iframe
    id="inlineFrameExample"
    title="Inline Frame Example"
    ref="iframe"
    class="w-100 h-100"
    src="https://daum.net"
  >
  </iframe>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'

import { getCurrentVoyage } from '@/api/voyage'
import { convertDateTimeType, convertDateType, openNewPopup } from '@/composables/util.js'
import { convertUTCTimezone } from '@/composables/util'

import { useToast } from '@/composables/useToast'
import { getPeriodEngineData } from '@/api/dataApi'
import { v4 } from 'uuid'
import moment from 'moment'

const startDate = ref(null)
const endDate = ref(null)
const isShowPopupModal = ref(false)

const selectedImoNumber = ref('')
const SECOND_IN_ONE_MINUTE = 1000 * 60

let uuid = null
let interval = null
let eventSource = ''

const iframe = ref('')

const { showResMsg } = useToast()
const drawer = ref(false)

onBeforeMount(() => {
  uuid = v4()
  let sseRequestUrl = import.meta.env.VITE_APP_API_URL + `/sse/subscribe?subScribeId=${uuid}`
  eventSource = new EventSource(sseRequestUrl, {
    withCredentials: true
  })
  eventSource.addEventListener('sse', (e) => {
    recievePortCode(e)
  })
})

onMounted(() => {
  let url = new URLSearchParams(location.search)
  let imoNumber = url.get('portCode')
  portName.value = imoNumber

  getUrl(portName.value)

  if (!imoNumber) {
    return
  }
})

let utcStartTime = ''
let utcEndTime = ''

const portName = ref()

const recievePortCode = (e) => {
  let curPort = null
  const result = JSON.parse(e.data)

  if (result.sseReturnCode == 'CHANGED_PORT') {
    portName.value = result.msg
    getUrl(portName.value)
  }
}

const getUrl = (port) => {
  let url = ''
  switch (port) {
    case 'CHSHG':
      url = 'https://daum.net'
      break
    case 'ZACPT':
      url = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M'
      break

    case 'KRPUS':
      url = 'https://www.google.com/webhp?igu=1'
      break

    default:
      url = 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M'
      break
  }

  iframe.value.src = url
}

// watch(curSelectedShip, initFetchData, { deep: true })
</script>

<style lang="scss" scoped></style>
