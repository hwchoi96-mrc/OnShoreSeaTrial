import instance from '@/composables/useAxios.js'
import { method } from 'lodash'
import moment from 'moment'

// const baseUrl = 'https://f0e9c754-bcb8-4adf-8c95-e9c3197d9ec0.mock.pstmn.io'

/**
 * 공지사항 등록
 * @param {*} notice 공지사항 제목, 내용
 * @returns
 */
export const saveNotice = (notice) => {
  // return axios
  //   .post('/api/notice/insert', notice)
  //   .then((response) => {
  //     // console.dir(response)
  //     return response
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })

  return instance({
    url: '/notice/insert',
    method: 'POST',
    data: notice
  })
}

/**
 * 공지사항 목록 조회
 * @param {} startDate : 조회 시작 날짜
 * @param {*} endDate  : 조회 종료 날짜
 * @returns
 */

export const getNotices = (startDate = '', endDate = '') => {
  return instance({
    url: '/notice/get-list',
    method: 'GET',
    params: { startDate, endDate }
  }).then((response) => {
    const {
      data: { data }
    } = response
    console.dir(data)

    let { normalNoticeList, topFixingNoticeList } = data

    console.dir(normalNoticeList)

    normalNoticeList = normalNoticeList.map((obj) => {
      return { ...obj, registTime: moment(obj.registTime).utc().format('YYYY-MM-DD hh:mm') }
    })

    topFixingNoticeList = topFixingNoticeList.map((obj) => {
      return { ...obj, registTime: moment(obj.registTime).utc().format('YYYY-MM-DD hh:mm') }
    })

    const result = { normalNoticeList, topFixingNoticeList }

    console.dir(result)
    return result
  })
}

/**
 * 공지사항 수정
 * @param {*} notice
 * @returns
 */
export const updateNotice = (notice) => {
  console.dir(notice)
  return instance({
    url: '/notice/update',
    method: 'POST',
    data: notice
  })
    .then((response) => {
      // console.dir(response)
      return response
    })
    .catch((error) => {
      console.error(error)
    })
}

/**
 * 공지사항 삭제
 * @param {*} id : 공지사항 아이디
 * @returns
 */
export const deleteNotice = (id) => {
  return instance({
    url: '/notice/hidden',
    method: 'POST',
    params: { id }
  })
}

export const changeNoticeTopFix = (id, topFix) => {
  return instance({
    url: '/notice/change-top-fix',
    method: 'POST',
    data: { id, topFix }
  }).then((response) => {
    // console.dir(response)
    if (response.status == 200) {
      return response.status
    }
  })
}

export const getNoticeDetail = (noticeId) => {
  return instance({
    url: '/notice/get-contents',
    method: 'GET',
    params: { id: noticeId }
  }).then((response) => {
    const {
      data: { data }
    } = response
    console.dir(data)
    return data
  })
}
