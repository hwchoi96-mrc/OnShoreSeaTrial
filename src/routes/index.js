import { createWebHistory, createRouter, START_LOCATION } from 'vue-router'

/**
 * 라우트 설정
 */
import authRoutes from './auth'
import mapRoutes from './map'
import adminRoutes from './admin'
import noticeRoutes from './notice'
import settingsRoutes from './settings'
import alertRoutes from './alert'
import voyageRoutes from './voyage'
import fdsRoutes from './fds'
import dataRoutes from './data'
import monitoringRoutes from './monitoring'
import reportRoutes from './report'
import popupRoutes from './popup'

/**
 * 페이지 Import
 */
import BaseLayout from '@/layout/BaseLayout.vue'
import NoSideLayout from '@/layout/NoSideLayout.vue'
import NoHeaderLayout from '@/layout/NoHeaderLayout.vue'

import SignUp from '@/layout/login/BaseSignUp.vue'
import Login from '@/layout/login/BaseLogin.vue'

import CheckAuthentication from '@/views/auth/CheckAuthentication.vue'
import NotFound from '@/views/error/NotFound.vue'
import NoAccessMenu from '@/views/error/NoAccessMenu.vue'

import GuideDashboard from '@/views/dashboard/GuideDashboard.vue'

import { useAuthStore } from '@/stores/authStore.js'
import { useMapStore } from '@/stores/mapStore.js'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAccessMenuStore } from '@/stores/accessMenuStore.js'
import { nextTick } from 'vue'

import { sse } from '@/composables/util'

import { v4 } from 'uuid'

const routes = [
  {
    path: '/',
    redirect: '/auth/login',
    component: BaseLayout,
    children: [
      {
        name: 'MainDashboard',
        path: '/dashboard',
        component: GuideDashboard
      },
      {
        name: 'certified',
        path: '/auth/certified',
        component: CheckAuthentication
      }
    ]
  },
  {
    path: '/notfound',
    component: NoHeaderLayout,
    children: [
      {
        path: '',
        name: 'NotFound',
        component: NotFound,
        props: true
      }
    ]
  },
  {
    path: '/noAccess',
    component: NoHeaderLayout,
    children: [
      {
        name: 'NoAccess',
        path: '',
        component: NoAccessMenu,
        meta: { requiresAuth: false }
      }
    ]
  },
  ...authRoutes,
  ...mapRoutes,
  ...adminRoutes,
  ...noticeRoutes,
  ...settingsRoutes,
  ...alertRoutes,
  ...voyageRoutes,
  ...fdsRoutes,
  ...dataRoutes,
  ...reportRoutes,
  ...monitoringRoutes,
  ...popupRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const checkPermission = (role, currentRole) => {
  return role === currentRole ? true : false
}

const authAccess = () => {
  const userInfo = sessionStorage.getItem('userInfo')
  // const userInfo = localStorage.getItem('userInfo')

  if (userInfo) {
    return true
  } else {
    return false
  }
}

const hasAccessMenu = () => {
  const accessMenus = sessionStorage.getItem('accessMenus')
  // const accessMenus = localStorage.getItem('AccessMenu')
  if (!accessMenus || accessMenus.length <= 0) {
    return false
  } else {
    return JSON.parse(accessMenus)
  }
}
router.beforeEach((to, from, next) => {
  // to : 이동할 url
  // from  : 현재 url
  // next : to에서 지정한 url로 이동하기 위해 꼭 호출해야하는 함수
  const authStore = useAuthStore()
  const mapStore = useMapStore()
  const voccStore = useVoccStore()
  const accessMenuStore = useAccessMenuStore()

  if (from === START_LOCATION && sessionStorage.getItem('userInfo')) {
    authStore.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    mapStore.clickedShipInfo = JSON.parse(sessionStorage.getItem('clickedShipInfo'))
    voccStore.voccInfo = JSON.parse(sessionStorage.getItem('voccInfo'))
    accessMenuStore.accessMenus = JSON.parse(sessionStorage.getItem('accessMenus'))

    let uuid = v4()

    let eventSource = new EventSource(`/api/sse/subscribe?subScribeId=${uuid}`)
    sse(eventSource)
  }

  const isLogin = authAccess()
  const menus = hasAccessMenu()
  const userRole = sessionStorage.getItem('userRole')

  if (to.name == undefined) {
    // return { name: 'NotFound' }
    next('/notFound')
  }

  if (to.meta.requiresAuth && !isLogin) {
    return { name: 'Login' }
  }

  // 로그인 여부 확인
  if (!isLogin) {
    // 무한 루프 방지
    return to.name !== 'Login' ? { name: 'Login' } : next()
  }

  // 접근 가능한 메뉴 있는지 확인
  if (!menus) {
    // 무한 루프 방지
    return to.name === 'NoAccess' ? next() : { name: 'NoAccess' }
    // next()
    // next('/noAccess')
  }

  // 권한이 필요한 페이지일 경우
  if (to.meta.requiresAuth) {
    if (to.meta.roles.includes(userRole)) {
      next()
    } else {
      // return { name: 'NoAccess' }
      next('/NoAccess')
    }
  }

  if (from.fullPath == '/' && to.fullPath == '/auth/login') {
    const { accessMenus } = menus

    if (!accessMenus) {
      next()
    }

    let firstMenu = ''
    if (accessMenus[0]['children']) {
      firstMenu = accessMenus[0]['children'][0]['routerPath']
    } else {
      firstMenu = accessMenus[0]['routerPath']
    }
    next(firstMenu)
  } else {
    next()
  }
})

export default router
