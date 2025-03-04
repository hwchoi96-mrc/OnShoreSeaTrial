<template>
  <!-- <v-dialog model-value="isPopMenuShow" ref="popupMenu2" width="250" :close-on-back="false" class="v-dialog--movable" :scrim="false"> -->
  <v-card v-if="isPopMenuVisiable" class="popupMenu" ref="popupMenu" width="250">
    <v-card-title class="d-flex justify-space-between align-center drag-handle vss-movable">
      <div>Contents</div>
      <div> <v-btn icon="mdi-close" variant="text" @click="closePopupMenu"></v-btn></div>
    </v-card-title>
    <v-card-text>
      <v-list v-model:selected="selectedPopMenu" class="contentsPopup" :mandatory="true">
        <v-list-item v-for="(item, i) in menus" :key="i" :value="item.name" @click="handleClick(item)">
          <!-- <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template> -->
          <v-list-item-title>{{ item.displayName }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>


  <!-- </v-dialog> -->
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import emitter from '@/composables/eventbus.js'
import { useShipStore } from '@/stores/shipStore'
import { useMapStore } from '@/stores/mapStore'

defineEmits(['close-popup'])

const shipStore = useShipStore()
const { currentShip } = storeToRefs(shipStore)
const mapStore = useMapStore()
const { selectedPopMenu } = storeToRefs(mapStore)

const selectedMenu = ref([])
const isPopMenuVisiable = ref(false)

emitter.on('clickedShipOnMap', () => {
  selectedPopMenu.value = ['ShipInfo']
  // isPopMenuVisiable.value = true;
})

emitter.on('changeVisibleMenu', () => {
  isPopMenuVisiable.value = !isPopMenuVisiable.value
})

emitter.on('closePopupMenu', ()=> {
  closePopupMenu()
})

const closePopupMenu = () => {
  isPopMenuVisiable.value = false;
}


const handleClick = (item) => {
  if (selectedPopMenu.value[0] == item.name) {
    selectedPopMenu.value = [item.name]
  }

  closePopupMenu()
}

const menus = ref([
  {
    id: 1,
    name: 'ShipInfo',
    displayName: 'Ship Info',
    icon: 'mdi-information-outline'
  },
  {
    id: 2,
    name: 'VoyageList',
    displayName: 'Voyage List',
    icon: 'mdi-information-outline'
  },
  {
    id: 3,
    name: 'CIIRating',
    displayName: 'CII Rating',
    icon: 'mdi-information-outline'
  },
  {
    id: 4,
    name: 'EnginePerformance',
    displayName: 'Engine Performance',
    icon: 'mdi-information-outline'
  },
  {
    id: 5,
    name: 'INSMonitoring',
    displayName: 'INS Monitoring',
    icon: 'mdi-information-outline'
  },
])



const dialogVisible = ref(true);

</script>

<style scoped>
.v-dialog--movable .v-card__title {
  cursor: grab;
}

.v-dialog--movable .v-card__title:hover {
  background-color: #eee;
}

.v-dialog--movable .v-card__title:active {
  cursor: grabbing;
}

.popupMenu {
  position: absolute;
  /* top: 15px; */
  top : 70px;
  z-index: 999;
  /* left: 560px; */
  left : 30px;
  background : #262628
}

.contentsPopup {
  background: #1d1d1e;
}

.contentsPopup>.v-list-item.v-list-item--active {
  border-left: 3px solid #5789FE;
}
</style>
