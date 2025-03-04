/**
 * 대메뉴 : 설정
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import AlertManagement from '@/views/alert/AlertManagement.vue'

const alertRoutes = [
  {
    path: '/alert',
    component: BaseLayout,
    children: [
      {
        name: 'AlertManagement',
        path: 'management',
        component: AlertManagement
      }
    ]
  }
]

export default alertRoutes
