<template>
  <v-container fluid class="rounded-lg detail-page ins-content-container pa-0">
    <!-- test10 -->
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="4">
            <div class="mt-3">
              <div class="d-flex justify-end ga-2 mb-3">
                <i-btn text="DECK 추가" @click="showAddModal" color="#3D3D40"></i-btn>
                <i-btn text="DECK 삭제" color="#F04A4A" @click="showDeleteModal"></i-btn>
                <i-btn
                  text="데크 이미지 등록"
                  @click="uploadDeckImage"
                  color="#3D3D40"
                  width="120"
                ></i-btn>
                <input
                  ref="deckImageUploader"
                  type="file"
                  @change="saveDeckFloorPlan"
                  class="d-none"
                  accept=".gif, .jpg, .png"
                />
              </div>

              <!-- Deck 목록 -->
              <DxDataGrid
                id="deckGrid"
                ref="deckGrid"
                key-expr="id"
                :data-source="deckList"
                :selected-row-keys="selectedDeckKey"
                :show-borders="true"
                :column-auto-width="true"
                class="decks-container no-stripe"
                @row-click="clickDeckName"
                style="height: 300px"
              >
                <DxSelection mode="single"></DxSelection>
                <DxScrolling mode="virtual" />
                <DxColumn
                  data-field="deckName"
                  caption="Deck"
                  alignment="center"
                  :allow-editing="false"
                ></DxColumn>
              </DxDataGrid>
            </div>
          </v-col>
          <v-col cols="8">
            <v-sheet color="#333334" class="h-100 rounded-lg" height="300">
              <div class="d-flex justify-center align-center mt-3 h-100">
                <v-sheet
                  class="w-100 image-container"
                  v-if="deckfloorplan"
                  style="position: relative"
                  height="300"
                >
                  <v-img :src="deckfloorplan" class="deck-image w-100 h-100" />
                  <div
                    v-for="icon in icons"
                    :key="icon.id"
                    class="icon"
                    :style="{ top: `${icon.posY}%`, left: `${icon.posX}%` }"
                    :data-id="icon.id"
                  >
                    <div class="sensor-icon" />
                  </div>
                </v-sheet>
                <div class="" v-else>선택한 Deck에 등록된 도면 이미지가 없습니다</div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="pb-0">
            <div class="d-flex justify-end ga-2 mb-3">
              <i-btn
                text="센서 추가"
                @click="addNewSensor('SensorRegisterForm')"
                color="#3D3D40"
              ></i-btn>
              <i-btn text="센서 삭제" color="#F04A4A" @click="showSensorDeleteModal"></i-btn>
            </div>
            <div>
              <DxDataGrid
                id="sensorGrid"
                ref="sensorGrid"
                key-expr="id"
                @row-click="getSensorInfo"
                :data-source="sensorList"
                :column-auto-width="true"
                :show-borders="true"
                class="no-stripe sensors-container"
              >
                <DxSelection mode="single"></DxSelection>
                <DxScrolling mode="virtual" />
                <DxColumn
                  data-field="deck"
                  caption="Deck"
                  alignment="center"
                  :allow-editing="false"
                ></DxColumn>
                <DxColumn
                  data-field="installationLocation"
                  caption="Installation Location"
                  alignment="center"
                  :allow-editing="false"
                />
                <DxColumn
                  data-field="sensorType"
                  caption="Sensor Type"
                  alignment="center"
                  :allow-editing="false"
                  width="10%"
                />

                <DxColumn
                  data-field="id"
                  caption="Sensor No"
                  alignment="center"
                  :allow-editing="false"
                ></DxColumn>

                <DxColumn
                  data-field="posX"
                  caption="X"
                  alignment="center"
                  width="auto"
                  :allow-editing="false"
                />

                <DxColumn
                  data-field="posY"
                  caption="Y"
                  alignment="center"
                  width="auto"
                  :allow-editing="false"
                />
              </DxDataGrid>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="pr-0 pb-0 tabs-inner-content-container">
        <v-sheet class="rounded-lg h-100" color="#333334">
          <component
            ref="form"
            style="height: 100%; max-height: calc(100%)"
            :is="componentList[currentComponent]"
            :deckName="selectedDeckName"
            :sensorListLength="sensorListLength"
            :sensorNo="selectSensorNo"
            :selectedTagId="selectedTagId"
            @resetComponent="resetComponent"
            @updatePos="updatePos"
          />
        </v-sheet>
        <!-- <SensorRegisterForm v-if="isShow" ref="registerForm" @updatePos="updatePos" /> -->
      </v-col>
    </v-row>
    <!--  데크 추가 팝업창 -->
    <AppModal v-model="isShowAddModal" @close="closeAddModal" title="데크 등록">
      <template #default>
        <i-input
          bgColor="#F1F1F9"
          label="그룹명"
          v-model="newDeckName"
          placehoder="데크명을 입력해주세요"
        ></i-input>
      </template>

      <template #actions>
        <i-btnGroup type="add" @close="closeAddModal" @add="registerNewDeck"></i-btnGroup>
      </template>
    </AppModal>

    <!-- 데크 삭제 팝업창 -->
    <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">
      <template #default>
        <p>정말로 Deck를 삭제하시겠습니까?</p>
      </template>
      <template #actions>
        <i-btnGroup type="confirm" @close="closeDeleteModal" @confirm="removeDeck"></i-btnGroup>
      </template>
    </AppModal>

    <!-- 센서 삭제 팝업창 -->
    <AppModal v-model="isShowSensorDeleteModal" @close="closeSensorDeleteModal">
      <template #default>
        <p>정말로 선택한 센서를 삭제하시겠습니까?</p>
      </template>
      <template #actions>
        <i-btnGroup
          type="confirm"
          @close="closeSensorDeleteModal"
          @confirm="removeFDSSensor"
        ></i-btnGroup>
      </template>
    </AppModal>
  </v-container>
  <!-- 선박 데크 수정 영역 -->
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore'
import { useFdsStore } from '@/stores/fdsStore'
import { useToast } from '@/composables/useToast'
import { isStatusOk } from '@/composables/util'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'
import {
  registerDeck,
  deleteDeck,
  updateDeckImage,
  getDeckList,
  getDeckImage,
  deleteFDSSensor,
  getFDSSensorList
} from '@/api/fdsApi'

