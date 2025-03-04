import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { isStatusOk } from '@/composables/util.js'
import { updateSystemSettingInfoAll, fetchSystemSettingInfoAll } from '@/api/settingsApi.js'

import { addGroup, deleteGroup } from '@/api/authApi'

import {
  updateVoccInfo,
  getVoccListAll,
  getVoccAdminListAll,
  getVoccAdminInfo,
  getVoccsWithoutAdmin,
  getAdminsByVoccId,
  getVoccUser,
  getVoccInfoByVoccId,
  joinVoccUser,
  deleteVoccUser,
  changeUserActivate,
  changeUserRole,
  updateVoccLogoByVoccId,
  getFleetAndShipByVocc,
  getVoccs,
  getMyVoccAdmins,
  updatePresidentAdmin,
  getUsersByVoccId
} from '@/api/voccApi'

import { useVoccStore } from '@/stores/voccStore'
import { useToast } from '@/composables/useToast'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const voccsAdmins = ref([])
    const voccsUsers = ref([])

    const voccAdminEditForm = ref({
      voccName: '',
      username: '',
      password: '********',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    const voccUserInfo = ref({
      id: 0,
      voccName: '',
      username: '',
      nickname: '',
      email: '',
      role: '',
      activated: ''
    })

    // 선사 기초 정보
    const voccStore = useVoccStore()
    const { voccInfo } = storeToRefs(voccStore)

    const fleetsAndShip = ref([])

    const dataIntervalAll = ref({})

    const { showResMsg } = useToast()

    /**
     * 선사 목록 조회
     * @param
     * @returns
     */
    const fetchVoccListAll = async () => {
      const response = await getVoccListAll()
      const {
        data: { data }
      } = response

      if (response.status == 200) {
        return data
      }
    }

    const fetchVoccs = async () => {
      const response = await getVoccs()
      const {
        data: { data }
      } = response

      if (response.status == 200) {
        return data
      }
    }

    /**
     * 관리자가 없는 선사 목록 조회
     */
    const fetchVoccsWithoutAdmin = async () => {
      let result
      await getVoccsWithoutAdmin()
        .then((response) => {
          console.dir(response)
          result = response
        })
        .catch((err) => {
          console.log(err)
        })
      return result
    }

    /**
     * 선사 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const fetchVoccInfoByVoccId = async (voccId) => {
      try {
        const response = await getVoccInfoByVoccId(voccId)
        const {
          data: { data }
        } = response
        return data
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
        // console.dir(error)
      }
    }

    /**
     * 선사 정보 수정
     * @param {*} voccId
     * @param {*} editForm
     * @returns
     */
    const editVoccInfo = async (voccId, editForm) => {
      try {
        delete editForm.logoImage
        const response = await updateVoccInfo(editForm)

        console.log('수정 폼')
        console.dir(editForm)
        const { status } = response
        if (isStatusOk(status)) {
          // 주석 해제 하기
          // ;({
          //   data: { data: voccInfo.value }
          // } = response)
          // voccInfo.value = { voccId, ...editForm }
          // sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
          return status
        }
      } catch (error) {
        console.log(error)
      }
    }

    const changeLogoImageByVoccId = async (image, voccId) => {
      try {
        const { status } = await updateVoccLogoByVoccId(image, voccId)

        if (status == 200) {
          let bytes = new Uint8Array(image)
          let binaryString = bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')

          console.log('voccId')
          console.log(voccId)
          console.dir(voccInfo.value)
          const result = btoa(binaryString)

          if (voccId == 0 && voccInfo.value.id == voccId) {
            console.log('vocc 정보')
            console.dir(voccInfo.value)
            voccInfo.value.logoImage = result
            console.dir(voccInfo.value)
          }
          return status
        }
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사별 관리자 목록 조회(UIPA)
     * @param
     * @returns
     */
    const getVoccAdmins = async () => {
      let result
      await getVoccAdminListAll()
        .then((response) => {
          result = response
          voccsAdmins.value = response
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 관리자 목록 조회
     * @param
     * @returns
     */
    const fetchMyVoccAdmins = async () => {
      let result
      await getMyVoccAdmins()
        .then((response) => {
          result = response
          voccsAdmins.value = response

          console.dir(voccsAdmins)
        })
        .catch((err) => {
          console.log(err)
        })

      return result
    }

    /**
     * 선사 아이디를 통한 관리자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchAdminsByVoccId = async (voccId) => {
      const result = await getAdminsByVoccId(voccId)
      console.log('관리자 목록')
      console.dir(result)
      voccsAdmins.value = result

      console.dir(voccsAdmins.value)
      return result
    }

    const fetchVoccAdminInfo = async (voccId, userId) => {
      try {
        const response = await getVoccAdminInfo(voccId, userId)
        const {
          data: { data }
        } = response

        voccAdminEditForm.value = {
          userId: data.userId,
          voccName: data.voccName,
          username: data.username,
          nickname: data.nickname,
          email: data.email,
          role: data.role,
          activated: data.activated
        }
      } catch (error) {
        console.log(error)
      }

      return voccAdminEditForm
    }

    const registerVoccUserByAdmin = async (voccId, registerForm) => {
      try {
        const {
          status,
          data: { data }
        } = await joinVoccUser(registerForm)

        if (isStatusOk(status)) {
          console.log('유저 등록 ')
          console.dir(data)
          let newUserVoccName = registerForm.voccName
          registerForm.userId = data
          registerForm.voccId = voccId

          if (voccsUsers.value.length != 0) {
            let voccsUserVoccName = voccsUsers.value[0].voccName
            if (newUserVoccName == voccsUserVoccName) {
              voccsUsers.value.push(registerForm)
            }
          } else {
            voccsUsers.value.push(registerForm)
          }
        }

        return status
      } catch (err) {
        const errMsg = err.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 선사 아이디를 통한 사용자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchUsersByVoccId = async (voccId) => {
      const result = await getUsersByVoccId(voccId)
      voccsUsers.value = result
      return result
    }

    /**
     * 선사 사용자 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const getVoccUserInfo = async (voccId, userId) => {
      try {
        const response = await getVoccUser(voccId, userId)
        const {
          data: { data }
        } = response
        console.log('유저 인포')
        console.dir(data)
        voccUserInfo.value = data
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사 사용자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccUserInfo
     */
    const removeVoccUser = async (voccUserId, removeVoccUserInfo) => {
      const { status } = await deleteVoccUser(removeVoccUserInfo)

      const { removeUsername } = removeVoccUserInfo

      if (isStatusOk(status)) {
        const index = voccsUsers.value.findIndex((voccUser) => voccUser.username === removeUsername)
        voccsUsers.value.splice(index, 1)
        showResMsg(' 사용자가 삭제되었습니다')

        return status
      }
    }

    const changeActiveByAdmin = async (userName, activate) => {
      let result = ''
      await changeUserActivate(userName, activate)
        .then((response) => {
          result = response
          voccsUsers.value.forEach((user) => {
            if (user.username == userName) {
              user.activated = activate
            }
          })
          voccUserInfo.value.activated = activate
        })
        .catch((error) => {
          console.log(error)
        })
      return result
    }

    const changeAdminActive = async (userName, activate) => {
      const { status } = await changeUserActivate(userName, activate)

      //const index = voccsAdmins.value.findIndex((el) => el.username == userName)

      //voccsAdmins.value[index].activated = activate
      voccAdminEditForm.value.activated = activate

      return status
    }

    const changeRole = async (editUserInfo) => {
      const { username, userRole } = editUserInfo
      const { status } = await changeUserRole(username, userRole)

      if (isStatusOk(status)) {
        let index = voccsUsers.value.findIndex((user) => user.username == username)
        voccsUsers.value.splice(index, 1)
        return status
      }
    }

    const fetchFleetAndShipByVocc = async (voccids) => {
      fleetsAndShip.value = await getFleetAndShipByVocc(voccids)
    }

    const registerVoccGroup = async (voccId, groupName) => {
      try {
        const response = await addGroup(voccId, groupName)
        const { data: groupKey } = response
        const { status } = response

        console.dir(response)
        console.log(status)
        const result = {
          status: status,
          first: groupKey, // 그룹 추가 후 그룹 아이디 값 추가 필요
          second: groupName // 소속 그룹 업데이트 필요해서 필드 추가
        }
        return result
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    /**
     * 권한 그룹 삭제
     * @param {} groupName
     */
    const removeVoccGroup = async (voccId, groupName) => {
      try {
        const { status } = await deleteGroup(voccId, groupName)
        console.log('권한 그룹 스토어')
        console.dir(status)
        return status
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    //시스템 설정 데이터 가져오기
    const fetchSystemSettingInfo = async () => {
      try {
        const {
          status,
          data: { data }
        } = await fetchSystemSettingInfoAll()

        if (status == 200) {
          dataIntervalAll.value = data
        }
      } catch (error) {
        console.error(error)
      }
    }
    //시스템 설정 데이터 변경
    const updateSystemSettingInfo = async (systemEditForm) => {
      try {
        const response = await updateSystemSettingInfoAll(systemEditForm)

        if (response.status == 200) {
          showResMsg('설정이 수정 되었습니다')
        } else {
          showResMsg('설정 수정에 실패하였습니다.')
        }
      } catch (error) {
        console.error(error)
      }
    }

    return {
      voccInfo,
      voccsUsers,
      voccsAdmins,
      voccAdminEditForm,
      voccUserInfo,
      fleetsAndShip,
      dataIntervalAll,
      fetchVoccInfoByVoccId,
      editVoccInfo,
      registerVoccGroup,
      removeVoccGroup,
      changeLogoImageByVoccId,
      fetchVoccsWithoutAdmin,
      fetchVoccListAll,
      fetchVoccs,
      getVoccAdmins,
      registerVoccUserByAdmin,
      getVoccUserInfo,
      removeVoccUser,
      changeActiveByAdmin,
      changeAdminActive,
      changeRole,
      fetchFleetAndShipByVocc,
      fetchMyVoccAdmins,
      fetchAdminsByVoccId,
      fetchUsersByVoccId,
      fetchVoccAdminInfo,
      fetchSystemSettingInfo,
      updateSystemSettingInfo
    }
  },
  {
    persist: true,
    persistOptions: {
      key: 'voccStore'
    }
  }
)
