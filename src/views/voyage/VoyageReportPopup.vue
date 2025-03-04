<template>
  <v-dialog
    model-value="isOpenVoaygeReport"
    width="900"
    height="3000"
    class="voyage-report-detail-container"
    :scrim="false"
  >
    <v-card class="page rounded-lg">
      <slot name="header">
        <div class="d-flex justify-end">
          <!-- 닫기 버튼 -->
          <v-btn
            :color="closeIconColor"
            class="d-flex justify-center text-center"
            variant="plain"
            append-icon="mdi-close"
            @click="$emit('close')"
          >
          </v-btn>
        </div>
        <div class="d-flex justify-end mt-4 pr-4 pb-4">
          <i-btn text="download" class="px-4" width="120" @click="download"></i-btn>
        </div>
      </slot>
      <slot name="text">
        <div
          fluid
          class="h-100 management-page detail-page voyage-report-detail overflow-auto px-4 py-2"
          id="report"
          ref="contentToCapture"
        >
          <v-row class="ma-0 d-flex align-center report-header">
            <v-col cols="3" class="pl-0">
              <div class="d-flex justify-start">
                <v-img :src="reportLogo" />
              </div>
            </v-col>
            <v-col cols="6">
              <div class="d-flex justify-center" style="font-size: 1.5rem">Voyage Report</div>
            </v-col>
            <v-col cols="3">
              <div class="d-flex flex-column align-end justify-center">
                <div>Issued Date</div>
                <div>2024.03.24</div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <!-- Ship Information -->
              <div id="test3">
                <v-sheet>
                  <div class="report-sub-title">Ship Information</div>
                  <v-data-table
                    :headers="shipInfoHeaders"
                    :items="shipInformation"
                    :hide-default-footer="true"
                  >
                    <template #bottom></template>
                  </v-data-table>
                </v-sheet>
                <!-- Voyage Route -->
                <v-sheet class="mt-4" color="#212121">
                  <div class="report-sub-title">Voyage Route</div>
                  <v-data-table :headers="voyageRouteHeaders" :items="voyageRoute">
                    <template #bottom></template>
                  </v-data-table>
                  <div class="voyage-route mt-4">
                    <v-img :src="voyageRouteImg" style="height: 250px" />
                  </div>
                </v-sheet>
                <!-- Performance Summary -->
                <v-sheet class="mt-4" color="#212121">
                  <div class="report-sub-title">Performance Summary</div>
                  <v-data-table
                    :headers="performanceSummaryHeaders"
                    :items="performanceSummary"
                    :hide-default-footer="true"
                    item-key="name"
                  >
                    <template v-slot:headers="{ columns }">
                      <tr class="text-center">
                        <th class="text-center" :rowspan="2">
                          Hour <br />
                          (hours)
                        </th>
                        <th class="text-center" :rowspan="2">
                          Distance <br />
                          (nm)
                        </th>
                        <th class="text-center" :rowspan="2">
                          Avg.Speed <br />
                          (kn)
                        </th>
                        <th
                          class="text-center"
                          :colspan="usedFuels.length"
                          style="border-bottom: 1px solid #4d4d4d"
                        >
                          FOC (mt)
                        </th>
                        <th class="text-center" :rowspan="2">
                          EEOI <br />
                          (10<sup>-6</sup>)
                        </th>
                      </tr>
                      <tr class="text-center">
                        <th class="text-center" v-if="isHFOVisible">HFO</th>
                        <th class="text-center" v-if="isLFOVisible">LFO</th>
                        <th class="text-center" v-if="isMDOMGOVisible">MDO/MGO</th>
                        <th class="text-center" v-if="isLPGPVisible">LPG(P)</th>
                        <th class="text-center" v-if="isLPGBVisible">LPG(B)</th>
                        <th class="text-center" v-if="isLNGVisible">LNG</th>
                        <th class="text-center" v-if="isMETHANOLVisible">METHANOL</th>
                        <th class="text-center" v-if="isETHANOLVisible">ETHANOL</th>
                      </tr>
                    </template>
                    <template v-slot:item="{ item }">
                      <tr>
                        <td v-for="(value, key) in item" class="text-center">
                          {{ value }}
                        </td>
                      </tr>
                    </template>
                    <template #bottom></template>
                  </v-data-table>
                </v-sheet>

                <!-- Engine Performance -->
                <v-sheet class="mt-4" color="#212121">
                  <div class="report-sub-title">Engine Performance</div>
                  <v-data-table
                    :headers="enginePerformaceHeader"
                    :items="enginePerformance"
                    :hide-default-footer="true"
                  >
                    <template #bottom></template>
                  </v-data-table>
                  <Echart :option="heatmapOption" class="w-100" style="height: 300px" />
                </v-sheet>
                <!-- Co2 Emission -->
                <v-sheet class="mt-4" color="#212121">
                  <div class="report-sub-title">CO2 Emission</div>
                  <v-data-table
                    :headers="emissionHeaders"
                    :items="emissionList"
                    :hide-default-footer="true"
                  >
                    <template v-slot:item="{ item }">
                      <tr class="text-center">
                        <td v-for="(key, value) in item">{{ key }}</td>
                      </tr>
                    </template>
                    <template #bottom></template>
                  </v-data-table>
                </v-sheet>
              </div>
            </v-col>
          </v-row>
        </div>
      </slot>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { convertDateType, isValidDateRange, addDay } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'