import SensorRegisterForm from '@/views/fds/SensorRegisterForm.vue'
import SensorEditForm from '@/views/fds/SensorEditForm.vue'
import AppModal from '@/components/modal/AppModal.vue'

import NoSelectSensor from '@/components/NoSelectSensor.vue'

const shipStore = useShipStore()
const { curSelectedShip } = storeToRefs(shipStore)

const fdsStore = useFdsStore()
const { sensorForm } = storeToRefs(fdsStore)

const { showResMsg } = useToast()

const currentComponent = ref('NoSelectSensor')
const componentList = {
  NoSelectSensor,
  SensorRegisterForm,
  SensorEditForm
}

const deckGrid = ref()
const deckGridInstance = ref()

const sensorGrid = ref()
const selectedDeckKey = ref([])
const sensorListLength = ref([])
const selectSensorNo = ref(null)
const selectedTagId = ref(null)

const newDeckName = ref('')

const deckImageUploader = ref()
const deckfloorplan = ref()

const regacyIcons = ref([])
const icons = ref([])

const isShow = ref(false)

const isShowAddModal = ref(false)
const isShowDeleteModal = ref(false)
const showAddModal = () => {
  if (curSelectedShip.value.imoNumber) {
    isShowAddModal.value = true
  } else {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
  }
}
const closeAddModal = () => {
  isShowAddModal.value = false
}
const showDeleteModal = () => {
  let selectedDeckLength = selectedDeckKey.value.length
  let deckName = clickedDeckName.value
  if (deckName != null) {
    isShowDeleteModal.value = true
  } else {
    showResMsg('Deck를 선택해주세요')
  }
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

const isShowSensorDeleteModal = ref()

const showSensorDeleteModal = () => {
  let selectedDeckLength = selectedDeckKey.value

  if (selectedTagId.value) {
    isShowSensorDeleteModal.value = true
  } else {
    showResMsg('센서를 선택해주세요')
  }
}
const closeSensorDeleteModal = () => {
  isShowSensorDeleteModal.value = false
}

const selectedDeckName = ref(null)
let curSelectedShipImoNumber = null

const changeComponent = (name, ...etcParameter) => {
  const instance = getDxGridInstance(sensorGrid)
  let deckName = selectedDeckName.value

  if (etcParameter.length != 0) {
    selectSensorNo.value = etcParameter[0].id
    selectedTagId.value = etcParameter[0].tagId
  }

  if (!deckName) {
    showResMsg('Deck를 선택해주세요')
    return
  }

  currentComponent.value = name

  if (name != 'SensorEditForm') {
    instance.clearSelection()
  }

  if (name == 'SensorRegisterForm') {
    createIcon()
  }
}

const addNewSensor = (name) => {
  const instance = getDxGridInstance(sensorGrid)

  let deckName = selectedDeckName.value
  isShow.value = true

  if (!deckName) {
    showResMsg('Deck를 선택해주세요')
    return
  }

  currentComponent.value = name

  instance.clearSelection()

  createIcon()
}

const resetComponent = async () => {
  let name = 'NoSelectSensor'
  currentComponent.value = name

  await fetchFDSSensorList()
  dxGridRefresh(sensorGrid)
}

const deckList = ref()
const sensorList = ref()

const registerNewDeck = async () => {
  let deckName = newDeckName.value
  let curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  if (deckName != null && deckName != '') {
    const { status } = await registerDeck(curSelectedShipImoNumber, deckName)
    console.log(status)
    if (isStatusOk(status)) {
      isShowAddModal.value = false
      newDeckName.value = null
      fetchDeckList()
      resetDeckName()
      let name = 'NoSelectSensor'
      currentComponent.value = name
    }
  } else {
    showResMsg('데크명을 입력해주세요')
  }
}

const fetchDeckList = async () => {
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  deckfloorplan.value = null
  selectedDeckKey.value = []
  clickedDeckName.value = null
  sensorList.value = null
  if (!curSelectedShipImoNumber) {
    showResMsg('선택한 선박이 없습니다. 선박명을 클릭해주세요')
    return
  }
  const {
    status,
    data: { data }
  } = await getDeckList(curSelectedShipImoNumber)

  if (isStatusOk(status)) {
    if (status == 204) {
      deckList.value = []
      return
    }
    deckList.value = data
  }
}

const clickedDeckName = ref()
const clickDeckName = async (e) => {
  console.log('clickDeckName')
  console.dir(e)
  // selectedDeckKey.value = [e.key]
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber

  // if (e.selectedRowsData[0].deckName == null || e.selectedRowsData[0].deckName == undefined) {
  //   return
  // }

  clickedDeckName.value = e.data.deckName
  let deckName = clickedDeckName.value

  const status = await fetchFDSSensorList()
  if (isStatusOk(status)) {
    selectedDeckName.value = deckName
    deckfloorplan.value = await fetchDeckImage(deckName)
  }

  resetComponent()
}

const fetchFDSSensorList = async () => {
  let deckName = clickedDeckName.value
  const {
    status,
    data: { data }
  } = await getFDSSensorList(curSelectedShipImoNumber, deckName)

  if (isStatusOk(status)) {
    console.log('Status')
    console.log(deckName)
    sensorList.value = data

    console.log('데이터')
    console.dir(data)
    if (sensorList.value.length > 0) {
      sensorListLength.value = data.length
    } else {
      sensorListLength.value = 0
    }

    icons.value = data
    regacyIcons.value = JSON.parse(JSON.stringify(data))
  }

  return status
}

const fetchDeckImage = async (deckName) => {
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  let deckImageUrl = null
  let {
    data: {
      data: { deckImage }
    }
  } = await getDeckImage(curSelectedShipImoNumber, deckName)

  if (deckImage) {
    deckImageUrl = `data:image/png;base64,${deckImage}`
  }

  return deckImageUrl
}

const uploadDeckImage = () => {
  // if()
  let deckName = clickedDeckName.value
  if (deckName != null) {
    deckImageUploader.value.click()
  } else {
    showResMsg('Deck를 선택해주세요')
  }
}

const saveDeckFloorPlan = async (e) => {
  curSelectedShipImoNumber = curSelectedShip.value.imoNumber
  let deckName = clickedDeckName.value

  let deckImage = e.target.files[0]

  let { imageWidth, imageHeight } = await getImageWidthHeight(e)

  let reader = new FileReader()

  if (deckImage != null) {
    reader.onload = async (e) => {
      let convertedImage = new Uint8Array(reader.result)

      const { status } = await updateDeckImage(
        curSelectedShipImoNumber,
        deckName,
        convertedImage,
        imageWidth,
        imageHeight
      )

      if (isStatusOk(status)) {
        showResMsg('선택한 Deck의 이미지가 저장되었습니다')

        let {
          data: {
            data: { deckImage }
          }
        } = await getDeckImage(curSelectedShipImoNumber, deckName)
        deckfloorplan.value = deckImage
        deckfloorplan.value = `data:image/png;base64,${deckImage}`
      }

      // deckfloorplan.value = reader.result
    }
    reader.readAsArrayBuffer(deckImage)
  } else {
    deckfloorplan.value = ''
  }
}

const getImageWidthHeight = async (e) => {
  return new Promise((resolve, reject) => {
    let deckImage = e.target.files[0]
    let imageWidth = null
    let imageHeight = null

    if (!deckImage) {
      reject(new Error('선택한 파일이 없습니다'))
      return
    }

    let reader = new FileReader()
    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        imageWidth = image.width
        imageHeight = image.height

        resolve({ imageWidth: image.width, imageHeight: image.height })
      }

      image.onerror = reject
      image.src = e.target.result
    }
    reader.readAsDataURL(deckImage)
  })
}

