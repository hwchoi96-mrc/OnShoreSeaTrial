<template>
<!-- <Teleport to="#resModal"> -->
    <v-dialog class="d-flex justify-cecnter" :model-value="dialogStatus" width="350" :scrim="false" >
      <v-card class="pb-6" color="#fff">
        <v-card-text class="text-end"> </v-card-text>
        <!-- <v-card-title class="px-10"><slot name="title"></slot></v-card-title> -->
        <v-card-text class="text-center font-weight-bold">{{ props.message }}</v-card-text>
      </v-card>
    </v-dialog>
<!-- </Teleport> -->
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  dialogStatus : {
    type : Boolean,
    default : false
  },
  message : {
    type : String,
    defalut  :''
  }
})

defineEmits('update:modelValue')
</script>

<style>

</style>