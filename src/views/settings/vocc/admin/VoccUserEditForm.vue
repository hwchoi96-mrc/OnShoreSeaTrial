<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 사용자 수정</div>
    </v-card-title>
    <v-card-text class="title-form-container">
      <v-form @submit.prevent>
        <div class="mb-1">선사명</div>
        <i-input type="text" v-model="voccUserInfo.voccName" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">아이디</div>
        <i-input type="text" v-model="voccUserInfo.username" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <div class="d-flex">
          <i-input type="password" v-model="voccUserInfo.password" class="mr-2" :disabled="true"/>
          <i-btn text="비밀번호 초기화" width="120" @click="showPasswordResetModal"></i-btn>
        </div>
        <div class="mt-4 mb-1">닉네임</div>
        <i-input
          type="text"
          v-model="voccUserInfo.nickname"
          placeholder="닉네임을 입력하여 주십시오"
          :disabled="true"
        >
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input
          type="text"
          v-model="voccUserInfo.email"
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
          <div class="align-self-center">{{ convertRoleName(voccUserInfo.role) }}</div>
          <i-btn text="권한 변경" @click="showEditRoleModal()"></i-btn>
        </div>

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
          <p>초기화된 비밀번호는 <br />해당 선사 사용자의 이메일로 발송됩니다</p>
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
            @confirm="removeVoccUser"
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
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, inject, ref, defineProps, watchEffect,toRef } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useLoadingStore } from '@/stores/loadingStore'

import { useToast } from '@/composables/useToast'
import { isStatusOk } from '@/composables/util'
import { convertRoleName } from '@/composables/user'
import AppModal from '@/components/modal/AppModal.vue'
const { showResMsg } = useToast()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const loadingStore = useLoadingStore()

const { voccInfo, voccUserInfo } = storeToRefs(voccStore)
const { loadingStatus } = storeToRefs(loadingStore)

const props = defineProps({
  voccId: {
    type: [Number, String]
  },
  voccUserId: {
    type: [Number, String]
  }
})

const toggleStatus = ref('')
const isDisabledInactive = ref('')
const isDisabledActive = ref('')
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '수정 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'delete', text: '계정 삭제', color: '#4E83FF', width: '48%' }
]

const fetchVoccInformation = async () => {
  await voccStore.fetchMyVoccInfo()
}
const getInfo = async () => {
  await voccStore.getVoccUserInfo(props.voccId, props.voccUserId)
    .then((response) => {
      voccUserInfo.value.password = '********'
      toggleStatus.value = voccUserInfo.value.activated
      if(toggleStatus.value){
        isDisabledActive.value = true
        isDisabledInactive.value = false
      }else{
        isDisabledInactive.value = true
        isDisabledActive.value = false
      }
    })
    .catch((error) => {
      console.error()
      showResMsg('네트워크 오류')
    })
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
  const userName = voccUserInfo.value.username
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
  isShowStautsModal.value = false
  toggleStatus.value = voccUserInfo.value.activated
}

const changeAcitveStatus = async () => {
  const userName = voccUserInfo.value.username
  const activate = voccUserInfo.value.activated
  const type = 'voccUser'

  const result = await voccStore.changeActive(userName, !activate, type)
  if (isStatusOk(result)) {
    isShowStautsModal.value = false
    showResMsg('상태를 성공적으로 변경하였습니다')
    emit('refresh')
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
  const selectedUserRole = voccUserInfo.value.role

  let message = ''
  if (loggineUserRole == 'ROLE_LCC_ADMIN') {
    if (selectedUserRole == 'ROLE_LCC_ADMIN') {
      message = '정말로 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 시스템관리자로 권한 변경하시겠습니까?'
    }
  } else {
    if (selectedUserRole == 'ROLE_VOCC_ADMIN') {
      message = '정말로 사용자로 권한 변경하시겠습니까?'
    } else {
      message = '정말로 관리자로 권한 변경하시겠습니까?'
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
  const selectedUserRole = voccUserInfo.value.role
  const loggineUserRole = sessionStorage.getItem('userRole')

  // 현재 권한이 일반 사용자인지
  if (selectedUserRole === 'ROLE_VOCC_USER') {
    role = loggineUserRole === 'ROLE_LCC_ADMIN' ? 'ROLE_LCC_ADMIN' : 'ROLE_VOCC_ADMIN'
  } else {
    roleEditMessage.value = '정말로 일반사용자로 권한 변경하시겠습니까?'
    role = 'ROLE_VOCC_USER'
  }

  const editUserInfo = {
    username: voccUserInfo.value.username,
    userRole: role
  }

  try {
    await voccStore.changeRole(editUserInfo)
    showResMsg('권한이 성공적으로 변경되었습니다') // 권한 변경 성공 알림
    closeEditRoleModal()
    cancleChange()
    emit('refresh')
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

const removeVoccUser = async () => {
  let voccUserId = props.voccUserId
  const removeVoccUserInfo = {
    removeUserVoccName: voccInfo.value.name,
    removeUsername: voccUserInfo.value.username
  }
  await voccStore.removeVoccUser(voccUserId, removeVoccUserInfo)
  isShowDeleteModal.value = false
  await getVoccUserAll()
  cancleChange()
}
const getVoccUserAll = async () => {
  let voccId = voccInfo.value.id
  await voccStore.fetchMyVoccUsers()
}

const emit = defineEmits(['changeComponent', 'refresh'])
const changeComponent = inject('changeComponent', 'DefaultText')
const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}
watchEffect(async () => {
  getInfo()
}),
  { immediat: true }
onMounted(() => {
  const result = getInfo(props.voccUserId)
  if (!voccInfo.value) {
    fetchVoccInformation()
  }
})
</script>

<style scope>
.inactive {
  color: #737373 !important;
}
</style>