const removeDeck = async () => {
  let curSelectedImoNumber = curSelectedShip.value.imoNumber
  let deckName = clickedDeckName.value

  const { status } = await deleteDeck(curSelectedImoNumber, deckName)

  if (isStatusOk(status)) {
    showResMsg('선택한 Deck 정보가 삭제되었습니다')
    isShowDeleteModal.value = false
    fetchDeckList()
    resetDeckName()
  }
}

const resetDeckName = () => {
  clickedDeckName.value = null
}

onMounted(() => {
  deckGridInstance.value = getDxGridInstance(deckGrid)
  fetchDeckList()
})

const newIconPos = ref({
  x: 0,
  y: 0
})

const createIcon = () => {
  // const newElement = document.createElement('div')
  // newElement.innerHTML = `<div style="position : absolute; top : 0; left : 0">test</div>`
  // document.querySelector('#icon-container').append(newElement)

  let newIconPos = ref({
    posX: sensorForm.posX,
    posY: sensorForm.posY
  })
  if (icons.value.length <= regacyIcons.value.length) {
    icons.value.push({ ...newIconPos.value })
    console.log('icons 목록')
    console.dir(icons.value)

    console.log('클래스 추가')

    nextTick(() => {
      const items = document.querySelectorAll('.image-container .icon')
      console.log(items.length)
      dragItem = items[items.length - 1]

      const imageContainer = document.querySelector('.image-container')

      newIcon = document.querySelector('.new-icon')
      items[items.length - 1].classList.add('new-icon')

      imageContainer.addEventListener('mousedown', dragStart)
      imageContainer.addEventListener('mousemove', drag)

      items[items.length - 1].addEventListener('mousedown', mouseDownIcon, items[items.length - 1])
      // items[items.length - 1].addEventListener('mousemove', drag, false)
      items[items.length - 1].addEventListener('mouseup', dragEnd, false)
    })
  }
}

