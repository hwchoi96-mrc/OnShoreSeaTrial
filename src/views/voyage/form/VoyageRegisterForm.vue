<template>
  <FormModal>
    <template #title>
      <div>항차 리포트 등록</div>
    </template>
    <template #content>
      <div class="d-flex ga-2">
        <div class="w-50">
          <span>출발지</span>
          <v-autocomplete
            v-model="voyageRegisterForm.departure"
            :items="ports"
            item-title="name"
            item-value="code"
            density="compact"
            bg-color="#434348"
            placeholder="출발지를 선택하세요"
            variant="solo-filled"
            no-data-text="데이터가 없습니다"
          />
        </div>
        <div class="w-50">
          <span>출발시각</span>
          <div>
            <input type="datetime-local" v-model="voyageRegisterForm.departureTime" class="w-100" />
          </div>
        </div>
      </div>
      <div class="d-flex ga-2">
        <div class="w-50">
          <span>도착지</span>
          <v-autocomplete
            v-model="voyageRegisterForm.arrival"
            :items="ports"
            item-title="name"
            item-value="code"
            density="compact"
            bg-color="#434348"
            placeholder="도착지를 선택하세요"
            variant="solo-filled"
            no-data-text="데이터가 없습니다"
          />
        </div>

        <div class="w-50">
          <span>도착시각</span>
          <input type="datetime-local" class="w-100" v-model="voyageRegisterForm.arrivalTime" />
        </div>
      </div>
      <!-- <div class="d-flex ga-2">
        <div class="w-50">
          <span>운항시간</span>
          <i-input type="number" v-model="voyageRegisterForm.underway" placeholder="운항시간을 입력하세요"></i-input>
        </div>
        <div class="w-50">
          <span>운항거리</span>
          <i-input type="number" v-model="voyageRegisterForm.distance" placeholder="운항거리를 입력하세요"></i-input>
        </div>
      </div> -->
    </template>

    <template #footer>
      <div class="d-flex justify-end w-100">
        <i-btn text="등록" @click="addVoyage()"></i-btn>
      </div>
    </template>
  </FormModal>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import moment from 'moment'

import { getAllPort } from '@/api/operationapi.js'
import { resetObject, convertDateTimeType, convertUTCTimezone } from '@/composables/util'

import FormModal from '@/components/modal/FormModal.vue'
onMounted(() => {
  fetchAllPort()
})

const emit = defineEmits('addVoyage')

const voyageRegisterForm = ref({
  departure: null,
  departureTime: null,
  arrival: null,
  arrivalTime: null
  // shipCondition: null,
  // underway: 0,
  // distance: 0
})

const ports = ref([])

const addVoyage = () => {
  let departureTime = convertDateTimeType(voyageRegisterForm.value.departureTime)
  let arrivalTime = convertDateTimeType(voyageRegisterForm.value.arrivalTime)

  voyageRegisterForm.value.departureTime = convertUTCTimezone(departureTime)
  voyageRegisterForm.value.arrivalTime = convertUTCTimezone(arrivalTime)

  emit('addVoyage', voyageRegisterForm.value)
  resetObject(voyageRegisterForm.value)
}

const fetchAllPort = async () => {
  const response = await getAllPort()
  console.dir(response)(
    ({
      data: { data: ports.value }
    } = response)
  )
  // console.dir(ports.value)
}
</script>

<style>
input[type='datetime-local'] {
  background: #434348;
  padding: 8px;
  border-radius: 4px;
}
</style>
