<template>
  <v-table class="text-caption common-table">
    <tbody>
      <tr align="left" v-for="(key, vlaue) of props.data">
        <th class="text-center">{{ key }}</th>
        <td>{{ props.data[key] }}</td>
        <slot name="actions"></slot>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
const props = defineProps({
  data : {
    type : [Object , Array],
  },
  keyWidth : {
    type : [String, Number]
  }
}
)
</script>

<style scoped>
.common-table {
  border: 1px solid #49494E;
}

.common-table tr:nth-child(odd) {
  background: #2F2F32;
}

.common-table th {
  border-right: 1px solid #49494E;
}

.common-table title {
  font-size: 1.2em;
}

.common-table th,
.common-table td {
  font-size: 1.1em;
  ;
}

.common-table  tr > th {
  width: 20%;
}
</style>