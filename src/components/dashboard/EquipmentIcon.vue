<template>
  <div class="icon-container">
    <v-img :src="imageUrl" width="50" height="50"></v-img>
  </div>
</template>

<script setup>
defineProps({
  imageUrl: {
    type: [String]
  }
})
</script>

<style lang="scss" scoped>
.icon-container {
  display: inline-block;
  background: #fff;
  border-radius: 50%;
  padding: 15px;
  box-shadow: 0 0 0 10px #5789fe8a;
}
</style>