import { useShipStore } from '@/stores/shipStore'
import { useVoyageStore } from '@/stores/voyageStore'
import { insertVoyage, updateVoyage, updateVoyageInfo, getVoyageReport } from '@/api/voyage'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

import Echart from '@/components/echart/Echarts.vue'

import voyageRouteImg from '/images/ins/ecdis.png'
import reportLogo from '/images/logo/report-logo.png'

const shipStore = useShipStore()
const { usedFuels } = storeToRefs(shipStore)

const contentToCapture = ref(null)

const props = defineProps({
  isOpenVoaygeReport: {
    type: Boolean
  },
  voyageId: {
    type: [Number, String],
    default: null
  },
  imoNumber: {
    type: [String]
  }
})

/**
 * 사용 연료별 보이기 여부를 결정하는 변수
 */
const isHFOVisible = computed(() => usedFuels.value.length !== 0 && usedFuels.value.includes('HFO'))
const isLFOVisible = computed(() => usedFuels.value.length !== 0 && usedFuels.value.includes('LFO'))
const isMDOMGOVisible = computed(
  () =>
    (usedFuels.value.length !== 0 && usedFuels.value.includes('MDO')) ||
    usedFuels.value.includes('MGO')
)
const isLPGPVisible = computed(
  () => usedFuels.value.length !== 0 && usedFuels.value.includes('LPGP')
)
const isLPGBVisible = computed(
  () => usedFuels.value.length !== 0 && usedFuels.value.includes('LPGB')
)
const isLNGVisible = computed(() => usedFuels.value.length !== 0 && usedFuels.value.includes('LNG'))
const isMETHANOLVisible = computed(
  () => usedFuels.value.length !== 0 && usedFuels.value.includes('METHANOL')
)
const isETHANOLVisible = computed(
  () => usedFuels.value.length !== 0 && usedFuels.value.includes('ETHANOL')
)
const isFocVisible = computed(() => usedFuels.value.length === 0)

const emissions = ref([])

const fetchVoyageReport = async () => {
  let imoNumber = props.imoNumber
  let id = props.voyageId

  await shipStore.fetchShipMachineInfo(imoNumber)

  console.log('사용 연료')
  console.dir(usedFuels.value)

  console.log('isHFOVisible')
  console.log(isHFOVisible)

  const requestform = {
    imoNumber,
    id
  }

  console.log('imoNumber , id')
  console.log(imoNumber, id)

  const {
    data: { data }
  } = await getVoyageReport(requestform)

  console.log('Voyage Report')
  console.dir(data)

  if ('shipInformation' in data) {
    console.log('선박 정보')
    console.dir(data.shipInformation)
    shipInformation.value = [{ ...data.shipInformation }]
  }

  if ('voyageRoute' in data) {
    voyageRoute.value = [{ ...data.voyageRoute }]
  }

  if ('performanceSummary' in data) {
    // performanceSummary.value['MDO_MGO'] = data.performanceSummary.focMap['MDO/MGO']
    const { hour, distance, avgSpeed, focMap, eeoi } = data.performanceSummary
    let data2 = [{ hour, distance, avgSpeed, ...focMap, eeoi }]

    console.log('키 값')
    console.dir(Object.keys(data2[0]))

    Object.keys(data2[0]).forEach((el) => {
      console.log('키 값')
      console.dir(el)
    })

    console.log('MDO MGO 히든?')
    console.log(isMDOMGOVisible)

    performanceSummary.value = data2
  }

  if ('enginePerformanceMap' in data) {
    const { enginePerformanceMap } = data
    const enginePerformances = Object.keys(enginePerformanceMap).map((el) => {
      let performance = enginePerformanceMap[el]
      return {
        ...performance,
        runningHour: parseFloat(performance.runningHour).toFixed(1),
        power: parseFloat(performance.power).toFixed(1),
        avgSpeed: parseFloat(performance.avgSpeed).toFixed(1),
        avgLoad: parseFloat(performance.avgLoad).toFixed(1)
      }
    })
    enginePerformance.value = enginePerformances
  }

  if ('mainEngineHeatmap' in data) {
    const {
      mainEngineHeatmap: { mainEngineLoadList, vesselSpeedList, heatMap }
    } = data

    console.log('히트맵 데이터')
    console.dir(heatMap)

    const heatmapData = heatMap.map((item) => [item[1], item[0], item[2] || '-'])

    console.dir(heatmapData)

    heatmapOption.value.xAxis.data = mainEngineLoadList
    heatmapOption.value.yAxis.data = vesselSpeedList
    heatmapOption.value.series[0].data = heatmapData
  }

  if ('co2EmissionMap' in data) {
    const { co2EmissionMap } = data
    emissions.value = co2EmissionMap

    console.log('배출량')
    console.dir(emissions)
  }

  console.log('선박 사용 연료')
  console.dir(usedFuels)

  console.log('isLNGVisible')
  console.log(isLNGVisible)
  console.log('isMDOMGOVisible')
  console.log(isMDOMGOVisible)

  // displayColumn()
}

