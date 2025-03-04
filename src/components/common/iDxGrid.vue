<template>
  <DxDataGrid 
    :key-expr="cellKey" :data-source="data" :show-column-headers="isShowHeader"
    :row-alternation-enabled="isStripe" :show-borders="isShowBorder"
    :show-column-lines="isShowColumnLine" :column-auto-width="isAutoWidth"
    :active-state-enabled="isActiveEnabled" :focused-row-enabled="isFocusEnabled"
  >
  <slot name="columns"></slot>
  <!-- <DxSelection v-if="isSelection" mode="multiple" show-check-boxes-mode="always" :recursive="true"></DxSelection> -->
  </DxDataGrid>
</template>

<script setup>
defineProps({
  cellKey : {
    type : String, 
    default : ''
  },
  data : {
    type : Object,
  },
  isShowHeader : {
    type : Boolean,
    default : false
  },
   isStripe: {
    type: Boolean,
    default: true
  },
  isShowBorder : {
    type: Boolean,
    default: true
  },
  isShowColumnLine: {
    type: Boolean,
    default: false
  },
  isAutoWidth: {
    type: Boolean,
    default: true
  },
  isActiveEnabled : {
    type : Boolean, 
    default : false
  },
  isFocusEnabled : {
    type : Boolean,
    default : false
  },
  isSelection : {
    type :Boolean,
    default : false
  }
})
</script>

<style>

</style>