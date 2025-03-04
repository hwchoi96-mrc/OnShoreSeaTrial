<template>
  <v-container class="pa-0">
    <v-row dense>
      <v-col lg="3" md="6">
        <v-card min-height="150" class="bg-card d-flex align-center">
          <v-row>
            <v-col class="text-center align-self-center">
              <v-icon icon="mdi-ferry" size="x-large"></v-icon>
            </v-col>
            <v-col>
              <div>운항중인 선박 수</div>
              <span class="sub-title">Operation Ships</span>
              <h3>150</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="3" md="6">
        <v-card min-height="150" class="bg-card d-flex align-center">
          <v-row>
            <v-col class="text-center align-self-center">
              <v-icon icon="mdi-ship-wheel" size="x-large"></v-icon>
            </v-col>
            <v-col>
              <div>정박된 선박 수</div>
              <span class="sub-title">Anchor Ships</span>
              <h3>80</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="3" md="6">
        <v-card min-height="150" class="bg-card d-flex align-center">
          <v-row>
            <v-col class="text-center align-self-center">
              <v-icon icon="mdi-account" size="x-large"></v-icon>
            </v-col>
            <v-col>
              <div>사용자 수</div>
              <span class="sub-title">Users</span>
              <h3>20</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="3" md="6">
        <v-card min-height="150" class="bg-card d-flex align-center">
          <v-row>
            <v-col class="text-center align-self-center">
              <v-icon icon="mdi-bell-check-outline" size="x-large"></v-icon>
            </v-col>
            <v-col>
              <div class="mb-0">알람 수</div>
              <span class="sub-title">Alarm</span>
              <h3>30</h3>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.sub-title {
  font-size: 0.8em;
  color: #999999;
}
</style>
