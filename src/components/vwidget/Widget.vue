<template>
  <GridItem
    class="bg-card text-color widget-item"
    :key="data.i"
    :x="data.x"
    :y="data.y"
    :w="data.w"
    :h="data.h"
    :i="data.i"
    :min-w="data.minW"
    :min-h="data.minH"
  >
    <!-- <v-row class="flex-column fill-height"> -->
    <!-- <v-col cols="12" class="text-center align-center" style="color: #000"> -->
    <div class="text-title py-2">{{ data.title }}</div>
    <v-divider></v-divider>
    <EChart
      :option="data.option"
      class="echart-height align-self-center py-5"
    ></EChart>
    <!-- </v-col> -->
    <!-- </v-row> -->
  </GridItem>
</template>
<script setup>
import { ref, reactive } from "vue";
import { GridLayout, GridItem } from "grid-layout-plus";
import EChart from "@/components/echart/Echarts.vue";
import { h } from "vue";
const props = defineProps({
  data: {
    type: Object,
    // default: () => ({}),
  },
  height: Number,
  isEditing: Boolean,
});
</script>

<style scoped>
.title,
.text-title {
  text-align: center;
  font-family: "Pretendard-Medium";
}
.echart-height {
  width: 100%;
  height: 90%;
  align-self: center;
}
.widget-item {
  border: 1px solid rgba(var(--v-theme-widgetBorder));
}
</style>
