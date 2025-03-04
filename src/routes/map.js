import BaseLayout from '@/layout/BaseLayout.vue'

import MainMap from '@/views/map/MainMap.vue'

/**
 * 항해정보 관련 라우트
 */
const mapRoutes = [
  {
    path: '/map',
    component: BaseLayout,
    children: [
      /**
       * 현재 지도 이미지 표시되는 화면
       */
      {
        name: 'MainMap',
        path: '',
        component: MainMap
      }
    ]
  }
]

export default mapRoutes
