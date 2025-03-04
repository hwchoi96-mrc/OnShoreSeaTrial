<template>
  <v-select :model-value="modelValue" :label="props.label" :append-icon="props.appendIcon" :bg-color="props.bgColor"
    :color="props.color" :items="props.items" :height="props.height" :variant="props.variant"
    :placeholder="props.placeholder" :no-data-text="props.noDataText" :hide-details="props.hideDetails"
    @update:modelValue="$emit('update:modelValue', $event)"></v-select>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [Object, String, Number],
    default: ""
  },
  label : {
    type : String,
    defalut : ''
  },
  appendIcon : {
    type : String,
    defalut : ''
  },
  bgColor : {
    type : String,
    defalut : '#282828'
  },
  color : {
    type : String,
    default : '#ffffff'
  },
  height : {
    type : [String, Number],
    defalut : 40
  },
  variant: {
    type: String,
    default: 'solo-filled'
  },
  noDataText : {
    type : String,
    defalut : '데이터가 없습니다'
  },
  hideDetails : {
    type : Boolean, 
    defalut : true
  },
  placeholder : {
    type : String,
    defalut : ''
  },
  items : {
    type : Array,
    defalut : '데이터가 없습니다'
  }
})
</script>

<style>

</style>