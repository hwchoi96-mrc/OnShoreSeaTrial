<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 사용자 등록</div>
    </v-card-title>

    <v-card-text class="title-form-container">
      <v-form @submit.prevent v-model="isDisabled">
        <div class="mb-1">선사명</div>
        <v-autocomplete
          :items="voccs"
          item-title="name"
          item-value="name"
          placeholder="선사명을 선택해주세요"
          v-model="registerForm.voccName"
          variant="solo-filled"
          density="compact"
          bg-color="#434348"
        >
        </v-autocomplete>
        <div class="mb-1">아이디</div>
        <i-input
          type="text"
          v-model="registerForm.username"
          placeholder="아이디를 입력하여 주십시오"
          required
          :hide-details="false"
        >
        </i-input>
        <div class="mb-1">비밀번호</div>
        <i-input
          v-model="registerForm.password"
          :type="isShowPassword ? 'text' : 'password'"
          :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="isShowPassword = !isShowPassword"
          required
          password
          placeholder="비밀번호를 입력하여 주십시오"
          :hide-details="false"
        >
        </i-input>
        <div class="mt-1 mb-1">비밀번호 확인</div>
        <i-input
          v-model="registerForm.passwordCheck"
          placeholder="비밀번호를 입력하여 주십시오"
          :type="isShowPasswordCheck ? 'text' : 'password'"
          :append-inner-icon="isShowPasswordCheck ? 'mdi-eye' : 'mdi-eye-off'"
          :hide-details="false"
          @click:append-inner="isShowPasswordCheck = !isShowPasswordCheck"
          required
          password
          :rules="[rePasswordRules.check]"
        >
        </i-input>
        <div class="mt-1 mb-1">닉네임</div>
        <i-input
          type="text"
          v-model="registerForm.nickname"
          placeholder="닉네임을 입력하여 주십시오"
          required
          :hide-details="false"
        >
        </i-input>
        <div class="mt-1 mb-1">이메일</div>
        <i-input
          type="text"
          v-model="registerForm.email"
          placeholder="이메일을 입력하여 주십시오"
          required
          email
          :hide-details="false"
        >
        </i-input>
        <div class="mt-1 mb-1">계정 권한</div>
        <span>선사 사용자</span>
      </v-form>

      <div class="d-flex justify-space-between mt-8">
        <i-btn width="48%" text="취소" color="#5E616A" @click="cancleChange"></i-btn>
        <i-btn
          width="48%"
          text="등록"
          color="#4E83FF"
          @click="registerVoccUserByAdmin"
          :disabled="!isDisabled"
        ></i-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref, reactive, inject, defineProps } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'
import { goPage, isStatusOk } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'

import BaseChangeForm from '@/layout/modify/BaseChangeForm.vue'

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)

const adminStore = useAdminStore()

const isShowPassword = ref(false)
const isShowPasswordCheck = ref(false)
const rePasswordRules = reactive({
  check: (value) => {
    if (value && registerForm.value.passwordCheck && value === registerForm.value.passwordCheck) {
      return true
    }
    return '비밀번호가 일치하지않습니다'
  }
})

const authStore = useAuthStore()

const { showResMsg } = useToast()
const isDisabled = ref(false)

const props = defineProps({
  voccId: Number
})

const voccId = props.voccId
const voccs = ref()

const registerForm = ref({
  voccName: '',
  username: '',
  password: '',
  passwordCheck: '',
  nickname: '',
  email: '',
  activated: true
})

onMounted(() => {
  fetchVoccs()
  if (!voccInfo.value) {
    fetchVoccInformation()
  }
})

/**
 * 선사 목록 조회
 */
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  console.dir(result)
  voccs.value = result
}

const fetchVoccInformation = async () => {
  await voccStore.fetchMyVoccInfo()
  console.dir(voccInfo.value)
}

const registerVoccUserByAdmin = async () => {
  const voccId = props.voccId
  const result = await adminStore.registerVoccUserByAdmin(voccId, registerForm.value)

  if (isStatusOk(result)) {
    showResMsg('사용자 등록이 성공적으로 되었습니다')
    cancleChange()
    emits('refresh')
  }
}

const emits = defineEmits(['changeComponent', 'refresh'])
const changeComponent = inject('changeComponent', 'DefaultText')

const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}
</script>

<style></style>
