<template>
  <div class="popup-container pointer-cursor">
    <div style="font-size:1.2em">| Vessel Particulars</div>
    <div class="d-flex ga-12 pl-4" style="line-height: 2;">
      <div class="popupLineHeight">
        <ShipInfoText fieldName=" Vessel type" :fieldValue="clickedShipInfo.type" />
        <ShipInfoText fieldName="Gross Tonnage" :fieldValue="clickedShipInfo.grossTonnage" unit="t" />
        <ShipInfoText fieldName="Summber DWT" :fieldValue="clickedShipInfo.summerDwt" unit="t" />
      </div>
      <div class="popupLineHeight">
        <ShipInfoText fieldName="Length" :fieldValue="clickedShipInfo.length" unit="m" />
        <ShipInfoText fieldName="Beam" :fieldValue="clickedShipInfo.beam" unit="m" />
        <ShipInfoText fieldName="Year built" :fieldValue="clickedShipInfo.yearBuilt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/mapStore'

const mapStore = useMapStore()
const { clickedShipInfo } = storeToRefs(mapStore);
import ShipInfoText from '@/components/map/ShipInfoText.vue'
</script>

<style scoped>
.popup-container{
  background: #3c3c3f;
  padding: 4px;
  border-radius: 5px;
  border: 0.5px solid #ffffff1f;
}

</style>