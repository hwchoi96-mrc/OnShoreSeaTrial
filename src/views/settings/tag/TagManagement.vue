<template>
  <div class="pa-4 container-height">
    <v-sheet class="rounded-lg">
      <div class="d-flex  justify-space-between">
        <div class="tagList d-flex py-3 ga-3 w-50 ml-4">
          <i-selectbox v-if="role == 'ROLE_LCC_ADMIN'" label="선사명" v-model="selectedVocc" :items="voccs"
            item-title="name" item-value="id" return-object variant="solo-filled" density="comfortable" hide-details>
          </i-selectbox>
          <i-selectbox label="선단명" v-model="selectedFleet" :items="fleetList" item-title="name" item-value="id"
            return-object variant="solo-filled" density="comfortable" hide-details placeholder="선단을 선택해주세요"
            no-data-text="선단 정보가 없습니다 " clearable>
          </i-selectbox>
          <i-selectbox label="선박명" v-model="selectedShip" :items="ships" item-title="name" item-value="imoNumber"
            return-object variant="solo-filled" density="comfortable" hide-details no-data-text="선박 정보가 없습니다"
            clearable></i-selectbox>

          <div class="d-flex align-center">
            <i-btn @click="searchTagList" text="조회"></i-btn>
          </div>
        </div>

        <div class="d-flex align-center;">
          <!-- <i-btnGroup class="d-flex ga-3 justify-space-between align-center mr-4" type="excel" @add="initNewRow"
            @delete="removeTags" @save="saveTags" @download="exportExcel" @upload="fileUpload"></i-btnGroup> -->
          <div class="d-flex align-center ga-2">
            <i-btn text="추가" color="#3D3D40" prepend-icon="mdi-plus" @click="createNewRow"></i-btn>
            <i-btn text="삭제" color="#F04A4A" prepend-icon="mdi-trash-can" @click="showDeleteModal"></i-btn>
            <i-btn text="저장" color="#3D3D40" @click="saveTags"></i-btn>
            <i-btn text="엑셀업로드" color="#3D3D40" @click="test"></i-btn>
            <input ref="excelUploader" class="d-none" type="file" @change="readFile" />
            <i-btn text="다운로드" color="#3D3D40" @click="exportExcel"></i-btn>
            <!-- <v-file-input class="mt-2" outlined dense clearable type="file" label="엑셀 업로드" variant="solo-filled "
              prepend-icon="" @change="readFile"></v-file-input> -->
          </div>
          <!-- <i-btnGroup class="d-flex ga-3 justify-space-between align-center" type="excel" @add="addTag"
              @delete="removeTags" @upload="uploadTag" download="downloadTag" @save="saveTag"></i-btnGroup> -->
        </div>
      </div>
    </v-sheet>
    <v-sheet class="mt-4 pa-4 rounded-lg">

      <DxDataGrid id="tagGrid" ref="tagGrid" class="container-include-filter " key-expr="id" :data-source="initTags"
        :active-state-enabled="activeStatus" :focused-row-enabled="activeStatus" :selected-row-keys="selectedRowKeys"
        @selection-changed="onSelectionChanged" @row-inserted="rowInserted" @row-updated="onRowUpdated"
        @init-new-row="initNewRow">

        <DxSelection mode="multiple" show-check-boxes-mode="always" :recursive="true"></DxSelection>
        <!-- <DxEditing :allow-updating="true"  mode="cell"></DxEditing> -->
        <DxFilterRow :visible="true" />
        <DxScrolling column-rendering-mode="virtual" />

        <!-- <DxColumn data-field="id" caption="id" :visible="true" /> -->
        <DxColumn data-field="measurementName" caption="measurementName" :allow-editing="true">
          <!-- <DxValidationRule type="required" message="필수 입력 항목입니다"/> -->
        </DxColumn>
        <DxColumn data-field="fieldName" caption="fieldName" :allow-editing="true">
          <!-- <DxValidationRule type="required" message="필수 입력 항목입니다"/> -->
        </DxColumn>
        <DxColumn data-field="imoNumber" caption="imoNumber" :visible="true" :allow-editing="true">
          <!-- <DxValidationRule type="required" message="필수 입력 항목입니다"/> -->
        </DxColumn>
        <DxColumn data-field="tagName" caption="tagName" class="pl-10" :allow-editing="true">
          <!-- <DxValidationRule type="required" message="필수 입력 항목입니다"/> -->
        </DxColumn>
        <DxColumn data-field="description" caption="description" :allow-editing="true"></DxColumn>
        <DxColumn data-field="dataType" caption="dataType">
          <!-- <DxValidationRule type="required" message="필수 입력 항목입니다"/> -->
        </DxColumn>
        <DxColumn data-field="dataUnit" caption="dataUnit " :allow-editing="true"></DxColumn>
        <DxColumn data-field="equipmentName" caption="equipmentName" :allow-editing="true"></DxColumn>
        <DxColumn data-field="partName" caption="partName" :allow-editing="true"></DxColumn>
      </DxDataGrid>
    </v-sheet>
    <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">

      <template #default>
        <p>기존 편집한 내용도 삭제됩니다.</p>
        <p>그래도 삭제하시겠습니까?</p>
      </template>

      <template #actions>
        <i-btnGroup type="confirm" @close="closeDeleteModal" @confirm="removeTags"></i-btnGroup>
      </template>
    </AppModal>

    <AppModal v-model="tagError" @close="tagError = false">
      <template #default>
        {{ tagErrorMsg }}
      </template>

      <template #actions>
        <i-btn @click="tagError = fasle" text="확인"></i-btn>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import { storeToRefs } from 'pinia';
