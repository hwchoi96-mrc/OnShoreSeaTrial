<template>
  <div v-if="type == 'default'">
    <i-btn v-for="btn in props.btnGroup" :key="btn.id" :text="btn.text" :color="btn.color" :data-type="btn.dataType"
      :width="btn.width" @click="$emit(`${btn.action}`, { event: $event, type: btn.dataType })">
    </i-btn>
  </div>
  <div v-else-if="type == 'add'">
    <i-btn text="취소" width="140" color="#5E616A" @click="$emit('close')"></i-btn>
    <i-btn text="등록" width="140" @click="$emit('add')"></i-btn>
  </div>

  <div v-else-if="type == 'update'">
    <i-btn text="취소" width="140" color="#5E616A" @click="$emit('cancle')"></i-btn>
    <i-btn text="수정" width="140" @click="$emit('update')"></i-btn>
  </div>

  <div v-else-if="type == 'delete'">
    <i-btn text="취소" color="#5E616A" @click="$emit('close')"></i-btn>
    <i-btn text="삭제" color="#F04A4A" @click="$emit('delete')"></i-btn>
  </div>

    <div v-else-if="type == 'confirm'">
      <i-btn text="취소" color="#5E616A" @click="$emit('close')"></i-btn>
      <i-btn text="확인" @click="$emit('confirm')"></i-btn>
    </div>

  <div v-else-if="type == 'excel'" class="">
    <i-btn text="추가" color="#3D3D40" prepend-icon="mdi-plus" @click="$emit('add')"></i-btn>
    <i-btn text="삭제" color="#F04A4A" prepend-icon="mdi-trash-can" @click="$emit('delete')"></i-btn>
    <i-btn text="저장" color="#3D3D40" @click="$emit('save')"></i-btn>
    <i-btn text="엑셀업로드" color="#3D3D40" @click="$emit('upload')"></i-btn>
    <i-btn text="다운로드" color="#3D3D40" @click="$emit('download')"></i-btn>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const width = ref()

const props = defineProps({
  btnGroup: {
    type: Array
  },
  type: {
    type: String,
    default: 'default'
  }
})

// const getWidth = computed(()=>{
//   // return width.value = ) * 100;
//   return width.value = 50%
// })
</script>

<style scope></style>