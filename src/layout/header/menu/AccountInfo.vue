<template>
  <v-menu v-model="isShowAccountInfo" :close-on-content-click="false" location="bottom" transition="slide-y-transition"
    offset="10">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
    </template>
    <v-card min-width="250" class="py-2 ga-3">
      <v-list>
        <v-list-item>
          <v-list-item-title><v-btn class="accountInfo-nickname" @click="goAccountPage">{{ userInfo.nickname}}</v-btn></v-list-item-title>
          <v-list-item-subtitle>{{ userInfo.email}}</v-list-item-subtitle>
          <template v-slot:append>
            <i-btn @click="logout()" text="로그아웃"></i-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { goPage } from '@/composables/util.js'

const authStore = useAuthStore()
const { userInfo } = authStore

const isShowAccountInfo = ref(false)


const goAccountPage = () => {
  goPage('/settings/account')
  isShowAccountInfo.value = false;
}

const logout = () => {
  authStore.logoutUser()
}
</script>

<style scoped>
.accountInfo-nickname{
  margin-left : -16px;
}
</style>