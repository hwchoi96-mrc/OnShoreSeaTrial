<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 관리자 수정</div>
    </v-card-title>

    <v-card-text class="title-form-container">
      <v-form @submit.prevent>
        <div class="mb-1">선사명</div>
        <i-input type="text" v-model="voccAdminInfo.voccName" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">아이디</div>
        <i-input type="text" v-model="voccAdminInfo.username" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <div class="d-flex">
          <i-input type="password" v-model="voccAdminInfo.password" class="mr-2" :disabled="true" />
          <i-btn text="비밀번호 초기화" width="120" @click="showPasswordResetModal"></i-btn>
        </div>
        <div class="mt-4 mb-1">닉네임</div>
        <i-input
          type="text"
          v-model="voccAdminInfo.nickname"
          placeholder="닉네임을 입력하여 주십시오"
          :disabled="true"
        >
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input
          type="text"
          v-model="voccAdminInfo.email"
          placeholder="이메일을 입력하여 주십시오"
          :disabled="true"
        >
        </i-input>
        <!-- 활성화 상태 -->
        <div class="mt-4 mb-1">활성화 상태</div>
        <v-btn-toggle v-model="toggleStatus" color="#5789FE">
          <i-btn text="사용가능" @click="showStautsModal()" :value="true" :disabled="isDisabledActive"></i-btn>
          <i-btn text="계정잠금" @click="showStautsModal()" :value="false" :disabled="isDisabledInactive"></i-btn>
        </v-btn-toggle>
        <!-- 계정권한 -->
        <div class="mt-4 mb-1">계정 권한</div>
        <div class="d-flex ga-3">
          <div class="align-self-center">{{ convertRoleName(voccAdminInfo.role) }}</div>
          <i-btn text="권한 변경" @click="showEditRoleModal()"></i-btn>
        </div>
        <!-- 화면모드 -->
        <div class="mt-4 mb-1">화면모드</div>
        <v-btn-toggle v-model="toggleDisplay" color="#5789FE">
          <i-btn text="일반화면" @click="showDisplayModeModal()" :value="false" :disabled="isDisabledNormal"></i-btn>
          <i-btn text="관제화면" @click="showDisplayModeModal()" :value="true" :disabled="isDisabledAdmin"></i-btn>
        </v-btn-toggle>

        <i-btnGroup
          class="d-flex justify-space-between mt-8"
          :btnGroup="btnGroup"
          @cancle="cancleChange($event)"
          @delete="showDeleteModal"
        ></i-btnGroup>
      </v-form>
      <!-- 비밀번호 초기화 팝업 -->
      <AppModal
        v-model="isShowPasswordResetModal"
        @close="closePasswordResetModal"
        title="정말로 비밀번호 초기화 하시겠습니까? "
      >
        <template #default>
          <p>초기화된 비밀번호는 <br />선사 관리자의 이메일로 발송됩니다</p>
        </template>
        <template #actions>
          <i-btnGroup
            type="confirm"
            @close="closePasswordResetModal"
            @confirm="resetPassword"
          ></i-btnGroup>
        </template>
      </AppModal>
      <!-- 계정 활성상태 변경 팝업 -->
      <AppModal v-model="isShowStautsModal" @close="closeStautsModal">
        <template #default>
          <p>{{ statusModalMessage }}</p>
        </template>
        <template #actions>
          <i-btnGroup
            type="confirm"
            @close="closeStautsModal"
            @confirm="changeAcitveStatus"
          ></i-btnGroup>
        </template>
      </AppModal>
      <!-- 계정 삭제 팝업 -->
      <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">
        <template #default>
          <p>정말로 계정을 삭제 처리 하시겠습니까?</p>
        </template>
        <template #actions>
          <i-btnGroup
            type="confirm"
            @close="closeDeleteModal"
            @confirm="removeAdmin"
          ></i-btnGroup>
        </template>
      </AppModal>
      <!-- 계정 권한 변경 팝업 -->
      <AppModal v-model="isShowEditRoleModal" @close="closeEditRoleModal">
        <template #default>
          <p>{{ roleEditMessage }}</p>
        </template>
        <template #actions>
          <i-btnGroup
            type="confirm"
            @close="closeEditRoleModal"
            @confirm="editUserRole"
          ></i-btnGroup>
        </template>
      </AppModal>

      <AppModal
        v-model="isShowRoleChangeAlert"
        @close="handleRoleChangeAlertClose"
        title="권한 변경 완료"
      >
        <template #default>
          <p>권한이 성공적으로 변경되었습니다.</p>
          <p>확인 버튼을 누르면 로그아웃됩니다.</p>
        </template>
        <template #actions>
          <i-btn text="확인" @click="handleRoleChangeAlertClose"></i-btn>
        </template>
      </AppModal>
      <!-- 화면모드 변경 팝업 -->
      <AppModal v-model="isShowDisplayModeModal" @close="closeDisplayModeModal">
        <template #default>
          <p>{{ displayModeModalMessage }}</p>
        </template>
        <template #actions>
          <i-btnGroup
            type="confirm"
            @close="closeDisplayModeModal"
            @confirm="changeDisplayMode"
          ></i-btnGroup>
        </template>
      </AppModal>
      <AppModal
        v-model="isShowDisplayModeAlert"
        @close="handleDisplayModeAlertClose"
        title="화면 변경 완료"
      >
        <template #default>
          <p>화면이 성공적으로 변경되었습니다.</p>
          <p>확인 버튼을 누르면 로그아웃됩니다.</p>
        </template>
        <template #actions>
          <i-btn text="확인" @click="handleDisplayModeAlertClose"></i-btn>
        </template>
      </AppModal>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, inject, ref, defineProps, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { getMyVoccInfo } from '@/api/voccApi'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useLoadingStore } from '@/stores/loadingStore'
