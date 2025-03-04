<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              <div>선사별 권한그룹 목록</div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <!-- 선사 목록 -->
                <DxDataGrid
                  id="voccGrid"
                  class="no-stripe title-container"
                  ref="voccGrid"
                  key-expr="id"
                  :show-borders="true"
                  :data-source="voccs"
                  @selection-changed="getUsersAndGroups"
                >
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn data-field="id" :visible="false" class="pl-10"></DxColumn>
                  <DxColumn data-field="name" caption="선사명" :allow-editing="false"></DxColumn>
                </DxDataGrid>
              </v-col>
              <v-col>
                <!-- 권한 그룹 목록 -->
                <DxDataGrid
                  id="groupGrid"
                  class="no-stripe title-container"
                  ref="groupGrid"
                  key-expr="first"
                  :show-borders="true"
                  :data-source="voccGroups"
                  @selection-changed="getMenuGroup"
                >
                  <DxScrolling mode="virtual" />
                  <DxSelection mode="single" />
                  <DxColumn
                    data-field="first"
                    caption="groupId"
                    :visible="false"
                    class="pl-10"
                  ></DxColumn>
                  <DxColumn
                    data-field="second"
                    caption="권한그룹명"
                    :allow-editing="false"
                  ></DxColumn>
                </DxDataGrid>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 메뉴 목록 -->
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between">
              <div class="align-self-center">메뉴 목록</div>
              <div>
                <i-btn text="저장" @click="saveMenusByGroup" class="bg-btn mr-1"></i-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <DxTreeList
              id="menus"
              ref="menusGrid"
              class="title-container no-stripe"
              :data-source="initMenus"
              :column-auto-width="true"
              key-expr="menuId"
              parent-id-expr="parentId"
              :selected-row-keys="selectedRowKeys"
              :autoExpandAll="true"
              noDataText="데이터가 없습니다"
              :show-borders="true"
              @row-prepared="onRowPrepared"
              @editor-preparing="onEditorPreparing"
            >
              <DxHeaderFilter :visible="false" />
              <DxScrolling column-rendering-mode="virtual" />
              <DxSelection mode="multiple" :recursive="true"></DxSelection>
              <DxColumn data-field="menuName" caption="메뉴명"></DxColumn>
            </DxTreeList>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showAlertDialog" max-width="290">
    <v-card rounded="lg">
      <v-card-title class="headline">알림</v-card-title>
      <v-card-text class="text-center">변경된 메뉴는 재접속 시 적용됩니다.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showAlertDialog = false">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useVoccStore } from '@/stores/voccStore'
import { getMenus, getMenusByGroup, saveMenuByGroup } from '@/api/permissionApi.js'
import { getDxGridInstance } from '@/composables/dxGridUtil'
import { useToast } from '@/composables/useToast'
import _ from 'lodash'

const authStore = useAuthStore()
const voccStore = useVoccStore()

// 선사 목록
const voccGrid = ref()
let voccInstance = null
const voccs = ref()

// 선사별 권한 그룹 목록
const voccGroups = ref([])
const groupGrid = ref(null)
let groupInstance = null

const selectedGroupKey = ref([])
const selectdGroupId = ref()

// 메뉴
const menusGrid = ref(null)
const menus = ref([]) // 전체 메뉴
const initMenus = ref([]) // 그룹별 메뉴
const WORLD_MAP_MENU_ID = 100
const filteredMenus = ref([])

// 선택한 메뉴 key 배열
const selectedRowKeys = ref([100])
const selectedVoccId = ref([])

const { showResMsg } = useToast()
const showAlertDialog = ref(false)

onBeforeMount(() => {
  fetchVoccs()
  getMenus().then((response) => {
    // const { data : { data : allMenu }} = response;
    const allMenu = response.data.data
    menus.value = allMenu // 전체 메뉴 저장
    const filteredMenu = allMenu.filter((menu) => menu.accessRole != 'LCC_ADMIN')
    filteredMenus.value = filteredMenu // 필터된 메뉴 저장
  })
})

