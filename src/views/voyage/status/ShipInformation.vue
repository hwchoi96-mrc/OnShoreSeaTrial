<template>
  <v-dialog width="500" :scrim="scrim">
    <template v-slot:activator="{ props }">
      <div class="d-flex justify-start align-center my-6">
        <v-btn class="bg-btn" v-bind="props" text="팝업형태"></v-btn>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="bg-card">
        <v-card-actions class="d-flex justify-end">
          <v-btn
            class="pl-6"
            prepend-icon="mdi-close"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
        <v-card-text>
          <v-container>
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
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
const scrim = ref(false);
const vertical = ref(true);
</script>

<style></style>
