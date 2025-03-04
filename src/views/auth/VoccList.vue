<template>
  <v-container>
  <v-row>
    <v-col cols="12" lg="9">
      <v-card class="pa-4" rounded="30">
        <v-card-title class="d-flex justify-space-between mb-4">
          <div>선사 목록</div>
          <i-btn prepend-icon="mdi-plus" color="#3D3D40" text="등록" width="75" height="35"
           @click.stop="changeComponent($event, 'VoccAdminRegisterForm')"></i-btn>
          </v-card-title>
        <v-card-text>
          <v-table class="list-table">
            <thead>

            </thead>
            <tbody>
              <tr v-for="(admin, index) in admins" :key="admin.id">
                <td>{{ admin.name }}</td>
                <td>{{ admin.nickname }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="3" class="pa-4">
      <component :is="componentList[currentComponent]" :voccAdminId="_voccAdminId"></component>
    </v-col>
  </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'

import DefaultText from '@/components/DefaultText.vue'
import VoccAdminRegisterForm from '@/views/auth/VoccAdminRegisterForm.vue'
import VoccAdminEditForm from '@/views/auth/VoccAdminEditForm.vue'

const admins = ref([])
const currentComponent = ref('DefaultText')
const _voccAdminId = ref()
const currentId = ref('')

const componentList = {
  DefaultText,
  VoccAdminRegisterForm,
  VoccAdminEditForm,
}

onBeforeMount(() => {
  getVoccAdminAll()
})

const fetchVoccAll = async () => {
  const voccStore = useVoccStore()
  const result = await voccStore.getVoccAdmins()
  admins.value = result
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId ='', index='') => {
  _voccAdminId.value = voccId
  console.dir(typeof(event))
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name
  currentComponent.value = name;
  currentId.value = index

}

const isEditing = (index) => {
  return parseInt(currentId.value) === index;
}

provide('changeComponent', changeComponent)

</script>

<style scoped>
.v-row {
  height: 100%;
}

.v-card {
  height: 100%;
}

.list-table{
  border: 1px solid #49494E;
}

.list-table  tr:nth-child(odd) {
  background: #2F2F32;
}

.list-table  th {
  border-right: 1px solid #49494E;
}

.list-table .title {
  font-size: 1.2em;
}

/* .active {
  background: '#4E83FF';
  color: '#fff'
}

.inactive {
  background: '#7A8294';
  color: '#525C71'

} */
</style>