<template>
  <v-sheet class="w-100 h-100 d-flex justify-center align-center">
    <div class="text-center">
      <v-img :src="noAccess" width="80px"></v-img>
      <p class="text-h6">접근할 수 있는 권한 또는 메뉴가 없습니다</p>
      <p class="text-h6"><span v-if="userInfo != null">로그아웃 후</span> 관리자에게 문의하세요</p>
      <div class="mt-5" v-if="userInfo != null">
        <i-btn text="로그아웃 하기" @click="logout"></i-btn>
      </div>
    </div>

  </v-sheet>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { onMounted } from 'vue';

import noAccess from '/images/error/no-access.png'

const store = useAuthStore()


let userInfo = ref('')
onMounted(() => {
  userInfo.value = sessionStorage.getItem('userInfo')
})

defineProps({
  message: {
    type: String
  }
}
)

const logout = () => {
  store.logoutUser()
}

</script>

<style></style>