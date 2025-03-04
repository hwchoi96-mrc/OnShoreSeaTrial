<template>
  <v-sheet class="ins-content-container">
    <v-container fluid>
      <v-row>
        <v-col cols="10">
          <v-sheet class="h-100">
            <video
              class="w-100 cctv-history-area"
              controls
              controlslist="nodownload noplaybackrate"
              disablepictureinpicture
              ref="videoTest"
            >
              <source :src="videoUrl" />
            </video>
          </v-sheet>
        </v-col>
        <v-col cols="2">
          <DxDataGrid
            id="cctvGrid"
            ref="cctvGrid"
            class="cctv-history-grid cctv-history-area"
            key-expr="id"
            :data-source="cctvs"
            :show-column-headers="false"
            :on-selection-changed="selectCCTV"
            :selected-row-keys="selectedRowKeys"
          >
            <DxSelection mode="single"></DxSelection>
            <DxScrolling mode="virtual" />
            <!-- row-rendering-mode="virtual" -->
            <DxColumn data-field="cctvName" alignment="center" :allow-editing="false" />
            <!-- <DxColumn
              data-field="status"
              :allow-editing="false"
              :show-column-lines="false"
              cell-template="cctv-status-template"
              width="15%"
            /> -->
            <!-- <DxColumn data-field="statusText" :allow-editing="false" /> -->

            <template #cctv-status-template="{ data: templateOptions }">
              <div :class="getCCTVStatusClass(templateOptions.data.status)">●</div>
            </template>
          </DxDataGrid>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0">
          <div class="timeline-container d-flex text-center ga-3 pa-3">
            <!-- <div class="d-flex align-center mr-4">
              <div class="d-flex ga-2">
                <input class="noticeList-datePicker" type="date" v-model="startDate" />
                <input class="noticeList-datePicker" type="date" v-model="endDate" />
                <i-btn @click="fetchPeriodPerformance" text="조회" height="43"></i-btn>
              </div>
            </div> -->
            <div
              v-for="(cctv, index) in formattedFileNames"
              v-key="index"
              class="d-flex pa-3 timeline-btn flex-grow-1 justify-center"
              :class="{ selected: selectedTimeLine == index }"
              @click="changeVideo(cctv.url, index)"
            >
              {{ cctv.fileName }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedRowKeys = ref([])
onMounted(() => {
  selectedRowKeys.value = [1]
  selectedTimeLine.value = 1
})

const vidoUrl = ''
const cctvList = ref([
  {
    id: 1,
    fileName: '24/07/01 00:00',
    url: 'https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4'
  },
  {
    id: 2,
    fileName: '24/07/01 02:00',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    id: 3,
    fileName: '24/07/01 04:00',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    id: 4,
    fileName: '24/07/01 06:00',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    id: 5,
    fileName: '24/07/01 08:00',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  },
  {
    id: 6,
    fileName: '24/07/01 10:00',
    url: 'https://videos.pexels.com/video-files/3075999/3075999-sd_640_360_30fps.mp4'
  },
  {
    id: 7,
    fileName: '24/07/01 12:00',
    url: 'https://videos.pexels.com/video-files/3075997/3075997-sd_640_360_30fps.mp4'
  },
  {
    id: 8,
    fileName: '24/07/01 14:00',
    url: 'https://videos.pexels.com/video-files/2231802/2231802-sd_640_360_30fps.mp4'
  },
  {
    id: 9,
    fileName: '24/07/01 16:00',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  },
  {
    id: 10,
    fileName: '24/07/01 18:00',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    id: 11,
    fileName: '24/07/01 20:00',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  },
  {
    id: 12,
    fileName: '24/07/01 22:00',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  },
  {
    id: 13,
    fileName: '24/07/01 11:40',
    url: 'https://videos.pexels.com/video-files/3058057/3058057-sd_640_360_30fps.mp4'
  },
  {
    id: 14,
    fileName: '24/07/01 11:50',
    url: 'https://videos.pexels.com/video-files/3840442/3840442-sd_640_360_30fps.mp4'
  },
  {
    id: 15,
    fileName: '24/07/01 12:00',
    url: 'https://videos.pexels.com/video-files/6595364/6595364-sd_640_360_24fps.mp4'
  },
  {
    id: 16,
    fileName: '24/07/01 12:10',
    url: 'https://videos.pexels.com/video-files/3864102/3864102-sd_640_360_30fps.mp4'
  }
])

const selectCCTV = (e) => {
  console.log('선택')
  console.dir(e)
  let id = e.currentSelectedRowKeys[0]
  selectedRowKeys.value = id
  if (id) {
    const newDate = `24/06/${String(id).padStart(2, '0')}`
    cctvList.value.forEach((item, index) => {
      const [date, time] = item.fileName.split(' ')
      item.fileName = `${newDate} ${time}`
    })

    selectedTimeLine.value = 0
    let url = cctvList.value.find((el) => el.id == id).url
    console.log(url)
    changeVideo(url, 0)
  }
}

const cctvs = ref([
  { id: 1, cctvName: 'CCTV 01', status: true, statusText: 'CONNECTED' },
  { id: 2, cctvName: 'CCTV 02', status: true, statusText: 'CONNECTED' },
  { id: 3, cctvName: 'CCTV 03', status: true, statusText: 'CONNECTED' },
  { id: 4, cctvName: 'CCTV 04', status: true, statusText: 'CONNECTED' },
  { id: 5, cctvName: 'CCTV 05', status: true, statusText: 'CONNECTED' },
  { id: 6, cctvName: 'CCTV 06', status: false, statusText: 'DISCONNECTED' },
  { id: 7, cctvName: 'CCTV 07', status: true, statusText: 'CONNECTED' },
  { id: 8, cctvName: 'CCTV 08', status: false, statusText: 'CONNECTED' },
  { id: 9, cctvName: 'CCTV 09', status: true, statusText: 'CONNECTED' },
  { id: 10, cctvName: 'CCTV 10', status: false, statusText: 'DISCONNECTED' },
  { id: 11, cctvName: 'CCTV 11', status: true, statusText: 'CONNECTED' },
  { id: 12, cctvName: 'CCTV 12', status: true, statusText: 'CONNECTED' },
  { id: 13, cctvName: 'CCTV 13', status: false, statusText: 'DISCONNECTED' },
  { id: 14, cctvName: 'CCTV 14', status: true, statusText: 'CONNECTED' },
  { id: 15, cctvName: 'CCTV 15', status: true, statusText: 'CONNECTED' },
  { id: 16, cctvName: 'CCTV 16', status: true, statusText: 'CONNECTED' }
])

const videoUrl = ref(cctvList.value[0].url)

const videoTest = ref()

const selectedTimeLine = ref()

const changeVideo = (url, index) => {
  console.log('클릭')
  console.log(url)
  console.dir(formattedFileNames)
  videoUrl.value = url
  // videoTest.value.currentSrc = url
  selectedTimeLine.value = index
  videoTest.value.load()

  console.dir(videoTest)
}

const formattedFileNames = computed(() =>
  cctvList.value.map((cctv) => ({ fileName: cctv.fileName.replace(/\s+/g, '\n'), url: cctv.url }))
)

const getCCTVStatusClass = (status) => {
  let colorClass = ''
  console.log(status)
  if (status) {
    colorClass = 'normal'
  } else {
    colorClass = 'danger'
  }

  return colorClass
}
</script>

<style scoped>
.cctvs-container {
  flex: 2 2 0;
}

.cctv-list-container {
  flex: 1 1 0;
}

.timeline-btn {
  background-color: #3b3b3f;
  border-radius: 4px;
  white-space: pre-wrap;
  text-align: center;
  align-items: center;
}

.timeline-container {
  background: #333334;
  overflow-x: scroll;
}

/* .timeline-container .timeline-btn:nth-child(3) {
  background: #5789fe;
} */

.selected {
  background: #5789fe;
}

.cctv-list-container thead {
  display: none;
}

#cctvGrid .dx-datagrid .dx-column-lines > td {
  border: 0px;
}

#cctvGrid tr:nth-child(odd) {
  background: #222224;
}

#cctvGrid tr {
  border-bottom: 1px solid #585a61;
}

#cctvGrid {
  height: 100%;
}

.video-container {
  flex: 3 3 0;
}

video {
  height: 100%;
  object-fit: fill;
}

#cctvGrid {
  /* margin-left: 20px;
  margin-right: 20px; */
  border: 1px solid #585a6187;
}
</style>
