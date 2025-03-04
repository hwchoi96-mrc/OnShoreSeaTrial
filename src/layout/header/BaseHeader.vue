<template>
  <v-app-bar class="h-auto bg-appBar">
    <!-- <template #default> -->
    <div class="d-flex w-100 justify-end px-6 ga-3">
      <!-- 출발지, 목적지 정보  -->
      <!-- <DistanceProgress class="w-20"></DistanceProgress> -->

      <!-- AIS INFO  메뉴  -->
      <!-- <HeaderAisInfo class="w-45"></HeaderAisInfo> -->

      <div class="d-flex align-center">
        <!-- 시간  -->
        <TimeInfo></TimeInfo>

        <!-- 아이콘 -->
        <IconList></IconList>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import DistanceProgress from '@/layout/header/menu/DistanceProgress.vue'
import HeaderAisInfo from '@/layout/header/menu/HeaderAisInfo.vue'
import IconList from '@/layout/header/menu/IconList.vue'
import TimeInfo from '@/layout/header/menu/TimeInfo.vue'
</script>

<style scoped>
header {
  color: white !important;
  /* border-bottom: 0.5px solid #595a63; */
}
</style>
