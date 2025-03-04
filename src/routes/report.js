/**
 * 대메뉴 : REPORT
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : IMO DCS
 */
import ImoDcs from '@/views/report/imodcs/ImoDcs.vue'

const reportRoutes = [
  {
    path: '/report',
    component: BaseLayout,
    children: [
      {
        name: 'ImoDcs',
        path: 'imodcs',
        component: ImoDcs
      }
    ]
  }
]

export default reportRoutes