onMounted(() => {
  voccInstance = getDxGridInstance(voccGrid)
  groupInstance = getDxGridInstance(groupGrid)
})

const getUsersAndGroups = async (e) => {
  const voccId = e.currentSelectedRowKeys[0]

  selectedVoccId.value = voccId
  initMenus.value = []
  const result = await authStore.fetchGroupsByVoccId(voccId)
  voccGroups.value = result.userGroupIdAndNameList
}
const fetchVoccs = async () => {
  const result = await voccStore.fetchVoccs()
  voccs.value = result
  console.dir(voccs)
}

// 메뉴 선택 시 실행되는 함수
// 그룹 선택시, 메뉴 목록에서 해당 그룹에 할당한 메뉴를 체크해주는 기능
const getMenuGroup = async (e) => {
  selectedGroupKey.value = e.currentSelectedRowKeys[0]
  if (selectedGroupKey.value == null) {
    return
  }

  const selectedVocc = voccs.value.find((vocc) => vocc.id === selectedVoccId.value)
  if (selectedVocc) {
    if (selectedVocc.name === 'UIPA') {
      initMenus.value = [...menus.value] // 모든 메뉴
      selectedRowKeys.value = menus.value.map((menu) => menu.menuId)
    } else {
      initMenus.value = filteredMenus.value // 필터된 메뉴
    }
  } else {
    console.error('No matching vocc found for voccId:', selectedVoccId.value)
  }

  const {
    data: { data }
  } = await getMenusByGroup(selectedGroupKey.value)

  if (data) {
    selectedRowKeys.value = data
  } else {
    selectedRowKeys.value = []
  }
}

// 저장할 경우 백엔드로 메뉴 목록 전달
const saveMenusByGroup = async () => {
  let selectedMenuKeys = getDxGridInstance(menusGrid).getSelectedRowKeys('leavesOnly')

  const parentKeys = selectedMenuKeys.map(
    (el) => initMenus.value.find((menu) => menu.menuId == el).parentId
  )

  selectedMenuKeys = [...selectedMenuKeys, ...parentKeys]

  const selectedMenu = menus.value
    .filter((menu) => selectedMenuKeys.includes(menu.menuId))
    .map((item) => item.menuId)

  const groupForm = {
    groupId: selectedGroupKey.value,
    menuIdArray: selectedMenu
  }

  try {
    const response = await saveMenuByGroup(groupForm)
    if (response.status == 200) {
      showResMsg('메뉴 목록이 업데이트 되었습니다')
      showAlertDialog.value = true // 팝업 알림 표시
    }
  } catch (error) {
    const errorMsg = error.response.data.errorMsg
    showResMsg(errorMsg)
  }
}

const onRowPrepared = (e) => {
  if (e.rowType !== 'data') return
  // 2024-07-15 수정: UIPA 선사일 경우 모든 메뉴의 선택을 비활성화
  const selectedVocc = voccs.value.find((vocc) => vocc.id === selectedVoccId.value)
  const selectedGroup = voccGroups.value.find((group) => group.first === selectedGroupKey.value)
  console.log('선택한 그룹')
  console.dir(selectedGroup)
  if (selectedVocc && selectedGroup.second === 'Super Group') {
    e.rowElement.style.pointerEvents = 'none'
  }
  if (e.data.menuId == WORLD_MAP_MENU_ID) {
    e.rowElement.style.pointerEvents = 'none'
  }
}

const onEditorPreparing = (e) => {
  // 타입이 dataRow일 경우만 동작
  if (e.type !== 'selection' || e.parentType !== 'dataRow') return
  if (e.row.data.menu == WORLD_MAP_MENU_ID) {
    e.editorOptions.disabled = true
  }
}
</script>

<style scoped></style>
