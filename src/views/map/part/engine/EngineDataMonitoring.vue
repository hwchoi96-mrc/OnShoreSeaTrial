<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex justify-space-between ">
      <div class="d-flex ga-2 align-center ">
        <!-- <div>Equipment</div> -->
        <i-selectbox v-model="equipmentName" :items="equipments" item-title="name" item-value="id" variant="solo-filled"
          density="compact" return-object class="equipmentSelector" bg-color="#434348"
          :hide-details="true"></i-selectbox>
      </div>
      <div class="d-flex ga-2 align-center">
        <div> <v-icon icon="mdi-clock-time-four-outline" /></div>
        <div>2024-04-05 11:07</div>
      </div>
    </div>
    
    <div class="d-flex flex-wrap ga-2 overflow-y-auto mt-3">
      <div class="engine-item" style="position : relative">
        <ReportItem title="Main Engine 1" :data="mainEngine" />
      </div>
      <div class="engine-item">
        <ReportItem title="Turbo Charger" :data="turboCharger1"></ReportItem>
      </div>
      <div class="engine-item">
        <ReportItem title="M/E Flow Meter" :data="flowMeter"></ReportItem>
      </div>

      <div class="pa-3" style="background-color: #333334">
        <div class="my-2 ml-1">Cylinder</div>
        <v-data-table :headers="headers" :items="formattedData" :hide-default-footer="true" item-key="fuel">
          <template #body="{ items }">
            <tr v-for="(item, index) in items" :key="index">
              <td>{{ getAttributeName(item.fuel) }}</td>
              <td v-for="(usage, month) in item.usage" :key="month">
                {{ usage }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from 'vue'
import DataGrid from '@/components/DataGrid.vue';
import ReportItem from '@/components/voyage/ReportItem.vue'

const equipmentName = ref('ME1')

const mainEngine = {
  runningHours: '15346.6',
  power: '8102.5',
  load: '20',
  speed: '87.06',
  scavAirPress: '7.2',
  scavAirTemp: '13.5',
  MainLOPress: '80',
  MainLOTemp: '80',
}

const turboCharger1 = {
  speed: '11651.5',
  inletTemp: '20',
  outletTemp: '87.06',
  tempDiff: '7.2',
  airTemp: '13.5',
}

const flowMeter = {
  fuelType: '15346.6',
  foMassFlow: '8102.5',
  fgMassFlow: '20',
  lowCalorifficValue: '87.06',
  foDensity: '7.2',
  foInletPress: '13.5',
  foInletTemp: '80',
  foInletViscosity: '80',
}



const equipmentDatas = [{
  mainEngine: {
    runningHours: {
      value: 153466,
      unit: 'Hrs',
      dataType: 'Number'
    },
    power: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    load: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    speed: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    airPress: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    airTemp: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    inletPress: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    },
    inletTemp: {
      value: 81025,
      unit: 'kW',
      dataType: 'Number'
    }
  },
  turboCharger1: {

  },
  turboCharger2: {

  },
  flowMeter: {

  }
}]

const equipments = [
  {
    id: 1,
    name: 'ME1'
  },
  {
    id: 2,
    name: 'ME2'
  },
  {
    id: 3,
    name: 'GE1'
  },
  {
    id: 4,
    name: 'GE2'
  },
  {
    id: 5,
    name: 'GE3'
  }
]


const headers = [
  { title: 'CyL No', align: 'start', value: 'fuel' },
  { title: '1', value: '1' },
  { title: '2', value: '2' },
  { title: '3', value: '3' },
  { title: '4', value: '4' },
  { title: '5', value: '5' },
  { title: '6', value: '6' },
  { title: '7', value: '7' },
  { title: '8', value: '8' },
  { title: '9', value: '9' },
  { title: 'Mean', value: '12' },
];

const data = [
  { gasTemp: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { pcoTemp: [1, 20, 3, 10, 5, 20, 10, 0, 5, 2] },
  { jcwOutTemp: [1, 10, 3, 10, 5, 20, 15, 0, 5, 2] },
  { pmax: [1, 0, 3, 40, 5, 20, 15, 0, 15, 2] },
  { pcomp: [1, 0, 3, 40, 5, 20, 15, 0, 15, 2] },
  { pbar: [1, 0, 3, 40, 5, 20, 15, 0, 15, 2] },
  { pi: [1, 0, 3, 40, 5, 20, 15, 0, 15, 2] },
];

const attributeNames = {
  gasTemp: 'Exh.Gas Temp',
  pcoTemp: 'P.C.O Temp (℃)',
  jcwOutTemp: 'JCW Out Temp (℃)',
  pmax: 'Pmax (bar)',
  pcomp: 'Pcomp (bar)',
  pbar: '△P (bar)',
  pi: 'Pi (bar)'
};

const formattedData = computed(() => {
  const test = data.map(item => {
    const fuel = Object.keys(item)[0];
    const usage = item[fuel];
    const formattedUsage = {};
    usage.forEach((value, index) => {
      formattedUsage[index + 1] = value;
    });
    return { fuel, usage: formattedUsage };
  });

  console.dir(test)
  return test;

});

const getAttributeName = (attribute) => {
  return attributeNames[attribute] || attribute;
};
</script>

<style>
.equipmentSelector {
  width: 150px;
}

.engine-item {
  flex: 1 1 40%;
}

.engine-item .v-sheet .item-container {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>