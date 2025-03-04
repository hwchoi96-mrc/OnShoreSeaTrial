<template>
  <v-container fluid class="h-100 management-page detail-page settings">
    <v-row class="ma-0 h-100">
      <v-col cols="12">
        <v-card class="h-100" flat rounded="30">
          <v-card-title class="d-flex justify-space-between">
            <div>공지사항</div>
            <div class="d-flex justify-space-between">
              <div class="d-flex ml-2">
                <div class="d-flex ga-3 mr-3">
                  <input class="noticeList-datePicker" type="date" v-model="startDate" />
                  <input class="noticeList-datePicker" type="date" v-model="endDate" />
                  <i-btn @click="periodData()" text="조회"></i-btn>
                </div>
                <!-- <v-responsive> -->
                <i-input
                  id="searchBox"
                  v-model="searchText"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="제목을 입력해주세요"
                  single-line
                  hide-details
                  @input="searchByText"
                  style="width: 350px"
                ></i-input>
                <!-- </v-responsive> -->
                <i-btn
                  v-show="displayRegisterBtn"
                  @click="goRegisterPage"
                  class="ml-2"
                  color="#3D3D40"
                  text="등록"
                />
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <DxDataGrid
              id="noticeGrid"
              ref="noticeGrid"
              class="title-container"
              key-expr="id"
              :data-source="notices"
              :column-auto-width="true"
              :show-column-lines="false"
              :show-borders="true"
            >
              <DxPaging :page-size="10" />
              <DxColumn data-field="id" caption="id" :visible="false"></DxColumn>
              <DxColumn
                data-field="title"
                caption="제목"
                cellTemplate="titleTemplate"
                :allow-search="true"
                :allow-editing="false"
                width="40%"
              ></DxColumn>

              <DxColumn
                data-field="register"
                caption="작성자"
                :allow-search="false"
                :allow-editing="false"
                alignment="center"
              >
              </DxColumn>
              <DxColumn
                data-field="registTime"
                caption="등록일"
                :allow-search="false"
                alignment="center"
                :allow-editing="false"
              ></DxColumn>
              <DxColumn
                data-field="views"
                caption="조회수"
                :allow-search="false"
                :allow-editing="false"
                alignment="center"
              ></DxColumn>

              <DxColumn
                v-if="role === 'ROLE_LCC_ADMIN'"
                data-field="topFix"
                caption=""
                cellTemplate="topFixTemplate"
                :allow-search="false"
                :allow-editing="false"
              >
              </DxColumn>

              <template #titleTemplate="{ data: templateOptions }">
                <div class="d-flex">
                  <v-icon
                    v-if="templateOptions.data.topFix == true"
                    class="px-2"
                    icon="mdi-volume-high"
                  ></v-icon>
                  <div @click="goDetailPage(templateOptions.data.id)" class="ml-2 title-hover">
                    {{ templateOptions.data.title }}
                  </div>
                </div>
              </template>

              <template #topFixTemplate="{ data: templateOptions }">
                <span v-if="role === 'ROLE_LCC_ADMIN'">
                  <i-btn
                    class="mr-2"
                    :text="templateOptions.data.topFix ? '고정해제' : '상단고정'"
                    @click="changeTopFix(templateOptions.data.id, !templateOptions.data.topFix)"
                    :prepend-icon="
                      templateOptions.data.changeTopFixtopFix ? 'mdi-pin-off' : 'mdi-pin'
                    "
                    :color="templateOptions.data.topFix ? '#5789FE' : '#3D3D40'"
                  ></i-btn>
                  <i-btn
                    class="ml-2"
                    text="삭제"
                    @click="removeNotice(templateOptions.data.id)"
                    color="#F04A4A"
                    prepend-icon="mdi-trash-can"
                  ></i-btn>
                </span>
              </template>
            </DxDataGrid>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, watch, computed, ref, onBeforeMount, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useNoticeStore } from '@/stores/noticeStore'
