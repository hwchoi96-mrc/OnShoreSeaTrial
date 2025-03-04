import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import {
  getNotices,
  changeNoticeTopFix,
  getNoticeDetail,
  updateNotice,
  deleteNotice,
  saveNotice
} from '@/api/noticeApi.js'
import { useToast } from '@/composables/useToast'

export const useNoticeStore = defineStore('notice', () => {
  const topPinnedPosts = ref()
  const normalNotices = ref()

  const notices = ref([])
  const noticeDetail = ref()
  const currentNotice = ref()

  const startDate = ref('')
  const endDate = ref('')

  const { showResMsg } = useToast()

  const fetchNotices = async (startDate, endDate) => {
    let response = ''
    try {
      response = await getNotices(startDate, endDate)
      const { normalNoticeList, topFixingNoticeList } = response
      topPinnedPosts.value = topFixingNoticeList
      normalNotices.value = normalNoticeList

      notices.value = [...topPinnedPosts.value, ...normalNotices.value]
    } catch (err) {
      console.error(err)
    }
  }

  const changeTopFix = async (id, topFix) => {
    let result = ''
    await changeNoticeTopFix(id, topFix)
      .then((response) => {
        result = response
        let post
        let message = ''
        if (topFix) {
          post = normalNotices.value.find((item) => item.id === id)
          post.topFix = topFix
          topPinnedPosts.value.push(post)
          const index = normalNotices.value.findIndex((item) => item.id === id)
          normalNotices.value.splice(index, 1)
          message = '해당 글이 상단 고정되었습니다'
        } else {
          post = topPinnedPosts.value.find((item) => item.id === id)
          post.topFix = topFix
          const index = topPinnedPosts.value.findIndex((item) => item.id === id)
          normalNotices.value.push(post)
          topPinnedPosts.value.splice(index, 1)
          message = '해당 글이 고정 해제 되었습니다'
        }
        notices.value = [...topPinnedPosts.value, ...normalNotices.value]
        showResMsg(message)
        console.dir(response)
      })
      .catch((err) => {
        console.error(err)
      })

    return result
  }

  const fetchNoticeDetail = async (noticeId) => {
    let result = ''
    await getNoticeDetail(noticeId)
      .then((response) => {
        result = response
        currentNotice.value = response
      })
      .catch((err) => {
        console.error(err)
      })
    return result
  }

  /**
   * 공지사항 수정
   * @param {} notice
   */
  const editNotice = async (notice) => {
    try {
      const response = await updateNotice(notice)

      if (response.status == 200) {
        currentNotice.value.title = notice.title
        currentNotice.value.contents = notice.contents
        showResMsg('공지사항이 성공적으로 수정되었습니다')
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 공지사항 삭제
   * @param {} noticeId : 공지사항 아이디
   * @returns
   */
  const removeNotice = async (noticeId, topFix) => {
    try {
      const response = await deleteNotice(noticeId)
      const status = response.status
      if (status == 200) {
        let index = ''
        if (topFix) {
          index = topPinnedPosts.value.findIndex((post) => post.id === noticeId)
          topPinnedPosts.value.splice(index, 1)
        } else {
          index = normalNotices.value.findIndex((post) => post.id === noticeId)
          normalNotices.value.splice(index, 1)
        }
        notices.value = [...topPinnedPosts.value, ...normalNotices.value]
        showResMsg('공지사항이 삭제되었습니다')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return {
    startDate,
    endDate,
    notices,
    topPinnedPosts,
    normalNotices,
    currentNotice,
    fetchNotices,
    changeTopFix,
    fetchNoticeDetail,
    editNotice,
    removeNotice
  }
})