import { useTagStore } from '@/stores/tagStore'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore'
import { useFleetStore } from '@/stores/fleetStore'
import { useShipStore } from '@/stores/shipStore'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()


const { proxy } = getCurrentInstance();

const tagStore = useTagStore()
const { tagList } = storeToRefs(tagStore)
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const voccStore = useVoccStore()
const shipStore = useShipStore()
const fleetStore = useFleetStore()
const { fleets } = storeToRefs(fleetStore)

const excelUploader = ref()

const tagError = ref(false)
const tagErrorMsg = ref('')

/** DxGrid 관련 필드 */
const tagGrid = ref(null)
const initTags = ref([])
const selectedRowKeys = ref([])
const updatedRows = ref([])
const activeStatus = ref(true)

let tagInstance = ''
let originTagList = []

const role = ref('')
onMounted(() => {
  // 태그 목록 조회
  role.value = userInfo.value.role

  if (role.value == "ROLE_LCC_ADMIN") {
    fetchVoccAll()
  } else {
    getFleetList()
  }
  getTagList()
  tagInstance = getDxGridInstance(tagGrid)
})

const test = () => {
  excelUploader.value.click()
}

const newRow = ref({
  id: '',
  measurementName: '',
  fieldName: '',
  imoNumber: '',
  tagName: '',
  description: '',
  dataType: '',
  dataUnit: '',
  equipmentName: '',
  partName: '',
  activated: true
})

/**
 * 로그인한 사용자의 선단 목록 조회
 */
const getFleetList = async () => {
  await fleetStore.fetchFleetsByVocc()
  fleetList.value = fleets.value

  if (role.value !== "ROLE_LCC_ADMIN") {
    selectedFleet.value = fleetList.value[0]
  }
}

/**
 * 태그 목록 조회
 */
const getTagList = async () => {
  const result = await tagStore.fetchTagList()
  originTagList = [...result]
}

/**
 * 조회 버튼 클릭 시 태그 목록 조회
 * 선택한 선사, 선단, 선박별 태그 목록 조회
 */
