<template>
  <div class="tab-card gray-border pa-6">
    <v-form @submit.prevent="registerShip" class="w-100" v-model="disabled">
      <div class="tab-container">
        <div class="shipInfo-container d-flex flex-wrap ga-2">
          <div class="shipInfo-item">
            <div class="mb-1">Ship Name</div>
            <i-input
              label="선박명"
              type="text"
              v-model="shipRegisterForm.name"
              placeholder="Ship Name을 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Flag</div>
            <v-autocomplete
              v-model="shipRegisterForm.nation"
              :items="ports"
              item-title="code"
              item-value="code"
              density="compact"
              bg-color="#434348"
              variant="solo-filled"
              placeholder="Flag를 선택하여 주십시오"
              no-data-text="데이터가 없습니다"
              hide-details
            />
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">IMO Number</div>
            <i-input
              label="IMO Number"
              type="text"
              v-model="shipRegisterForm.imoNumber"
              placeholder="IMO Number를 입력하여 주십시오"
              min="7"
              maxChar="7"
              maxlength="7"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">MMSI</div>
            <i-input
              label="MMSI"
              type="text"
              :maxChar="9"
              v-model="shipRegisterForm.mmsiNumber"
              placeholder="MMSI를 입력하여 주십시오"
              maxlength="9"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Call Sign</div>
            <i-input
              label="TYPE"
              type="text"
              :maxlength="5"
              v-model="shipRegisterForm.callSign"
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
            <i-input
              label="Type"
              type="text"
              v-model="shipRegisterForm.type"
              placeholder="Type을 입력하여 주십시오"
              required
              :hide-details="false"
            >
            </i-input>
          </div>
          <div class="shipInfo-item">
            <div class="mb-1">Length</div>
            <i-input
              label="Flag"
              type="number"
              v-model="shipRegisterForm.length"
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
              v-model="shipRegisterForm.grossTonnage"
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
              v-model="shipRegisterForm.beam"
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
              v-model="shipRegisterForm.summerDwt"
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
              v-model="shipRegisterForm.yearBuilt"
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
          type="submit"
          class="w-100 mt-3"
          text="등록"
          :disabled="!disabled"
        ></i-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, inject, defineProps, onMounted } from 'vue'
import _ from 'lodash'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useShipStore } from '@/stores/shipStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { dxGridRefresh } from '@/composables/dxGridUtil'
import { getAllPort } from '@/api/operationapi.js'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

const shipStore = useShipStore()

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const ports = ref([])

const props = defineProps({
  shipImoNumber: {
    type: String,
    default: ''
  }
})

const shipRegisterForm = ref({
  voccId: voccInfo.value.id, // 선사 아이디
  name: '',
  nation: null,
  imoNumber: '',
  mmsiNumber: '',
  callSign: '',
  type: '',
  grossTonnage: 0,
  summerDwt: 0,
  length: 0,
  beam: 0,
  yearBuilt: ''
})

let role = ''
onMounted(() => {
  role = userInfo.value.role
  fetchAllPort()
})

/**
 * 버튼 비활성화 여부
 */
const disabled = ref(false)

const emit = defineEmits(['change-component'])
const shipGrid = inject('shipGrid')

/**
 * 선박 등록
 */
const registerShip = async () => {
  shipRegisterForm.value.grossTonnage = parseFloat(shipRegisterForm.value.grossTonnage)
  shipRegisterForm.value.summerDwt = parseFloat(shipRegisterForm.value.summerDwt)
  shipRegisterForm.value.length = parseFloat(shipRegisterForm.value.length)
  shipRegisterForm.value.beam = parseFloat(shipRegisterForm.value.beam)

  const result = await shipStore.addShip(shipRegisterForm.value)

  if (result == 201) {
    dxGridRefresh(shipGrid)
    setTimeout(() => {
      emit('change-component', 'NoSelectShip')
    }, 500)
  }
}

const fetchAllPort = async () => {
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
