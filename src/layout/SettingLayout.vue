<template>
  <SettingAside></SettingAside>
  <DetailPageHeader />
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>

import DetailPageHeader from '@/layout/header/DetailPageHeader.vue'
import SettingAside from '@/layout/aside/SettingAside.vue'

</script>

<style scoped>
</style>