import { useAdminStore } from '@/stores/adminStore.js'
import { useToast } from '@/composables/useToast'
import { isStatusOk } from '@/composables/util'

import AppModal from '@/components/modal/AppModal.vue'
const { showResMsg } = useToast()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const adminStore = useAdminStore()
const loadingStore = useLoadingStore()
const { voccAdminInfo } = storeToRefs(voccStore)
const { loadingStatus } = storeToRefs(loadingStore)

const props = defineProps({
  voccId: {
    type: [Number, String]
  },
  userId: {
    type: [Number, String]
  },
  voccAdminCount: {
    type: Number,
    default: 0
  }
})

const toggleStatus = ref('')
const isDisabledInactive = ref('')
const isDisabledActive = ref('')
const toggleDisplay = ref('')
const isDisabledAdmin = ref('')
const isDisabledNormal = ref('')
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '수정 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'delete', text: '계정 삭제', color: '#4E83FF', width: '48%' }
]
const emits = defineEmits(['changeComponent', 'refresh'])
const isShowRoleChangeAlert = ref(false)
const fetchVoccInfo = async () => {
  const {
    data: { data }
  } = await getMyVoccInfo()

  voccAdminInfo.value.voccName = data.name
}
const getInfo = async () => {
  await voccStore.fetchVoccAdminInfo(props.voccId, props.userId)
  toggleStatus.value = voccAdminInfo.value.activated
  toggleDisplay.value = voccAdminInfo.value.displayMode

  //선택된 버튼은 다시 선택 못하도록
  //true이면 관제용 false는 일반용
  if(toggleDisplay.value){//true
    isDisabledAdmin.value = true
    isDisabledNormal.value = false
  }else{//false
    isDisabledAdmin.value = false
    isDisabledNormal.value = true
  }
  //true이면 사용가능 false는 잠금
  if(toggleStatus.value){
    isDisabledActive.value = true
    isDisabledInactive.value = false
  }else{
    isDisabledActive.value = false
    isDisabledInactive.value = true
  }
}

