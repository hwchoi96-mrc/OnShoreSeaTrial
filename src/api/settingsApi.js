import instance from '@/composables/useAxios.js'



//시스템 설정 데이터 가져오기
export const fetchSystemSettingInfoAll = () => {
  return instance({
    url: '/system-setting/get-data-all',
    method: 'GET',
  })
}
 //시스템 설정 데이터 변경
export const updateSystemSettingInfoAll = (systemEditForm) => {
  return instance({
    url: '/system-setting/update-data-all',
    method: 'POST',
    data: systemEditForm
  })
}

//투명도 설정
export const getPopupOpacitySetting = (id) => {
  return instance({
    url: '/user-setting/get-data',
    method: 'GET',
    params: { id }
  })

}

export const getUserSetting = (userId) => {
  return instance({
    url: '/user-setting/get-data',
    method: 'GET',
    params: { id: userId }
  })
}

export const updateUserSettings = (settingsForm) => {
  return instance({
    url: '/user-setting/update-data',
    method: 'POST',
    data: settingsForm
  })
}