var dragging = false
var currentX
var currentY
var initialX
var initialY
var xOffset = 0
var yOffset = 0
let dragItem = ''

const container = document.querySelector('.image-container')
let newIcon = ''

// container.addEventListener('mousedown', (e) => {
//   if (e.target == newIcon) {
//     dragging = true
//   }
// })

function dragStart(e) {
  const newIcon = document.querySelector('.new-icon')
  if (e.target == newIcon) {
    dragging = true
  }
}

function mouseDownIcon(e, item) {
  const icon = item
  // icon.posX = (e.offsetX * 100) / window.innerWidth
  // icon.posY = (e.offsetY * 100) / window.innerHeight
}

function dragEnd(e) {
  console.log('드래그 End')
  dragging = false

  initialX = currentX
  initialY = currentY

  console.dir(e)
}

function drag(e) {
  // if (!dragging) return
  console.log('드래그')
  console.dir(e)
  const container = document.querySelector('.image-container')

  let x = (e.offsetX * 100) / container.clientWidth
  let y = (e.offsetY * 100) / container.clientHeight

  let x1 = (e.clientX * 100) / container.clientWidth
  let y1 = (e.clientY * 100) / container.clientHeight

  console.log('마우스 좌표' + x, y)
  console.log('마우스1 좌표' + x1, y1)
}

