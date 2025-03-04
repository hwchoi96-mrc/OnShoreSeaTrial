<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="6">
        <v-card class="h-100" rounded="30">
          <v-card-title>
            <div class="d-flex justify-space-between align-center">
              <div>권한그룹정보</div>
              <div></div>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- 권한 그룹 목록 -->
            <DxDataGrid
              id="grid"
              class="title-container no-stripe"
              key-expr="first"
              :data-source="groups"
              :active-state-enabled="activeStatus"
              :focused-row-enabled="activeStatus"
              :show-borders="true"
              :on-focused-cell-changed="getMenuGroup"
              :filter-criteria="null"
            >
              <DxColumn
                data-field="first"
                caption="groupId"
                :visible="false"
                class="pl-10"
              ></DxColumn>
              <DxColumn
                data-field="second"
                class="groupname"
                caption="권한그룹명"
                :allow-editing="false"
              ></DxColumn>
              <DxScrolling column-rendering-mode="virtual" />
            </DxDataGrid>
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
                <i-btn class="" @click="saveMenusByGroup" text="저장"></i-btn>
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
              <DxScrolling mode="virtual" />
              <DxSelection mode="multiple" :recursive="true"></DxSelection>
              <DxColumn data-field="menuName" caption="메뉴명"></DxColumn>
            </DxTreeList>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { getMenus, getMenusByGroup, saveMenuByGroup } from '@/api/permissionApi.js'
import { useAuthStore } from '@/stores/authStore'
import { useVoccStore } from '@/stores/voccStore'
import { DxColumn } from 'devextreme-vue/tree-list'
import { storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import { getDxGridInstance } from '@/composables/dxGridUtil'

const authStore = useAuthStore()
const { groups } = storeToRefs(authStore)

const voccStore = useVoccStore()
const { voccInfo } = storeToRefs(voccStore)
const { showResMsg } = useToast()

const menusGrid = ref(null)

const initMenus = ref([])
const menus = ref([])
const activeStatus = ref(true)

const selectedGroupKey = ref()
// 선택한 메뉴 key 배열
const selectedRowKeys = ref([])
const WORLD_MAP_MENU_ID = 100 

onBeforeMount(() => {
  // 그룹 목록 조회
  getUserdAndGroups()

  // 메뉴 목록 조회
  getMenus().then((response) => {
    // const { data : { data : allMenu }} = response;
    const allMenu = response.data.data
    const filterMenu = allMenu.filter((menu) => menu.accessRole != 'LCC_ADMIN')
    menus.value = filterMenu
    // ({ data: menus.value = response.data })
  })
})

const getUserdAndGroups = async () => {
  let voccId = voccInfo.value.id
  await authStore.displayUsersByGroup(voccId)
  groups.value = authStore.groups
}

// 메뉴 선택 시 실행되는 함수
// 그룹 선택시, 메뉴 목록에서 해당 그룹에 할당한 메뉴를 체크해주는 기능
const getMenuGroup = (e) => {
  selectedGroupKey.value = e['row']['key']
  initMenus.value = [...menus.value]

  getMenusByGroup(selectedGroupKey.value).then((response) => {
    const result = response.data.data
    if (result.length > 0) {
      // 할당된 메뉴가 있을 경우, 메뉴 업데이트
      selectedRowKeys.value = result
    } else {
      // 할당된 메뉴가 없을 경우, 이전 선택된 메뉴 초기화
      selectedRowKeys.value = []
    }
  })
}

// 추가된 부분: row가 준비되었을 때 특정 조건에 따라 스타일을 수정합니다.
const onRowPrepared = (e) => {
  if (e.rowType !== 'data') return
  
  if (e.data.menuId == WORLD_MAP_MENU_ID) {
    e.rowElement.style.pointerEvents = 'none'
  }
}

// 추가된 부분: 에디터가 준비될 때 특정 조건에 따라 에디터 옵션을 수정합니다.
const onEditorPreparing = (e) => {
  if (e.type !== 'selection' || e.parentType !== 'dataRow') return
  
  if (e.row.data.menuId == WORLD_MAP_MENU_ID) {
    e.editorOptions.disabled = true
  }
}

// 저장할 경우 백엔드로 정보 전달
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
    }
  } catch (error) {
    const errorMsg = error.response.data.errorMsg
    showResMsg(errorMsg)
  }
}
</script>

<style scoped>
.groupName {
  background: #4e83ff;
  border-radius: 10px;
  padding: 2px 4px;
}

.groupName.gray {
  background: #959595;
  border-radius: 10px;
  padding: 2px 4px;
}
</style>
