<template>
  <div class="h-100" style="position: relative">
    <v-img class="ship-iso" :src="lngIso" aspect-ratio="16/9">
      <!-- <EquipmentIcon1
                  :imageUrl="engineIcon"
                  title="Engine Status"
                  :iconProps="{
                    x: 15,
                    y: -5
                  }"
                  :cardProps="{
                    x: 10,
                    y: 0,
                    position: 'right'
                  }"
                  :list="engineStatusList"
                />

                <EquipmentIcon1
                  :imageUrl="aisIcon"
                  title="Voyage Status"
                  :iconProps="{
                    x: 10,
                    y: -20
                  }"
                  :cardProps="{
                    x: 10,
                    y: 0,
                    position: 'left'
                  }"
                  :list="voyageStatusList"
                /> -->
    </v-img>

    <div class="voyage-info">
      <EquipmentIcon class="voyage-icon" :imageUrl="voyageIcon" />
      <v-card class="voyage-desc px-4 rounded-lg">
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
      <EquipmentIcon class="fuel-icon" :imageUrl="fuelIcon" />
      <v-card class="fuel-desc px-4 rounded-lg">
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
      <EquipmentIcon class="engine-icon" :imageUrl="engineIcon" />
      <v-card class="engine-desc px-4 rounded-lg">
        <v-card-title>Engine Status</v-card-title>
        <v-card-text class="">
          <div
            v-for="(engine, index) in engineStatus"
            :key="index"
            class="d-flex justify-space-between lcc-default-font mb-2"
          >
            <div class="text-secondary lcc-sub-font">{{ engine.key }}</div>
            <div>
              {{ engine.value }} <span class="text-secondary">{{ engine.unit }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="propeller-info">
      <EquipmentIcon class="propeller-icon" :imageUrl="propellerIcon" />
      <v-card class="propeller-desc px-3 rounded-lg">
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

import bulkIso from '/images/dashboard/shiptype/bulk/bulk_iso.png'
import bulkRear from '/images/dashboard/shiptype/bulk/bulk_rear.png'
import bulkSide from '/images/dashboard/shiptype/bulk/bulk_side.png'

import containerIso from '/images/dashboard/shiptype/container/container_iso.png'
import containerRear from '/images/dashboard/shiptype/container/container_rear.png'
import containerSide from '/images/dashboard/shiptype/container/container_side.png'

import lngIso from '/images/dashboard/shiptype/lng/lng_iso.png'
import lngRear from '/images/dashboard/shiptype/lng/lng_rear.png'
import lngSide from '/images/dashboard/shiptype/lng/lng_side.png'

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

console.log('데이터')
console.dir(props.list)
</script>

<style lang="scss" scoped>
.voyage-icon {
  position: absolute;
  top: 22%;
  right: 34%;
}

.voyage-desc {
  position: absolute;
  top: 16%;
  left: 5%;
  min-width: 320px;
  overflow: visible;
}

.voyage-desc::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 61%;
  display: inline-block;
  width: 78%;
  height: 3px;
  background-color: #5789fe;
  z-index: -1;
  transform: translate(50%, 0);
}

.fuel-icon {
  position: absolute;
  bottom: 44%;
  right: 37%;
}

.fuel-desc {
  position: absolute;
  bottom: 12%;
  left: 45%;
  min-width: 320px;
  overflow: visible;
}

.fuel-desc::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 49%;
  display: inline-block;
  width: 1px;
  height: 14vh;
  border-left: 3px solid #5789fe;
  border-bottom: 3px solid #5789fe;
  z-index: -1;
}

.engine-icon {
  position: absolute;
  bottom: 57%;
  right: 22%;
}

.engine-desc {
  position: absolute;
  bottom: 30%;
  right: 0%;
  min-width: 320px;
  overflow: visible;
}

.engine-desc::after {
  content: '';
  width: 6.4vh;
  height: 8.6vh;
  display: inline-block;
  position: absolute;
  top: -50%;
  right: 50%;
  z-index: -1;
  border-top: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
  transform: translate(2%);
}

.propeller-icon {
  position: absolute;
  top: 20%;
  right: 13%;
}

.propeller-desc {
  position: absolute;
  top: -5%;
  right: 5%;
  min-width: 320px;
  z-index: 9999;
  overflow: visible;
}

.propeller-desc::after {
  content: '';
  // width: 20%;
  height: 64%;
  display: inline-block;
  position: absolute;
  top: 100%;
  right: 33%;
  z-index: -1;
  // border-bottom: 3px solid #5789fe;
  border-right: 3px solid #5789fe;
}
</style>