const selectedRowTagId = ref(null)
const getSensorInfo = (e) => {
  let id = e.data.id
  let tagId = e.data.tagId
  selectedRowTagId.value = e.data.tagId
  console.log('sensorInfo')
  console.dir(e)
  icons.value = regacyIcons.value
  changeComponent('SensorEditForm', { id, tagId })
  // icons.value =
}

const removeFDSSensor = async () => {
  let imoNumber = curSelectedShip.value.imoNumber
  let tagId = selectedTagId.value
  let updatedIcons = icons.value.filter((item) => item.tagId != tagId)

  let requestForm = {
    imoNumber,
    tagId
  }

  const { status } = await deleteFDSSensor(requestForm)

  if (isStatusOk(status)) {
    showResMsg('선택한 센서 정보가 삭제되었습니다')
    icons.value = updatedIcons
    isShowSensorDeleteModal.value = false
    resetComponent()
  }
}

const updatePos = (posInfo) => {
  const findIcon = (type) => {
    switch (type) {
      case 'regist':
        return icons.value[icons.value.length - 1]
      case 'edit':
        return icons.value.find((el) => el.tagId == selectedRowTagId.value)
    }
  }
  const icon = findIcon(posInfo.type)

  console.log('findIcon')
  console.dir(icon)
  icon.posX = posInfo.posX
  icon.posY = posInfo.posY
}

watch(curSelectedShip, fetchDeckList)
</script>

<style scoped>
.normal {
  color: #42d2a7;
  border-color: #42d2a7;
}

.warning {
  color: #fd8100;
}

.danger {
  color: #f04a4a;
  border-color: #f04a4a;
}

.alarm-type {
  font-size: 1.2em;
}

.sensor-management-container {
  flex: 3 3 0;
}

.form-container {
  flex: 1 1 0;
}

.deck-modify-item {
  flex: 1 1 0;
}

.sensors-container {
  /* height: calc(100% - 56px); */
  height: 100vh;
  /* max-height: calc((100% - 24px - 24px) * 0.5 - 24px) ; */
  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 12px - 62px - 12px - 40px - 12px - 12px - 12px) * 0.5 -
      24px
  );
}

.decks-container {
  /* height: calc(100% - 56px); */
  height: 100vh;
  max-height: calc(
    (100vh - 65px - 12px - 60px - 12px - 12px - 62px - 12px - 40px - 12px - 12px - 12px) * 0.5 -
      64px
  );
}

/* max-height: calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.65); */
/* calc((100vh - 65px - 24px - 62px - 24px - 40px - 24px - 24px - 24px) * 0.5 - 64px) */

.image-container {
  flex: 2 2 0;
}

.deck-list {
  flex: 1 1 auto;
}

.deck-modify-container.d-flex.ga-4 {
  height: 20%;
}

.tabs-content-test {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 62px - 24px - 24px);
}

.image-container {
  position: relative;
  overflow: hidden;
}
.image-container > .icon {
  top: 0%;
  left: 0%;
  /* transform: translate(-50%, -50%) */
}
.icon {
  position: absolute;
  cursor: pointer;
}

.sensor-icon {
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  background-color: #5789fe;
  width: 15px;
  height: 15px;
}
</style>
