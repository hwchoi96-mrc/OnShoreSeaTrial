import { ref } from 'vue'
import { defineStore, storeToRefs, getActivePinia } from 'pinia'
import { useAccessMenuStore } from '@/stores/accessMenuStore.js'
import { useLoadingStore } from '@/stores/loadingStore.js'
import { useVoccStore } from '@/stores/voccStore'

import {
  checkUser,
  logout,
  getUserInfo,
  resetUserPassword,
  changeEmail,
  changePassword,
  changeNickname,
  getUserInfoById,
  addGroup,
  deleteGroup,
  getUsersByGroup,
  saveUserByGroup,
  deleteUserByGroup,
  getAccessLog,
  getUserId
} from '@/api/authApi'

import { cancleSSE } from '@/api/shipApi'
import { goPage, isStatusOk, sse, convertDateTimeSecondType } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'

import moment from 'moment'
import { v4 } from 'uuid'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userInfo = ref({
      userId: '',
      username: '',
      nickname: '',
      email: '',
      role: '',
      activated: false,
      sessionId: '',
      uuid: ''
    })

    const users = ref([])
    const groups = ref([])
    const accessLogs = ref([])

    const accessMenuStore = useAccessMenuStore()
    const { accessMenus } = storeToRefs(accessMenuStore)

    const loadingStore = useLoadingStore()
    const { refreshDataTime } = storeToRefs(loadingStore)

    const voccStore = useVoccStore()
    const { showResMsg } = useToast()
    let errorMsg = ''
    const NETWORK_ERROR_CODE = 5000
    const isCertified = ref(false)

    const loginUser = async (param) => {
      let result = ''
      const userName = param.username
      let eventSource = ''

      try {
        const response = await checkUser(param)
        if (response.status == 200) {
          const { data } = response.data
          sessionStorage.setItem('sessionId', data.sessionId)

          sessionStorage.setItem('userRole', data.role)
          localStorage.setItem('userInfo', JSON.stringify(data))

          userInfo.value = data
          accessMenus.value = []

          const menu = await accessMenuStore.fetchAccessMenu()

          if (menu) {
            sessionStorage.setItem('accessMenus', JSON.stringify(accessMenus.value))
            localStorage.setItem('accessMenus', JSON.stringify(accessMenus.value))

            await voccStore.fetchMyVoccInfo()
            let uuid = v4()
            // let uuid = crypto.randomUUID()
            userInfo.value.uuid = uuid
            eventSource = new EventSource(`/api/sse/subscribe?subScribeId=${uuid}`)
            sse(eventSource)

            const today = moment()
            // nowTime = nowTime.toLocaleDateString()
            let nowKRTime = today.format('YYYY-MM-DD HH:mm:ss')

            refreshDataTime.value = convertDateTimeSecondType(nowKRTime)

            showResMsg('로그인 성공했습니다')
            goPage('/map')
          }

          sessionStorage.setItem('userInfo', JSON.stringify(data))
        }
      } catch (error) {
        console.log(error)
        // let errCode = ''
        // let errMsg = ''
        // if (error.response.data) {
        //   errCode = error.response.data.errorCode
        //   errMsg = error.response.data.errorMsg
        //   showResMsg(errMsg)
        // }
        // if (errCode == 'ALREADY_LOGGED_IN_USER') {
        //   goPage('/noAccess')
        // }
      }
      return result
    }

    const logoutUser = async () => {
      try {
        let uuid = userInfo.value.uuid
        // cancleSSE(uuid)
        console.log('구독 취소')
        const result = await logout()
        if (result.status == 200) {
          sessionStorage.clear()
          localStorage.clear()
          getActivePinia()._s.forEach((store) => {
            console.dir(store)
            // store.$dispose()
            if (store.$id == 'mapManagement') {
              store.$reset()
            }
          })

          goPage('/auth/login')
        }
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 계정 정보 접근 시 사용자 인증 체크
     * @param {*} param
     * @returns
     */
    const certifyUser = async (param) => {
      if (sessionStorage.getItem('userName') !== param.username) {
        showResMsg('아이디 또는 비밀번호가 일치하지않습니다')
        return
      }
      await getUserInfo(param)
        .then((response) => {
          if (response != null) {
            isCertified.value = true
            userInfo.value.userId = response.data.userId
            userInfo.value.username = response.data.username
            userInfo.value.nickname = response.data.nickname
            userInfo.value.email = response.data.email
            userInfo.value.role = response.data.role
            userInfo.value.activated = response.data.activated

            if (userInfo.value.role == 'ROLE_LCC_ADMIN') {
              goPage('/admin/account')
            } else if (userInfo.value.role == 'ROLE_VOCC_ADMIN') {
              goPage('/vocc/admin/account')
            } else {
              goPage('/vocc/user/account')
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const getMyInfo = async () => {
      const {
        status,
        data: { data }
      } = await getUserInfoById()

      if (isStatusOk(status)) {
        data.userId = data.id
        delete data.id
        userInfo.value = data
      }
    }

    /**
     * 아이디 찾기
     * @param {*} email
     * @returns
     */

    const findUserId = async (email) => {
      let result = ''
      await getUserId(email).then((response) => {
        result = response.data
      })
      return result
    }

    /**
     * 비밀번호 초기화
     * @param {} userName
     * @returns
     */
    const resetPassword = async (userName) => {
      let result = ''
      const { status } = await resetUserPassword(userName)

      return status
    }

    /**
     * 사용자 이메일 변경
     * @param {*} emailEditForm
     * @returns
     */
    const changeUserEmail = async (emailEditForm) => {
      let result = NETWORK_ERROR_CODE

      try {
        const response = await changeEmail(emailEditForm)
        if (response.status == 200) {
          const { newEmail } = emailEditForm
          result = response.status
          userInfo.value.email = newEmail
          showResMsg('이메일이 성공적으로 변경되었습니다')
        }
        return result
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 사용자 비밀번호 변경
     * @param {} passwordEditForm
     * @returns
     */
    const changeUserPassword = async (passwordEditForm) => {
      let result = NETWORK_ERROR_CODE
      try {
        const response = await changePassword(passwordEditForm)
        console.dir(response)
        if (response.status == 200) {
          result = response.status
          showResMsg('비밀번호가 성공적으로 변경되었습니다')
        }
        return result
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 사용자 닉네임 변경
     * @param {*} nicknameEditForm
     * @returns
     */
    const changeUserNickname = async (nicknameEditForm) => {
      let result = NETWORK_ERROR_CODE
      try {
        const response = await changeNickname(nicknameEditForm)
        if (response.status == 200) {
          const { newNickname } = nicknameEditForm
          result = response.status
          userInfo.value.nickname = newNickname
          showResMsg('닉네임이 성공적으로 변경되었습니다')
        }
        return result
      } catch (error) {
        const errMsg = error.response.data.errorMsg
        showResMsg(errMsg)
      }
    }

    /**
     * 사용자 그룹 추가
     * @param {*} groupName
     */
    const registerGroup = async (voccId, groupName) => {
      try {
        const response = await addGroup(voccId, groupName)
        const { data: groupKey } = response
        const { status } = response

        console.dir(response)
        console.log(status)
        const addGroupInfo = {
          first: groupKey, // 그룹 추가 후 그룹 아이디 값 추가 필요
          second: groupName // 소속 그룹 업데이트 필요해서 필드 추가
        }

        groups.value = [...groups.value, addGroupInfo]
        showResMsg('그룹이 추가되었습니다')
        return status
      } catch (error) {
        errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    /**
     * 권한 그룹 삭제
     * @param {} groupName
     */
    const removeGroup = async (voccId, groupName) => {
      try {
        const response = await deleteGroup(voccId, groupName)
        const index = groups.value.findIndex((group) => group.value === groupName)
        groups.value.splice(index, 1)
        showResMsg('그룹이 삭제되었습니다')
      } catch (error) {
        errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    // 사용자 그룹별 사용자 목록 조회
    const displayUsersByGroup = async (voccId) => {
      try {
        const response = await getUsersByGroup(voccId)
        const {
          data: {
            data: {
              userGroupIdAndNameList, // 그룹 목록
              userGroupInfoByUserList // 사용자 목록
            }
          }
        } = response

        groups.value = userGroupIdAndNameList
        users.value = userGroupInfoByUserList

        // localStorage.setItem('groups', groups.value)
        // localStorage.setItem('users', users.value)
      } catch (err) {
        const errorMsg = err.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    const fetchGroupsByVoccId = async (voccId) => {
      try {
        const response = await getUsersByGroup(voccId)
        const {
          data: {
            data: {
              userGroupIdAndNameList, // 그룹 목록,
              userGroupInfoByUserList // 사용자 목록
            }
          }
        } = response

        return { userGroupIdAndNameList, userGroupInfoByUserList }
      } catch (err) {
        const errorMsg = err.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    /**
     * 그룹에 사용자 추가
     * @param {*} groupId
     * @param {*} userInfo
     * @returns
     */
    const addUserByGroup = async (groupId, userInfo) => {
      try {
        const response = await saveUserByGroup(userInfo)

        if (response.status == 200) {
          const { groupName, userIdList } = userInfo

          console.log(`그룹명 : ${groupName}`)
          console.log(`사용자 목록  : ${userIdList}`)
          users.value.forEach((user) => {
            if (userIdList.includes(user.userId)) {
              user.groupName = groupName
              user.groupId = groupId
            }
          })

          console.log('사용자 추가 후 결과')
          console.dir(users.value)

          // localStorage.setItem('users', users.value)

          return true
        }
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    const addUserByVoccId = async (userInfo) => {
      try {
        console.log('그룹 추가 요청')
        console.dir(userInfo)
        const response = await saveUserByGroup(userInfo)

        if (response.status == 200) {
          // localStorage.setItem('users', users.value)

          return true
        }
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    /**
     * 그룹에 사용자 삭제
     * @param {*} userInfo
     * @returns
     */
    const removeUserByGroup = async (userInfo) => {
      try {
        const response = await deleteUserByGroup(userInfo)
        if (response.status == 200) {
          const { userIdList } = userInfo
          users.value.forEach((user) => {
            if (userIdList.includes(user.userId)) {
              user.groupName = null
              user.groupId = null
            }
          })

          return true
        }
      } catch (error) {
        if (error.response) {
          const errorMsg = error.response.data.errorMsg
          showResMsg(errorMsg)
        }
      }
    }

    /**
     * 그룹에 사용자 삭제
     * @param {*} userInfo
     * @returns
     */
    const removeUserByVoccId = async (userInfo) => {
      try {
        const response = await deleteUserByGroup(userInfo)
        if (response.status == 200) {
          return true
        }
      } catch (error) {
        if (error.response) {
          const errorMsg = error.response.data.errorMsg
          showResMsg(errorMsg)
        }
      }
    }

    // /

    // 사용자 접속 기록 조회
    const fetchAccessLog = async (startDate = '', endDate = '') => {
      try {
        const response = await getAccessLog(startDate, endDate)

        if (response.status == 200) {
          ;({
            data: { data: accessLogs.value }
          } = response)

          accessLogs.value = accessLogs.value.map((log) => {
            log.loginTime = moment(log.loginTime).format('YYYY-MM-DD HH:mm:ss')
            if (log.logoutTime != null) {
              log.logoutTime = moment(log.logoutTime).format('YYYY-MM-DD HH:mm:ss')
            }
            return log
          })
        }
      } catch (error) {
        const errorMsg = error.response.data.errorMsg
        showResMsg(errorMsg)
      }
    }

    return {
      isCertified,
      userInfo,
      users,
      groups,
      accessLogs,
      loginUser,
      logoutUser,
      certifyUser,
      getMyInfo,
      changeUserEmail,
      changeUserPassword,
      changeUserNickname,
      findUserId,
      resetPassword,
      registerGroup,
      displayUsersByGroup,
      addUserByGroup,
      removeUserByGroup,
      removeGroup,
      fetchAccessLog,
      fetchGroupsByVoccId,
      addUserByVoccId,
      removeUserByVoccId
    }
  },
  {
    // persist: {
    //   storage : sessionStorage
    // },
    persist: true,
    persistOptions: {
      key: 'authStore' // Unique key for each store
    }
  }
)
