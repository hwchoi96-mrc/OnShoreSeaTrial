<template>
  <v-data-table 
   :headers="props.headers"
   :items="props.datas">
  </v-data-table>
</template>

<script setup>
const props = defineProps({
  headers: {
    type: [Object, Array],
  },
  datas: {
    type: [String, Number]
  }
}
)
</script>

<style scoped>
</style>