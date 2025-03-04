export const convertRoleName = (role) => {
  // switch(role)
  let roleName = ''
  switch (role) {
    case 'ROLE_LCC_ADMIN':
      roleName = '시스템 관리자'
      break
    case 'ROLE_VOCC_ADMIN':
      roleName = '관리자'
      break
    case 'ROLE_VOCC_USER':
      roleName = '일반 사용자'
      break
  }
  return roleName
}
