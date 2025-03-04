<template>
  <v-btn
    :ref="props.refName"
    :prepend-icon="props.prependIcon"
    :append-icon="props.appendIcon"
    :block="props.isBlock"
    :border="props.border"
    :color="props.color"
    :disabled="props.disabled"
    :width="props.width"
    :height="props.height"
    :rounded="props.rounded"
    :size="props.size"
    :text="props.text"
    :variant="props.variant"
  >
  </v-btn>
</template>

<script setup>
const props = defineProps({
  refName : {
    type : String,
    default : ''
  },
  prependIcon: {
    type: String,
    default: ""
  },
  appendIcon : {
    type : String,
    default : ""
  },
  block : {
    type : Boolean,
    default : false
  },
  border : {
    type : [String, Number, Boolean],
    default : false
  },
  color : {
    type : String,
    default : '#4E83FF'
  },
  disabled : {
    type : Boolean,
    default : false
  },
  width  : {
    type : [String, Number],
    default : 90
  },
  height : {
    type : [String, Number],
    default : '40px'
  },
  rounded : {
    type : [String, Number, Boolean],
    default : 5
  },
  size : {
    type : [String, Number],
    default : 'default'
  },
  text : {
    type : String,
    default : ''
  },
  variant: {
    type : String,
    default : 'elevated'
  }

})
</script>

<style>

</style>