const searchTagList = async () => {
  tagInstance.option('focusedRowKey', null)
  let filterd = ''
  let imoNumberList = []
  let result = ''

  // 선택한 선단이 null일 경우 => 모든 선단의 선박들의 태그 정보 조회
  if (!selectedFleet.value) {
    if (role.value == "ROLE_LCC_ADMIN") {
      // 선단이 없는 경우
      if (!fleetList.value) {
        filterd = []
        initTags.value = filterd
        return;
      }

      fleetList.value.forEach(fleet => {
        if (fleet.imoNumberList) {
          imoNumberList.push(...fleet.imoNumberList)
        }
      })

      if (!imoNumberList) {
        filterd = []
      } else {
        result = await fetchTagListByImoNumber(imoNumberList)
        filterd = result.data
      }
    } else {
      fleets.value.forEach(fleet => {
        if (fleet.imoNumberList) {
          imoNumberList.push(...fleet.imoNumberList)
        }
      })
      result = await fetchTagListByImoNumber(imoNumberList)

      if (result.status == 200) {
        filterd = result.data
      } else {
        filterd = []
      }
    }
  } else {
    // 선박을 선택안한 경우 => 선택한 선단의 선박들의 태그 정보 조회
    if (!selectedShip.value) {
      imoNumberList = selectedFleet.value.imoNumberList
      result = await fetchTagListByImoNumber(imoNumberList)
      filterd = result.data
    } else {
      let imoNumbers = [selectedShip.value.imoNumber]
      result = await fetchTagListByImoNumber(imoNumbers)
      if (result.status == 200) {
        filterd = result.data
      } else {
        filterd = []
      }
    }
  }
  initTags.value = filterd
  originTagList = [...filterd]
}

const fetchTagListByImoNumber = (imoNumbers) => {
  const response = tagStore.fetchTagListByImoNumber(imoNumbers)
  return response;
}


/**
 * 모든 선사 목록 조회
 */
const voccs = ref();
const selectedVocc = ref();
const fetchVoccAll = async () => {
  const result = await voccStore.fetchVoccListAll();
  voccs.value = result;
  selectedVocc.value = voccs.value[0]

  getFleetList()
}

/**
 * 선택한 선사의 선단 목록 조회
 */
const fleetList = ref();
const selectedFleet = ref();
const fetchFleetsByVoccId = async () => {
  selectedFleet.value = ''
  selectedShip.value = ''
  const voccId = selectedVocc.value.id

  const result = await fleetStore.fetchFleetsByVoccId(voccId);
  console.dir(result)
  fleetList.value = result.data;
}


/**
 * 선택한 선단의 선박 목록 조회
 */

const ships = ref();
const selectedShip = ref();
const fetchShipscByFleetId = async () => {
  if (!selectedFleet.value) {
    selectedShip.value = ''
    ships.value = ''
  } else {
    const fleetId = selectedFleet.value.id
    const result = await shipStore.fetchShipsByFleetId(fleetId);
    ships.value = result;
    selectedShip.value = ships.value[0]
  }
}


watch(selectedVocc, fetchFleetsByVoccId, { deep: true, immediate: false })
watch(selectedFleet, fetchShipscByFleetId, { deep: true, immediate: false })

const removeTags = async () => {
  let result = ''
  let selectedRowData = tagInstance.getSelectedRowsData()

  let newRowStauts = isExistNewRows(newRows)

  if (newRowStauts) {
    initTags.value = selectedRowData.filter(row => newRows.some(newRow => newRow.id != row.id))
    selectedRowData = selectedRowData.filter(row => !newRows.some(newRow => newRow.id == row.id))
    result = 200;
  }

  if (selectedRowData.length) {
    const removedData = selectedRowData.map(tag => ({ measurementName: tag.measurementName, fieldName: tag.fieldName }))
    await tagStore.removeTags(removedData)
  }
}


const isExistNewRows = (newRows) => {
  return newRows.length || false;
}

