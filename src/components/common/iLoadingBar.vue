<template>
  <!-- <div class="loading-bar-container text-center" v-if="loadingStatus">
    <v-progress-circular
      color="indigo-darken-2"
      indeterminate
    ></v-progress-circular>
    </div> -->

  <div class="loader-overlay" v-if="loadingStatus">
    <div class="loader"><div class="loader-inner"></div></div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
const { loadingStatus } = storeToRefs(loadingStore)
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  /* background: #4e83ff; */
  z-index: 9999;
  cursor: pointer;
}

/* .loading-bar-container{
  position: absolute;
  top: 50%;
  z-index: 999;
  left: 50%;
}  */

.loader {
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  border: 4px solid #fff;
  top: 50%;
  animation: loader 2s infinite ease;
  position: absolute;
  top: 50%;
  z-index: 999;
  left: 50%;
}

.loader-inner {
  vertical-align: top;
  display: inline-block;
  width: 100%;
  background-color: #fff;
  animation: loader-inner 2s infinite ease-in;
  background-color: #4e83ff;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(180deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loader-inner {
  0% {
    height: 0%;
  }

  25% {
    height: 0%;
  }

  50% {
    height: 100%;
  }

  75% {
    height: 100%;
  }

  100% {
    height: 0%;
  }
}
</style>
