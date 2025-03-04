<template>
  <v-card title="Color" subtitle="" class="card bg-card cardContainer h-100" min-height="410">
    <v-container class="pa-0">
      <v-row>
        <v-col>
          <v-list class="bg-card d-flex w-100">
            <v-list-item title="PrimaryColor" class="mb-2 d-inline-flex">
              <v-btn class="mt-2">#202528</v-btn>
            </v-list-item>
            <v-list-item title="SecondaryColor" class="mb-2">
              <v-btn class="bg-secondary text-color mt-2" elevation="2">#202528</v-btn>
              <v-btn class="bg-secondary-1 text-color mt-2" elevation="2">#61D1D2</v-btn>
              <v-btn class="bg-secondary-2 text-color mt-2" elevation="2"> #A63AA9</v-btn>
              <!-- <v-btn class="bg-secondary-3 text-color mt-2" elevation="2">#EDA339</v-btn>
                <v-btn class="bg-secondary-4 text-color mt-2" elevation="2">#E25E20</v-btn> -->
            </v-list-item>
          </v-list>
          <v-list class="bg-card d-flex w-100">
            <v-list-item title="Point Color" class="w-25 mb-2 d-flex">
              <v-btn class="bg-secondary-4 mt-2">#E25E20</v-btn>
            </v-list-item>

            <v-list-item title="TrafficLight Color" class="mb-2">
              <div class="d-flex justify-space-between secondaryColorContainer">
                <v-btn class="bg-green text-color mt-2">#E25E20</v-btn>
                <v-btn class="bg-orange text-color mt-2">#E25E20</v-btn>
                <v-btn class="bg-red mt-2">#E25E20</v-btn>
              </div>
            </v-list-item>
          </v-list>

          <v-list class="bg-card d-flex w-100">
            <v-list-item title="Text Color" class="w-25 mb-2 d-flex">
              <v-btn class="bg-secondary-4 mt-2">#E25E20</v-btn>
            </v-list-item>

            <v-list-item title="TrafficLight Color" class="mb-2">
              <div class="d-flex justify-space-between secondaryColorContainer">
                <v-btn class="bg-green text-color mt-2">#E25E20</v-btn>
                <v-btn class="bg-orange text-color mt-2">#E25E20</v-btn>
                <v-btn class="bg-red mt-2">#E25E20</v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.secondaryColorContainer {
  width: 60%;
}

/* .v-btn {
  width: 4vw;
  font-size: 0.8em;
} */
</style>
