<template>
  <div class="">
    <div class="d-flex align-center ga-2">
      <div><v-img :width="20" :height="20" :src="countryUrl"></v-img></div>
      <div class="text-start">{{ portName }}</div>
    </div>
    <div>
      <div class="text-start">{{ regDate }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { convertDateTimeType } from '@/composables/util.js'

const countryUrl = ref('')
const regDate = ref('')

const props = defineProps({
  data: {
    type: Object
  },
  portName: {
    type: String,
  },
  time: {
    type: String
  },
  country: {
    type: String
  }
})


onMounted(() => {
  countryUrl.value = `/images/country/${props.country}.png`
  regDate.value = convertDateTimeType(props.time)
})
</script>

<style></style>