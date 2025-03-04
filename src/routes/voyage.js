/**
 * 대메뉴 : VOYAGE
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : VOYAGE LIST, CII RATRING
 */
import VoyageList from '@/views/voyage/VoyageList.vue'
import CIIRating from '@/views/voyage/cii/CIIRating.vue'

const voyageRoutes = [
  {
    path: '/voyage',
    component: BaseLayout,
    children: [
      {
        name: 'VoyageList',
        path: 'cii/list',
        component: VoyageList
      },
      {
        name: 'DetailCIIRating',
        path: 'cii/rating',
        component: CIIRating
      }
    ]
  }
]

export default voyageRoutes
