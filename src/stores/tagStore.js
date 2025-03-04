import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTags, getTagListByImoNumber, deleteTag, updateTags, updateCacheData } from '@/api/tagApi.js'
import { useToast } from '@/composables/useToast'

export const useTagStore = defineStore('tagManagement', () => {
  const tagList = ref([])
  const { isShow, resMessage, showResMsg } = useToast()

  const fetchTagList = async () => {
    ({ data : { data : tagList.value}} = await getTags())
  }

  const editTags = async (editTagsInfo) => {
    try {
      console.dir(editTagsInfo)
      const response = await updateTags(editTagsInfo)

      console.dir(response)

      if(response.status == 200){
        // editTagsInfo 
        showResMsg('태그 목록이 성공적으로 수정되었습니다')
        return response.status;
      }
    } catch (error) {
      console.dir(error)
      let errMsg = ''
      if(error.name == 'AxiosError' ){
        errMsg = '데이터 처리하는 도중에 오류가 발생했습니다'
      }else{
        errMsg = error.response.data.errorMsg  
      }
      showResMsg(errMsg)
    }
  }

  const removeTags = async (removedTags) => {
    try{
      const response = await deleteTag(removedTags)

      if(response.status == 200){
        return response.status
      }
    }catch(error){
      const errMsg = error.response.data.errorMsg
      showResMsg(errMsg)
    }
  }

  const fetchTagListByImoNumber = async(imoNumbers) => {
    try{
      imoNumbers = imoNumbers.toString()
      const response = await getTagListByImoNumber(imoNumbers)
      const { status, data : { data }} = response;
      
      return { status, data}
    }catch(error){
      const errMsg = error.response.data.errorMsg
      showResMsg(errMsg)
    }
  }


  const saveCache = async(cacheData) => {
    try{
      const response = await updateCacheData(cacheData)
    }catch(error){
      const errMsg = error.response.data.errorMsg
      showResMsg(errMsg)
    }
  }


  return { tagList, fetchTagList, fetchTagListByImoNumber, removeTags, editTags, saveCache }
},
{
  persist: {
    storage: sessionStorage 
  }
})
