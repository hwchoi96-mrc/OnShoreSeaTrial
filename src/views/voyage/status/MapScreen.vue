<!--Windy.vue-->
<template>
  <v-container fluid="true" class="pa-0 h-100">
    <v-row class="pa-0 h-100">
      <v-col cols="10" class="pa-0">
        <v-img class="h-100" cover :src="mapImage"></v-img>
      </v-col>
      <v-col cols="1" class="ml-4">
        <ShipInformation> </ShipInformation>
        <ShipSideBar> </ShipSideBar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import WindyComponent from "@/components/windy/WindyComponent.vue";
import ShipInformation from "@/views/voyage/status/ShipInformation.vue";
import ShipSideBar from "@/views/voyage/status/ShipSideBar.vue";
import mapImage from "@/assets/images/map.png";
</script>

<style scoped></style>
