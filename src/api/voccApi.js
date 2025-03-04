import axios from 'axios'
import instance from '@/composables/useAxios.js'
import { getShipCondition } from '@/api/alarmApi'
import { method } from 'lodash'

export const getVoccListAll = () => {
  return instance({
    url: '/vocc/get-all-admin-list',
    method: 'GET'
  })
}

/**
 * 선사 목록 조회
 */
export const getVoccs = () => {
  return instance({
    url: '/vocc/get-all-vocc',
    method: 'GET'
  })
}

/**
 * 선사 정보 조회
 * @param
 * @returns
 */

export const getVoccInfoByVoccId = (voccId) => {
  return instance({
    url: '/vocc/get-basic-info',
    method: 'GET',
    params: { voccId }
  })
}

export const getMyVoccInfo = () => {
  return instance({
    url: '/vocc/get-my-basic-info',
    method: 'GET'
  })
}
/**
 * 선사 기초 정보 수정
 * @param {*} editForm
 * @returns
 */
export const updateMyVoccInfo = (editForm) => {
  return instance({
    url: '/vocc/change-my-basic-info',
    method: 'POST',
    data: editForm
  })
}

export const updateVoccInfo = (editForm) => {
  return instance({
    url: '/vocc/change-basic-info',
    method: 'POST',
    data: editForm
  })
}

/**
 * 선사 로고 업데이트
 * @param {} image
 * @returns
 */
export const updateVoccLogo = (image) => {
  return instance({
    url: '/vocc/update-my-basic-info-logo',
    method: 'POST',
    data: image,
    headers: {
      'Content-Type': 'application/octet-stream' // or appropriate content type
    }
  })
}

export const updateVoccLogoByVoccId = (image, voccId) => {
  return instance({
    url: '/vocc/update-basic-info-logo',
    method: 'POST',
    data: image,
    params: { voccId },
    headers: {
      'Content-Type': 'application/octet-stream' // or appropriate content type
    }
  })
}

/**
 * 선사 관리자 정보를 입력받아 선사 관리자 가입 api 요청
 * @param {Object} registerForm 선사 관리자 정보
 */
export const registerVoccAdmin = (registerForm) => {
  // registerForm.role = 'ROLE_VOCC_ADMIN'

  return instance({
    url: '/vocc/join-admin',
    method: 'POST',
    data: registerForm
  })
}

export const getVoccAdmin = (voccAdminId) => {
  return axios.get('/api/vocc/get-vocc-user-data?voccId=' + voccAdminId).then((response) => {
    return response.data.data
  })
}

export const getVoccAdminInfo = (voccId, userId) => {
  return instance({
    url: '/vocc/get-vocc-user-data',
    method: 'GET',
    params: { voccId, userId }
  })
}

/**
 * 관리자가 없는 선사 목록 조회 api 요청
 * @param {*} param
 * @returns
 */
export const getVoccsWithoutAdmin = () => {
  return instance({
    url: '/vocc/get-all-admin-list',
    method: 'GET'
  }).then((response) => {
    const {
      data: { data }
    } = response
    if (data.length != 0) {
      const result = data
        .filter((admin) => admin.adminUsername == null || admin.adminUsername == '')
        .map((admin) => admin.name)
      return result
    } else {
      return response.data
    }
  })
}

/**
 * DB에 등록된 선사 관리자 목록 조회 api 요청
 * @param {*} param
 * @returns
 */
export const getVoccAdminListAll = () => {
  return axios.get('/api/vocc/get-all-admin-list').then((response) => {
    if (response.data.data.length != 0) {
      const result = response.data.data
        .filter((admin) => admin.getUserData != null)
        .map((admin) => {
          let adminInfo = {
            id: admin.voccId,
            name: admin.voccName,
            username: admin.getUserData.username,
            nickname: admin.getUserData.nickname,
            email: admin.getUserData.email,
            role: admin.getUserData.role,
            activated: admin.getUserData.activated
          }

          return adminInfo
        })
      return result
    } else {
      return response.data
    }
  })
}

/**
 * 해당 선사의 관리자 목록 조회 api 요청
 * @param {*} param
 * @returns
 */
export const getMyVoccAdmins = () => {
  return instance({
    url: '/vocc/get-my-admin-list',
    method: 'GET'
  }).then((response) => {
    if (response.data.data.length != 0) {
      const result = response.data.data.map((admin) => {
        let adminInfo = {
          voccId: admin.voccId,
          voccName: admin.voccName,
          username: admin.username,
          presidentAdminUser: admin.presidentAdminUser,
          nickname: admin.getVoccUserData.nickname,
          email: admin.getVoccUserData.email,
          role: admin.getVoccUserData.role,
          activated: admin.getVoccUserData.activated,
          userId: admin.getVoccUserData.userId
        }

        return adminInfo
      })
      return result
    } else {
      return response.data
    }
  })
}

/**
 * 선사 아이디를 통한 선사 관리자 목록 조회
 */

export const getAdminsByVoccId = (voccId) => {
  return instance({
    url: '/vocc/get-admin-list-by-vocc-id',
    method: 'GET',
    params: { voccId }
  }).then((response) => {
    const {
      data: { data }
    } = response

    console.dir(data)
    const result = data.map((admin) => {
      let adminInfo = {
        voccId: admin.voccId,
        voccName: admin.getVoccUserData.voccName,
        presidentAdminUser: admin.presidentAdminUser,
        username: admin.getVoccUserData.username,
        nickname: admin.getVoccUserData.nickname,
        email: admin.getVoccUserData.email,
        role: admin.getVoccUserData.role,
        activated: admin.getVoccUserData.activated,
        userId: admin.getVoccUserData.userId
      }

      return adminInfo
    })

    return result
  })
}

