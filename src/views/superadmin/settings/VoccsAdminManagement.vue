<template>
  <v-container fluid class="h-100 management-page">
    <v-row class="ma-0 h-100">
      <v-col cols="12" lg="9">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>선사별 관리자 목록</div>
            <i-btn
              prepend-icon="mdi-plus"
              color="#3D3D40"
              text="등록"
              width="75"
              @click.stop="changeComponent($event, 'AdminRegisterForm')"
            ></i-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid
                  id="voccs-grid"
                  class="no-stripe title-container"
                  ref="voccsGrid"
                  key-expr="id"
                  :show-borders="true"
                  :data-source="voccs"
                  :show-column-headers="false"
                  @selection-changed="fetchAdminsByVoccId"
                >
                  <DxScrolling column-rendering-mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>

              <v-col cols="8">
                <v-data-table class="admin-list title-container" no-data-text="데이터가 없습니다">
                  <thead></thead>
                  <tbody>
                    <tr
                      v-for="(admin, index) in admins"
                      :key="admin.id"
                      :class="{ 'is-editing': isEditing(index) }"
                    >
                      <td class="username">
                        {{ admin.nickname }}
                        <span class="president-symbol ml-2" v-if="admin.presidentAdminUser">
                          대표
                        </span>
                      </td>
                      <td class="activate-status">
                        <i-btn
                          :text="admin.activated ? '사용 가능' : '계정 잠금'"
                          :prepend-icon="admin.activated ? 'mdi-lock-open' : 'mdi-lock'"
                          :color="admin.activated ? '#fff' : '#737373'"
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
                          name="AdminEditForm"
                          @click.stop="
                            changeComponent($event, 'AdminEditForm', index, admin.userId)
                          "
                        >
                        </i-btn>
                      </td>

                      <td class="president-btn">
                        <i-btn
                          v-if="!isExistPresentAdmin"
                          text="대표 관리자 할당"
                          class="mr-4"
                          width="120"
                          color="#434348 "
                          @click="
                            changePresidentAdmin(
                              admin.voccId,
                              admin.username,
                              !admin.presidentAdminUser
                            )
                          "
                        ></i-btn>
                        <i-btn
                          v-if="admin.presidentAdminUser"
                          class="mr-4"
                          @click="
                            changePresidentAdmin(
                              admin.voccId,
                              admin.username,
                              !admin.presidentAdminUser
                            )
                          "
                          text="대표 관리자 해제"
                          width="120"
                          color="#F04A4A"
                        ></i-btn>
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
      <v-col cols="12" lg="3">
        <component
          :is="componentList[currentComponent]"
          :voccId="curSelectedVoccId"
          :userId="selectedUserId"
          :adminCount="selectedAdminCount"
          class="h-100"
          @refresh="refreshVoccsGrid"
        >
        </component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore.js'
import { useAdminStore } from '@/stores/adminStore.js'
import { useToast } from '@/composables/useToast'

import { isStatusOk } from '@/composables/util.js'
import { getDxGridInstance, dxGridRefresh } from '@/composables/dxGridUtil'

import { getAdminsByVoccId, updatePresidentAdmin } from '@/api/voccApi'

import DefaultText from '@/components/DefaultText.vue'
import AdminRegisterForm from '@/views/superadmin/settings/form/AdminRegisterForm.vue'
import AdminEditForm from '@/views/superadmin/settings/form/AdminEditForm.vue'

import _ from 'lodash'

const voccs = ref([]) // 선사 목록
const admins = ref([]) // 관리자 목록
const curSelectedVoccId = ref(null) // 현재 선택한 선사 아이디
const selectedUserId = ref() // 현재 선택한 사용자 아이디
const currentIndex = ref('')
const selectedAdminCount = ref(0)

/**
 * 상태관리를 위한 변수
 */
const voccStore = useVoccStore()
const adminStore = useAdminStore()

const { voccsAdmins } = storeToRefs(adminStore)
const { showResMsg } = useToast()

/**
 * 우측 컴포넌트 관련 변수
 */
const currentComponent = ref('DefaultText')
const componentList = {
  DefaultText,
  AdminRegisterForm,
  AdminEditForm
}

/**
 * 선사 목록 테이블 관련 변수
 */
const voccsGrid = ref()
const voccsInstace = ref()

onBeforeMount(() => {
  fetchVoccs()
})

onMounted(() => {
  voccsInstace.value = getDxGridInstance(voccsGrid)
})

/**
 * 선사 목록 조회
 */
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
}

/**
 * 선사별 관리자 목록 조회
 * @param {} e
 */
const fetchAdminsByVoccId = async (e) => {
  changeComponent(e, 'DefaultText')

  const voccId = e.currentSelectedRowKeys[0]
  curSelectedVoccId.value = voccId // 현재 선택된 선사의 ID 저장

  const result = await getAdminsByVoccId(voccId)
  admins.value = result
  admins.value.sort((a, b) => b.presidentAdminUser - a.presidentAdminUser)

  // 선사가 "UIPA"인 관리자의 리스트 수를 voccName으로 비교하여 콘솔에 출력
  const uipaAdmins = admins.value.filter((admin) => admin.voccName === 'UIPA')
  console.log('선사가 UIPA인 관리자의 수:', uipaAdmins.length)
}

/**
 * 대표 관리자 존재 여부
 */
const isExistPresentAdmin = computed(() => {
  const result = admins.value.some((admin) => admin.presidentAdminUser == true)
  return result
})

/*
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 *
 */
const changeComponent = (event, name, index = '', userId = '') => {
  selectedUserId.value = userId

  currentComponent.value = name
  currentIndex.value = index

  if (name === 'AdminEditForm') {
    selectedAdminCount.value = admins.value.length
  }
}

/**
 * 현재 수정 중인지 여부 체크
 * @param {} index
 */
const isEditing = (index) => {
  return parseInt(currentIndex.value) === index
}

/**
 * 대표 관리자 변경
 * @param {} voccId
 * @param {*} username
 * @param {*} appoint
 */
const changePresidentAdmin = async (voccId, username, appoint) => {
  const form = { voccId, username, appoint }
  const { status } = await updatePresidentAdmin(form)

  if (isStatusOk(status)) {
    if (appoint) {
      showResMsg('대표 관리자가 할당되었습니다')
    } else {
      showResMsg('대표 관리자가 해제되었습니다')
    }

    let index = admins.value.findIndex((admin) => admin.username == username)

    admins.value[index].presidentAdminUser = appoint
    admins.value.sort((a, b) => b.presidentAdminUser - a.presidentAdminUser)
  }
}

const refreshVoccsGrid = async () => {
  if (curSelectedVoccId.value != null && curSelectedVoccId.value != undefined) {
    admins.value = await getAdminsByVoccId(curSelectedVoccId.value)
    voccsInstace.value.option('focusedRowKey', null)
    admins.value.sort((a, b) => b.presidentAdminUser - a.presidentAdminUser)
  }
}

provide('changeComponent', changeComponent)
</script>

<style scoped>
.admin-list {
  border: 1px solid #49494e;
}

.admin-list tr:nth-child(odd) {
  background: #2f2f32;
}

.admin-list th {
  border-right: 1px solid #49494e;
}

.admin-list .title {
  font-size: 1.2em;
}

/* .voccs-grid {
  flex : 1 1 30%;
} */

.admin-list {
  flex: 1 1 70%;
}

.president-symbol {
  background: #5789fe;
  padding: 5px 10px;
  border-radius: 50px;
}

@media (max-height: 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>
