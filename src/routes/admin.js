import BaseLayout from '@/layout/BaseLayout.vue'

// import VoccEditTab from '@/views/auth/vocc/VoccEditTab.vue'
// import voccAdminList from '@/views/auth/admin/voccAdminList.vue'
/**
 * UIPA 시스템 관리자 관련 라우트
 */
const adminRoutes = [
  {
    path: '/admin',
    component: BaseLayout,
    children: [
      /**
       * 선사 관리자 정보 조회
       */
      // {
      //   name: 'voccEdit',
      //   path: 'vocc/detail/:id',
      //   component: VoccEditTab,
      //   meta: {
      //     requiresAuth: true,
      //     role: 'ROLE_LCC_ADMIN'
      //   }
      // },
      // {
      //   name : 'VoccAdminList',
      //   path : 'vocc/list',
      //   component : voccAdminList
      // }
    ]
  }
]

export default adminRoutes
