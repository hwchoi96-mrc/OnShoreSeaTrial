<template>
  <div class="container">
    <table class="menuTable-0"></table>
    <div id="windy" style="height: 900px"></div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
export default {
  setup() {
    const windy = ref(null)
    const map = ref(null) // Add a ref for the Leaflet map
    const markers = [] // 마커 객체를 담을 배열

    const iconOptions = {
      default: {
        imageUrl: '/images/ship/icon/normal-ship.png',
        iconSize: [32, 16],
        iconAnchor: [16, 8]
      },
      focus: {
        imageUrl: '/images/ship/icon/focus-ship.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      },
      warning: {
        imageUrl: '/images/ship/icon/normal-ship.png',
        iconSize: [32, 16],
        iconAnchor: [16, 8]
      }
    }

    onMounted(() => {
      const options = {
        key: 'ui0AZNqA0SCja9saUqPvgLbqsnyXEC0r', // **REPLACE WITH YOUR ACTUAL KEY!**
        verbose: true,
        lat: 35.5,
        lon: 126.8,
        zoom: 7
      }

      window.windyInit(options, (windyAPI) => {
        const { map } = windyAPI
        windy.value = windyAPI
        map.value = windyAPI.map

        createMarker(map.value, 34.85, 129.35, 'narmal')
        createMarker(map.value, 35.1, 129.4, 'narmal')
        createMarker(map.value, 35.2, 129.5, 'narmal')
      })

      // 마커 생성 함수
      function createMarker(map, lat, lng, state) {
        const options = iconOptions[state.type] || iconOptions.default // 상태값에 따른 옵션 선택 (없으면 기본값)

        const cShipIcon = L.icon({
          iconUrl: options.imageUrl,
          iconSize: options.iconSize, // 필요에 따라 조절
          iconAnchor: options.iconAnchor, // 필요에 따라 조절
          popupAnchor: [0, -25] // 필요에 따라 조절
        })

        L.marker([lat, lng], { icon: cShipIcon }).addTo(map)
      }
    })

    return { windy, map, markers }
  }
}
</script>

<style scoped>
#windy {
  width: 100%;
}

.container {
  display: flex; /* Flexbox 사용 */
  flex-direction: column; /* 수직 방향으로 배치 */
}

.menuTable-0 {
  display: flex; /* 가로로 나열 */
  align-items: center; /* 수직 가운데 정렬 */
  margin-top: 0px; /* 테이블 상단 여백 200px */
}

.menuTable-0 td {
  display: flex; /* 내부 요소들을 가로로 나열 */
  align-items: center; /* 수직 가운데 정렬 */
  margin-right: 20px; /* 각 td 요소 간 간격 조절 */
}
</style>
