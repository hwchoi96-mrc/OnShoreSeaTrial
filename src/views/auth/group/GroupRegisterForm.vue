<template>
  <FormModal ref="formModal" width="600px">
    <template #title
      ><v-row><v-col>새로운 그룹 추가</v-col></v-row></template
    >
    <template #content>
      <v-container class="d-flex justify-center flex-column">
        <v-row justify="center">
          <v-col
            ><v-text-field
              v-model="groupName"
              label="그룹명"
              clearable
              variant="outlined"
              dirty
            ></v-text-field
          ></v-col>
        </v-row>
      </v-container>
    </template>
    <template #footer><v-btn class="w-100 bg-btn" @click="registerGroup">등록</v-btn></template>
  </FormModal>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref, reactive, defineProps } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { goPage } from '@/composables/util.js'

import FormModal from '@/components/modal/FormModal.vue'

const store = useAuthStore()
const voccStore = useVoccStore()
const show = ref(false)
const rules = reactive({
  // min: (value) => {
  //   let regPass = /^(?=.*[a-zA-Z])(?=.*.*[!@#$%^*+=-])(?=.*[0-9]).{8,}$/
  //   return regPass.test(value) || '영문,숫자, 특수문자를 조합하여 최소 8자 이상 입력해주세요'
  // }
  // required: (value) => {
  //   value != null || value != undefined || "필수 입력 항목입니다";
  // },
})

const formModal = ref(null)
// const test = () => {
//   isActive.value = true
//

const dirty = ref(true)

const prop = defineProps(['isActive'])
const groupName = ref()

const registerGroup = () => {
  const result = store.registerGroup(groupName.value)
}

const closePopup = () => {
  prop.isActive = false
}

// const callRegisterForm = () => {
//   formModal.value.isActive = true
// }

defineExpose({
  closePopup
})
// defineExpose({
//   isActive,
//   closePopup,
//   callRegisterForm,
//   test
// })
</script>

<style></style>
