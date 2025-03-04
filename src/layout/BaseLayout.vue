<template>
  <MapAside></MapAside>
  <DetailPageHeader />
  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<script setup>
import DetailPageHeader from '@/layout/header/DetailPageHeader.vue'
import MapAside from '@/layout/aside/MapAside.vue'
</script>

<style scoped></style>
