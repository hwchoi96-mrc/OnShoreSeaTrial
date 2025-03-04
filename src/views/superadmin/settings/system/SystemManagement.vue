<template>
  <v-sheet class="settings-container d-flex flex-column ga-4 align-center rounded-lg ma-6 pa-6">
    <div class="d-flex justify-start text-left w-50 page-title">시스템 설정</div>
    <div class="d-flex justify-end w-50">
      <v-btn @click="updateSystemSettingData" text="저장" class="bg-btn"></v-btn>
    </div>
    <!-- 데이터 설정 영역 -->
    <v-sheet class="d-flex flex-column rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">데이터 설정</div>
      <!-- <div class="d-flex justify-space-between ga-2">
        <div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
          <div class="mr-4">데이터 갱신 시간</div>
          <div class="d-flex ga-4 align-center"><i-input></i-input> <spa<div class="outer-border d-flex flex-column align-center w-100 pa-3 ga-4 rounded-lg" style="border: 2px solid blue; padding: 1cm;">n>분</span></div>
        </div>
        <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
          <div class="mr-4">CCTV 삭제 주기</div>
          <div class="d-flex ga-4 align-center"><i-input></i-input><span>일</span></div>
        </div>
      </div> -->
      <v-row>
        <v-col>
          <div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">데이터 갱신 시간</div>
            <div class="d-flex ga-4 align-center">
              <i-input
                type="number"
                step="30"
                min="30"
                v-model="systemEditForm.dataRefreshInterval"
              ></i-input
              ><span>초</span>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">CCTV 삭제 주기</div>
            <div class="d-flex ga-4 align-center">
              <i-input
                type="number"
                step="30"
                min="30"
                v-model="systemEditForm.cctvRemoveInterval"
              ></i-input
              ><span>일</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <!-- 선박 충돌 회피 설정 영역 -->
    <v-sheet class="d-flex flex-column rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">선박 충돌 회피 설정</div>
      <v-row>
        <v-col>
          <div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">CPA</div>
            <!-- ClosetPointofApporach -->
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.cpaValue"></i-input><span>NM</span>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">TCPA</div>
            <!-- TimetoClosetPointofApporach -->
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.tcpaValue"></i-input><span>분</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <!-- 기상시뮬레이션 설정 영역 -->
    <v-sheet class="d-flex flex-column rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">기상시뮬레이션 설정</div>

      <!-- 풍향 / 풍속 -->
      <div class="wind-setting">
        <div class="setting-sub-title mb-2">풍향/풍속</div>
        <div class="d-flex ga-2">
          <div class="wind-setting-area d-flex justify-space-between align-center">
            <div class="wind-setting-area-title w-25 mr-2">길이</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.windLength"></i-input>
            </div>
          </div>
          <div class="wind-setting-area d-flex justify-space-between align-center">
            <div class="wind-setting-area-title w-25 mr-2">속도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.windSpeed"></i-input>
            </div>
          </div>
          <div class="wind-setting-area d-flex justify-space-between align-center">
            <div class="wind-setting-area-title w-25 mr-2">밀도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.windDensity"></i-input>
            </div>
          </div>
          <div class="wind-setting-area d-flex justify-space-between align-center">
            <div class="wind-setting-area-title w-25 mr-2">색상</div>
            <div class="d-flex ga-4 align-center wind-color">
              <i-input type="color" v-model="systemEditForm.windColor"></i-input>
            </div>
          </div>
        </div>
      </div>

      <div class="flow-setting">
        <div class="setting-sub-title mb-2">유향/유속</div>
        <div class="d-flex ga-2">
          <div class="flow-setting-area d-flex justify-space-between align-center">
            <div class="flow-setting-area-title w-25 mr-2">길이</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.flowLength"></i-input>
            </div>
          </div>
          <div class="flow-setting-area d-flex justify-space-between align-center">
            <div class="flow-setting-area-title w-25 mr-2">속도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.flowSpeed"></i-input>
            </div>
          </div>
          <div class="flow-setting-area d-flex justify-space-between align-center">
            <div class="flow-setting-area-title w-25 mr-2">밀도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.flowDensity"></i-input>
            </div>
          </div>
          <div class="flow-setting-area d-flex justify-space-between align-center">
            <div class="flow-setting-area-title w-25 mr-2">색상</div>
            <div class="d-flex ga-4 align-center flow-color">
              <i-input type="color" v-model="systemEditForm.flowColor"></i-input>
            </div>
          </div>
        </div>
      </div>

      <div class="flow-setting">
        <div class="setting-sub-title mb-2">파향/파주기</div>
        <div class="d-flex ga-2">
          <div class="delete-time-area d-flex justify-space-between align-center w-25">
            <div class="mr-2 w-25">길이</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.waveSpeed"></i-input>
            </div>
          </div>
          <div class="delete-time-area d-flex justify-space-between align-center w-25">
            <div class="mr-2 w-25">속도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.waveDensity"></i-input>
            </div>
          </div>
          <div class="delete-time-area d-flex justify-space-between align-center w-25">
            <div class="mr-2 w-25">밀도</div>
            <div class="d-flex ga-4 align-center">
              <i-input type="number" v-model="systemEditForm.waveColor"></i-input>
            </div>
          </div>
          <div class="w-25"></div>
        </div>
      </div>
    </v-sheet>
    <!--항적 설정 -->
    <v-sheet class="d-flex flex-column rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">항적 설정</div>
      <v-row>
        <v-col>
          <div class="refresh-time-area d-flex justify-space-between align-center">
            <div class="mr-4">과거항적색상</div>
            <div class="d-flex ga-4 align-center w-75">
              <i-input type="color" v-model="systemEditForm.pastVoyageColor"></i-input>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="delete-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">현재항적색상</div>
            <div class="d-flex ga-4 align-center w-75">
              <i-input type="color" v-model="systemEditForm.currentVoyageColor"></i-input>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <!-- 월드맵 설정 영역 -->
    <v-sheet class="rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">월드맵 설정</div>
      <div>
        <div>팝업창 투명도</div>
        <div>
          <v-slider
            class="opacity-slider"
            v-model="popupOpacity"
            :ticks="tickLabels"
            show-ticks="always"
            step="20"
            tick-size="5"
            @mouseup="inputHandleOpacity"
          ></v-slider>
        </div>
      </div>
    </v-sheet>
    <!-- CCTV 폴더 경로 설정 -->
    <v-sheet class="rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">CCTV 폴더 경로 설정</div>
      <v-row>
        <v-col>
          <div class="refresh-time-area d-flex justify-space-between align-center flex-grow-1">
            <div class="mr-4">최상위 폴더 경로</div>
            <div class="d-flex ga-4 align-center custom-width">
              <i-input type="text" v-model="systemEditForm.cctvPath" disabled></i-input>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useAdminStore } from '@/stores/adminStore'
