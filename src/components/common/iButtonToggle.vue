<template>
  <v-btn-toggle :model-value="modelValue" :color="color">
    <v-btn v-for="toggle in toggles"
     :text="toggle.text"
     :value="toggle.value"
     :key="toggle.id"
     @click="$emit('update:modelValue', $event.target.value)">
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
defineProps({
  modelValue  : {
    type : [ String , Number, Boolean],
  },
  toggles : {
    type : Array
  },
  color : {
    type : String
  }
})

</script>

<style>

</style>