/**
 * 대메뉴 : 설정
 */
import SettingLayout from '@/layout/SettingLayout.vue'
/**
 * 소메뉴 : 계정관리
 */
import AccountManagement from '@/views/auth/AccountManagement.vue'
import VoccAdminManagement from '@/views/auth/admin/VoccAdminManagement.vue'
import VoccUserManagement from '@/views/settings/vocc/admin/VoccUserManagement.vue'
import GroupManagement from '@/views/settings/group/GroupManagement.vue'
import VoccsAdminManagement from '@/views/superadmin/settings/VoccsAdminManagement.vue'
import VoccsUserManagement from '@/views/superadmin/settings/VoccsUserManagement.vue'
import VoccsGroupManagement from '@/views/superadmin/settings/VoccsGroupManagement.vue'
import VoccsMenuManagement from '@/views/superadmin/settings/VoccsMenuManagement.vue'
import VoccsOperationManagement from '@/views/superadmin/settings/VoccsOperationManagement.vue'
import VoccsManagement from '@/views/superadmin/settings/VoccsManagement.vue'
import MenuManagement from '@/views/settings/menu/MenuManagement.vue'
import AccessLogs from '@/views/settings/logs/AccessLogs.vue'
import VoccInfoManagement from '@/views/settings/vocc/VoccInfoManagement.vue'
import TagManagement from '@/views/settings/tag/TagManagement.vue'
import OperationManagement from '@/views/settings/operation/OperationManagement.vue'
import SystemManagement from '@/views/superadmin/settings/system/SystemManagement.vue'
import UserSystemManagement from '@/views/settings/system/UserSystemManagement.vue'

const settingsRoutes = [
  {
    path: '/settings',
    component: SettingLayout,
    children: [
      {
        name: 'AccountManagement',
        path: 'account',
        component: AccountManagement
      },
      {
        name: 'VoccsAdminManagement',
        path: 'voccs/admin',
        component: VoccsAdminManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN'] }
      },
      {
        name: 'VoccAdminManagement',
        path: 'vocc/admin',
        component: VoccAdminManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN', 'ROLE_VOCC_ADMIN'] }
      },
      {
        name: 'VoccUserManagement',
        path: 'vocc/user',
        component: VoccUserManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN', 'ROLE_VOCC_ADMIN'] }
      },
      {
        name: 'VoccsUserManagement',
        path: 'voccs/user',
        component: VoccsUserManagement,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN', 'ROLE_VOCC_ADMIN'] }
      },
      {
        name: 'GroupManagement',
        path: 'group',
        component: GroupManagement
      },
      {
        name: 'VoccsGroupManagement',
        path: 'vocc/group',
        component: VoccsGroupManagement
      },
      // {
      //   name : 'MenuManagement',
      //   path : 'menu',
      //   component : MenuManagement
      // },
      {
        name: 'AccessLogs',
        path: 'accesslog',
        component: AccessLogs,
        meta: { requiresAuth: true, roles: ['ROLE_LCC_ADMIN'] }
      },
      {
        name: 'VoccsMenuManagement',
        path: 'voccs/menu',
        component: VoccsMenuManagement
      },
      {
        name: 'MenuManagement',
        path: 'menu',
        component: MenuManagement
      },
      {
        name: 'VoccInfoManagement',
        path: 'vocc',
        component: VoccInfoManagement
      },
      {
        name: 'VoccsManagement',
        path: 'voccs',
        component: VoccsManagement
      },
      {
        name: 'TagManagement',
        path: 'tag',
        component: TagManagement
      },
      {
        name: 'VoccsOperationManagement',
        path: 'voccs/operation',
        component: VoccsOperationManagement
      },
      {
        name: 'OperationManagement',
        path: 'operation',
        component: OperationManagement
      },
      {
        name: 'SystemManagement',
        path: 'system',
        component: SystemManagement
      },
      {
        name: 'UserSystemManagement',
        path: 'system/user',
        component: UserSystemManagement
      }
    ]
  }
]

export default settingsRoutes