import { useUserSettingStore } from '@/stores/userSettingStore'

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

const authStore = useAuthStore()
const adminStore = useAdminStore()
const userSettingsStore = useUserSettingStore()

const { userInfo } = storeToRefs(authStore)
const { dataIntervalAll } = storeToRefs(adminStore)
const { settingsForm } = storeToRefs(userSettingsStore)

const tickLabels = ref([0, 20, 40, 60, 80, 100])
let timer = null

const popupOpacity = ref()
const userId = ref()

onMounted(() => {
  fetchSettings()
})

const fetchSettings = () => {
  fetchSystemSettingData() //시스템 설정
  fetchPopupOpacitySetting() //투명도 설정
}

//시스템 설정
const systemEditForm = ref({
  cctvRemoveInterval: null,
  dataRefreshInterval: null,
  cpaValue: null,
  tcpaValue: null,
  windSpeed: null,
  windLength: null,
  windDensity: null,
  windColor: null,
  flowSpeed: null,
  flowLength: null,
  flowDensity: null,
  flowColor: null,
  waveColor: null,
  waveDensity: null,
  waveSpeed: null,
  pastVoyageColor: null,
  currentVoyageColor: null,
  cctvPath: 'http://172.16.181.14'
})

//시스템 설정 데이터 불러오기
const fetchSystemSettingData = async () => {
  await adminStore.fetchSystemSettingInfo()
  Object.keys(systemEditForm.value).forEach((key) => {
    systemEditForm.value[key] = getValueIntByKey(key)
  })
}
//키 값으로 데이터 가져오기
function getValueIntByKey(key) {
  const item = dataIntervalAll.value.find((item) => item.key === key)
  if (!item) return null

  if (item.valueInt !== null) {
    return item.valueInt
  } else if (item.valueString !== null) {
    return item.valueString
  } else if (item.valueFloat !== null) {
    return item.valueFloat
  }
}

