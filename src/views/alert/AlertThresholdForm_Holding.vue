<template>
  <v-dialog :width="700">
    <v-sheet class="pa-4" :height="420">
      <div class="d-flex justify-space-between">
        <div class="title d-flex align-center">새로운 임계치 추가</div>
        <v-btn class="d-flex align-center" icon="mdi-close" height="35" size="small" variant="text"
          @click="closePopup"></v-btn>
      </div>
      <div class="d-flex flex-column ga-2 mt-2">
        <div class="d-flex ga-2">
          <div class="threshold-item d-flex flex-column ga-2">
            <div>
              <span>Description</span>
              <i-input v-model="alertThresholdForm.description" density="compact" bg-color='#434348'
                placeholder="description을 입력하세요" hide-details></i-input>
            </div>
            <div>
              <span>Equip No</span>
              <i-input v-model="alertThresholdForm.equipmentNo" :items="ports" item-title="name" item-value="code"
                density="compact" bg-color='#434348' placeholder="Equip No를 입력하세요" hide-details></i-input>
            </div>
            <div>
              <span>Tag ID</span>
              <i-input v-model="alertThresholdForm.tagId" density="compact" bg-color='#434348'
                placeholder="tagId를 입력하세요" hide-details></i-input>
            </div>
            <div>
              <span>DataType</span>
              <i-selectbox v-model="alertThresholdForm.dataType" :items="dataTypes" item-title="name" item-value="code"
                density="compact" bg-color='#434348' placeholder="Threshold Type을 선택하세요" hide-details></i-selectbox>
            </div>

          </div>

          <div class="threshold-item  d-flex flex-column ga-3">
            <div>
              <span>Use</span>
              <i-selectbox v-model="alertThresholdForm.use" :items="useStatus" item-title="name" item-value="code"
                density="compact" bg-color='#434348' placeholder="Use를 선택하세요" hide-details></i-selectbox>
            </div>
            <div>
              <span>Threshold Type</span>
              <i-selectbox v-model="alertThresholdForm.thresholdType" :items="thresholdTypes" item-title="name"
                item-value="code" density="compact" bg-color='#434348' placeholder="Threshold Type을 선택하세요"
                hide-details></i-selectbox>
            </div>
            <div>
              <span>Caution</span>
              <i-input v-model="alertThresholdForm.caution" density="compact" bg-color='#434348'
                placeholder="Caution을 입력하세요" hide-details></i-input>
            </div>
            <div>
              <span>Warning</span>
              <i-input v-model="alertThresholdForm.warning" density="compact" bg-color='#434348'
                placeholder="Warning을 입력하세요" hide-details></i-input>
            </div>
          </div>
        </div>

        <div class="d-flex justify-end w-100 mt-2">
          <i-btn text="수정" @click="editVoyage"></i-btn>
        </div>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'

import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()

const emit = defineEmits(['closePopup'])

const dataTypes = ['Value', 'Boolean']
const thresholdTypes = ['Low', 'High']
const useStatus = ['O', 'X']

const alertThresholdForm = ref({
  description: null,
  equipmentNo: null,
  tagId: null,
  use: useStatus[0],
  dataType: dataTypes[0],
  thresholdType: thresholdTypes[0],
  caution: null,
  warning: null,
})



const closePopup = () => {
  emit('closePopup')
}

</script>

<style>
.threshold-item{
  flex : 1 1 40%;
}

.title {
  font-size: 1.2em;
}
</style>