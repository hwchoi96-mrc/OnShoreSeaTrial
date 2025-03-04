<template>
  <v-sheet class="pa-4 h-100" color="#333334">
    <div>{{ title }}</div>
    <div v-for="[key, value] of Object.entries(data)" :key="key" class="d-flex item-container">
      <div class="dataKey">{{ convertText(key, names) }}</div>
      <div class="dataValue justify-start">{{ value }}</div>
    </div>
  </v-sheet>
</template>

<script setup>
defineProps({
  title : {
    type : String
  },
  data: {
    type: Object
  },
  names : {
    type : Object
  }
})


const convertText = (key, names) =>{
  if( names){
    return names[key]
  }else{
    return key;
  }
}
</script>

<style scoped>
.item-container:not(:last-child){
  border-bottom: 1px dashed #ffffff34;
}

.item-container{
  padding-top : 12px;
  padding-bottom : 12px;
}

.item-container > div{
  flex: 1 1 40%;
}

.dataKey {
  font-weight: 300;
}

.dataValue {
  font-weight: 400;
}
</style>