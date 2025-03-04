<template>
  <div class="h-100 d-flex align-center rear-container" style="position: relative">
    <v-img class="ship-rear" :src="bulkRear" />
    <div class="voyage-info">
      <EquipmentIcon class="rear-ais-icon" :imageUrl="voyageIcon" />
      <v-card class="rear-voyage-desc px-3 rounded-lg">
        <v-card-title>Voyage Status</v-card-title>
        <v-card-text class="">
          <div
            v-for="(voyage, index) in voyageStatus"
            :key="index"
            class="d-flex justify-space-between lcc-default-font mb-2"
          >
            <div class="text-secondary lcc-sub-font">{{ voyage.key }}</div>
            <div>
              {{ voyage.value }} <span class="text-secondary">{{ voyage.unit }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="fuel-info">
      <EquipmentIcon class="rear-fuel-icon" :imageUrl="fuelIcon" />
      <v-card class="rear-fuel-desc px-4 rounded-lg">
        <v-card-title>Fuel Remaining</v-card-title>
        <v-card-text class="">
          <div
            v-for="(fuel, index) in fuelsStatus"
            :key="index"
            class="d-flex justify-space-between lcc-default-font mb-2"
          >
            <div class="text-secondary lcc-sub-font">{{ fuel.key }}</div>
            <div>{{ fuel.value }} <span class="text-secondary">ton</span></div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="engine-info">
      <EquipmentIcon class="rear-engine-icon" :imageUrl="engineIcon" />
      <v-card class="rear-engine-desc rounded-lg px-4">
        <v-card-title>Engine Status</v-card-title>
        <v-card-text class="">
          <div
            v-for="(engin, engin_index) in engineStatus"
            :key="engin_index"
            class="d-flex justify-space-between lcc-default-font mb-2"
          >
            <div class="text-secondary lcc-sub-font">{{ engin.key }}</div>
            <div>
              {{ engin.value }}
              <span class="text-secondary lcc-sub-font">{{ engin.unit }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="propeller-info">
      <EquipmentIcon class="rear-propeller-icon" :imageUrl="propellerIcon" />
      <v-card class="rear-propeller-desc px-3 rounded-lg">
        <v-card-title>Propeller Status</v-card-title>
        <v-card-text class="">
          <div
            v-for="(propeller, index) in propellersStatus"
            class="d-flex justify-space-between ga-2 mb-2"
          >
            <div class="text-secondary lcc-sub-font">
              {{ propeller.key }}
            </div>
            <div class="lcc-default-font">
              {{ propeller.power }}
              <span class="text-secondary lcc-sub-font">kw </span> /
              {{ propeller.rpm }}
              <span class="text-secondary lcc-sub-font">rpm </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import EquipmentIcon from '@/components/dashboard/EquipmentIcon.vue'

import engineIcon from '/images/dashboard/icon/engine-blue-icon.png'
import voyageIcon from '/images/dashboard/icon/voyage-blue-icon.png'
import propellerIcon from '/images/dashboard/icon/propeller-blue-icon.png'
import fuelIcon from '/images/dashboard/icon/fuel-blue-icon.png'

import bulkRear from '/images/dashboard/shiptype/bulk/bulk_rear.png'

const props = defineProps({
  imageUrl: {
    type: [String]
  },
  title: {
    type: String,
    default: ''
  },
  voyageStatus: {
    type: Array,
    default: () => []
  },
  fuelsStatus: {
    type: Array,
    default: () => []
  },
  engineStatus: {
    type: Array,
    default: () => []
  },
  propellerStatus: {
    type: Array,
    default: () => []
  }
})
const equipmentCard = ref(null)
</script>

<style lang="scss" scoped>
// .equipment-container {
//   position: absolute !important;
//   display: inline-block;
//   background: #fff;
//   border-radius: 50%;
//   padding: 15px;
//   box-shadow: 0 0 0 10px #5789fe8a;
//   transform: translate(-50%, -50%);
//   .equipment-area {
//     position: relative;
//     // .equipment-line {
//     //   top: 50%;
//     //   left: 50%;
//     //   transform: translate(-50%, -50%);
//     //   position: absolute;
//     // }
//     .content-container {
//       position: absolute;
//       // ::before {
//       //   content: '';
//       // }
//     }
//   }
// }

/*
* Rear 아이콘, 설명 관련 CSS
*/
.rear-container {
  .rear-ais-icon {
    position: absolute;
    top: 35%;
    right: 53%;
  }

  .rear-voyage-desc {
    position: absolute;
    top: 29%;
    right: 70%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-voyage-desc::after {
    content: '';
    width: 9vh;
    height: 3px;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 100%;
    z-index: -1;
    background: #5789fe;
  }

  .rear-fuel-icon {
    position: absolute;
    bottom: 50%;
    right: 22%;
  }

  .rear-fuel-desc {
    position: absolute;
    top: -5%;
    right: 0%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-fuel-desc::after {
    content: '';
    width: 7.9vh;
    height: 31vh;
    display: inline-block;
    position: absolute;
    top: 100%;
    right: 45%;
    z-index: -1;
    border-bottom: 3px solid #5789fe;
    border-right: 3px solid #5789fe;
  }

  .rear-engine-icon {
    position: absolute;
    bottom: 34%;
    right: 38%;
  }

  .rear-engine-desc {
    position: absolute;
    bottom: 26%;
    right: 0%;
    min-width: 320px;
    overflow: visible;
  }

  .rear-engine-desc::after {
    content: '';
    width: 7.5vh;
    height: 3px;
    display: inline-block;
    position: absolute;
    top: 43%;
    right: 100%;
    transform: translate(2%);
    z-index: -1;
    background: #5789fe;
  }

  .rear-propeller-icon {
    position: absolute;
    bottom: 18%;
    left: 26%;
  }

  .rear-propeller-desc {
    position: absolute;
    bottom: 6%;
    left: 42%;
    min-width: 320px;
    z-index: 9999;
    overflow: visible;
  }

  .rear-propeller-desc::after {
    content: '';
    width: 12vh;
    height: 5vh;
    display: inline-block;
    position: absolute;
    bottom: 50%;
    right: 101%;
    z-index: -1;
    border-bottom: 3px solid #5789fe;
    border-left: 3px solid #5789fe;
    transform: translate(2%);
  }
}
</style>
