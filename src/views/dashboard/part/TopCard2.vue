<template>
  <div class="topCardContiner w-100">
    <v-card class="pa-3" min-height="150">
      <v-card-item>
        <v-card-title>운항중인 선박수</v-card-title>
        <v-card-subtitle>Operation Ships</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="d-flex justify-end align-self-end text-end mt-5 mb-2">
        150
      </v-card-text>
    </v-card>

    <v-card class="pa-3" min-height="150">
      <v-card-item>
        <v-card-title>정박된 선박수</v-card-title>
        <v-card-subtitle>Anchor Ships</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 80 </v-card-text>
    </v-card>

    <v-card class="pa-3" min-height="150">
      <v-card-item>
        <v-card-title>사용자 수</v-card-title>
        <v-card-subtitle>Users</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 20 </v-card-text>
    </v-card>

    <v-card class="pa-3" min-height="150">
      <v-card-item>
        <v-card-title>알람수</v-card-title>
        <v-card-subtitle>Alarm</v-card-subtitle>
      </v-card-item>
      <v-spacer></v-spacer>
      <v-card-text class="justify-end align-self-end text-end mt-5 mb-2"> 30 </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
</script>

<style scoped>

.topCardContiner{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
}

</style>