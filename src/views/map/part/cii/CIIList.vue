<template>
  <div class="area-container d-flex flex-column h-100 px-2">
    <div class="d-flex justify-space-between align-center my-1">
      <div class="ciiList-title">| CII Rating</div>
      <i-btn icon="mdi-plus" width="30" height="30" color="transparent"></i-btn>
    </div>
    <DxDataGrid :data-source="ciiList" :column-auto-width="true" :show-borders="false" :show-column-lines="false"
      style="height: calc(100% - 38px);">
      <DxColumn data-field="id" cell-template="track-template" :visible="false"></DxColumn>
      <DxColumn data-field="departure" cell-template="departure-template" :allow-editing="false"></DxColumn>
      <template #departure-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.departure.portName" :time="templateOptions.data.time"
          :country="templateOptions.data.departure.country">
        </PortInfo>
      </template>

      <DxColumn data-field="arrival" cell-template="arrival-template" :allow-editing="false"></DxColumn>
      <template #arrival-template="{ data: templateOptions }">
        <PortInfo :portName="templateOptions.data.arrival.portName" :time="templateOptions.data.time"
          :country="templateOptions.data.arrival.country">
        </PortInfo>
      </template>

      <DxColumn data-field="distance" :allow-editing="false" alignment="center"></DxColumn>
      <DxColumn data-field="co2Emission" caption="Emission" :allow-editing="false" :wordWrapEnabled="true"
        alignment="center">
      </DxColumn>
      <DxColumn data-field="ciiRating" caption="Rating" :allow-editing="false" alignment="center"></DxColumn>

      <DxPaging :page-size="5" />
    </DxDataGrid>
  </div>
</template>

<script setup>
import PortInfo from '@/components/voyage/PortInfo.vue';

let imageURl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/255px-Flag_of_South_Korea.svg.png'
const ciiList = [
  {
    id: 1,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating : 'B'
  },
  {
    id: 2,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },
  {
    id: 3,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },
  {
    id: 4,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },
  {
    id: 5,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },
  {
    id: 6,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },
  {
    id: 7,
    departure: {
      portName: 'Yeosu',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    arrival: {
      portName: 'Pohang',
      time: '2023-12-23',
      nationImage: imageURl,
      country: 'KOR'
    },
    distance: '254,000',
    co2Emission: '20',
    ciiRating: 'B'
  },


]
</script>

<style scoped>
.ciiList-title{
  font-size : 1.2em;
}
</style>