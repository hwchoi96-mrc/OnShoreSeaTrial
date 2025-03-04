<template>
  <div class="shipInfo-text">
    <span class="squareIcon">■</span>
    <span class="shipInfo-fieldName">{{ fieldName }} :</span>
    <span class="shipInfo-fieldValue">{{ fieldValue }} {{ unit }}</span>
  </div>
</template>

<script setup>
defineProps({
  fieldName : {
    type : String,
  },
  fieldValue  : {
    type : String 
  },
  unit : {
    type : String,
    default : ''
  }
})
</script>

<style lang="scss">
span.squareIcon {
  font-size: 3px;
  vertical-align: middle;

}

.shipInfo-text {
  font-size: 1.1em;

  .shipInfo-fieldName {
    color: #ffffffa6;
    margin-left: 10px;
    margin-right: 6px;
  }
}
</style>