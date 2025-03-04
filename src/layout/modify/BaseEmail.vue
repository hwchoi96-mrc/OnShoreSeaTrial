<template>
  <BaseChangeForm>
    <template #title>
      <div>이메일 변경</div>
    </template>
    <template #content>
      <v-form @submit.prevent v-model="editStatus">
        <div class="mb-1">새 이메일을 입력</div>
        <i-input
          v-model="emailEditForm.newEmail"
          email
          :hide-details="false"
          placeholder="새 이메일을 입력하여 주십시오"
        ></i-input>
      </v-form>
    </template>
    <template #actions>
      <div class="d-flex justify-space-between">
        <i-btn text="변경 취소" @click="resetComponent" color="#5E616A" width="48%"></i-btn>
        <i-btn
          text="비밀번호 변경"
          @click="changeEmail"
          :disabled="!editStatus"
          width="48%"
        ></i-btn>
      </div>
    </template>
  </BaseChangeForm>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'
import { goPage } from '@/composables/util.js'
import BaseChangeForm from '@/layout/modify/BaseChangeForm.vue'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const emailEditForm = ref({
  username: '',
  newEmail: ''
})

const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '변경 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'edit', text: '이메일 변경', color: '#4E83FF', width: '48%' }
]

const editStatus = ref(false)

/**
 * 이메일 변경 로직
 */
const changeEmail = async () => {
  let userName

  if (userInfo.value != null) {
    userName = userInfo.value.username
  } else {
    // 피니아에 저장된 정보가 없는 경우
    userName = sessionStorage.getItem('userInfo')['userName']
  }
  emailEditForm.value.username = userName
  const result = await authStore.changeUserEmail(emailEditForm.value)

  if (result == 200) {
    setTimeout(() => {
      resetComponent()
    }, 500)
  }
}

const changeComponent = inject('changeComponent', 'DefaultText')
const resetComponent = (e) => {
  changeComponent(e, 'DefaultText')
}
</script>

<style></style>