const handleRoleChangeAlertClose = async () => {
  isShowRoleChangeAlert.value = false
  await authStore.logoutUser() // 로그아웃 수행
}

/**
 * 비밀번호 초기화
 */
const isShowPasswordResetModal = ref(false)
const showPasswordResetModal = () => {
  isShowPasswordResetModal.value = true
}
const closePasswordResetModal = () => {
  isShowPasswordResetModal.value = false
}

const resetPassword = async () => {
  const userName = voccAdminInfo.value.username
  loadingStatus.value = true
  try {
    const result = await authStore.resetPassword(userName)

    if (isStatusOk(result)) {
      showResMsg('비밀번호가 성공적으로 초기화 되었습니다')
      setTimeout(() => {
        isShowPasswordResetModal.value = false
      }, 500)
    }
  } catch (error) {
    if (error.response.data) {
      const errMsg = error.reponse.data.errorMsg
      showResMsg(errMsg)
    }
  } finally {
    loadingStatus.value = false
  }
}

/**
 * 계정 활성화 상태 변경
 */
const isShowStautsModal = ref(false)
const statusModalMessage = ref('')

const showStautsModal = () => {
  if (toggleStatus.value) {
    statusModalMessage.value = '정말로 계정을 활성화 하시겠습니까?'
  } else {
    statusModalMessage.value = '정말로 계정을 비활성화 하시겠습니까?'
  }
  isShowStautsModal.value = true
}

const closeStautsModal = () => {
  toggleStatus.value = voccAdminInfo.value.activated
  isShowStautsModal.value = false
}

const changeAcitveStatus = async () => {
  const userName = voccAdminInfo.value.username
  const activate = toggleStatus.value
  const type = 'voccAdmin'
  const result = await voccStore.changeActive(userName, activate, type)
  if (isStatusOk(result)) {
    isShowStautsModal.value = false
    showResMsg('상태를 성공적으로 변경하였습니다')
    emits('refresh')
  }
  setDisabledStatusBtn()
}
const setDisabledStatusBtn = () => {//선택된 버튼은 다시 선택 못하도록
  if(toggleStatus.value){
    isDisabledActive.value = true
    isDisabledInactive.value = false
  }else{
    isDisabledActive.value = false
    isDisabledInactive.value = true
  }
}

/**
 * 계정 권한 변경
 */
const isShowEditRoleModal = ref(false)
const roleEditMessage = ref('')
const loggineUserRole = sessionStorage.getItem('userRole')

const showEditRoleModal = () => {
  const selectedUserRole = voccAdminInfo.value.role

  let message = ''
  if (loggineUserRole == 'ROLE_LCC_ADMIN') {
    if (selectedUserRole == 'ROLE_LCC_ADMIN') {
      message = '정말로 선사 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 시스템관리자로 권한 변경하시겠습니까?'
    }
  } else {
    if (selectedUserRole == 'ROLE_VOCC_ADMIN') {
      message = '정말로 선사 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 선사관리자로 권한 변경하시겠습니까?'
    }
  }
  roleEditMessage.value = message
  isShowEditRoleModal.value = true
}
const closeEditRoleModal = () => {
  isShowEditRoleModal.value = false
}

