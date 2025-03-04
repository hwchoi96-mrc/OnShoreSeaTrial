<template>
  <div class="rounded-lg">
  <v-card class="h-100 ">
    <v-card-title class="my-4">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <slot name="content"> </slot>
    </v-card-text>
    <v-card-text>
      <slot name="actions"></slot>
    </v-card-text>
  </v-card>
  
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { goPage } from '@/composables/util.js'
import { storeToRefs } from 'pinia'
import { useVoccStore } from '@/stores/voccStore.js'

const voccStore = useVoccStore()

const newEmail = ref()
const voccInfo = ref({
  username: '',
  newEmail: ''
})

const show = ref(false)

const changeEmail = () => {
  voccInfo.value.username = 'vocc02'
  voccInfo.value.newEmail = newEmail.value
  const result = voccStore.changeEmail(voccInfo.value)

  result
    .then((response) => {
      // if (response.status == 200) {
      //   goPage('/')
      // }
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<style></style>
