// composable 함수명은 카멜케이스 기법 사용 
import { ref } from 'vue'
import {useAlertStore} from '@/stores/alertStore'
import { storeToRefs } from 'pinia'

export function useAlert() {
  const { dialogStatus, alertMessage } = storeToRefs(useAlertStore())
  const { vAlert } = useAlertStore()
  // const dialogStatus = ref(false)
  // const alertMessage = ref('')

  // const vAlert = (message) => {
  //   alertMessage.value = message
  //   dialogStatus.value = true
  //   setTimeout(()=>{
  //     dialogStatus.value = false
  //   }, 2000)
  // }
  
  return {
    dialogStatus,
    alertMessage,
    vAlert
  }
}
