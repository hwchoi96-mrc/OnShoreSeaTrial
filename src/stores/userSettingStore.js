import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserSetting, updateUserSettings } from '@/api/settingsApi.js'
import { useToast } from '@/composables/useToast'

import _ from 'lodash'

export const useUserSettingStore = defineStore(
  'userSetting',
  () => {
    const { showResMsg } = useToast()

    const settingsForm = ref({
      id: null,
      settingDataMap: {
        popupOpacity: 0
      }
    })

    const fetchUserSettings = async (id) => {
      try {
        const {
          status,
          data: { data }
        } = await getUserSetting(id)

        if (status == 200) {
          settingsForm.value = data
        }
      } catch (error) {
        console.log(error)
      }
    }

    //시스템 설정 투명도 설정
    const editUserSettings = async (editForm) => {
      console.log('투명도 수정')
      console.dir(editForm)
      try {
        const { status } = await updateUserSettings(editForm)
        if (status == 200) {
          settingsForm.value = editForm
          showResMsg('설정이 수정 되었습니다')
        }else{
          showResMsg('설정 수정에 실패하였습니다.')
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      settingsForm,
      fetchUserSettings,
      editUserSettings
    }
  },
  {
    // persist: {
    //   storage : sessionStorage
    // },
    persist: true,
    persistOptions: {
      key: 'userSettingStore' // Unique key for each store
    }
  }
)
