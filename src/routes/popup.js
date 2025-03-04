/**
 * 대메뉴 : 설정
 */
import NoHeaderLayout from '@/layout/NoHeaderLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import PopupAlertList from '@/views/popup/PopupAlertList.vue'
import PouppEngineRealTimeMonitoring from '@/views/popup/PouppEngineRealTimeMonitoring.vue'
import PopupEngineTimeBased from '@/views/popup/PopupEngineTimeBased.vue'
import PopupEnginePerformance from '@/views/popup/PopupEnginePerformance.vue'
import PopupFDSMonitoring from '@/views/popup/PopupFDSMonitoring.vue'
import PopupCCTVMonitoring from '@/views/popup/PopupCCTVMonitoring.vue'
import PopupECDISMonitoring from '@/views/popup/PopupECDISMonitoring.vue'
import PopupRADARMonitoring from '@/views/popup/PopupRADARMonitoring.vue'
import PopupShipDashboard from '@/views/popup/PopupShipDashboard.vue'
import PopupPortInfo from '@/views/popup/PopupPortInfo.vue'

const popupRoutes = [
  {
    path: '/popup',
    component: NoHeaderLayout,
    children: [
      {
        name: 'PopupAlertList',
        path: 'alert',
        component: PopupAlertList
      },
      {
        name: 'PopupShipDashboard',
        path: 'monitoring/ship',
        component: PopupShipDashboard
      },
      {
        name: 'PopupEngineRealTimeMonitoring',
        path: 'monitoring/engine',
        component: PouppEngineRealTimeMonitoring
      },
      {
        name: 'PopupEngineTimeBased',
        path: 'monitoring/engine/time',
        component: PopupEngineTimeBased
      },
      {
        name: 'PopupEnginePerformance',
        path: 'monitoring/engine/performance',
        component: PopupEnginePerformance
      },
      {
        name: 'PopupFDSMonitoring',
        path: 'monitoring/fds',
        component: PopupFDSMonitoring
      },
      {
        name: 'PopupCCTVMonitoring',
        path: 'monitoring/cctv',
        component: PopupCCTVMonitoring
      },
      {
        name: 'PopupECDISMonitoring',
        path: 'monitoring/ecdis',
        component: PopupECDISMonitoring
      },
      {
        name: 'PopupRADARMonitoring',
        path: 'monitoring/radar',
        component: PopupRADARMonitoring
      },
      {
        name: 'PopupPortInfo',
        path: 'monitoring/port',
        component: PopupPortInfo
      }
    ]
  }
]

export default popupRoutes
