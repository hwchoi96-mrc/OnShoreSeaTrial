<template>
  <v-container fluid class="h-100 management-page">
    <v-row class="ma-0 h-100">
      <v-col cols="9" lg="9">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>선사별 사용자 목록</div>
            <i-btn
              prepend-icon="mdi-plus"
              color="#3D3D40"
              text="등록"
              width="75"
              @click.stop="changeComponent($event, 'UserRegisterForm')"
            ></i-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <DxDataGrid
                  id="voccs-grid"
                  class="no-stripe voccs-grid title-container"
                  ref="voccsGrid"
                  key-expr="id"
                  :data-source="voccs"
                  :show-column-headers="false"
                  :show-borders="true"
                  @selection-changed="fetchUsersByVoccId"
                >
                  <!-- :on-focused-cell-changed="fetchUsersByVoccId" -->
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                  <DxScrolling mode="virtual" />
                </DxDataGrid>
              </v-col>
              <v-col>
                <v-data-table class="users-list title-container" no-data-text="데이터가 없습니다">
                  <thead></thead>
                  <tbody>
                    <tr v-for="(voccsUser, index) in users" :key="voccsUser.id">
                      <td class="username">{{ voccsUser.nickname }}</td>
                      <td class="activate-status">
                        <i-btn
                          :text="voccsUser.activated ? '사용 가능' : '계정 잠금'"
                          :prepend-icon="voccsUser.activated ? 'mdi-lock-open' : 'mdi-lock'"
                          :color="voccsUser.activated ? '#fff' : '#737373'"
                          variant="text"
                          readonly
                          class="d-flex justify-end align-center"
                        >
                        </i-btn>
                      </td>
                      <td class="modify-btn">
                        <i-btn
                          :text="isEditing(index) ? '수정중' : '수정'"
                          :color="isEditing(index) ? '#7A8294' : '#4E83FF'"
                          :disable="isEditing(index)"
                          :dataId="index"
                          name="UserEditForm"
                          @click.stop="
                            changeComponent(
                              $event,
                              'UserEditForm',
                              voccsUser.voccId,
                              voccsUser.userId,
                              index
                            )
                          "
                        >
                        </i-btn>
                      </td>
                    </tr>
                  </tbody>
                  <template #bottom></template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" lg="3">
        <component
          :is="componentList[currentComponent]"
          :voccId="_voccId"
          :voccUserId="_voccsUserId"
          @refresh="refreshVoccUser"
          class="h-100"
        >
        </component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide } from 'vue'
import { storeToRefs } from 'pinia'

import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'

// import { convertRoleName } from '@/composables/user.js'
import { dxGridRefresh } from '@/composables/dxGridUtil.js'

import DefaultText from '@/components/DefaultText.vue'
import UserRegisterForm from '@/views/superadmin/settings/form//UserRegisterForm.vue'
import UserEditForm from '@/views/superadmin/settings/form/UserEditForm.vue'

import _ from 'lodash'

const currentComponent = ref('DefaultText')
const voccStore = useVoccStore()
const adminStore = useAdminStore()
const { voccsUsers } = storeToRefs(adminStore)
const _voccId = ref()
const _voccsUserId = ref()
const currentId = ref('')

const voccs = ref([])
const users = ref([])

const voccsGrid = ref()

const componentList = {
  DefaultText,
  UserRegisterForm,
  UserEditForm
}

onBeforeMount(() => {
  fetchVoccs()
  // getVoccUserAll()
})

const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId = '', voccsUserId = '', index = '') => {
  _voccsUserId.value = voccsUserId
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name
  _voccId.value = voccId
  currentComponent.value = name
  currentId.value = index
}

const isEditing = (index) => {
  return parseInt(currentId.value) === index
}

const fetchUsersByVoccId = async (e) => {
  let curVoccId = e.currentSelectedRowKeys[0]
  const result = await adminStore.fetchUsersByVoccId(curVoccId)
  _voccId.value = curVoccId

  if (result) {
    users.value = _.cloneDeep(voccsUsers.value)
  }

  changeComponent(e, 'DefaultText')
}

const refreshUsers = () => {
  fetchUsersByVoccId(_voccId.value)
}

const refreshVoccUser = () => {
  users.value = _.cloneDeep(voccsUsers.value).filter(
    (user) => user.role !== 'ROLE_VOCC_ADMIN' && user.role !== 'ROLE_LCC_ADMIN'
  ) //이채원사원 작업사항
  //users.value = _.cloneDeep(voccsUsers.value) 오류나면 복구
  dxGridRefresh(voccsGrid)
}

provide('changeComponent', changeComponent)
provide('refreshUsers', refreshUsers)
</script>

<style scoped>
.v-row {
  height: 100%;
}

.v-card {
  height: 100%;
}

.users-list {
  border: 1px solid #49494e;
}

.users-list tr:nth-child(odd) {
  background: #2f2f32;
}

.users-list th {
  border-right: 1px solid #49494e;
}

.users-list .title {
  font-size: 1.2em;
}

.voccs-grid {
  flex: 1 1 30%;
}

.users-list {
  flex: 1 1 70%;
}

/* .active {
  background: '#4E83FF';
  color: '#fff'
}

.inactive {
  background: '#7A8294';
  color: '#525C71'

} */

@media (max-height: 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>
