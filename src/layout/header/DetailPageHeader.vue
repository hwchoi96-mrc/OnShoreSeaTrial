<template>
  <v-app-bar class="bg-appBar detail-header h-auto  px-6">
    <div class="d-flex align-center justify-space-between w-100">

      <AccessibleMenu />
      <div class="d-flex align-center">
        <TimeInfo />
        <!-- 아이콘  -->
        <IconList></IconList>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import AccessibleMenu from '@/layout/header/menu/AccessibleMenu.vue'
import AlarmCount from '@/layout/header/menu/AlarmCount.vue'
import AccountInfo from '@/layout/header/menu/AccountInfo.vue'
import IconList from '@/layout/header/menu/IconList.vue';
import TimeInfo from '@/layout/header/menu/TimeInfo.vue'

</script>

<style scoped>
header {
  color: white !important;
  /* border-bottom: 0.5px solid #595a63; */
}

.subTitle {
  font-size: 0.9em;
}

.localTime::before {
  content: '';
  border: 0.5px solid #595A63;
}
</style>