export const getMyVoccUsers = () => {
  return instance({
    url: '/vocc/get-my-user-list',
    method: 'GET'
  })
}

/**
 * 선사 사용자 목록 조회
 */

/**
 * 선사 관리자 삭제
 * @param {} editForm
 * @returns
 */
export const deleteVoccAdmin = (removeVoccAdminInfo) => {
  return instance({
    url: '/vocc/remove-admin',
    method: 'POST',
    data: removeVoccAdminInfo
  })
}

/**
 * 선사 사용자 정보를 입력받아 선사 사용자 가입 api 요청
 * @param {Object} registerForm 선사사용자정보
 * @returns 등록 여부
 */
export const joinVoccUser = (registerForm) => {
  registerForm.role = 'ROLE_VOCC_USER'
  return instance({
    url: '/vocc/join-user',
    method: 'POST',
    data: registerForm
  })
  // return axios.post('/api/vocc/join-user', registerForm)
}

/**
 * DB에 등록된 선사 사용자 목록 조회 api 요청
 * @param {*} param
 * @returns
 */
export const getVoccUserListAll = () => {
  return axios.get('/api/vocc/get-all-user-list').then((response) => {
    return response.data.data
  })
}

/**
 * 선사 아이디를 통한 선사 사용자 목록 조회
 */

export const getUsersByVoccId = (voccId) => {
  return instance({
    url: '/vocc/get-user-list-by-vocc-id',
    method: 'GET',
    params: { voccId }
  }).then((response) => {
    const {
      data: { data }
    } = response

    const result = data.map((user) => {
      let userInfo = {
        voccId: user.voccId,
        voccName: user.voccName,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        activated: user.activated,
        userId: user.userId
      }

      return userInfo
    })

    return result
  })
}

/**
 * 선사 사용자 정보 조회
 * @param {Number} voccUserId
 * @returns
 */
export const getVoccUser = (voccId, userId) => {
  return instance({
    url: '/vocc/get-vocc-user-data',
    method: 'GET',
    params: { voccId, userId }
  })
}

export const getMyVoccUser = (voccId, userId) => {
  return instance({
    url: '/vocc/get-vocc-user-data',
    method: 'GET',
    params: { voccId, userId }
  })
}

/**
 * 선사 사용자 삭제
 * @param {} editForm
 * @returns
 */
export const deleteVoccUser = (removeVoccUserInfo) => {
  return instance({
    url: '/vocc/remove-user',
    method: 'POST',
    data: removeVoccUserInfo
  })
}

/**
 * 선사 관리자 / 사용자 계정 활성화 변경
 * @param {} userName, activate
 * @returns
 */
export const changeUserActivate = (userName, activate) => {
  return instance({
    url: '/user/change-activate',
    method: 'POST',
    params: { username: userName, activate: activate }
  })
}

/**
 * 선사 관리자 / 사용자 권한 변경
 * @param {} userName, roleName
 * @returns
 */
export const changeUserRole = (userName, userRole) => {
  return instance({
    url: '/vocc/change-user-role',
    method: 'POST',
    params: { username: userName, userRole: userRole }
  })
}

/**
 * 선사의 선단 및 선박 목록 조회
 */

export const getFleetAndShipByVocc = (voccids) => {
  return instance({
    url: '/vocc/get-fleet-list-by-menu',
    method: 'GET',
    params: { voccIdList: voccids }
  }).then((response) => {
    const {
      data: { data }
    } = response
    const result = convertArray(data)
    return result
  })
}

export const getShipsByVoccId = (voccId) => {
  return instance({
    url: '/vocc/get-ship-list-by-vocc',
    method: 'GET',
    params: { voccId }
  })
}

const convertArray = async (apiData) => {
  let convertData = []
  // const test = apiData.forEach(vocc => {
  for (let data of apiData) {
    convertData.push({
      id: convertData.length + 1,
      parentId: 0,
      voccId: data.voccId,
      voccName: data.voccName,
      displayName: data.voccName,
      fleetId: '',
      fleetName: '',
      imoNumber: '',
      ShipName: ''
    })

    let voccId = convertData.length
    if (data.fleetDataList.length > 0) {
      //  vocc.fleetDataList.forEach( fleet => {
      for (let fleet of data.fleetDataList) {
        let fleetId = ''
        if (fleet.fleetName != 'DEFAULT') {
          convertData.push({
            id: convertData.length + 1,
            parentId: voccId,
            voccId: data.voccId,
            voccName: data.voccName,
            fleetId: fleet.fleetId,
            fleetName: fleet.fleetName,
            displayName: fleet.fleetName,
            imoNumber: '',
            shipName: ''
          })
          fleetId = convertData.length
        } else {
          fleetId = voccId
        }

        if (fleet.shipDataList.length > 0) {
          for (const ship of fleet.shipDataList) {
            // console.log(response[ship.imoNumber])
            const result = await fetchShipCondition(ship.imoNumber)
            let alarmType = result[ship.imoNumber]
            convertData.push({
              id: convertData.length + 1,
              parentId: fleetId,
              voccId: data.voccId,
              voccName: data.voccName,
              fleetId: fleet.fleetId,
              fleetName: fleet.fleetName,
              displayName: ship.shipName,
              imoNumber: ship.imoNumber,
              shipName: ship.shipName,
              shipStatus: alarmType
            })
          }
        }
      }
    }
  }
  return convertData
}
export const fetchShipCondition = async (imoNumber) => {
  const result = await getShipCondition(imoNumber.toString())
  return result
}

/**
 * 선사 대표 관리자 변경
 * @param {} editForm
 * @returns
 */
export const updatePresidentAdmin = (form) => {
  return instance({
    url: '/vocc/change-president-admin',
    method: 'POST',
    data: form
  })
}
