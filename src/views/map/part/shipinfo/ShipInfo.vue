<template>
  <v-sheet class="popup-container pointer-cursor">
    <div class="mb-2">
      <VesselParticulars />
    </div>
    <div class="mt-2">
      <AISInfo :imoNumber="shipImoNumber" />
    </div>
  </v-sheet>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import ShipInfoText from '@/components/map/ShipInfoText.vue'
import VesselParticulars from '@/views/map/part/shipinfo/VesselParticulars.vue'
import AISInfo from '@/views/map/part/shipinfo/AISInfo.vue'
import emitter from '@/composables/eventbus.js'

onMounted(() => {
  // console.dir(popupLayout.value)
  const channel = new BroadcastChannel('foobar')
})
const openPopup = () => {
  var popup = window.open(`./test2`, "_blank", 'menubar=no, toolbar=no, width=300, height=400, scrollbars=0, location=no, width=500, height=300')
  // popup.opener.postMessage(boatName)
}

const shipImoNumber = ref('')
emitter.on('clickedShipOnMap', (imoNumber) => {
  shipImoNumber.value = imoNumber;
})

</script>

<style></style>