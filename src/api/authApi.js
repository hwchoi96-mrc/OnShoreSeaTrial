import instance from '@/composables/useAxios.js'

export const checkUser = (loginInfo) => {
  localStorage.clear()
  return instance({
    url: '/user/login',
    method: 'POST',
    data: loginInfo,
    withCredentials: true
  })
}

export const logout = () => {
  return instance({
    url: '/user/logout',
    method: 'POST'
  })
}

/**
 * DB에 등록된 사용자 정보 조회 api 요청
 * @param {*} param
 * @returns
 */

export const getUserInfo = (param) => {
  return instance({
    url: '/user/get-data',
    method: 'POST',
    data: param
  })
}

export const getUserInfoById = () => {
  return instance({
    url: '/user/get-data-from-id',
    method: 'get'
  })
}

/**
 * 아이디 찾기
 * @param {*} email
 * @returns
 */
export const getUserId = (email) => {
  return instance({
    url: '/user/find-username',
    method: 'GET',
    params: { email }
  })
}

export const resetUserPassword = (userName) => {
  return instance({
    url: '/vocc/initialize-admin-password',
    method: 'POST',
    params: { username: userName }
  })
}

/**
 * 📄 계정 관리 페이지
 */

/**
 * 사용자 이메일 변경
 * @param {} emailEditForm
 * @returns
 */

export const changeEmail = (emailEditForm) => {
  return instance({
    url: '/user/change-email',
    method: 'POST',
    data: emailEditForm
  })
}

/**
 * 사용자 비밀번호 변경
 * @param {} emailEditForm
 * @returns
 */
export const changePassword = (passwordEditForm) => {
  return instance({
    url: '/user/change-password',
    method: 'POST',
    data: passwordEditForm
  })
}

/**
 * 사용자 닉네임 변경
 * @param {*} nicknameEditForm
 * @returns
 */
export const changeNickname = (nicknameEditForm) => {
  return instance({
    url: '/user/change-nickname',
    method: 'POST',
    data: nicknameEditForm
  })
}

/**
 * 📄 사용자 그룹 관리
 */

/**
 * 새 그룹 추가
 * @param {*} groupName
 * @returns
 */
export const addGroup = (voccId, groupName) => {
  return instance({
    url: '/user-group/add-group',
    method: 'POST',
    params: { voccId, groupName }
  })
}

export const deleteGroup = (voccId, groupName) => {
  return instance({
    url: '/user-group/remove-group',
    method: 'POST',
    params: { voccId, groupName }
  })
}

export const getUsersByGroup = (voccId) => {
  return instance({
    url: '/user-group/get-user-list',
    method: 'GET',
    params: { voccId }
  })
}

export const saveUserByGroup = (userInfo) => {
  return instance({
    url: '/user-group/add-user',
    method: 'POST',
    data: userInfo
  })
}

export const deleteUserByGroup = (userInfo) => {
  return instance({
    url: '/user-group/remove-user',
    method: 'POST',
    data: userInfo
  })
}

export const getAccessLog = (startDate, endDate) => {
  return instance({
    url: '/user-connection-history/get-list',
    method: 'GET',
    params: { startDate, endDate }
  })
}
