import { createWebHistory, createRouter } from 'vue-router'

import NoSideLayout from '@/layout/NoSideLayout.vue'
import BaseLayout from '@/layout/BaseLayout.vue'

import SignUp from '@/layout/login/BaseSignUp.vue'
import Login from '@/layout/login/BaseLogin.vue'
import BaseEmail from '@/layout/modify/BaseEmail.vue'
import BasePassword from '@/layout/modify/BasePassword.vue'
import BaseNickname from '@/layout/modify/BaseNickname.vue'

const authRoutes = [
  {
    path: '/auth',
    component: NoSideLayout,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
        meta : { requiresAuth : false }
      },

      {
        name: 'SignUp',
        path: 'signup',
        component: SignUp
      },
      {
        name: 'ChangeEmail',
        path: 'change/email/:userId',
        component: BaseEmail
      },
      {
        name: 'ChangePassword',
        path: 'change/password',
        component: BasePassword
      },
      {
        name: 'ChangeNickname',
        path: 'change/nickname',
        component: BaseNickname
      }
    ]
  },
]

export default authRoutes
