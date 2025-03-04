<template>
  <v-card class="card bg-card w-25 mx-auto ma-4 pa-4 d-flex flex-column">
    <v-card-text class="text-h6">계정 인증 페이지</v-card-text>
    <v-card-text>
      <!-- <v-container class="d-flex justify-center flex-column w-75"> -->
      <v-form>
        <v-row justify="center">
          <!--  <v-col class="text-left">아이디</v-col> -->
          <v-col
            ><v-text-field
              v-model="userInfo.username"
              placeholder="아이디를 입력하세요"
              rounded
              variant="outlined"
              dirty
            ></v-text-field
          ></v-col>
        </v-row>

        <v-row>
          <!-- <v-col> 비밀번호 </v-col> -->
          <v-col
            ><v-text-field
              type="password"
              @click:append-inner="show = !show"
              v-model="userInfo.password"
              placeholder="비밀번호를 입력하세요"
              variant="outlined"
              rounded
              dirty
            ></v-text-field
          ></v-col>
        </v-row>

        <v-row>
          <v-col><v-btn class="w-100 bg-btn" @click="checkCertificated">확인</v-btn> </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'

const show = ref(false)
const tab = ref(null)
const userInfo = ref({
  username: '',
  password: ''
})
const dirty = ref(true)

const checkCertificated = () => {
  const store = useAuthStore()
  store.certifyUser(userInfo.value)
}
</script>

<style>
.text-h6 {
  font-family: 'Pretendard-Medium' !important;
}
</style>
