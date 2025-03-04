<template>
  <div class="w-100">
    <div class="shipSummary d-flex w-100 ga-10">
      <div>
        <v-img :src="displayImage" width="200" height="120" cover></v-img>
      </div>
      <div class="d-flex flex-column justify-center popupLineHeight">
        <ShipInfoText fieldName="Flag" :fieldValue="clickedShipInfo.nation" />
        <ShipInfoText fieldName="IMO" :fieldValue="clickedShipInfo.imoNumber" />
        <ShipInfoText fieldName="MMSI" :fieldValue="clickedShipInfo.mmsiNumber" />
        <ShipInfoText fieldName="Call sign" :fieldValue="clickedShipInfo.callSign" />
      </div>
    </div>
  </div>
</template>

 
<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import PanamaShip from '@/assets/images/panamaShip2.png'
import emitter from '@/composables/eventbus.js'
import { useMapStore } from '@/stores/mapStore'
import ShipInfoText from '@/components/map/ShipInfoText.vue'
const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore)

// const { currentShip } = storeToRefs(shipStore)
defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})

const boatName = ref()

emitter.on('clickedShipOnMap', () => {
  // boatName.value = currentShip.value
  console.dir(clickedShipInfo)
})

const displayImage = computed(()=> {
  let image = ''
  const result = clickedShipInfo.value.shipImage ? `data:image/png;base64,${clickedShipInfo.value.shipImage}` : PanamaShip;
  image = result

  return image;
})


</script>

<style lang="scss">
span.squareIcon {
  font-size: 3px;
  vertical-align: middle;

}

.shipInfo-text {
  font-size: 1.1em;

  .shipInfo-fieldName {
    color: #ffffffa6;
    margin-left: 10px;
    margin-right: 6px;
  }
}

</style>
