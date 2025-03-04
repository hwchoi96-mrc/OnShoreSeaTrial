<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-center white">구분</th>
        <th class="text-center white">수량</th>
      </tr>
    </thead>
    <tbody class="text-center">
      <tr v-for="output in outputs" :key="output.id">
        <td>{{ output.title }}</td>
        <td>{{ output.quantity }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { ref } from "vue";

const outputs = ref([
  {
    id: 1,
    title: "총 생산량",
    quantity: 11000,
  },
  {
    id: 2,
    title: "정상 수량",
    quantity: 10000,
  },
  {
    id: 3,
    title: "불량 수량",
    quantity: 1000,
  },
]);
</script>

<style>
thead {
  background-color: #1e55ad;
}


.white {
  color: #fff !important;
}


.desc {
  font-size: 1.2em;
}

td{
    height: 55px !important;
    font-family: 'GmarketSansMedium';
}

</style>
