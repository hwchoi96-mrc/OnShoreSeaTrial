<template>
  <div class="timeinfo d-flex mr-2">
    <div class="mr-2 d-flex ga-4 pointer-cursor">
      <div class="subTitle">UTC TIme</div>
      <div class="subTitle">{{ nowUTCTime }}</div>
    </div>
    <div class="d-flex ga-4 localTime pointer-cursor">
      <div class="subTitle">Local TIme</div>
      <div class="subTitle">{{ nowKRTime }} (+9)</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loadingStore'
const loadingStore = useLoadingStore()
const { refreshDataTime } = storeToRefs(loadingStore)

const nowKRTime = ref()
const nowUTCTime = ref()

onMounted(() => {
  getNowTime()
})

const getNowTime = () => {
  //nowKRTime
  const localTime = moment()
  nowKRTime.value = localTime.format('YYYY-MM-DD HH:mm')
  
  //nowUTCTime
  let utcTime = new Date()
  utcTime = utcTime.toUTCString()
  let utcValue = moment(utcTime).utc().format('YYYY-MM-DD HH:mm')
  nowUTCTime.value = utcValue
}

const reloadData = () => {
  const today = moment()
  let loadingDateTime = today.utc().format('YYYY-MM-DD hh:mm')
  let dateTime = moment(loadingDateTime)
  let refreshTime = moment(refreshDataTime.value)

  let result = dateTime.isBefore(refreshTime)
  if(result){
     getNowTime()
  }
 }
 watch(refreshDataTime, reloadData)

</script>

<style scoped>
.subTitle {
  font-size: 0.9em;
}

.localTime::before {
  content: '';
  border: 0.5px solid #595a63;
  margin-left: 4px;
}

@media screen and (max-width: 1250px) {
  .timeinfo {
    flex-direction: column;
  }

  .localTime::before {
    display: none;
  }

  .localTime {
    margin-left: 0px;
  }
}
</style>
