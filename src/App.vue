<template>
  <v-app class="w-100">
    <router-view></router-view>
    <iToast></iToast>
    <iLoadingBar></iLoadingBar>
  </v-app>
</template>

<script setup>
import iToast from '@/components/common/iToast.vue'
import iLoadingBar from '@/components/common/iLoadingBar.vue'
</script>

<style>
/* .v-footer {
  height: 130px;
} */

html,
body {
  margin: 0;
  padding: 0;
  min-width: 1440px;
  width: 100%;
  font-size: 0.875rem;
  overflow-x: auto !important;
  overflow-y: auto !important;
}
</style>
