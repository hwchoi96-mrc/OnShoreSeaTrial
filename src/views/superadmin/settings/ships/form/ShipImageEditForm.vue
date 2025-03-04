<template>
  <div class="mt-8">
    <v-form @submit.prevent>
      <div class="d-flex justify-space-between align-center my-4">
        <div>선박 이미지</div>
        <i-btn text="이미지 업로드" @click="uploadBtnClick"></i-btn>
        <input ref="imageFileUploader" class="d-none" type="file" @change="previewFile" />
      </div>

      <v-img :src="preview" height="150" aspect-ratio="16/9" position="center" contain></v-img>
      <i-btn v-if="role != 'ROLE_VOCC_USER'" @click="changeShipImage" class="w-100 mt-10" text="수정"
        ></i-btn>
    </v-form>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed, ref, reactive, inject, defineProps, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useShipStore } from '@/stores/shipStore.js'

const shipStore = useShipStore()
const { shipInfo } = storeToRefs(shipStore)

import { useToast } from '@/composables/useToast'

import DefaultShipImage from '@/assets/images/default-ship.png'
const { showResMsg } = useToast()

const props = defineProps({
  shipImoNumber: {
    type: String,
    default: ''
  }
})

const imageFileUploader = ref()
const preview = ref([])

let role = ''
onMounted(()=> {
  role = sessionStorage.getItem('userRole')
  // preview.value = `${shipInfo.value.shipImage}`
  fetchShipInformation()

})

// 선박 정보 조회
const fetchShipInformation = async () => {
  const result = await shipStore.fetchShipInfo(props.shipImoNumber)
  const shipImage = shipInfo.value.shipImage
  if (shipImage){
    preview.value = `data:image/png;base64,${shipInfo.value.shipImage}`
  } else{
    preview.value = DefaultShipImage
  }
}

const uploadBtnClick = () => {
  imageFileUploader.value.click()
}

const shipImagefile = ref([])
const previewFile = (e) => {
  shipImagefile.value = e.target.files[0]
  let reader = new FileReader()

  if (shipImagefile.value !== null) {
    reader.onload = (e) => {
      preview.value = reader.result;
    }

    reader.readAsDataURL(shipImagefile.value)
  } else {
    preview.value = ''
  }
}

const changeShipImage = () => {
  let reader = new FileReader()
  let convertedImage = ''
  if(shipImagefile.value){
    reader.onload = async(e)=>{
      convertedImage = reader.result;

      const result = await new Uint8Array(convertedImage)
      const response = await shipStore.changeShipImage(props.shipImoNumber, result)

      if (response == 200) {
        showResMsg('선박 이미지가 업데이트 되었습니다')
      }
    }

    reader.readAsArrayBuffer(shipImagefile.value)
  }
}


</script>

<style scoped>
.shipInfo-item {
  width: 48%;
}
</style>