import { reactive, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useToast } from '@/composables/useToast'
import {
    getPlanList,
    getRouteInfoById,
    saveRouteM,
    deleteRouteM,
    getRouteD,
    saveRouteD
  } from '@/api/routePlanApi'

export const useRouteStore = defineStore(
    'routeManagement',
    () => {        
        const { showResMsg } = useToast()

        const routeMaster = ref({
            routeid:0,
            routename: '',
            makename: '',
            makedate: '',
            modifydate: '',
            usefg: ''
        })
        const routeDetail = ref({
            routeid: 0,
            lon: '',
            lat: '',
            seq: 0
        })

        const selectedMIndex = ref(null)
        const selectedDIndex = ref(null)

        const routelist = ref([])

        const getRouteList = async () => {
            const result = await getPlanList()
            routelist.value = result
        }

        const fetchRouteInfoById = async (id) => {
            const result = await getRouteInfoById(id)
            routeMaster.value = result[0];
        }

        const fetchRouteDetailInfoById = async (id) => {
            const result = await getRouteD(id)
            routeDetail.value = result;
        }

        const resetroute = () => {
            routeMaster.value = {
                routeid:0,
                routename: '',
                makename: '',
                makedate: '',
                modifydate: '',
                usefg: ''
            }
            routeDetail.value = ref([{
                routeid: 0,
                lon: '',
                lat: '',
                seq: 0
            }])
            selectedMIndex.value = null
            selectedDIndex.value = null
        }
        
        const RouteMSave = async (id, name, mkname) => {
            const result = await saveRouteM(id, name, mkname)
            if(result[0] == "S") {
                //alert("저장하였습니다.")
                if(routeDetail.value.length>0) {
                    const a_lon = []
                    const a_lat = []
                    routeDetail.value.forEach((item, index) => {
                        a_lon.push(item.lon)
                        a_lat.push(item.lat)
                    })
                    const r = await saveRouteD(id, a_lon.join(','), a_lat.join(','), routeDetail.value.length)
                    if(r[0] == "S") {                        
                        showResMsg('저장하였습니다')
                    } else {
                        showResMsg('저장 실패 하였습니다')
                    }
                } else {
                    showResMsg('저장하였습니다')
                }
                getRouteList()
                if(id!=0) {
                    fetchRouteInfoById(id)
                }
            } else {
                showResMsg('저장 실패 하였습니다')
            }

        }

        const RouteMDelete = async (id) => {
            const result = await deleteRouteM(id)
            if(result[0] == "S") {
                showResMsg('삭제하였습니다')
                getRouteList()
                resetroute()
            } else {
                showResMsg('삭제 실패 하였습니다')
            }

        }

        return {
            routeMaster,
            routeDetail,
            routelist,
            selectedMIndex,
            selectedDIndex,
            getRouteList,
            fetchRouteInfoById,
            resetroute,
            RouteMSave,
            RouteMDelete,
            fetchRouteDetailInfoById
        }
    }
)