// const displayColumn = () => {
//   if (usedFuels.value.length == 0) {
//     return
//   } else {
//     console.dir(usedFuels)
//     isFocVisible.value = true
//     isHFOVisible.value = usedFuels.value.includes('HFO')
//     console.log('HFO')
//     console.log(isHFOVisible.value)
//     isLFOVisible.value = usedFuels.value.includes('LFO')
//     console.log('LFO')
//     console.log(isHFOVisible.value)
//     isMDOMGOVisible.value = usedFuels.value.includes('MDO/MGO')
//     console.log('MDO/MGO')
//     console.log(isHFOVisible.value)
//     isLPGVisible.value = usedFuels.value.includes('LPG')
//     isLNGVisible.value = usedFuels.value.includes('LNG')
//   }
// }

const voyageReport = ref()

const shipInfoHeaders = [
  {
    title: 'Ship Name',
    key: 'shipName'
  },
  {
    title: 'IMO No.',
    key: 'imoNumber'
  },
  {
    title: 'Ship Type',
    key: 'shipType'
  },
  {
    title: 'Flag',
    key: 'flag'
  },
  {
    title: 'GRT',
    key: 'grt'
  },
  {
    title: 'DWT',
    key: 'dwt'
  }
]

const voyageRouteHeaders = [
  { title: '', key: 'location' },
  {
    title: 'From',
    key: 'locationFrom'
  },
  {
    title: 'To',
    key: 'locationTo'
  }
]

const shipInformation = ref([
  {
    shipName: '',
    imoNumber: '',
    shipType: '',
    flag: '',
    grt: 0,
    dwt: 0
  }
])

const voyageRoute = ref([
  {
    location: 'Location',
    locationFrom: '',
    locationTo: ''
  }
])

const performanceSummaryHeaders = [
  { title: 'Hour (Hours)', key: 'hour' },
  { title: 'Distance (NM)', key: 'distance' },
  { title: 'Avg.Speed (KN)', key: 'avgSpeed' },
  {
    title: 'FOC (M/T)',
    align: 'center',
    children: [
      { title: 'HFO', key: 'HFO' },
      { title: 'LFO', key: 'LFO' },
      { title: 'MDO/MGO', key: 'MDO/MGO' },
      { title: 'LPGP', key: 'LPGP' },
      { title: 'LPGB', key: 'LPGB' },
      { title: 'LNG', key: 'LNG' },
      { title: 'METHANOL', key: 'METHANOL' },
      { title: 'ETHANOL', key: 'ETHANOL' }
    ]
  },
  { title: 'EEOI', key: 'eeoi' }
]

const performanceSummary = ref([
  {
    hour: 0,
    distance: 0,
    avgSpeed: 0,
    HFO: 0,
    LPG: 0,
    LFO: 0,
    LNG: 0,
    MDO_MGO: 0,
    eeoi: 0
  }
])

const enginePerformaceHeader = [
  {
    title: 'Equipment',
    key: 'equipment',
    align: 'center'
  },
  {
    title: 'Running Hour',
    key: 'runningHour',
    align: 'center'
  },
  {
    title: 'Power (kW)',
    key: 'power',
    align: 'center'
  },
  {
    title: 'Avg.RPM (rpm)',
    key: 'avgSpeed',
    align: 'center'
  },
  {
    title: 'Avg.Load(%)',
    key: 'avgLoad',
    align: 'center'
  }
]

const enginePerformance = ref([])

