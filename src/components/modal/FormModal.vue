<template>
  <v-dialog class="d-flex justify-center" width="700" persistent>
    <v-card class="pb-6">
      <v-card-text class="text-end">
        <v-btn class="pl-6" prepend-icon="mdi-close" @click="$emit('closePopup')"></v-btn>
      </v-card-text>
      <v-card-title class="px-6">
        <slot name="title"></slot>
      </v-card-title>
      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions class="px-6">
        <slot name="footer"></slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['closePopup'])
</script>

<style></style>
