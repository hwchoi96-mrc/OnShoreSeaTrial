<template>
  <div>
    <v-navigation-drawer
      :sticky="true"
      location="left"
      v-model="drawer"
      temporary
      width="500"
      class="bg-card"
    >
      <!-- <v-card class="bg-card"> -->
      <!-- <v-card-actions class="d-flex justify-end"> -->

      <!-- </v-card-actions> -->
      <!-- <v-card-text> -->
      <v-container>
        <v-row class="bg-card">
          <v-col class="text-right">
            <v-btn
              class="bg-card text-center pl-6"
              prepend-icon="mdi-close"
              @click="drawer = false"
            ></v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>선박명</v-col>
          <v-col
            ><div>{{ boatName }}</div></v-col
          >
        </v-row>
        <v-row>
          <v-col>현재위치</v-col>
          <v-col>16° 28.841’N 70°11.242’E</v-col>
        </v-row>
        <v-row>
          <v-col>출발지</v-col>
          <v-col>Busan</v-col>
        </v-row>
        <v-row>
          <v-col>출발시각</v-col>
          <v-col>2024/07/04 07:00:00 (UTC +09:00)</v-col>
        </v-row>
        <v-row>
          <v-col>도착지</v-col>
          <v-col>San Francisco</v-col>
        </v-row>
        <v-row>
          <v-col>도착예정시각</v-col>
          <v-col>2024/07/19 22:30:00 (UTC -08:00)</v-col>
        </v-row>
        <v-row>
          <v-col>운항거리</v-col>
          <v-col>9999km</v-col>
        </v-row>
        <v-row>
          <v-col>운항시간</v-col>
          <v-col>16일 9시간 30분</v-col>
        </v-row>
        <v-row>
          <v-col>운항상태</v-col>
          <v-col>항해모드</v-col>
        </v-row>
      </v-container>
      <!-- </v-card-text> -->
      <!-- </v-card> -->
    </v-navigation-drawer>
    <!-- <div class="d-flex justify-start align-center h-100">
      <v-btn class="bg-btn" @click.stop="drawer = !drawer">
        사이드바 형태
      </v-btn>
    </div> -->
  </div>
</template>

<script setup>
import { ref, provide } from "vue";

const drawer = ref(false);
const boatName = ref();

const showShipInfo = (clickedBoatName) => {
  drawer.value = true;
  boatName.value = clickedBoatName;
};

// defineExpose({
//   popupClick,
// });

defineExpose({
  showShipInfo
})
</script>

<style></style>
