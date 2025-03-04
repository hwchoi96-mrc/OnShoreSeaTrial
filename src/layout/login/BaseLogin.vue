<template>
  <div class="position-relative">
    <v-img :src="LoginBg" cover height="100vh"></v-img>
    <v-sheet class="loginForm rounded-lg pa-12" width="450px">
      <v-form @submit.prevent>
        <v-img :src="LogoX" :width="50" placeholder="아이디를 입력해주세요" class="mx-auto"></v-img>
        <div class="mb-1">아이디</div>
        <i-input
          label="아이디"
          v-model="loginInfo.username"
          placeholder="아이디를 입력해주세요"
        ></i-input>
        <div class="mt-3 mb-1">비밀번호</div>
        <i-input
          label="비밀번호"
          v-model="loginInfo.password"
          @keyup.enter="submit"
          class="mt-2"
          :type="show ? 'text' : 'password'"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show = !show"
          placeholder="비밀번호를 입력해주세요"
        ></i-input>
        <i-btn block @click="submit" class="w-100 my-8" height="45px" text="로그인"></i-btn>
      </v-form>

      <div class="d-flex justify-center">
        <div @click="findModal('findId')" class="findId">아이디 찾기</div>
        <div @click="findModal('findPassword')">비밀번호 찾기</div>
      </div>
    </v-sheet>

    <AppModal
      v-model="isShowIdFindModal"
      @close="findModal('findId')"
      title="아이디 찾기"
      width="400"
      color="#1F1E1E"
      closeIconColor="#fff"
    >
      <template #title>
        <div class="text-center pl-2">아이디 찾기</div>
      </template>
      <template #default>
        <div v-if="!userLoginId">
          <div class="idFindModal-info text-left">
            <p class="idFindModal-subTitle">이메일로 아이디를 찾습니다</p>
            <p class="inFindModal-infoText">등록된 이메일로 아이디를 찾습니다</p>
            <p class="inFindModal-infoText">이메일을 입력하여 주십시오</p>
          </div>
          <div class="mt-8">
            <p class="text-left">이메일</p>
            <i-input
              v-if="!userLoginId"
              type="email"
              :email="true"
              :hide-details="false"
              v-model="userEmail"
              placeholder="이메일을 입력하여 주십시오"
            ></i-input>
          </div>
        </div>
        <div v-else class="idFindModal-info text-center">
          <p class="inFindModal-infoText">귀하의 아이디는 다음과 같습니다</p>
          <p class="inFindModal-infoText text-h6" style="color: #fff">{{ userLoginId }}</p>
        </div>
      </template>

      <template v-if="!userLoginId" #actions>
        <i-btnGroup
          class="w-100 d-flex justify-space-between px-4 py-6"
          :btnGroup="btnGroup"
          @cancle="findModal('findId')"
          @confirm="findUserId"
        ></i-btnGroup>
      </template>
    </AppModal>

    <!-- 비밀번호 초기화 요청 팝업창 -->
    <AppModal
      v-model="isShowPasswordFindModal"
      @close="findModal('findPassword')"
      color="#1F1E1E"
      closeIconColor="#fff"
    >
      <template #default> 관리자에게 비밀번호 초기화 요청 부탁드립니다 </template>
    </AppModal>
    <div class="version">V 1.3</div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue'
import AppModal from '@/components/modal/AppModal.vue'
import Logo from '/images/logo/uipa-logo-removebg.png'
import LoginBg from '@/assets/images/login-bg.png'

import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'

import { goPage, logout, sse } from '@/composables/util.js'
import jsPDF from 'jspdf'
import { format } from 'echarts/core'

// 비밀번호 보이기 여부
const show = ref(false)

const loginInfo = ref({
  username: '',
  password: ''
})

const authStore = useAuthStore()
const submit = async () => {
  await authStore.loginUser(loginInfo.value)
}

/**
 * 팝업창 show 여부
 * name이 password 일 경우,
 */
const isShowIdFindModal = ref(false)
const isShowPasswordFindModal = ref(false)

const findModal = (name) => {
  if (name == 'findPassword') {
    isShowPasswordFindModal.value = !isShowPasswordFindModal.value
  } else if (name == 'findId') {
    console.log(isShowIdFindModal.value)
    isShowIdFindModal.value = !isShowIdFindModal.value
    console.log(isShowIdFindModal.value)
  }
  setTimeout(resetUserId, 1000)
}

const resetUserId = () => {
  userLoginId.value = ''
}

/**
 * 아이디 찾기 팝업창
 */
const userEmail = ref('') // 이메일 입력
const userLoginId = ref('')
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'confirm', text: '아이디 찾기', color: '#4E83FF', width: '48%' }
]

const findUserId = () => {
  authStore.findUserId(userEmail.value).then((response) => {
    userLoginId.value = response.data
    userEmail.value = ''
  })
}

const test = () => {
  var doc = new jsPDF('p', 'pt', 'letter')
  var loginForm = document.querySelector('.loginForm')
  doc.addPage({ format: 'a4' })
  doc.html(loginForm, {
    callback: function (doc) {
      // doc.autoPrint()
      doc.save('test.pdf')
    },
    margin: [72, 72, 72, 72],
    authPaging: 'text',
    html2canvas: {
      allowTaint: true,
      dpi: 300,
      letterRendering: true,
      logging: false,
      scale: 0.8
    }
  })

  // doc.setPage(1)
}
</script>

<style scoped>
.loginForm {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.findId::after {
  content: '';
  border-right: 1px solid #ffffff4d;
  margin: 0px 10px;
}

.version {
  position: absolute;
  right: 0.5%;
  bottom: 1%;
}
</style>
