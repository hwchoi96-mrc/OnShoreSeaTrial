<template>
  <v-snackbar v-model="isShow" :timeout="duration" :color="props.color">
    <div class="text-center">{{ resMessage }}</div>
  </v-snackbar>
</template>


<script setup>
import { useToast } from '@/composables/useToast';
const { isShow, resMessage, duration } = useToast();

// const styleClass = computed(()=>{
//    return props.type =='error' ? 'alert-danger' : 'alert-success'
// })

const props = defineProps({
    show : {
        type : Boolean, 
        default : false
    },
    message : {
        type : String,
        default : ''
    },
    color : {
      type : String,
      default : '#fff'
    },
    timeout : {
      type : Number,
      default : 3000
    }
    // type : {
    //     type : String,
    //     default : 'error',
    //     validator: value => ['success', 'error'].includes(value)
    // }
})


</script>

<style>

</style>