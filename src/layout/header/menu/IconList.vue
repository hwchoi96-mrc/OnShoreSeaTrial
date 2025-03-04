<template>
  <div class="d-flex">
    <div class="align-self-center">
      <AlarmCount></AlarmCount>
    </div>
    <div class="align-self-center">
      <v-btn icon="mdi-cog" @click="goAccountPage()"></v-btn>
    </div>
    <div class="align-self-center">
      <AccountInfo></AccountInfo>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAccessMenuStore } from '@/stores/accessMenuStore'

import { useToast } from '@/composables/useToast'
import { goPage } from '@/composables/util.js'

// import AlarmCount from '@/layout/header/menu/AlarmCount.vue'
import AccountInfo from '@/layout/header/menu/AccountInfo.vue'

const { showResMsg } = useToast()

const accessMenuStore = useAccessMenuStore()
const { accessMenus } = storeToRefs(accessMenuStore)

const SETTINGS_MENU_ID = 500

const goAccountPage = () => {
  const settingMenu = accessMenus.value.find((el) => el.menuId == SETTINGS_MENU_ID)

  if (settingMenu) {
    const settingFirstMenuUrl = settingMenu.children[0].routerPath
    goPage(settingFirstMenuUrl)
  } else {
    showResMsg('설정 메뉴에 대한 접근 권한이 없습니다')
  }
}
</script>

<style></style>