//시스템 설정 데이터 수정하기
const updateSystemSettingData = async () => {
  //데이터갱신입력값 유효성 검사
  if (systemEditForm.value.dataRefreshInterval) {
    let remainder = parseInt(systemEditForm.value.dataRefreshInterval) % 30
    if (remainder != 0 || systemEditForm.value.dataRefreshInterval < 30) {
      showResMsg('30초 단위로 입력하여 주십시오')
      return
    }
  }
  //실수키
  const floatKeys = ['flowLength', 'windLength']
  //문자열키
  const stringKeys = [
    'windColor',
    'flowColor',
    'waveColor',
    'pastVoyageColor',
    'currentVoyageColor',
    'cctvPath'
  ]

  //색상입력값 유효성 검사
  const colorRegex = /^[a-zA-Z0-9#]+$/
  const colorKeys = ['windColor', 'flowColor', 'waveColor', 'pastVoyageColor', 'currentVoyageColor']
  const colorMessage = '#fff와 같이 입력하여 주십시오'
  for (const key of colorKeys) {
    const colorValue = systemEditForm.value[key]
    if (colorValue && !colorRegex.test(colorValue)) {
      showResMsg(colorMessage)
      return
    }
  }

  //객체만들기
  const formatDataForSpringBoot = () => {
    return Object.keys(systemEditForm.value).map((key) => {
      const value = systemEditForm.value[key]
      let valueInt = null
      let valueFloat = null
      let valueString = null

      //값 타입에 따라 테이블에 다르게 저장
      if (value) {
        if (stringKeys.includes(key)) {
          valueString = value
        } else if (floatKeys.includes(key)) {
          valueFloat = parseFloat(value)
        } else {
          valueInt = parseInt(value)
        }
      }
      return {
        key: key,
        valueInt: valueInt,
        valueString: valueString,
        valueFloat: valueFloat
      }
    })
  }
  const formattedData = formatDataForSpringBoot()
  await adminStore.updateSystemSettingInfo(formattedData)
}

//투명도 설정
const fetchPopupOpacitySetting = async () => {
  let curUserId = userInfo.value.userId
  userId.value = curUserId
  await userSettingsStore.fetchUserSettings(curUserId)
  popupOpacity.value = settingsForm.value.settingDataMap.popupOpacity
}

const inputHandleOpacity = (type) => {
  if (timer) {
    clearInterval(timer)
  }
  timer = setTimeout(saveSettingOpacity, 3000, type)
}

const saveSettingOpacity = async () => {
  let opacityEditForm = null
  opacityEditForm = {
    id: userId.value,
    settingDataMap: {
      popupOpacity: popupOpacity.value
    }
  }
  await userSettingsStore.editUserSettings(opacityEditForm)
}
</script>

<style lang="scss" scoped>
.settings-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 24px);
  overflow: auto;
}

.setting-title {
  font-size: 1.2rem;
}

.setting-sub-title {
  font-size: 1rem;
}

.page-title {
  font-size: 1.3rem;
  line-height: 1;
}

.custom-width {
  width: 500px;
}

.wind-setting-area,
.flow-setting-area {
  width: 25%;

  > .wind-color {
    width: 75%;
  }

  .flow-color {
    width: 75%;
  }

  .wind-setting-area-title,
  .flow-setting-area-title {
    text-align: center;
  }
}
</style>
