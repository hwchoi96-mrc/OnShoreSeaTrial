<template>
  <v-container fluid class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="12">
        <v-card class="pa-4 h-100">
          <v-card-text>
            <v-form @submit.prevent class="w-100">
              <div class="mb-2">제목</div>
              <i-input v-model="notice.title"></i-input>
              <div class="my-2">본문</div>

              <v-textarea
                variant="solo-filled"
                bg-color="#434348"
                v-model="notice.contents"
                rows="25"
              ></v-textarea>
              <div class="d-flex justify-end">
                <div><i-btn block @click="goNoticeList" color="#5E616A" text="목록"></i-btn></div>
                <div v-if="role === 'ROLE_LCC_ADMIN'" class="ml-2">
                  <i-btn block @click="editNotice" text="수정"></i-btn>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { goPage } from '@/composables/util.js'
import { useNoticeStore } from '@/stores/noticeStore'
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const { userInfo } = storeToRefs(authStore)
const { showResMsg } = useToast()

const notice = ref({
  id: 0,
  title: '',
  contents: ''
})

let role = ''
const route = useRoute()
const noticeStore = useNoticeStore()

const noticeId = route.params.noticeId

onMounted(() => {
  fetchNoticeDetail(noticeId)
  role = userInfo.value.role
})

const goNoticeList = () => {
  goPage('/notice')
}

const fetchNoticeDetail = async (noticeId) => {
  // const { title, contents } = await store.fetchNoticeDetail(noticeId)
  // notice.value.title = title;
  // notice.value.content = contents;
  ;({
    id: notice.value.id,
    title: notice.value.title,
    contents: notice.value.contents
  } = await noticeStore.fetchNoticeDetail(noticeId))
}

const editNotice = () => {
  noticeStore.editNotice(notice.value).then(() => {
    showResMsg('공지사항 수정이 완료되었습니다')
  })
}
</script>

<style></style>
