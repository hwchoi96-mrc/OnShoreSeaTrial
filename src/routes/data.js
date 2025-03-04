/**
 * 대메뉴 : 설정
 */
import BaseLayout from '@/layout/BaseLayout.vue'
/**
 * 소메뉴 : 알람 모니터링
 */
import DataEquipment from '@/views/data/DataEquipment.vue'
import DataAnalysis from '@/views/data/DataAnalysis.vue'
import EngineMonitoring from '@/views/data/engine/EngineMonitoring.vue'

const dataRoutes = [
  {
    path: '/data',
    component: BaseLayout,
    children: [
      {
        name: 'EngineMonitoring',
        path: 'engine',
        component: EngineMonitoring
      },
      {
        name: 'DataEquipment',
        path: 'equipment',
        component: DataEquipment
      },
      {
        name: 'EquipmentManagement',
        path: 'analysis',
        component: DataAnalysis
      }
    ]
  }
]

export default dataRoutes