const editUserRole = async () => {
  let role
  const selectedUserRole = voccAdminInfo.value.role
  const loggineUserRole = sessionStorage.getItem('userRole')

  if (props.adminCount === 1) {
    showResMsg('관리자가 1명일 경우, 선사 사용자로 권한을 변경할 수 없습니다.')
    isShowDeleteModal.value = false
    return
  }

  // 현재 권한이 일반 사용자인지
  if (selectedUserRole === 'ROLE_VOCC_USER') {
    role = loggineUserRole === 'ROLE_LCC_ADMIN' ? 'ROLE_LCC_ADMIN' : 'ROLE_VOCC_ADMIN'
  } else {
    // roleEditMessage.value = '정말로 일반사용자로 권한 변경하시겠습니까?'
    role = 'ROLE_VOCC_USER'
  }

  const editUserInfo = {
    username: voccAdminInfo.value.username,
    userRole: role
  }

  try {
    await voccStore.changeRole(editUserInfo)
    showResMsg('권한이 성공적으로 변경되었습니다') // 권한 변경 성공 알림
    if (voccAdminInfo.value.username === authStore.userInfo.username) {
      isShowRoleChangeAlert.value = true // 권한 변경 후 알림 모달 표시
    } else {
      closeEditRoleModal()
      cancleChange()
      emits('refresh')
    }
  } catch (error) {
    showResMsg('권한 변경에 실패했습니다') // 권한 변경 실패 알림
  }
}

/**
 * 계정 삭제
 */

const isShowDeleteModal = ref(false)
const showDeleteModal = () => {
  isShowDeleteModal.value = true
}
const closeDeleteModal = () => {
  isShowDeleteModal.value = false
}

const removeAdmin = async () => {
  if (props.voccAdminCount === 1) {
    showResMsg('최소 한 명의 관리자가 필요합니다.')
    isShowDeleteModal.value = false
    return
  }

  const removeAdminInfo = {
    removeUserVoccName: voccAdminInfo.value.voccName,
    removeUsername: voccAdminInfo.value.username
  }

  const result = await voccStore.removeAdmin(removeAdminInfo)

  if (isStatusOk(result)) {
    isShowDeleteModal.value = false
    emits('refresh')
    showResMsg('선사 관리자가 성공적으로 삭제되었습니다')
    cancleChange()
  }
}

const convertRoleName = (role) => {
  const roleMap = {
    ROLE_VOCC_ADMIN: '선사 관리자',
    ROLE_VOCC_USER: '선사 사용자',
    ROLE_LCC_ADMIN: '시스템 관리자'
  }
  return roleMap[role] || '알 수 없는 역할'
}

/**
 * 화면 모드 변경
 */
 const isShowDisplayModeModal = ref(false)
 const isShowDisplayModeAlert = ref(false)
 const displayModeModalMessage = ref('')

const showDisplayModeModal = () => {
  if (toggleDisplay.value) {
      displayModeModalMessage.value = '관제센터용 화면으로 변경하시겠습니까?'
    } else {
      displayModeModalMessage.value = '일반화면으로 변경하시겠습니까?'
    }
    isShowDisplayModeModal.value = true
}

const closeDisplayModeModal = () => {
  toggleDisplay.value = voccAdminInfo.value.displayMode
  isShowDisplayModeModal.value = false
}

const changeDisplayMode = async () => {
  const userName = voccAdminInfo.value.username
  const displayMode = toggleDisplay.value
  const result = await adminStore.updateDisplayMode(userName, displayMode)

  if (isStatusOk(result)) {
    isShowDisplayModeModal.value = false
    showResMsg('화면을 성공적으로 변경하였습니다.')
  }

  setDisabledDisplayBtn()
  isShowDisplayModeAlert.value = true
}

const setDisabledDisplayBtn = () => {//선택된 버튼은 다시 선택 못하도록
  if(toggleDisplay.value){
    isDisabledAdmin.value = true
    isDisabledNormal.value = false
  }else{
    isDisabledNormal.value = true
    isDisabledAdmin.value = false
  }
}

const handleDisplayModeAlertClose = async () => {
  isShowDisplayModeAlert.value = false
  await authStore.logoutUser()
}
const changeComponent = inject('changeComponent', 'DefaultText')

const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}
watchEffect(async () => {
  getInfo()
}),
  { immediat: true }
onMounted(() => {
  fetchVoccInfo()
  getInfo()
  setDisabledDisplayBtn()
})
</script>

<style scope>
.inactive {
  color: #737373 !important;
}
</style>
