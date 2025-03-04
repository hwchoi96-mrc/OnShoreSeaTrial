/**
 * 대메뉴 : 설정
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import FdsManagement from '@/views/fds/FdsManagement.vue'

const fdsRoutes = [
  {
    path: '/fds',
    component: BaseLayout,
    children: [
      {
        name: 'FdsManagement',
        path: 'management',
        component: FdsManagement
      }
    ]
  }
]

export default fdsRoutes
