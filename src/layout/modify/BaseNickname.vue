<template>
  <BaseChangeForm>
    <template #title>
      <div>닉네임 변경</div>
    </template>
    <template #content>
      <v-form @submit.prevent>
        <div class="mb-1">새 닉네임 입력</div>
        <i-input v-model="nickNameEditForm.newNickname" placeholder="새 닉네임을 입력하여 주십시오"></i-input>
      </v-form>
    </template>
    <template #actions>
      <i-btnGroup class="mt-4 d-flex justify-space-between" :btnGroup="btnGroup" @cancle="resetComponent"
        @edit="changeNickname"></i-btnGroup>
    </template>
  </BaseChangeForm>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { storeToRefs } from 'pinia'
import BaseChangeForm from '@/layout/modify/BaseChangeForm.vue'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const nickNameEditForm = ref({
  username: '',
  newNickname: ''
})
const btnGroup = [
  { id: 'cancel-btn', action: 'cancle', text: '변경 취소', color: '#5E616A', width: '48%' },
  { id: 'change-btn', action: 'edit', text: '닉네임 변경', color: '#4E83FF', width: '48%' },
]

/**
 * 닉네임 변경 로직
 */
const changeNickname = async() => {
  let userName;

  if (userInfo.value != null) {
    userName = userInfo.value.username
  } else {
    // 피니아에 저장된 정보가 없는 경우
    userName = sessionStorage.getItem('userInfo')['userName']
  }
  nickNameEditForm.value.username = userName
  const result = await authStore.changeUserNickname(nickNameEditForm.value)
  
  if (result == 200) {
    setTimeout(() => {
      resetComponent();
    }, 500)
  }
}

/**
 * 동적 컴포넌트 변경
 */
const changeComponent = inject('changeComponent', 'DefaultText')
const resetComponent = (e) => {
  changeComponent(e, 'DefaultText')
}

</script>

<style></style>
