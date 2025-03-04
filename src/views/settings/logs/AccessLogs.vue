<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col>
        <v-card class="h-100" rounded="30">
          <v-card-title class="align-content-center">
            <div class="d-flex align-center">
              <div>사용자 접속 기록</div>
            </div>
          </v-card-title>
          <v-card-text>
            <!-- 날짜 검색 필터, 업데이트 / 다운로드 버튼 영역 -->
            <div class="d-flex">
              <!-- 날짜 검색 필터 -->
              <div class="d-flex justify-space-between ga-3">
                <input type="date" v-model="startDate" />
                <input type="date" v-model="endDate" />
                <i-btn @click="periodData()" text="조회"></i-btn>
              </div>
              <v-spacer></v-spacer>
              <!-- 업데이트 / 다운로드 버튼 -->
              <div class="d-flex justify-space-between align-center ga-3">
                <i-btn
                  text="업데이트"
                  @click="refreshAccessLog"
                  color="#3D3D40"
                  width="100"
                  prepend-icon="mdi-refresh"
                ></i-btn>
                <i-btn
                  text="다운로드"
                  @click="exportExcel"
                  color="#3D3D40"
                  width="100"
                  prepend-icon="mdi-download"
                ></i-btn>
              </div>
            </div>

            <!-- 사용자 접속 기록 그리드  -->
            <DxDataGrid
              id="grid"
              class="title-filter-container mt-6"
              :data-source="accessLogs"
              :show-borders="true"
            >
              <!-- <DxPaging :page-size="20" /> -->
              <!-- :page-size="10" -->
              <DxScrolling mode="virtual" />
              <DxColumn data-field="voccName" caption="선사명" :allow-editing="false"></DxColumn>
              <DxColumn
                data-field="userGroupName"
                caption="사용자그룹"
                :allow-editing="false"
              ></DxColumn>
              <DxColumn data-field="username" caption="아이디" :allow-editing="false"></DxColumn>
              <DxColumn
                data-field="loginTime"
                caption="로그인시간"
                :allow-editing="false"
              ></DxColumn>
              <DxColumn
                data-field="logoutTime"
                caption="로그아웃시간"
                :allow-editing="false"
              ></DxColumn>
              <DxColumn data-field="connectIp" caption="접속 ip" :allow-editing="false"></DxColumn>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import moment from 'moment'

const authStore = useAuthStore()

const { accessLogs } = storeToRefs(authStore)
const startDate = ref()
const endDate = ref()

const { proxy } = getCurrentInstance()

onMounted(() => {
  fetchAccessLogs()
})

/*
 사용자 접속 기록 조회
*/

const fetchAccessLogs = async (startDate = '', endDate = '') => {
  await authStore.fetchAccessLog(startDate, endDate)
}

/**
 * 기간별 사용자 접속 기록 조회
 */
const periodData = () => {
  let selectedStartDate = startDate.value
  let selectedEndDate = endDate.value
  // let selectedStartDate = moment.utc(startDate.value).format()
  // let selectedEndDate = moment.utc(endDate.value).format()

  fetchAccessLogs(selectedStartDate, selectedEndDate)
}

/**
 * 사용자 접속 기록 새로고침
 */
const refreshAccessLog = () => {
  fetchAccessLogs()
  startDate.value = ''
  endDate.value = ''
}

/**
 * 엑셀 다운로드
 */
const exportExcel = async () => {
  const today = moment()
  let todayDateTime = today.format('YYYYMMDDhhmmss')
  const selectedRowData = accessLogs.value
  const removedIdRowData = selectedRowData.map((data) => {
    delete data.id
    return data
  })
  const workBook = proxy.xlsx.utils.book_new()
  const workSheet = proxy.xlsx.utils.json_to_sheet(removedIdRowData)

  proxy.xlsx.utils.book_append_sheet(workBook, workSheet, 'sheet1')
  proxy.xlsx.writeFile(workBook, `사용자 접속기록_${todayDateTime}.xlsx`) // 엑셀파일 만듬
}
</script>

<style scope>
.dx-widget.dx-datagrid-pager.dx-pager {
  justify-content: center;
  display: flex;
}
</style>
