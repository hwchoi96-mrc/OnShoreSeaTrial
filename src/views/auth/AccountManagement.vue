<template>
  <v-container fluid class="h-100 settings">
    <v-row class="ma-0 h-100">
      <v-col cols="9" lg="9">
        <v-card class="h-100 rounded-lg">
          <v-card-title class="align-center">계정 정보</v-card-title>
          <v-card-text>
            <v-table class="text-caption">
              <tbody>
                <tr>
                  <th class="text-center">아이디</th>
                  <td>{{ userInfo.username }}</td>

                  <td></td>
                </tr>
                <tr align="left">
                  <th class="text-center">비밀번호</th>
                  <td>********</td>
                  <td align="right">
                    <i-btn
                      text="변경"
                      ref="basePasswordBtn"
                      name="BasePassword"
                      @click="changeComponent($event, 'BasePassword')"
                    ></i-btn>
                  </td>
                </tr>

                <tr align="left">
                  <th class="text-center">닉네임</th>
                  <td>{{ userInfo.nickname }}</td>
                  <td align="right">
                    <i-btn
                      text="변경"
                      ref="baseNicknameBtn"
                      name="BaseNickname"
                      @click="changeComponent($event, 'BaseNickname')"
                    ></i-btn>
                  </td>
                </tr>

                <tr align="left">
                  <th class="text-center">이메일</th>
                  <td>{{ userInfo.email }}</td>
                  <td align="right">
                    <i-btn
                      text="변경"
                      ref="baseEmailBtn"
                      name="BaseEmail"
                      @click="changeComponent($event, 'BaseEmail')"
                    ></i-btn>
                  </td>
                </tr>
                <tr align="left">
                  <th class="text-center">활성화 상태</th>
                  <td>
                    {{ displayStatus }}
                  </td>
                  <td></td>
                </tr>
                <tr align="left">
                  <th class="text-center">계정 권한</th>
                  <td>{{ convertRoleName }}</td>
                  <td></td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" lg="3">
        <component
          :is="componentList[currentComponent]"
          class="h-100"
          style="background-color: #1f1e1e"
        ></component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, computed, provide } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/authStore.js'

import DefaultText from '@/components/DefaultText.vue'
import BasePassword from '@/layout/modify/BasePassword.vue'
import BaseNickname from '@/layout/modify/BaseNickname.vue'
import BaseEmail from '@/layout/modify/BaseEmail.vue'

/**
 * 계정 정보 표시
 */
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

onBeforeMount(() => {
  getUserInfo()
})

const getUserInfo = async () => {
  console.log('유저정보 조회')
  console.dir(userInfo.value)
  await authStore.getMyInfo()
}

/**
 * 권한에 따른 텍스트 변경
 */
const convertRoleName = computed(() => {
  let roleName = ''
  switch (userInfo.value.role) {
    case 'ROLE_LCC_ADMIN':
      roleName = '최고 관리자'
      break
    case 'ROLE_VOCC_ADMIN':
      roleName = '선사 관리자'
      break
    case 'ROLE_VOCC_USER':
      roleName = '선사 사용자'
      break
  }
  return roleName
})

const displayStatus = computed(() => {
  return userInfo.value.activated ? '사용 가능' : '사용 불가능'
})

/**
 * 동적 컴포넌트 변경
 */

const componentList = {
  DefaultText,
  BasePassword,
  BaseNickname,
  BaseEmail
}
const currentComponent = ref('DefaultText')
const currentButton = ref()
const basePasswordBtn = ref('')
const baseNicknameBtn = ref('')
const baseEmailBtn = ref('')

/**
 * 버튼 선택 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name) => {
  let componentName = ''

  currentComponent.value = name
  componentName = name
  componentName = name

  // 클릭한 컴포넌트가 아니면 초기화
  if (componentName !== 'BasePassword') resetButtonState('BasePassword')
  if (componentName !== 'BaseNickname') resetButtonState('BaseNickname')
  if (componentName !== 'BaseEmail') resetButtonState('BaseEmail')

  changeButtonStatus(event, name)
}
provide('changeComponent', changeComponent)

const changeButtonStatus = (event, name) => {
  const el = document.querySelector(`button[name=${name}]`)
  el.innerText = '변경중'
  el.style.backgroundColor = '#7A8294'
  el.style.color = '#525C71'
  el.disabled = true
}

const resetButtonState = (buttonRef) => {
  const el = document.querySelector(`button[name=${buttonRef}]`)
  el.style.backgroundColor = '#4E83FF'
  el.innerText = '변경'
  el.style.color = '#fff'
  el.disabled = false
}
</script>

<style scoped></style>
