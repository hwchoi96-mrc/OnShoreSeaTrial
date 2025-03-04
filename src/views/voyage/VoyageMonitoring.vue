<template>
  <v-container class="mx-10 my-2 justify-flex">
    <div class="text-h5 mb-lg-8">Voyage Page</div>
    <v-row class="mb-6">
      <v-col cols="6">
        <v-row>
          <v-col cols="6">
            <TotalEnginePerformance />
          </v-col>

          <v-col cols="6">
            <MainenginePerformance />
          </v-col>

          <!-- <v-col cols="4">
            <GeneratorEnginePerformance />
          </v-col> -->
        </v-row>

        <v-row>
          <v-col cols="12">
            <EquipmentPerformance />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <FuelPerformance></FuelPerformance>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <CIIGradeArea />
          </v-col>
          <v-col>
            <CIITable />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- v-row : no-gutters : 간격 없음
     v-col 속성 : cols : 칼럼 병합
 -->
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import EquipmentPerformance from "@/views/equipment/status/EquipmentPerformance.vue";
import MainenginePerformance from "@/views/equipment/status/MainenginePerformance.vue";
import GeneratorEnginePerformance from "@/views/equipment/status/GeneratorEnginePerformance.vue";
import TotalEnginePerformance from "@/views/equipment/status/TotalEnginePerformance.vue";
import FuelPerformance from "@/views/equipment/status/FuelPerformance.vue";
import CIIGradeArea from "../enviroment/status/CIIGradeArea.vue";
import CIITable from "@/views/enviroment/status/CIITable.vue";

// export default{
//   setup(){
//     const option = {
//       xAxis: {
//         data: ['A', 'B', 'C', 'D', 'E']
//       },
//       yAxis: {},
//       series: [{
//         data: [0, 22, '-', 23, 19],
//         type: 'line'
//         }]
//     }

//     const chart = ref(option)

//     return {
//       chart
//     }
//   }
// }
</script>

<style scoped>
/* .card {
  background-color : #27293d;
  color : #ffffff ;
} */
</style>
