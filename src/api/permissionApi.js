import instance from '@/composables/useAxios.js'

export const saveMenuByGroup = (menus) => {
  return instance({
    url : '/menu-group/change-menu-group',
    method : 'POST',
    data : menus
  })
}

export const getMenus = () => {
  return instance({
    url: '/menu-group/get-all-menu',
    method: 'GET',
  })
}

export const getMenusByGroup = (groupId) => {
  return instance({
    url: '/menu-group/get-menu',
    method: 'GET',
    params: { userGroupId: groupId }
  })
}
