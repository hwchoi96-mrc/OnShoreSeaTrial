<template>
  <!-- <div class=""> -->
  <div class="tab-card gray-border pa-6">
    <v-form @submit.prevent class="w-100">
      <div class="tab-container">
        <div class="shipInfo-container d-flex flex-wrap ga-2">
          <div class="shipInfo-item">
            <div class="mb-1">선박명</div>
            <i-input
              label="선박명"
              type="text"
              v-model="shipEditForm.name"
              placeholder="선박명을 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Flag</div>
            <!-- <i-input label="Flag" type="text" v-model="shipEditForm.nation" placeholder="Flag를 입력하여 주십시오" required
              :hide-details="false"></i-input> -->
            <v-autocomplete
              v-model="shipEditForm.nation"
              :items="ports"
              item-title="name"
              item-value="code"
              density="compact"
              bg-color="#434348"
              placeholder="Flag를 선택하세요"
              hide-details
              variant="solo-filled"
              no-data-text="데이터가 없습니다"
            />
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">IMO Number</div>
            <i-input
              label="IMO Number"
              type="text"
              v-model="shipEditForm.imoNumber"
              placeholder="IMONumber를 입력하여 주십시오"
              maxChar="7"
              maxlength="7"
              required
              :hide-details="false"
              disabled
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">MMSI</div>
            <i-input
              label="MMSI"
              type="text"
              :maxChar="9"
              v-model="shipEditForm.mmsiNumber"
              placeholder="MMSI를 입력하여 주십시오"
              maxlength="9"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">CallSign</div>
            <i-input
              label="TYPE"
              type="text"
              :maxlength="7"
              v-model="shipEditForm.callSign"
              placeholder="CallSign을 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
        </div>
        <div class="shipParticulars-container d-flex flex-wrap ga-2">
          <div class="shipInfo-item">
            <div class="mb-1">Type</div>
            <v-autocomplete
              v-model="shipEditForm.type"
              :items="shipTypes"
              density="compact"
              bg-color="#434348"
              variant="solo-filled"
              placeholder="Type을 선택하여 주십시오"
              no-data-text="데이터가 없습니다"
              hide-details
            />
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Length</div>
            <i-input
              label="Flag"
              type="number"
              v-model="shipEditForm.length"
              placeholder="Length를 입력하여 주십시오"
              required
              :hide-details="false"
            ></i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Gross Tonnage</div>
            <i-input
              label="Gross Tonnage"
              type="number"
              v-model="shipEditForm.grossTonnage"
              placeholder="Gross Tonnage를 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Beam</div>
            <i-input
              label="Beam"
              type="number"
              v-model="shipEditForm.beam"
              placeholder="Beam을 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Summer Dwt</div>
            <i-input
              label="Summer Dwt"
              type="number"
              v-model="shipEditForm.summerDwt"
              placeholder="Summer Dwt를 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Year Built</div>
            <i-input
              label="Year Built"
              type="text"
              v-model="shipEditForm.yearBuilt"
              placeholder="Year Built를 입력하여 주십시오"
              maxlength="4"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
        </div>
        <i-btn
          v-if="role != 'ROLE_VOCC_USER'"
          @click="editShipInfo"
          class="w-100 mt-3"
          text="수정"
          :color="changeColor"
          :disabled="isDisabled"
        ></i-btn>
      </div>
    </v-form>
  </div>
  <!-- </div> -->
</template>

<script setup>
import { onMounted, watch, computed, ref, defineProps, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore.js'
import { getAllPort } from '@/api/operationapi.js'
import _ from 'lodash'

const ports = ref([])

const shipStore = useShipStore()
const { shipInfo } = storeToRefs(shipStore)

const emit = defineEmits(['updateShipInfo'])

const shipEditForm = ref({
  imoNumber: '', // 선사명
  nameEng: '',
  nameKor: '',
  mmsiNumber: '',
  type: '',
  classification: '',
  deliveryDate: '',
  builder: '',
  lengthLoa: '',
  breadth: '',
  depth: '',
  maxDraft: '',
  grt: '',
  dwt: ''
})
const isDisabled = ref(false)

const props = defineProps({
  shipImoNumber: {
    type: String,
    default: ''
  }
})

let role = ''
let originShipName = ''
const readonly = ref(true)

const shipTypes = [
  'BULK_CARRIER',
  'GAS_CARRIER',
  'TANKER',
  'CONTAINER',
  'GENERAL_CARGO_CARRIER',
  'REFRIGERTED_CARGO_CARRIER',
  'COMBINED_CARRIER',
  'LNG_CARRIER',
  'RORO_CAR_CARRIER',
  'RORO_CARGO_CARRIER',
  'RORO_FERRY',
  'CRUISE'
]
onMounted(() => {
  fetchShipInformation()
  role = sessionStorage.getItem('userRole')
  if (role != 'ROLE_VOCC_USER') {
    readonly.value = false
  }
  fetchAllPort()
})

// 선박 정보 조회
const fetchShipInformation = async () => {
  const result = await shipStore.fetchShipInfo(props.shipImoNumber)
  shipEditForm.value = { ...shipStore.shipInfo }
  originShipName = shipEditForm.value.name
}

watchEffect(async () => {
  fetchShipInformation()
}),
  { immediat: true }

const editShipInfo = async () => {
  const result = await shipStore.editShipInfo(shipEditForm.value)
  let shipNameInfo = {
    originShipName: originShipName,
    newShipName: shipEditForm.value.name
  }
  emit('updateShipInfo', shipNameInfo)
  originShipName = shipEditForm.value.name
}

watch(
  shipEditForm,
  (newValue, oldValue) => {
    if (!_.isEqual(newValue, shipInfo.value)) {
      isDisabled.value = false
    } else {
      isDisabled.value = true
    }
  },
  { deep: true }
)

const changeColor = computed(() => {
  return isDisabled.value ? '#7A8294' : '#5789FE'
})

const fetchAllPort = async () => {
  // const response = await getAllPort()
  ;({
    data: { data: ports.value }
  } = await getAllPort())
}
</script>

<style scoped>
.shipInfo-item {
  width: 48%;
}
</style>
