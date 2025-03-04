import SettingLayout from '@/layout/SettingLayout.vue'

import NoticeList from '@/views/notice/NoticeList.vue'
import NoticeDetail from '@/views/notice/NoticeDetail.vue'
import NoticeRegistForm from '@/views/notice/NoticeRegistForm.vue'
/**
 * UIPA 시스템 관리자 관련 라우트
 */
const adminRoutes = [
  {
    path: '/notice',
    component: SettingLayout,
    children: [
      /**
       * 공지사항 목록 조회
       */
      {
        name: 'NoticeList',
        path: '',
        component: NoticeList
      },
      /**
       * 공지사항 등록
       */
      {
        name: 'NoticeRegister',
        path: 'add',
        component: NoticeRegistForm
      },

      /**
       * 공지사항 상세 조회
       */
      {
        name: 'NoticeDetail',
        path: ':noticeId',
        component: NoticeDetail
      }
    ]
  }
]

export default adminRoutes