const machineryStatus = [
  {
    title: 'Engine Speed',
    key: 'engineSpeed'
  },
  {
    title: 'T/C Speed',
    key: 'tcSpeed'
  },
  {
    title: 'Pmax & Pcomp',
    key: 'pmaxPcomp'
  },
  {
    title: 'Cyl Outlet Exh.Gas Temp',
    key: 'cylOutlet'
  },
  {
    title: 'T/C Inlet Exh. Gas Temp',
    key: 'tcInletExhGasTemp'
  },
  {
    title: 'T/C Outlet Exh. Gas Temp',
    key: 'tcOutlet'
  },
  {
    title: 'Ovarall Status',
    key: 'ovarallStatus'
  }
]

const heatmapOption = ref({
  grid: {
    top: '10%',
    left: '10%',
    right: '0'
  },
  xAxis: {
    type: 'category',
    data: [],
    interval: 10,
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    data: [],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    max: 10,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%',
    inRange: {
      color: ['#FFFFFF', '#D25751']
    },
    textStyle: {
      color: '#fff'
    }
  },
  series: [
    {
      name: 'Engine Performance',
      type: 'heatmap',
      data: [],
      label: { show: true },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

let initPage

const printReport = () => {
  var frame = document.getElementById('report')

  frame.focus()
  frame.contentWindow.print()
}

const download = async () => {
  await nextTick()

  if (!contentToCapture.value) return

  console.log('pdf')

  console.dir(contentToCapture.value)

  const test = document.querySelector('#report')

  console.assert('report 높이')
  console.log(test.scrollHeight)
  test.scrollTo(0, 0)

  try {
    // const totalCanvas = await html2canvas(test, {})
    const canvas = await html2canvas(test, {
      backgroundColor: '#212121',

      // windowWidth: contentToCapture.value.innerWidth,
      // windowHeight: contentToCapture.value.innerHeight
      //이미지 종료 y좌표
      //height: 3000,
      // scrollX: -window.scrollX,
      width: test.scrollWidth,
      height: test.scrollHeight,
      windowWidth: test.scrollWidth,
      windowHeight: test.scrollHeight
    })

    // window.open(canvas.toDataURL())

    // 이미지 데이터 추출

    const imgData = canvas.toDataURL('image/png')

    // jsPDF 설정
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const imgProps = pdf.getImageProperties(imgData)
    const imgWidth = pdfWidth
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width

    const totalPages = Math.ceil(imgHeight / pdfHeight)

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage()
      }

      const pageHeight = pdfHeight * i
      pdf.addImage(imgData, 'PNG', 0, -pageHeight, imgWidth, imgHeight)
    }
    window.open(pdf.output('bloburl'))

    // const dialogElement = this.$refs.dialog
    // const totalHeight = test.scrollHeight
    // const pdf = new jsPDF()
    // let currentY = 0

    // const captureAndAddImage = () => {
    //   html2canvas(test).then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png')
    //     pdf.addImage(imgData, 'PNG', 0, currentY)
    //     currentY += canvas.height

    //     if (currentY < totalHeight) {
    //       test.scrollTop += canvas.height
    //       captureAndAddImage()
    //     } else {
    //       // pdf.save('my-pdf.pdf')
    //       window.open(pdf.output('bloburl'))
    //     }
    //   })
    // }

    // captureAndAddImage()

    // pdf.save('capture.pdf')
    // var imgWidth = 210
    // var pageHeight = 297

    // console.log('캔버스 높이')
    // console.log(canvas.height)

    // var imgHeight = (canvas.height * imgWidth) / canvas.width
    // var heightLeft = imgHeight

    // var doc = new jsPDF('p', 'mm', 'a4')
    // var position = 0
    // var pageData = canvas.toDataURL('image/jpeg', 1.0)
    // var imgData = encodeURIComponent(pageData)

    // window.open(imgData)

    // doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    // // doc.setLineWidth(5)
    // doc.setDrawColor(255, 255, 255)
    // doc.setFillColor('#212121')
    // doc.rect(0, 0, 210, 295)
    // heightLeft -= pageHeight

    // while (heightLeft >= 0) {
    //   position = heightLeft - imgHeight
    //   doc.addPage()
    //   doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    //   // doc.setLineWidth(5)
    //   // doc.setDrawColor(255, 255, 255)
    //   doc.rect(0, 0, 210, 295)
    //   heightLeft -= pageHeight
    // }
    // window.open(doc.output('bloburl'))
  } catch (error) {
    console.error('Error generating PDF:', error)
  }

  // html2canvas을 사용하여 캡처
  // const canvas = await html2canvas(contentToCapture.value)
  // console.log('canvas', canvas.height)
  // const imgData = canvas.toDataURL('image/png')

  // // jsPDF를 사용하여 PDF 생성
  // const pdf = new jsPDF()
  // const imgProps = pdf.getImageProperties(imgData)
  // const pdfWidth = pdf.internal.pageSize.getWidth()
  // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  // pdf.save('capture.pdf')

  // printReport()
  // const doc = new jsPDF()

  // console.log('레포트')
  // console.dir(voyageReport.value)
  // const html2 = document.querySelector('#report')

  // const canvas = await html2canvas(html2, () => {
  //   // document.body.appendChild(canvas);
  //   var imgData = canvas.toDataURL('image/png')

  //   var imgWidth = 190 // 이미지 가로 길이(mm) / A4 기준 210mm
  //   var pageHeight = imgWidth * 1.414 // 출력 페이지 세로 길이 계산 A4 기준
  //   var imgHeight = (canvas.height * imgWidth) / canvas.width
  //   var heightLeft = imgHeight
  //   var margin = 10 // 출력 페이지 여백설정
  //   var doc = new jsPDF('p', 'mm')
  //   var position = 0

  //   // 첫 페이지 출력
  //   doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
  //   heightLeft -= pageHeight

  //   // 한 페이지 이상일 경우 루프 돌면서 출력
  //   while (heightLeft >= 20) {
  //     position = heightLeft - imgHeight
  //     doc.addPage()
  //     doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  //     heightLeft -= pageHeight
  //   }

  //   // 파일 저장
  //   doc.save('file-name.pdf')
  //   // window.open(doc.output('bloburl'))
  // })

  // // const img = canvas.toDataURL('image/jpeg')

  // // doc.addImage(img, 'JPEG', 0, 0)
  // // window.open(doc.output('bloburl'))
  // // doc.save('test.pdf')
}

const emissionHeaders = computed(() => {
  const emissionHeader =
    Object.keys(emissions.value).map((el) => ({ title: el, align: 'center', value: el })) || []

  console.log('헤더')
  console.dir(emissionHeader)
  return emissionHeader
})

const emissionList = computed(() => {
  //let emissionValue = Object.keys(emissions.value).map((el) => ({ el: emissions.value[el] })) || []

  let emissionValues = [{}]
  // for (const [key, value] of Object.entries(emissions.value)) {
  //   emissionValues[0][key] = value
  // }

  // console.log('Em')
  // console.dir(emissionValues)
  // return emissionValues

  for (const [key, value] of Object.entries(emissions.value)) {
    let newKey = key
    if (key.includes('\/')) {
      console.log('특수문자 포함')
      newKey = `${key}`
    }

    emissionValues[0][newKey] = value
  }

  console.log('CO2 배출량')
  console.dir(emissionValues)

  return emissionValues || []
})

// const emissionList = [
//   {
//     key: 'G/E 1',
//     noxTotal: 27.3,
//     coTotal: 0,
//     ch4Total: 0,
//     co2Total: 0,
//     so2Total: 682
//   },
//   {
//     key: 'G/E 2',
//     noxTotal: 27.3,
//     coTotal: 0,
//     ch4Total: 0,
//     co2Total: 0,
//     so2Total: 682
//   }
// ]

watch(() => props.voyageId, fetchVoyageReport)
</script>

<style lang="scss" scoped>
input[type='date'] {
  border: 1px solid #49494e;
  padding: 5px;
  border-radius: 8px;
  /* cursor: default; */
  font-size: 1rem;
}
.title {
  font-size: 1.2em;
}

.cargoCapacityContainer {
  background-color: #111115;
}

.v-btn.inactive {
  background-color: #111115;
  color: #ffffff80;
}

.v-btn.active {
  color: #fff;
}

#voyageGrid tr.dx-row.dx-data-row > td {
  height: 45px;
}

.report-container {
  height: calc(100vh - 65px - 32px);
}

/* #voyageGrid {
  height: calc(100% - 60px);
} */

.v-btn--icon.v-btn--density-default.actionBtn {
  width: 35px;
  height: 35px;
  /* padding: 4px; */
}

.actionBtn i {
  font-size: 20px;
}

.voyage-route {
  .v-img__img--contain {
    object-fit: fill;
  }
}

.report {
  page: a4sheet;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  margin: 10mm auto;
  border-radius: 5px;
  /* background: white; */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

@page a4sheet {
  size: A4;
  margin: 0;
}
@media print {
  .report {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}

.report-header {
  height: 80px;
  align-content: center;
}

.report-sub-title {
  font-size: 1.1rem;
  margin-bottom: 8px;
}
</style>
