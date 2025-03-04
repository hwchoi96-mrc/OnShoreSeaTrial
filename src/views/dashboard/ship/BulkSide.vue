<template>
  <div class="h-100 d-flex align-center" style="position: relative">
    <v-img class="ship-side" :src="bulkSide" />
    <div class="voyage-info">
      <EquipmentIcon class="side-voyage-icon" :imageUrl="voyageIcon" />
      <v-card class="side-voyage-desc px-3 rounded-lg">
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
      <EquipmentIcon class="side-fuel-icon" :imageUrl="fuelIcon" />
      <v-card class="side-fuel-desc px-4 rounded-lg">
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
      <EquipmentIcon class="side-engine-icon" :imageUrl="engineIcon" />
      <v-card class="side-engine-desc rounded-lg px-4">
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
      <EquipmentIcon class="side-propeller-icon" :imageUrl="propellerIcon" />
      <v-card class="side-propeller-desc px-3 rounded-lg">
        <v-card-title>Propeller Status</v-card-title>
        <v-card-text class="">
          <div
            v-for="(propeller, index) in propellerStatus"
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
import { ref, computed } from 'vue'
import EquipmentIcon from '@/components/dashboard/EquipmentIcon.vue'

import bulkSide from '/images/dashboard/shiptype/bulk/bulk_side.png'
import engineIcon from '/images/dashboard/icon/engine-blue-icon.png'
import voyageIcon from '/images/dashboard/icon/voyage-blue-icon.png'
import propellerIcon from '/images/dashboard/icon/propeller-blue-icon.png'
import fuelIcon from '/images/dashboard/icon/fuel-blue-icon.png'
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
.side-voyage-icon {
  position: absolute;
  top: 43%;
  right: 15%;
}

.side-voyage-desc {
  position: absolute;
  top: 3%;
  right: 4%;
  min-width: 320px;
  overflow: visible;
}

.side-voyage-desc::after {
  content: '';
  width: 1px;
  height: 15vh;
  display: inline-block;
  position: absolute;
  // top: 100%;
  left: 50%;
  z-index: -1;
  border-bottom: 3px solid #5789fe;
  border-left: 3px solid #5789fe;
}

.side-fuel-icon {
  position: absolute;
  bottom: 40%;
  right: 58%;
}

.side-fuel-desc {
  position: absolute;
  top: 2%;
  left: 4%;
  min-width: 320px;
  overflow: visible;
}

.side-fuel-desc::after {
  content: '';
  width: 5vh;
  height: 36vh;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 100%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

.side-engine-icon {
  position: absolute;
  bottom: 40%;
  left: 55%;
}

.side-engine-desc {
  position: absolute;
  bottom: 10%;
  left: 19%;
  min-width: 320px;
  overflow: visible;
}

.side-engine-desc::after {
  content: '';
  width: 5.7vw;
  height: 16.5vh;
  display: inline-block;
  position: absolute;
  bottom: 47%;
  left: 100%;
  z-index: -1;
  border-bottom: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}

.side-propeller-icon {
  position: absolute;
  bottom: 35%;
  right: 8%;
}

.side-propeller-desc {
  position: absolute;
  bottom: 15.5%;
  right: 0%;
  min-width: 320px;
  z-index: 9999;
  overflow: visible;
}

.side-propeller-desc::after {
  content: '';
  width: 1px;
  height: 3vh;
  display: inline-block;
  position: absolute;
  bottom: 100%;
  left: 67%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}
</style>
