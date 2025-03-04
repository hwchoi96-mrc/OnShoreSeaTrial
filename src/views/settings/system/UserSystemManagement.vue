<template>
  <v-sheet class="settings-container d-flex flex-column ga-4 align-center rounded-lg ma-6 pa-6">
    <div class="d-flex justify-start text-left w-50 page-title">환경설정</div>

    <v-sheet class="rounded-lg w-50 pa-6 ga-4" color="#333334">
      <div class="setting-title mb-4">월드맵 설정</div>
      <div>
        <div>팝업창 투명도</div>
        <div>
          <v-slider
            class="opacity-slider"
            v-model="popupOpacity"
            :ticks="tickLabels"
            show-ticks="always"
            step="20"
            tick-size="5"
            @mouseup="inputHandle('opacity')"
          ></v-slider>
        </div>
      </div>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserSettingStore } from '@/stores/userSettingStore'
import { useAuthStore } from '@/stores/authStore'

const userSettingStore = useUserSettingStore()
const authStore = useAuthStore()

const { userInfo } = storeToRefs(authStore)
const { settingsForm } = storeToRefs(userSettingStore)

const popupOpacity = ref(0)

let timer = null
const tickLabels = ref([0, 20, 40, 60, 80, 100])

let userId = null

onBeforeMount(() => {
  userId = userInfo.value.userId

  if (!userId) {
    authStore.getMyInfo()
    userId = userInfo.value.userId
  }
})
onMounted(() => {
  fetchSettings()
})

const inputHandle = (type) => {
  if (timer) {
    clearInterval(timer)
  }
  timer = setTimeout(editSettingInformation, 800, type)
}

const fetchSettings = async () => {
  await userSettingStore.fetchUserSettings(userId)

  popupOpacity.value = settingsForm.value.settingDataMap.popupOpacity
}

const editSettingInformation = async (type) => {
  let requestForm = null
  requestForm = {
    id: userId,
    settingDataMap: {
      popupOpacity: popupOpacity.value
    }
  }

  await userSettingStore.editUserSettings(requestForm)
}
</script>

<style scoped>
.settings-container {
  height: 100vh;
  max-height: calc(100vh - 65px - 24px - 24px);
}

.setting-title {
  font-size: 1.2rem;
}

.page-title {
  font-size: 1.3rem;
  line-height: 1;
}
</style>