/**
 * 태그 삭제 확인 팝업창
 */
const isShowDeleteModal = ref(false)
const showDeleteModal = () => {
  const selectedRowData = tagInstance.getSelectedRowsData()
  if (!selectedRowData.length) {
    showResMsg('삭제할 항목을 선택해주세요')
    return;
  }

  isShowDeleteModal.value = true
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

const onSelectionChanged = (e) => {
  selectedRowKeys.value = e.selectedRowKeys
}

/**
 * 행 추가
 */
const createNewRow = () => {
  tagGrid.value.instance.addRow();
}

let newRows = []
const initNewRow = (e) => {
  newRow.value.id = initTags.value.length == 0 ? 0 : initTags.value.length
  e.data = newRow.value;
}

/**
 * 추가한 행이 저장될 때 로직 처리
 * @param {} e 
 */
const rowInserted = (e) => {
  tagInstance.selectRows(newRow.value.id, true)
  newRows.push(e.data);
}

const onRowUpdated = (e) => {
  const index = updatedRows.value.findIndex((row) => row.id === e.data.id)

  if (index != -1) {
    updatedRows.value[index] = { ...e.data }
  } else {
    updatedRows.value.push(e.data)
    tagInstance.selectRows(e.data.id, true)
  }
}

/**
 * 저장 버튼 클릭 시 태그 목록 업데이트
 */
const saveTags = async () => {
  const selectedRowData = tagInstance.getSelectedRowsData()
  console.dir(selectedRowData)

  selectedRowData.forEach((row, index) => {
    if (row.measurementName == '' ||
      row.fieldName == '' ||
      row.imoNumber == '' ||
      row.tagName == '' ||
      row.dataType == ''
    ){
      errorMsgs.push(`${row.id}번째에 measurementName, fieldName, imoNumber, tagName, dataType을 입력해주세요`)
    }
    const result = isDuplicatedMeasurementAndFieldName(originTagList, row, index)
    if (result) {

      // 중복된 경우
      // imoNumber와 tagName이 서로 동일한지 여부 체크
      const isEquled = isEqualImoNumberAndTagName(result, row)

      if (isEquled) {
        // imoNumber, EquipmentName, PartName 
        const isEqualedEquipement = isEqualImoNumberAndEquipmentPartName(result, row)
        if (!isEqualedEquipement) {
          row.id = result.id
          let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(row)
        } else {
          let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(row)

          if (!isExistEquipPart) {
            row.id = result.id
          }
        }
      } else {
        let isExistStatus = isExistTagNameByImoNumber(row)
        // 기존 데이터에 imoNumber, tagName 없을 경우
        if (!isExistStatus) {
          let isEqualStatus = isEqualImoNumberAndEquipmentPartName(result, row)
          if (isEqualStatus) {
            row.id = result.id
          } else {
            let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(excelData)
            if (!isExistEquipPart) {
              row.id = result.id
            }
          }
        }
      }
    } else {
      // 중복 안된 경우
      let isExistStatus = isExistTagNameByImoNumber(row)
      if (!isExistStatus) {
        let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(row)
        if (!isExistEquipPart) {
          let newTagId = initTags.value.length;
          row.id = newTagId
          // initTags.value[initTags.value.length] = row
        }
      }
    }
  })

  if (errorMsgs.length > 0) {
    initTags.value = originTagList
    tagError.value = true;
    
    tagErrorMsg.value = errorMsgs.join("\n").replace(/[,"]/g, '')
    tagInstance.option('focusedRowKey', null)
    // showResMsg(errorMsgs.toString())
  } else {
    // tagInstance.refresh()
    const convertedRowData = selectedRowData.map((data) => {
      // delete data.id
      delete newRow.value.id
      data = { ...newRow.value, ...data }
      return data
    })
    
    try{

      const result = await tagStore.editTags(convertedRowData)
      if (result == 200) {
        tagList.value = [...tagInstance.option('dataSource')]
        initTags.value = [...tagInstance.option('dataSource')]

        tagStore.saveCache(convertedRowData)
        tagInstance.option('focusedRowKey', null)
        selectedRowKeys.value = null

        dxGridRefresh(tagGrid)
        getTagList()
      }
    }catch(e){
      console.dir(e)
      // tagErrorMsg.value = errorMsgs.push()
    }
   
  }
  errorMsgs = []
}

/**
 * 엑셀 업로드
 */
let uploadExcelData = []
const readFile = (e) => {
  let file = e.target.files[0]
  let reader = new FileReader()

  if (file !== null) {
    reader.onload = (e) => {
      let data = reader.result

      const workBook = proxy.xlsx.read(data, { type: 'binary', cellDates: true, dateNF: 'YYYY-MM-DD' })

      workBook.SheetNames.forEach(sheetName => {
        uploadExcelData = proxy.xlsx.utils.sheet_to_json(workBook.Sheets[sheetName]);
      })

      if (uploadExcelData) {
        fileUpload()
      }
    }
    reader.readAsBinaryString(file)
  }
  reader.readAsText(file)
}

let errorMsgs = []

const fileUpload = () => {
  uploadExcelData.forEach((excelData, index) => {
    if (!excelData['measurement'] && !excelData['fieldName']) {
      errorMsgs.push(`${index}번째 measurement 또는 fieldName은 필수 입력 항목입니다`)
    }

    const result = isDuplicatedMeasurementAndFieldName(initTags.value, excelData, index)

    // Measurement와 FieldName이 중복 여부 확인
    if (result) {
      // 중복된 경우
      // imoNumber와 tagName이 서로 동일한지 여부 체크
      const isEquled = isEqualImoNumberAndTagName(result, excelData)

      if (isEquled) {
        // imoNumber, EquipmentName, PartName 
        const isEqualedEquipement = isEqualImoNumberAndEquipmentPartName(result, excelData)
        if (isEqualedEquipement) {
          excelData.id = result.id
          initTags.value[result.id] = excelData;
          // tagInstance.selectRows(result.id, true)
          selectedRowKeys.value.push(result.id)
        } else {
          let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(excelData)

          if (!isExistEquipPart) {
            excelData.id = result.id
            initTags[result.id] = excelData;
            selectedRowKeys.value.push(result.id)
          }
        }
      } else {
        let isExistStatus = isExistTagNameByImoNumber(excelData)

        // 기존 데이터에 imoNumber, tagName 없을 경우
        if (!isExistStatus) {
          let isEqualStatus = isEqualImoNumberAndEquipmentPartName(result, excelData)
          if (isEqualStatus) {
            excelData.id = result.id
            initTags.value[result.id] = excelData;
            selectedRowKeys.value.push(result.id)
          } else {
            let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(excelData)
            if (!isExistEquipPart) {
              excelData.id = result.id
              initTags[result.id] = excelData;
              selectedRowKeys.value.push(result.id)

            }
          }
        }
      }

    } else {
      // 중복 안된 경우
      let isExistStatus = isExistTagNameByImoNumber(excelData)

      if (!isExistStatus) {
        let isExistEquipPart = isExistEquipmentNameAndPartNameByImoNumber(excelData)
        if (!isExistEquipPart) {
          let newTagId = initTags.value.length;
          excelData.id = newTagId
          initTags.value[initTags.value.length] = excelData
          selectedRowKeys.value.push(newTagId)
        }
      }
    }
  })

  if (errorMsgs.length > 0) {
    initTags.value = originTagList
    tagError.value = true;
    tagErrorMsg.value = errorMsgs.toString()
    tagInstance.option('focusedRowKey', null)
    // showResMsg(errorMsgs.toString())
  } else {
    // tagInstance.refresh()
    dxGridRefresh(tagGrid)
    showResMsg('엑셀이 업로드 되었습니다')
  }

  errorMsgs = []
}

/**
 * imoNumber와 TagName이 같은게 있는지 확인
 * @param {*} existedData 
 * @param {*} newData 
 */
const isEqualImoNumberAndTagName = (existedData, newData) => {
  if (existedData.imoNumber == newData.imoNumber && existedData.tagName == newData.tagName) {
    return true
  } else {
    return false
  }
}

/**
 * imoNumber와 equipmentName, partNAme이 같은지 확인
 * @param {} existedData 
 * @param {*} newData 
 */
const isEqualImoNumberAndEquipmentPartName = (existedData, newData) => {
  if (existedData.imoNumber == newData.imoNumber
    && existedData.equipmentName == newData.equipmentName
    && existedData.partName == newData.partName) {
    return true
  } else {
    return false
  }
}

/**
 * Measuremeent와 FieldName이 중복되는지 확인
 * @param {*} existedData 
 * @param {*} uploadExcelData 
 * @param {*} index 
 */
function isDuplicatedMeasurementAndFieldName(existedData, uploadExcelData, index) {
  const { measurementName, fieldName } = uploadExcelData

  const matchedItemIndex = existedData.findIndex((element) => 
    element.measurementName == measurementName && element.fieldName == fieldName)

  if (matchedItemIndex == -1) {
    return false
  } else {
    return existedData[matchedItemIndex];
  }
}

/**
 * imoNumber에 tagName이 중복되는게 있는지 확인
 * @param {} uploadExcelData 
 */
function isExistTagNameByImoNumber(uploadExcelData) {
  // Loop through each element in existedData
  const { imoNumber, tagName } = uploadExcelData
  const matchedItemIndex = originTagList.findIndex((element) => element.imoNumber == imoNumber
    && element.tagName == tagName)
  if (matchedItemIndex == -1) {
    return false;
  } else {
    let errorMsg = `새로 업로드한 데이터가 기존 데이터 ${matchedItemIndex} 번째 ( imoNumber, tagName )이 중복됩니다`
    errorMsgs.push(errorMsg)
    return true;
  }
}

/**
 * 기존 저장된 데이터 imoNumber, equipmentName, partName이 중복되는게 있는지 확인
 * @param {*} uploadExcelData 
 */
function isExistEquipmentNameAndPartNameByImoNumber(uploadExcelData) {
  const { imoNumber, equipmentName, partName } = uploadExcelData
  const matchedItemIndex = originTagList.findIndex((element) =>
    element.imoNumber == imoNumber
    && element.equipmentName == equipmentName
    && element.partName == partName)

  if (matchedItemIndex == -1) {
    return false;
  } else {
    let errorMsg = `새로 업로드한 데이터가 기존 데이터 ${matchedItemIndex} 번째 ( imoNumber, equipmentName, partName )이 중복됩니다`
    errorMsgs.push(errorMsg)
    return true;
  }
}

/**
 * 엑셀 다운로드
 */
const exportExcel = async () => {
  const selectedRowData = tagInstance.getSelectedRowsData()
  const removedIdRowData = selectedRowData.map((data) => {
    delete data.id
    return data
  })
  const workBook = proxy.xlsx.utils.book_new()
  const workSheet = proxy.xlsx.utils.json_to_sheet(removedIdRowData)
  proxy.xlsx.utils.book_append_sheet(workBook, workSheet, 'sheet1')
  proxy.xlsx.writeFile(workBook, '태그목록.xlsx') // 엑셀파일 만듬
}

</script>

<style scoped>
.groupName {
  background: #4E83FF;
  border-radius: 10px;
  padding: 2px 4px; 
}

.groupName.gray {
  background: #959595;
  border-radius: 10px;
  padding: 2px 4px;
}

.w-60 {
  width: 60%;
}

.w-30 {
  width: 30%;
}
</style>