import { goPage } from '@/composables/util.js'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { getDxGridInstance, dxGridRefresh, dxGridDeselectAll } from '@/composables/dxGridUtil'
import { useToast } from '@/composables/useToast'

const noticeGrid = ref()
const itemsPerPage = ref(10)
const page = ref(1)
const currentPage = ref(1)
// const notices = ref()
const currentPagePost = ref([])
const displayedPost = ref()
const totalPageCount = ref()
const { showResMsg } = useToast()

const store = useNoticeStore()
const { startDate, endDate, notices, topPinnedPosts, normalNotices } = storeToRefs(store)
const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)

let role = ''
const searchText = ref('')

const tableHeaders = [
  { title: '제목', key: 'title', align: 'center' },
  { title: '작성자', key: 'register', align: 'center' },
  { title: '등록일', key: 'registTime', align: 'center' },
  { title: '조회수', key: 'views', align: 'center' },
  { title: '', key: '', align: '' }
]

onBeforeMount(() => {
  role = userInfo.value.role
})

onMounted(() => {
  fetchNotices()
})

let start = ''
let end = ''

const fetchNotices = async () => {
  await store.fetchNotices(startDate.value, endDate.value)
}

const getPostsByPage = () => {
  start = (currentPage.value - 1) * (itemsPerPage.value - topPinnedPosts.value.length)
  end = itemsPerPage.value - topPinnedPosts.value.length
  const normalNotice = normalNotices.value.slice(start, start + end)
  const notices = [...topPinnedPosts.value, ...normalNotice]
  currentPagePost.value = notices
}

/**
 * 페이지 수 반환
 */
const getTotalPageCount = () => {
  const TotaldisplayCount = displayedPost.value.length - topPinnedPosts.value.length
  const displayCount = itemsPerPage.value - topPinnedPosts.value.length
  totalPageCount.value = Math.ceil(TotaldisplayCount / displayCount)
}

watch(currentPage, getPostsByPage)

const changeTopFix = async (id, topFix) => {
  // 고정된 공지사항이 이미 5개 이상인 경우 고정할 수 없다는 경고 메시지를 보여줍니다.
  if (topFix && topPinnedPosts.value.length >= 5) {
    alert('6개 이상 고정할 수 없습니다')
    return
  }
  
  // 24.07.02 [이채원 사원]
  await store.changeTopFix(id, topFix);
  await fetchNotices();
  getPostsByPage();
}


const removeNotice = (noticeId) => {
  store.removeNotice(noticeId)
  dxGridRefresh(noticeGrid)
}

const goDetailPage = (id) => {
  goPage(`/notice/${id}`)
}

const goRegisterPage = () => {
  goPage('/notice/add')
}
const periodData = () => {
  fetchNotices(startDate.value, endDate.value)
}

const searchByText = () => {
  const instance = getDxGridInstance(noticeGrid)

  instance.searchByText(searchText.value)
  console.dir(getDxGridInstance(noticeGrid))
}

const displayRegisterBtn = computed(() => {
  return role == 'ROLE_LCC_ADMIN' ? true : false
})
</script>

<style scoped>
.noticeTable tr td:first-child {
  width: 45%;
}

.noticeTable tbody > tr:nth-child(odd) {
  background: #2f2f32;
}

.noticeTable tbody > tr:nth-child(even) {
  background: #222224;
}

#searchBox .v-input__control {
  width: 350px;
}

.noticeList-datePicker {
  font-size: 0.9rem;
  text-align: center;
}

input[type='date'] {
  border: 1px solid #49494e;
  padding: 3px 15px;
  border-radius: 8px;
}

.dx-datagrid .dx-column-lines > td {
  border-left: 0px !important;
  border-right: 0px !important;
}

.title-hover {
  cursor: pointer; /* 제목에 마우스를 올리면 커서가 손가락 모양으로 변경됨 */
}
/* .pinned {
  background-color: rgb(16 44 123 / 30%);
} */
</style>
