<template>
  <v-container fluid class="h-100 col2-Layout">
    <v-row class="ma-0 h-100" >
      <v-col :cols="cols[0]">
        <v-card class="h-100" :rounded="30">
          <v-card-title>
            <slot name="cardLeftTitle"></slot>
          </v-card-title>
          <v-card-text>
            <slot name="cardLeftContent"></slot>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="cols[1]">
        <v-card class="h-100">
          <v-card-title>
            <slot name="cardRightTitle"></slot>
          </v-card-title>
          <v-card-text>
            <slot name="cardRightContent"></slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
const { lg, sm } = useDisplay();

/*
 colType : 1 => lg = 6:6 , sm = 12 : 12
 colType : 2 => lg = 9:3 , sm = 12 : 12
 colType : 3 => lg = 3:9 , sm = 12 : 12
*/
const props = defineProps({
  colType : {
    type : [ Number, String],
    default : 1
  }
})

const cols = computed(()=>{
  switch (props.colType) {
    case 1:
      return lg ? [6, 6]
    : sm ? [12, 12]
      : [6, 6]
    case 2:
      return lg ? [9, 3]
        : sm ? [12, 12]
          : [6, 6]
    case 3:
      return lg ? [3, 9]
      : sm ? [12, 12]
      : [6,6]
    default:
       return lg ? [6, 6]
        : sm ? [12, 12]
          : [6, 6]
  }

})
</script>