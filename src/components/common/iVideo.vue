<template>
  <video controls controlslist="nodownload noplaybackrate" disablepictureinpicture>
    <source :src="url" type="video/webm" />

    <!-- <source :src="url" type="video/mp4" /> -->
  </video>
</template>

<script setup>
defineProps({
  url : {
    type : String,
  }
})
</script>

<style>
video::-webkit-media-controls-mute-button {
  display: none;
}

video::-webkit-media-controls-volume-slider {
  display: none;
}

video::-webkit-media-controls-download {
  display: none;
}
  
</style>
