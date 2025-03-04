<template>
  <v-container fluid class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="12">
        <v-card class="pa-4 h-100">
          <v-card-text>
            <v-form @submit.prevent class="w-100">
              <div class="mb-2">제목</div>
              <i-input v-model="newNotice.title"></i-input>
              <div class="my-2">본문</div>

              <v-textarea
                variant="solo-filled"
                bg-color="#434348"
                v-model="newNotice.contents"
                rows="25"
              ></v-textarea>
              <div class="d-flex justify-end">
                <div><i-btn block @click="goNoticeList" color="#5E616A" text="취소"></i-btn></div>
                <div class="ml-2">
                  <i-btn block @click="registerNotice" text="등록"></i-btn>
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

import { saveNotice } from '@/api/noticeApi'

import { goPage, isStatusOk } from '@/composables/util.js'
import { useToast } from '@/composables/useToast'

const { showResMsg } = useToast()

const newNotice = ref({
  title: '',
  contents: ''
})

const goNoticeList = () => {
  goPage('/notice')
}

const registerNotice = async () => {
  const { status } = await saveNotice(newNotice.value)
  if (isStatusOk(status)) {
    showResMsg('공지사항 등록이 완료되었습니다')
    goPage('/notice')
  }
}
</script>

<style></style>
