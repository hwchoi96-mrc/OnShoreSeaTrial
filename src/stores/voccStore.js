import { defineStore } from 'pinia'
import { ref } from 'vue'
import { goPage, isStatusOk } from '@/composables/util.js'
// import { useAxios } from '@/composables/useAxios'
import {
  registerVoccAdmin,
  updateMyVoccInfo,
  getVoccListAll,
  getVoccAdminListAll,
  getVoccAdmin,
  getVoccsWithoutAdmin,
  getVoccUserListAll,
  getMyVoccUsers,
  getAdminsByVoccId,
  getVoccUser,
  getMyVoccInfo,
  deleteVoccAdmin,
  joinVoccUser,
  deleteVoccUser,
  changeUserActivate,
  changeUserRole,
  updateVoccLogo,
  getFleetAndShipByVocc,
  getVoccs,
  getMyVoccAdmins,
  updatePresidentAdmin,
  getUsersByVoccId
} from '@/api/voccApi'
import { useToast } from '@/composables/useToast'

export const useVoccStore = defineStore(
  'vocc',
  () => {
    const voccAdmins = ref([])
    const voccUsers = ref([])

    const voccAdminInfo = ref({
      username: '',
      password: '********',
      nickname: '',
      email: '',
      role: '',
      activated: '',
      voccName: ''
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
    const voccInfo = ref()
    const fleetsAndShip = ref([])

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

    const fetchVoccInfo = async (voccId) => {
      try {
        const response = await getMyVoccInfo(voccId)
        ;({
          data: { data: voccInfo.value }
        } = response)

        if (!voccInfo.value.address) {
          voccInfo.value.address = ''
        }

        if (!voccInfo.value.ceoName) {
          voccInfo.value.ceoName = ''
        }
        sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
        // console.dir(error)
      }
    }

    /**
     * 선사 정보 조회
     * @param {Number} voccUserId
     * @returns
     */

    const fetchMyVoccInfo = async () => {
      try {
        const response = await getMyVoccInfo()
        ;({
          data: { data: voccInfo.value }
        } = response)

        if (!voccInfo.value.address) {
          voccInfo.value.address = ''
        }

        if (!voccInfo.value.ceoName) {
          voccInfo.value.ceoName = ''
        }
        sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
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
        const response = await updateMyVoccInfo(editForm)
        const status = response.status
        if (status == 200) {
          ;({
            data: { data: voccInfo.value }
          } = response)
          voccInfo.value = { voccId, ...editForm }
          sessionStorage.setItem('voccInfo', JSON.stringify(voccInfo.value))
          return status
        }
      } catch (error) {
        console.log(error)
      }
    }

    const changeLogoImage = async (image) => {
      try {
        const { status } = await updateVoccLogo(image)

        if (status == 200) {
          let bytes = new Uint8Array(image)
          let binaryString = bytes.reduce((data, byte) => data + String.fromCharCode(byte), '')
          const result = btoa(binaryString)

          voccInfo.value.logoImage = result

          return status
        }
      } catch (error) {
        console.error(error)
      }
    }

    /**
     * 선사 관리자 등록
     * @param {*} param
     * @returns
     */
    const joinVoccAdmin = async (registerForm) => {
      try {
        const response = await registerVoccAdmin(registerForm)
        const { status, data } = response

        if (isStatusOk(status)) {
          registerForm.id = data
          registerForm.activated = true

          voccAdmins.value.push(registerForm)

          return status
        }

        console.dir(response)
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
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
          voccAdmins.value = response
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
      const result = await getMyVoccAdmins()

      console.log('api 응답 값 ')
      console.dir(result)

      voccAdmins.value = result

      return result
    }

    /**
     * 선사 아이디를 통한 관리자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchAdminsByVoccId = async (voccId) => {
      const result = await getAdminsByVoccId(voccId)
      return result
    }

    const fetchVoccAdminInfo = async (voccId, userId) => {
      try {
        const response = await getMyVoccAdmins()

        console.log(`유저 아이디 : ${userId}`)
        console.log('사용자 목록')

        console.dir(response)

        const curVoccAdmin = response.filter((el) => el.userId == userId)
        console.dir(curVoccAdmin)
        curVoccAdmin[0].password = '********'

        voccAdminInfo.value = { ...curVoccAdmin[0] }
      } catch (error) {
        console.log(error)
      }

      return voccAdminInfo
    }

    /**
     * 선사 관리자 삭제
     * @param {} voccAdminId
     * @param {*} removeVoccAdminInfo
     */
    const removeAdmin = async (removeVoccAdminInfo) => {
      try {
        const response = await deleteVoccAdmin(removeVoccAdminInfo)
        const { removeUserVoccName, removeUsername } = removeVoccAdminInfo

        const { status } = response

        if (isStatusOk(status)) {
          const index = voccAdmins.value.findIndex(
            (voccAdmin) => voccAdmin.username === removeUsername
          )
          voccAdmins.value.splice(index, 1)
          return status
        }
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    const registerVoccUser = async (registerForm) => {
      try {
        const { status } = await joinVoccUser(registerForm)

        if (isStatusOk(status)) {
          voccUsers.value.push(registerForm.value)
          return status
        }
      } catch (err) {
        const errMsg = err.response.data.errorMsg
        showResMsg(errMsg)
      }
    }
    /**
     * 선사 사용자 목록 조회
     * @param
     * @returns
     */
    const fetchMyVoccUsers = async () => {
      const {
        status,
        data: { data }
      } = await getMyVoccUsers()

      if (isStatusOk(status)) {
        voccUsers.value = data
      }
    }

    /**
     * 선사 아이디를 통한 사용자 목록 조회
     * @param {*} voccId
     * @returns
     */

    const fetchUsersByVoccId = async (voccId) => {
      const result = await getUsersByVoccId(voccId)
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
        voccUserInfo.value = data
        return data
      } catch (error) {
        console.error(error)
      }
    }

    const fetchMyVoccUserInfo = async (voccId, userId) => {
      try {
        const response = await getMyVoccUser(voccId, userId)
        const {
          data: { data }
        } = response
        voccUserInfo.value = data
        return data
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
      const {
        data: { data }
      } = await deleteVoccUser(removeVoccUserInfo)
      const index = voccUsers.value.findIndex((voccUser) => voccUser.id === voccUserId)
      voccUsers.value.splice(index, 1)
      showResMsg(' 사용자가 삭제되었습니다')
    }

    const changeActive = async (userName, activate, type) => {
      let result = ''

      const { status } = await changeUserActivate(userName, activate)

      if (type == 'voccAdmin') {
        voccAdmins.value.forEach((admin) => {
          if (admin.username == userName) {
            admin.activated = activate
            voccAdminInfo.value.activated = activate
          }
        })
      } else if (type == 'voccUser') {
        voccUsers.value.forEach((user) => {
          if (user.username == userName) {
            user.activated = activate
          }
        })

        voccUserInfo.value.activated = activate
      }

      return status

      // await changeUserActivate(userName, activate)
      //   .then((response) => {
      //     result = response
      //     if (type == 'voccAdmin') {
      //       voccAdmins.value.forEach((admin) => {
      //         if (admin.username == userName) {
      //           admin.activated = activate
      //           voccAdminInfo.value.activated = activate
      //         }
      //       })
      //     } else if (type == 'voccUser') {
      //       voccUsers.value.forEach((user) => {
      //         if (user.username == userName) {
      //           user.activated = activate
      //         }
      //       })

      //       voccUserInfo.value.activated = activate
      //     }

      //     showResMsg('계정 활성화 상태를 성공적으로 변경하였습니다')
      //   })
      //   .catch((error) => {
      //     console.log(error)
      //   })
      // return result
    }

    const changeRole = async (editUserInfo) => {
      const { username, userRole } = editUserInfo
      const { status } = await changeUserRole(username, userRole)

      if (isStatusOk(status)) {
        let index = voccUsers.value.findIndex((el) => el.username == username)

        voccUsers.value.splice(index, 1)
        // voccUsers.value.forEach((user) => {
        //   if (user.username == username) {
        //     user.role = userRole
        //   }
        // })
        return status
      }
    }

    const fetchFleetAndShipByVocc = async (voccids) => {
      fleetsAndShip.value = await getFleetAndShipByVocc(voccids)
    }

    const changePresidentAdmin = async (form) => {
      const response = await updatePresidentAdmin(form)
      console.dir(response)
      if (response.status == 200) {
        if (!form.appoint) {
          showResMsg('대표 관리자가 해제되었습니다')
        } else {
          showResMsg('대표 관리자가 할당되었습니다')
        }
      }
    }

    return {
      voccInfo,
      voccUsers,
      voccAdmins,
      voccAdminInfo,
      voccUserInfo,
      fleetsAndShip,
      joinVoccAdmin,
      fetchVoccInfo,
      fetchMyVoccInfo,
      editVoccInfo,
      changeLogoImage,
      fetchVoccsWithoutAdmin,
      fetchVoccListAll,
      fetchVoccs,
      fetchMyVoccUsers,
      getVoccAdmins,
      registerVoccUser,
      getVoccUserInfo,
      removeAdmin,
      removeVoccUser,
      changeActive,
      changeRole,
      fetchFleetAndShipByVocc,
      fetchMyVoccAdmins,
      fetchAdminsByVoccId,
      fetchUsersByVoccId,
      changePresidentAdmin,
      fetchVoccAdminInfo
    }
  },
  {
    persist: true,
    persistOptions: {
      key: 'voccStore'
    }
  }
)
