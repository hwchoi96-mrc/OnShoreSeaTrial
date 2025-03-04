<template>
  <v-form @submit.prevent>
    <div class="mb-1">선사명</div>
    <i-input
      label="선사명"
      type="text"
      v-model="editForm.name"
      placeholder="선사명을 입력하여 주십시오"
      :readonly="isReadonly"
    >
    </i-input>
    <div class="mt-4 mb-1">소재지</div>
    <i-input
      label="소재지"
      type="text"
      v-model="editForm.address"
      placeholder="소재지를 입력하여 주십시오"
      :readonly="isReadonly"
    >
    </i-input>
    <div class="mt-4 mb-1">대표이사</div>
    <i-input
      label="대표이사"
      type="text"
      v-model="editForm.ceoName"
      placeholder="대표이사명을 입력하여 주십시오"
      :readonly="isReadonly"
    >
    </i-input>
    <div class="d-flex justify-space-between align-center my-4">
      <div>선사 로고</div>
      <i-btn v-if="displayByRole" text="로고 업로드" @click="uploadBtnClick"></i-btn>
      <input
        ref="logoFileUploader"
        class="d-none"
        type="file"
        @change="previewFile"
        accept=".jpg, .png"
      />
    </div>
    <div class="gray-border">
      <v-img :src="preview" height="150" aspect-ratio="16/9" position="center" contain></v-img>
    </div>
    <div class="mt-6">
      <i-btn
        v-if="displayByRole"
        @click="editVoccInfo"
        class="w-100"
        text="수정"
        :color="changeColor"
        :disabled="isDisabled"
      ></i-btn>
    </div>
  </v-form>
</template>

<script setup>
import { onMounted, watch, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAuthStore } from '@/stores/authStore'

import { displayByUserRole } from '@/composables/util'

import _ from 'lodash'

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

import { useToast } from '@/composables/useToast'
const { showResMsg } = useToast()

const props = defineProps({
  voccId: {
    type: [String, Number],
    default: null
  }
})

const editForm = ref({
  nameKor: '', // 선사명
  nameEng: '',
  address: '',
  ceoName: '',
  logoImage: []
})

const isReadonly = ref(false)

let role = ''

const preview = ref([])

onMounted(() => {
  fetchVoccInformation()
  role = userInfo.value.role
  if (role === 'ROLE_VOCC_USER') {
    isReadonly.value = true
  }
})

const displayByRole = computed(displayByUserRole)

watch(
  editForm,
  (newValue, oldValue) => {
    if (!_.isEqual(newValue, voccInfo.value)) {
      isDisabled.value = false
    } else {
      isDisabled.value = true
    }
  },
  { deep: true }
)

const isDisabled = ref(true)

const changeColor = computed(() => {
  return isDisabled.value ? '#7A8294' : '#5789FE'
})

const editVoccInfo = async () => {
  console.dir(editForm.value)
  const voccId = voccInfo.value.id
  const response = await voccStore.editVoccInfo(voccId, editForm.value)

  if (response == 200) {
    console.log('수정 후 이미지 요청')
    isDisabled.value = true

    if (logoImagefile.value && logoImagefile.value instanceof Blob) {
      let reader = new FileReader()

      reader.onload = async (e) => {
        const convertedImage = new Uint8Array(e.target.result)
        const response = await voccStore.changeLogoImage(convertedImage)

        console.dir(response)

        if (response == 200) {
          showResMsg('선사 정보가 업데이트 되었습니다')
        }
      }

      reader.readAsArrayBuffer(logoImagefile.value)
    } else {
      showResMsg('선사 정보가 업데이트 되었습니다')
    }
  }
}

const fetchVoccInformation = async () => {
  await voccStore.fetchMyVoccInfo()
  editForm.value = { ...voccStore.voccInfo }
  editForm.value.logoImage = `data:image/png;base64,${editForm.value.logoImage}`
  preview.value = `${editForm.value.logoImage}`
}

const logoFileUploader = ref()
const uploadBtnClick = () => {
  logoFileUploader.value.click()
}

const logoImagefile = ref([])
const previewFile = (e) => {
  logoImagefile.value = e.target.files[0]
  let reader = new FileReader()

  let imageType = e.target.files[0].type

  if (imageType != 'image/png' && imageType != 'image/jpeg') {
    showResMsg('파일 확장자가 png, jpg인 파일을 업로드해주세요 ')
    return
  }

  if (logoImagefile.value !== null) {
    reader.onload = (e) => {
      preview.value = reader.result
      editForm.value.logoImage = reader.result
    }
    reader.readAsDataURL(logoImagefile.value)
  } else {
    preview.value = ''
  }
}
</script>

<style></style>
