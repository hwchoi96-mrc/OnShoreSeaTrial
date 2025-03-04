<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 관리자 등록</div>
    </v-card-title>
    <v-card-text class="title-form-container">
      <v-form @submit.prevent v-model="isDisabled">
        <div class="mb-1">선사명</div>
        <!-- <v-autocomplete :items="voccs" item-title="name" item-value="id" placeholder="선사명을 선택해주세요"
          v-model="registerForm.voccName" variant="solo-filled" density="compact" bg-color="#434348">
        </v-autocomplete> -->
        <i-input type="text" v-model="registerForm.voccName" disabled></i-input>
        <div class="mb-1">아이디</div>
        <i-input
          type="text"
          v-model="registerForm.username"
          placeholder="아이디를 입력하여 주십시오"
          required
        >
        </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <i-input
          v-model="registerForm.password"
          :type="isShowPassword ? 'text' : 'password'"
          :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="isShowPassword = !isShowPassword"
          required
          password
          :hide-details="false"
          placeholder="비밀번호를 입력하여 주십시오"
        >
        </i-input>
        <div class="mb-1">비밀번호 확인</div>
        <i-input
          v-model="registerForm.passwordCheck"
          :type="isShowPasswordCheck ? 'text' : 'password'"
          :append-inner-icon="isShowPasswordCheck ? 'mdi-eye' : 'mdi-eye-off'"
          :hide-details="false"
          @click:append-inner="isShowPasswordCheck = !isShowPasswordCheck"
          required
          password
          :rules="[rePasswordRules.check]"
          placeholder="비밀번호를 재입력하여 주십시오"
        >
        </i-input>
        <div class="mb-1">닉네임</div>
        <i-input
          type="text"
          v-model="registerForm.nickname"
          placeholder="닉네임을 입력하여 주십시오"
          required
        >
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input
          type="text"
          email
          :hide-details="false"
          v-model="registerForm.email"
          placeholder="이메일을 입력하여 주십시오"
          required
        >
        </i-input>
        <div class="mb-1">계정 권한</div>
        <span class="roleName">선사 관리자</span>
        <div class="d-flex justify-space-between mt-8">
          <i-btn width="48%" text="취소" color="#5E616A" @click="cancleChange"></i-btn>
          <i-btn
            width="48%"
            text="등록"
            color="#4E83FF"
            @click="registerVoccAdmin"
            :disabled="!isDisabled"
          ></i-btn>
        </div>
      </v-form>
      <!-- <i-btnGroup class="d-flex justify-space-between mt-8" :btnGroup="btnGroup" @cancle="cancleChange($event)"
        @delete="showDeleteModal"></i-btnGroup> -->
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref, reactive, inject, defineProps } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'

import { getMyVoccInfo } from '@/api/voccApi'

import { isStatusOk } from '@/composables/util'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  voccId: Number
})
const emits = defineEmits(['changeComponent', 'refresh'])
const changeComponent = inject('changeComponent', 'DefaultText')
const { showResMsg } = useToast()

const voccStore = useVoccStore()
// 관리자가 없는 선사 목록
const voccs = ref()

// 비밀번호 보이기 여부
const isShowPassword = ref(false)
const isShowPasswordCheck = ref(false)

// 유효성 검사 통과 안 할 경우, 버튼 비활성화
const isDisabled = ref(false)

const registerForm = ref({
  voccName: '', // 선사명
  username: '',
  password: '',
  passwordCheck: '',
  nickname: '',
  email: '',
  role: 'ROLE_VOCC_ADMIN'
})

onMounted(() => {
  fetchVoccInfo()
})

const fetchVoccInfo = async () => {
  const {
    data: { data }
  } = await getMyVoccInfo()

  console.dir(data)

  registerForm.value.voccName = data.name
}

// onMounted(() => {
//   fetchVoccs()
// })

/**
 * 선사 목록 조회
 */
// const fetchVoccs = async () => {
//   const result = await voccStore.fetchVoccs()
//   console.dir(result)
//   voccs.value = result;
// }

const registerVoccAdmin = async () => {
  const result = await voccStore.joinVoccAdmin(registerForm.value)

  if (isStatusOk(result)) {
    cancleChange()
    emits('refresh')
    showResMsg('관리자 등록이 성공적으로 되었습니다')
  }
}

const rePasswordRules = reactive({
  check: (value) => {
    if (value && registerForm.value.passwordCheck && value === registerForm.value.passwordCheck) {
      return true
    }
    return '비밀번호가 일치하지않습니다'
  }
})

const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}
</script>

<style scoped></style>
