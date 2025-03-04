<template>
  <v-card title="Grid" subtitle="그리드 레이아웃" class="card pa-2 bg-card" min-height="410px">
    <v-table class="mt-2 mb-2" height="100%">
      <!-- <caption>CII 등급</caption> -->
      <thead class="bg-table-header" style="background: #006699; color: white">
        <tr>
          <th class="text-center" bg-color="grey-lighten-2" style="color: white">연도</th>
          <th class="text-center" style="color: white">CII 허용량</th>
          <th class="text-center" style="color: white">CII 달성량</th>
          <th class="text-center" style="color: white">CII 등급</th>
        </tr>
      </thead>
      <tbody class="bg-table-body">
        <tr class="text-center" v-for="item in items" :key="item.year">
          <td>{{ item.year }}</td>
          <td>{{ item.requiredCII }}</td>
          <td>{{ item.attainedCII }}</td>
          <td>{{ item.grade }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const items = ref([
  {
    year: '2023',
    requiredCII: 6.89,
    attainedCII: 5.3,
    grade: 'A'
  },
  {
    year: '2022',
    grade: 'B',
    requiredCII: 6.89,
    attainedCII: 8.8
  },
  {
    year: '2021',
    grade: 'B',
    requiredCII: 6.89,
    attainedCII: 10.3
  }
  // {
  //   year: "2020",
  //   grade: "D",
  //   requiredCII: 6.89,
  //   attainedCII: 30.3,
  // },
])
</script>

<style scoped>
caption {
  caption-side: top;
  text-align: center;
  color: #000;
  font-weight: 500;
  font-size: 1.25rem;
}
</style>
