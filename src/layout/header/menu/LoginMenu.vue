<template>
  <v-container>
    <v-row v-if="isAuthenticated == null" no-gutters class="d-flex flex-row-reverse">
      <v-col class="px-2 py-0 text-small text-center text-btn-title">
        <v-btn variant="text" @click="signup">회원가입</v-btn>
      </v-col>
      <v-col class="px-2 py-0 text-small text-center text-btn-title">
        <v-btn variant="text" @click="login">로그인</v-btn>
      </v-col>
    </v-row>

    <v-row v-else no-gutters class="d-flex flex-row-reverse">
      <v-col class="px-2 py-0 text-small text-center text-btn-title">
        <v-btn variant="text" @click="signup">마이페이지</v-btn>
      </v-col>
      <v-col class="px-2 py-0 text-small text-center text-btn-title">
        <v-btn variant="text" @click="logout">로그아웃</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { goPage } from '@/composables/util.js'
// import { useAuthStore }  from '@/stores';
// const authStore = useAuthStore();

const isAuthenticated = ref(sessionStorage.getItem('sessionId'))

const signup = () => {
  goPage('/auth/signup')
}

const login = () => {
  goPage('/auth/login')
}
const logout = () => {
  sessionStorage.clear()

  goPage('/auth/login')
}
</script>

<style></style>
