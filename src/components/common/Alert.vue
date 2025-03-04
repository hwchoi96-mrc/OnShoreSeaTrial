<template>
  <Teleport to="#modal">
  <v-dialog :model-value="show" width="350" class="d-flex justify-cecnter" :class="styleClass">
    <v-card class="pb-6" color="#fff" >
      <v-card-text class="text-end">
        <v-btn class="pl-6" color="#fff" prepend-icon="mdi-close" @click="$emit('closePopup')"></v-btn>
      </v-card-text>
      <v-card-title class="px-10">title</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
    </v-card>
  </v-dialog>
  </Teleport>
</template>


<script setup>
import { ref, computed } from 'vue'
const dialog = ref(true)

const styleClass = computed(()=>{
   return props.type =='error' ? 'alert-danger' : 'alert-success'
})

const props = defineProps({
    show : {
        type : Boolean, 
        default : false
    },
    message : {
        type : String,
        default : ''
    },
    type : {
        type : String,
        default : 'error',
        validator: value => ['success', 'error'].includes(value)
    }
})


</script>

<style>

</style>