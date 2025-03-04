<template>
  <v-card class="h-100">
    <v-card-title>
      <div>선사 사용자 수정</div>
    </v-card-title>
    <v-card-text class="title-form-container">
      <v-form @submit.prevent>
        <div class="mb-1">선사명</div>
        <i-input type="text" v-model="voccUserEditForm.voccName" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">아이디</div>
        <i-input type="text" v-model="voccUserEditForm.username" :disabled="true"> </i-input>
        <div class="mt-4 mb-1">비밀번호</div>
        <div class="d-flex">
          <i-input type="password" v-model="voccUserEditForm.password" class="mr-2" :disabled="true"/>
          <i-btn text="비밀번호 초기화" width="120" @click="showPasswordResetModal"></i-btn>
        </div>
        <div class="mt-4 mb-1">닉네임</div>
        <i-input
          type="text"
          v-model="voccUserEditForm.nickname"
          placeholder="닉네임을 입력하여 주십시오"
          :disabled="true"
        >
        </i-input>
        <div class="mt-4 mb-1">이메일</div>
        <i-input
          type="text"
          v-model="voccUserEditForm.email"
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
          <div class="align-self-center">{{ convertRoleName(voccUserEditForm.role) }}</div>
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
            @confirm="changeAcitveStatusByAdmin"
          ></i-btnGroup>
        </template>
      </AppModal>

      <!-- 계정 삭제 팝업 -->
      <AppModal v-model="isShowDeleteModal" @close="closeDeleteModal">
        <template #default>
          <p>정말로 계정을 삭제 처리 하시겠습니까?</p>
        </template>

        <template #actions>
          <i-btnGroup type="confirm" @close="closeDeleteModal" @confirm="removeVoccUser"></i-btnGroup>
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
import { onMounted, inject, ref, defineProps, watchEffect, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'
import { useLoadingStore } from '@/stores/loadingStore'

import { convertRoleName } from '@/composables/user'
import { isStatusOk } from '@/composables/util'
import { useToast } from '@/composables/useToast'

import AppModal from '@/components/modal/AppModal.vue'

const { showResMsg } = useToast()
const authStore = useAuthStore()
const voccStore = useVoccStore()
const adminStore = useAdminStore()

const { voccInfo, voccUserInfo } = storeToRefs(adminStore)
const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)

const props = defineProps({
  voccId: {
    type: [Number, String]
  },
  voccUserId: {
    type: [Number, String]
  }
})
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '수정 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'delete', text: '계정 삭제', color: '#4E83FF', width: '48%' }
]

const toggleStatus = ref('')
const isDisabledInactive = ref('')
const isDisabledActive = ref('')
const voccUserEditForm = ref({
  voccName: '',
  username: '',
  password: '',
  nickname: '',
  email: '',
  role: ''
})
/**
 * 사용자가 선택한 사용자 정보 조회
 */
const fetchVoccInformation = async () => {
  await voccStore.fetchMyVoccInfo()
}

/**
 * 수정 버튼 클릭 시, EditForm은 이미 렌더링 된 상태라서
 * 정보가 재조회가 안되는 문제 발생
 * => voccUserId가 바뀌면 사용자 정보 조회하는 함수 재호출
 */
const getInfo = async () => {
  await adminStore.getVoccUserInfo(props.voccId, props.voccUserId)
  voccUserEditForm.value = { ...voccUserInfo.value }
  voccUserEditForm.value.password = '********'
  toggleStatus.value = voccUserEditForm.value.activated
  //선택된 버튼은 다시 선택 못하도록
  //true이면 사용가능 false는 잠금
  if(toggleStatus.value){
    isDisabledActive.value = true
    isDisabledInactive.value = false
  }else{
    isDisabledActive.value = false
    isDisabledInactive.value = true
    
  }
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
  const userName = voccUserEditForm.value.username
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
  toggleStatus.value = voccUserEditForm.value.activated
}

const changeAcitveStatusByAdmin = async () => {
  const userName = voccUserEditForm.value.username
  const activate = toggleStatus.value
  const result = await adminStore.changeActiveByAdmin(userName, activate)

  if (isStatusOk(result.status)) {
    isShowStautsModal.value = false
    showResMsg('상태를 성공적으로 변경하였습니다')
    emits('refresh')
  }
  setDisabledStatusBtn()
}
const setDisabledStatusBtn = () => {//선택된 버튼은 다시 선택 못하도록
  //true이면 사용가능 false는 잠금
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

const showEditRoleModal = () => {
  const selectedUserRole = voccUserEditForm.value.role
  const voccName = voccUserEditForm.value.voccName
  console.dir(voccUserEditForm.value.role)

  let message = ''
  if (voccName === 'UIPA') {
    if (selectedUserRole == 'ROLE_VOCC_ADMIN') {
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
  const selectedUserRole = voccUserEditForm.value.role
  const voccName = voccUserEditForm.value.voccName
  // 현재 권한이 일반 사용자인지
  if (voccName === 'UIPA') {
    role = 'ROLE_LCC_ADMIN'
  } else {
    role = selectedUserRole === 'ROLE_VOCC_ADMIN' ? 'ROLE_USER' : 'ROLE_VOCC_ADMIN'
  }

  const editUserInfo = {
    username: voccUserEditForm.value.username,
    userRole: role
  }

  try {
    await adminStore.changeRole(editUserInfo)
    showResMsg('권한이 성공적으로 변경 되었습니다')
    closeEditRoleModal() // 모달 닫기
    cancleChange() // 수정 취소 처리
    emits('refresh') // 사용자 목록 업데이트
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
    removeUserVoccName: voccUserEditForm.value.voccName,
    removeUsername: voccUserEditForm.value.username
  }

  const result = await adminStore.removeVoccUser(voccUserId, removeVoccUserInfo)

  if (isStatusOk(result)) {
    isShowDeleteModal.value = false
    cancleChange()
    emits('refresh')
  }
}

/**
 * 수정 취소 버튼 클릭 시,
 * DefaultText 컴포넌트로 변경
 */
const emits = defineEmits(['changeComponent', 'refresh'])
const changeComponent = inject('changeComponent', 'DefaultText')

const cancleChange = (e) => {
  changeComponent(e, 'DefaultText')
}
onMounted(() => {
  const result = getInfo(props.voccUserId)
  if (!voccInfo.value) {
    fetchVoccInformation()
  }
})
watchEffect(
  async () => {
    getInfo()
  },
  { immediate: true }
)
</script>

<style scope></style>
