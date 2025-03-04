<template>
  <v-sheet class="cctv-container area-container content d-flex h-100 flex-grow-1 flex-shrink-1">
    <div class="videoContainer d-flex flex-wrap flex-grow-1 flex-shrink-1 ga-3">
      <div v-for="video in videoUrl" class="videoItem">
        <i-video :url="video.url" class="h-100"></i-video>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>

const videoUrl = [
  {
    id: 1,
    url: 'https://media.istockphoto.com/id/1142024058/ko/%EB%B9%84%EB%94%94%EC%98%A4/%EB%B0%94%EB%8B%A4%EC%97%90%EC%84%9C-%EC%B4%88%EB%8C%80%ED%98%95-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%84%A0%EB%B0%95%EC%9D%98-%ED%95%AD%EA%B3%B5-%EC%98%81%EC%83%81-%ED%95%98%ED%96%A5%EC%8B%9D-%EB%B3%B4%EA%B8%B0.mp4?s=mp4-640x640-is&k=20&c=moihaZ3yERaw2gIrCba2ZtZso38M6AhsQS0vSFZr3fQ='
  },
  {
    id: 2,
    url: 'https://media.istockphoto.com/id/1144186665/ko/%EB%B9%84%EB%94%94%EC%98%A4/%ED%99%94%EB%AC%BC-%EC%84%A0%EB%B0%95%EC%9D%80-%EA%B0%80%EC%9E%A5%EC%9E%90%EB%A6%AC%EC%97%90-%EB%A7%8E%EC%9D%80-%ED%81%AC%EB%A0%88%EC%9D%B8%EC%9D%B4-%EC%9E%88%EB%8A%94-%ED%8F%AC%ED%8A%B8%EB%A1%9C-%ED%96%A5%ED%95%98%EB%8A%94-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88%EB%A5%BC-%EC%9A%B4%EB%B0%98-%ED%95%A9%EB%8B%88%EB%8B%A4-%EC%88%98%EC%9E%85-%EB%B0%8F-%EC%88%98%EC%B6%9C-%EA%B2%BD%EC%A0%9C%EC%9D%98-%EC%A4%91%EC%9A%94-%ED%95%9C-%EB%B6%80%EB%B6%84%EC%9E%85%EB%8B%88%EB%8B%A4.mp4?s=mp4-640x640-is&k=20&c=A7AhRhy1zRtslePf9L7Hn9_fjo2qwpQshBzCZAeLJMg='
  },
  {
    id: 3,
    url: 'https://media.istockphoto.com/id/1340236278/ko/%EB%B9%84%EB%94%94%EC%98%A4/%EC%9E%A5%EC%A0%84%EB%90%9C-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%ED%99%94%EB%AC%BC%EC%9A%A9%EA%B8%B0%EC%9D%98-%EC%A0%84%EB%A9%B4-%EC%8B%9C%EC%95%BC.mp4?s=mp4-640x640-is&k=20&c=Kv2ZIDxW-EA5OQ_Hc82AbZxwC_tjPyX8Q4vqNH7By18='
  },
  {
    id: 4,
    url: 'https://media.istockphoto.com/id/1557581492/ko/%EB%B9%84%EB%94%94%EC%98%A4/%ED%99%94%EB%AC%BC-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%84%A0%EB%B0%95-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88%EB%A5%BC-%EC%9A%B4%EB%B0%98%ED%95%98%EA%B3%A0-%ED%8A%B9%EA%B8%89-%EC%84%A0%EB%B0%95%EC%9C%BC%EB%A1%9C-%EC%88%98%EC%B6%9C-%EA%B0%9C%EB%85%90-%EA%B8%B0%EC%88%A0%ED%99%94%EB%AC%BC-%EC%9A%B4%EC%86%A1-%ED%95%B4%EC%83%81-%EC%9A%B4%EC%86%A1%EC%9D%84-%EC%9C%84%ED%95%B4-%EC%9A%B4%EC%98%81%EB%90%98%EB%8A%94-%ED%95%B4%EC%83%81-%EC%84%A0%EB%B0%95-%EC%95%9E-view.mp4?s=mp4-640x640-is&k=20&c=o39LJJlKuW3OzjbMWFz5vmBdHDIxu2tS3QhV022Kubw='
  }
]

</script>

<style scoped>
.videoContainer {
  flex: 1 1 40%;
}

.videoItem video {
  width : 225px;
}

.cctv-container{
  background: #000;
  padding: 16px;
}

</style>
