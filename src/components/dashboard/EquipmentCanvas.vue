<template>
  <div ref="canvasContainer" :key="updateKey" class="canvas-container">
    <v-img :src="props.imageUrl" width="100%" height="100%" class="cavas-background" />
    <v-col
      cols="auto"
      class="pa-0 d-flex align-center justify-center"
      style="position: relative !important"
    >
      <canvas ref="canvasRef"> </canvas>
      <template v-if="props.list.length !== 0 && updateKey">
        <template v-for="(item, index) in canvasItems" :key="item.id">
          <div
            v-show="isShow"
            class="overlay-image"
            :ref="(el) => (overlayImageRefs[index] = el)"
            :style="overlayImageStyle(item)"
          >
            <v-img :src="item.image" :width="iconSize" :height="iconSize" aspect-ratio="1/1" />
            <div class="overlay-line">
              <div class="overlay-line-child"></div>
            </div>
            <div class="overlay-info">
              <v-card
                width="max-content"
                min-width="280"
                class="px-4 pb-3 overlay-info-card"
                :style="overlayInfoStyle(item)"
                :ref="(el) => (overlayInfoRefs[index] = el)"
                color="#333334"
              >
                <v-col cols="12" class="pa-0">
                  <v-card-title class="pa-0 overlay-info-card-title">{{
                    item.listTitle
                  }}</v-card-title>
                </v-col>
                <template v-for="info in item.list" :key="info.key">
                  <v-sheet class="d-flex align-center" color="#333334">
                    <span class="mr-3 text-secondary lcc-sub-font">{{ info.key }}</span>
                    <v-spacer />
                    <template v-if="item.id == 'propeller'">
                      <div class="lcc-default-font" style="line-height: 1.3">
                        {{ info.power || '-' }}
                        <span class="text-secondary lcc-sub-font">kw </span> /
                        {{ info.rpm || '-' }}
                        <span class="text-secondary lcc-sub-font">rpm </span>
                      </div>
                    </template>
                    <template v-else>
                      <span class="lcc-default-font">{{ info.value }}</span>
                      <v-sheet width="46" class="pl-2" color="#333334">
                        <span class="text-secondary lcc-sub-font">{{ info.unit }}</span>
                      </v-sheet>
                    </template>
                  </v-sheet>
                </template>
              </v-card>
            </div>
          </div>
        </template>
      </template>
    </v-col>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, onUpdated } from 'vue'

const props = defineProps({
  imageUrl: {
    type: String,
    default: null
  },
  list: {
    type: Array,
    default: () => []
  },
  key: {
    type: String,
    default: ''
  },
  updateKey: {
    type: [String, Number, Boolean],
    default: false
  }
})

const isShow = ref(false)
const canvasRef = ref(null)
const canvasContainer = ref(null)
const iconSize = ref(74)

const canvasItems = computed(() => {
  return props.list || []
})
const updateKey = computed(() => props.updateKey || false)

const overlayImageStyle = (param) => {
  const x = param.position[0] || 0
  const y = param.position[1] || 0
  return ` left: ${x}%; top: ${y}%;`
}

const overlayInfoStyle = (param) => {
  const expandNum = 10
  const x = param.listPosition[0] * expandNum || 0
  const y = param.listPosition[1] * expandNum || 0
  const topFill = (param.list.length < 4 ? 4 - param.list.length : 0) * 30
  switch (param.listAlign) {
    case 'top':
      return `
        left: 50%; bottom: 100%;
        transform: translate(calc(-50% - ${x}px), calc(0% + ${y}px - ${topFill}px));
      `
    case 'bottom':
      return `
        left: 50%; top: 100%;
        transform: translate(calc(-50% - ${x}px), calc(0% + ${y}px));
      `
    case 'left':
      return `
        right: 100%; top: 50%;
        transform: translate(calc(0% + ${x}px), calc(-50% - ${y}px));
      `
    case 'right':
      return `
        left: 100%; top: 50%;
        transform: translate(calc(0% + ${x}px), calc(-50% - ${y}px));
      `
  }
}

const updateCanvasSize = async () => {
  const container = canvasContainer.value
  const canvas = canvasRef.value
  if (container && canvas) {
    await nextTick()
    const size = Math.min(container.clientWidth, container.clientHeight) * 1
    canvas.width = size
    canvas.height = size
    if (size !== 0) {
      isShow.value = true
    }
    setTimeout(() => {
      drawLines()
    }, 0)
  }
}
let debounceTimer
const debounce = (func, delay) => {
  return (...args) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
const handleResize = debounce(() => {
  if (updateKey.value) {
    updateCanvasSize()
  }
}, 0)

const overlayImageRefs = ref([])
const overlayInfoRefs = ref([])

const drawLines = () => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  overlayImageRefs.value.forEach((imageRef, index) => {
    const infoRef = overlayInfoRefs.value[index].$el
    if (imageRef && infoRef) {
      const imageBounds = imageRef.getBoundingClientRect()
      const infoBounds = infoRef.getBoundingClientRect()
      const canvasBounds = canvas.getBoundingClientRect()
      nextTick(() => {
        const imageX = imageBounds.left - canvasBounds.left + iconSize.value / 2
        const imageY = imageBounds.top - canvasBounds.top + iconSize.value / 2
        const infoX = infoBounds.left - canvasBounds.left + infoBounds.width / 2
        const infoY = infoBounds.top - canvasBounds.top + infoBounds.height / 2
        drawRightAngleLine(ctx, imageX, imageY, infoX, infoY, props.list[index])
      })
    }
  })
}

const drawRightAngleLine = async (ctx, x1, y1, x2, y2, item) => {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  if (item) {
    switch (item.listAlign) {
      case 'top':
      case 'bottom':
        if (item.listPosition[0] !== 0) {
          ctx.lineTo(x1, y2)
        }
        break
      case 'left':
      case 'right':
        if (item.listPosition[1] !== 0) {
          ctx.lineTo(x2, y1)
        }
        break
    }
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = '#5789fe'
    ctx.lineWidth = 3
    ctx.stroke()
  }
}

onMounted(async () => {
  await nextTick()
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUpdated(() => {
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
.canvas-container {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative !important;
  display: flex;
  width: 100%;
  height: calc(100vh - 151px);
  // height: 100%;
  justify-content: center;
  align-items: center;
  .cavas-background {
    position: absolute;
  }
  > div {
    position: relative;
    canvas {
      // min-height: calc(100vh - 151px);
      // border: 1px solid white;
    }
    .overlay-image {
      position: absolute;
      transform: translate(-50%, -50%);
      z-index: 1000;
      .v-img {
        border-radius: 50%;
        background-color: white;
        img {
          padding: 14px !important;
          object-fit: fill !important;
        }
      }
      &::before {
        content: '';
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 0 10px #5789fe8a;
      }
    }
    .overlay-info {
      position: absolute;
      display: flex;
      width: 250%;
      height: 250%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      .overlay-info-card {
        position: absolute;
        &-title {
          display: flex;
          height: 60px;
          align-items: center;
        }
        span {
          line-height: 28px;
        }
      }
    }
    .overlay-line {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100% + 20px);
      height: calc(100% + 20px);
      .overlay-line-child {
      }
    }
  }
}
</style>
