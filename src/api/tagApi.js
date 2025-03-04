import instance from '@/composables/useAxios.js'

export const getTags = () => {
  return instance({
    url : '/ship/tag/find-all',
    method : 'GET'
  })
}

export const updateTags = (editTagsInfo) => {
  return instance({
    url: '/ship/tag/save',
    method: 'POST',
    data: editTagsInfo
  })
}

export const deleteTag = (tagInfo) => {
  return instance({
    url : '/ship/tag/delete',
    method : "POST",
    data : tagInfo
  })
}


export const getTagListByImoNumber = ( imoNumbers ) =>{
  return instance({
    url  : '/ship/tag/find-ship-list',
    params : { imoNumberList : imoNumbers}
  })
}

export const updateCacheData = (cacheData) => {
  return instance({
    url: '/ship/cache/save',
    method: 'POST',
    data: cacheData
  })
}