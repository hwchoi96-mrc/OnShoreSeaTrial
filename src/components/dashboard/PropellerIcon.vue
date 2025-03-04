<template>
  <div class="equipment-container" :style="iconStyle">
    <div class="equipment-area">
      <v-img :src="props.imageUrl" width="50" height="50" />
      <v-card
        min-width="380"
        width="max-content"
        :min-height="`calc(76px + ${props.list.length * 28}px + 8px)`"
        class="content-container rounded-lg px-4 overflow-visible"
        :style="cardStyle"
        ref="equipmentCard"
      >
        <v-card-title>{{ props.title }}</v-card-title>
        <v-card-text>
          <template v-for="(obj, obj_index) in props.list" :key="obj_index">
            <div class="d-flex flex-wrap justify-center align-center mb-2">
              <div class="text-secondary lcc-sub-font mr-4">
                {{ obj.key }}
              </div>
              <div class="lcc-default-font">
                {{ obj.power }}
                <span class="text-secondary lcc-sub-font">kw </span> /
                {{ obj.rpm }}
                <span class="text-secondary lcc-sub-font">rpm </span>
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  imageUrl: {
    type: [String]
  },
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  },
  iconProps: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0
    })
  },
  cardProps: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
      position: 'bottom'
    })
  }
})
const equipmentCard = ref(null)
const iconStyle = computed(() => {
  const base = 50
  return `left: ${base + props.iconProps.x}%; top: ${base + props.iconProps.y}%;`
})
const cardStyle = computed(() => {
  const position = (key) => {
    switch (key) {
      case 'right':
        return `80%, -37.5%`
      case 'left':
        return `-160%, -37.5%`
      case 'top':
        return `-37.5%, ${-125 + props.list.length}%`
      case 'bottom':
      default:
        return `-37.5%, 100px`
    }
  }
  const transform = `transform: translate(${position(props.cardProps.position)});`
  return `${transform} left: ${props.cardProps.x * 4.5}%; top: ${props.cardProps.y * 4.5}%;`
})
const lineStyle = computed(() => {
  return `left: -100%; width: 45px; z-index: 100000;`
})
</script>

<style lang="scss" scoped>
.equipment-container {
  position: absolute !important;
  display: inline-block;
  background: #fff;
  border-radius: 50%;
  padding: 15px;
  box-shadow: 0 0 0 10px #5789fe8a;
  transform: translate(-50%, -50%);
  .equipment-area {
    position: relative;
    // .equipment-line {
    //   top: 50%;
    //   left: 50%;
    //   transform: translate(-50%, -50%);
    //   position: absolute;
    // }
    .content-container {
      position: absolute;
      ::before {
        content: '';
      }
    }
  }
}
</style>
