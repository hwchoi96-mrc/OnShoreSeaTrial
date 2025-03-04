<template>
  <div class="container pa-3">
    <v-card class="pa-3 item" min-height="150">
      <v-card-item>
        <v-card-title>운항중인 선박수</v-card-title>
        <v-card-subtitle>Operation Ships</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="d-flex justify-end align-self-end text-end mt-5 mb-2">
        150
      </v-card-text>
    </v-card>
    <v-card class="pa-3 item" min-height="150">
      <v-card-item>
        <v-card-title>정박된 선박수</v-card-title>
        <v-card-subtitle>Anchor Ships</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 80 </v-card-text>
    </v-card>
    <v-card class="pa-3 item" min-height="150">
      <v-card-item>
        <v-card-title>사용자 수</v-card-title>
        <v-card-subtitle>Users</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 20 </v-card-text>
    </v-card>
    <v-card class="pa-3 item" min-height="150">
      <v-card-item>
        <v-card-title>알람수</v-card-title>
        <v-card-subtitle>Alarm</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 30 </v-card-text>
    </v-card>
    <UIKitDesign class="item"></UIKitDesign>
    <LineChart class="item">
    </LineChart>
    <StackedAreaChart class="item"></StackedAreaChart>
    <BarChart class="item"></BarChart>
    <PieChart class="item"></PieChart>
    <ColorConcept class="item"></ColorConcept>
  </div>
</template>

<script setup>
import PieChart from '@/views/dashboard/part/PieChart.vue'
import BarChart from '@/views/dashboard/part/BarChart.vue'
import StackedAreaChart from '@/views/dashboard/part/StackedAreaChart.vue'
import LineChart from '@/views/dashboard/part/LineChart.vue'
import UIKitDesign from '@/views/dashboard/part/UIKitDesign.vue'
import ColorConcept from '@/views/dashboard/part/ColorConcept.vue'

</script>

<style scoped>
.v-card {
  background: #4e83ff;
  border-radius: 10px;
}

.v-card-title {
  font-family: 'Pretendard-SemiBold';
}

.v-card-subtitle {
  font-family: 'Pretendard-Regular';
}

.v-card-text {
  font-family: 'Pretendard-SemiBold';
  font-size: 3em;
}

.container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  height: calc(100vh - 64px);
  min-height: 700px;
}

.item:nth-child(5) {
  grid-column: 5/ 7;
  grid-row: 1/3;
}

.item:nth-child(6) {
  grid-column: 1/ 3;

}

.item:nth-child(7) {
  grid-column: 3/ 5;

}

.item:nth-child(8) {
  grid-column: 1/ 3;

}

.item:nth-child(9) {
  grid-column: 3/ 5;

}

.item:nth-child(10) {
  grid-column: 5 / 7;

}
</style>
