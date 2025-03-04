<template>
  <MapAside />
  <DetailPageHeader :isNoSideBar="isNoSideBar"></DetailPageHeader>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import DetailPageHeader from '@/layout/header/DetailPageHeader.vue'
import MapAside from '@/layout/aside/MapAside.vue'

const isNoSideBar = ref(false)
</script>

<style scoped></style>
