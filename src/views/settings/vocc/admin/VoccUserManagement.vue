<template>
  <v-container fluid class="h-100 management-page">
    <v-row class="ma-0 h-100">
      <v-col cols="9" lg="9">
        <v-card class="h-100" rounded="30">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>사용자 목록</div>
            <i-btn
              prepend-icon="mdi-plus"
              color="#3D3D40"
              text="등록"
              width="75"
              @click.stop="changeComponent($event, 'VoccUserRegisterForm')"
            ></i-btn>
          </v-card-title>
          <v-card-text>
            <v-table class="list-table title-container">
              <thead></thead>
              <tbody>
                <tr v-for="(voccUser, index) in voccUsers" :key="voccUser.username">
                  <td class="username">{{ voccUser.nickname }}</td>
                  <td class="activate-status">
                    <i-btn
                      :text="voccUser.activated ? '사용 가능' : '계정 잠금'"
                      :prepend-icon="voccUser.activated ? 'mdi-lock-open' : 'mdi-lock'"
                      :color="voccUser.activated ? '#fff' : '#737373'"
                      variant="text"
                      readonly
                      class="d-flex justify-end align-center"
                    >
                    </i-btn>
                  </td>
                  <td class="modify-btn">
                    <i-btn
                      :text="isEditing(index) ? '수정중' : '수정'"
                      :color="isEditing(index) ? '#7A8294' : '#4E83FF'"
                      :disable="isEditing(index)"
                      :dataId="index"
                      name="VoccAdminEditForm"
                      @click.stop="
                        changeComponent(
                          $event,
                          'VoccUserEditForm',
                          voccUser.voccId,
                          voccUser.userId,
                          index
                        )
                      "
                    >
                    </i-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" lg="3">
        <!--24.07.03 [이채원 사원]-->
        <component
          :is="componentList[currentComponent]"
          :voccId="_voccId"
          :voccUserId="_voccUserId"
          @refresh="getVoccUserAll"
          class="h-100"
        >
        </component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onBeforeMount, provide } from 'vue'
import { useVoccStore } from '@/stores/voccStore.js'
import { convertRoleName } from '@/composables/user.js'
import DefaultText from '@/components/DefaultText.vue'
import VoccUserRegisterForm from '@/views/settings/vocc/admin/VoccUserRegisterForm.vue'
import VoccUserEditForm from '@/views/settings/vocc/admin/VoccUserEditForm.vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
const currentComponent = ref('DefaultText')
const voccStore = useVoccStore()
const { voccInfo, voccUsers } = storeToRefs(voccStore)
const _voccId = ref()
const _voccUserId = ref()
const currentId = ref('')

const componentList = {
  DefaultText,
  VoccUserRegisterForm,
  VoccUserEditForm
}

onBeforeMount(() => {
  getVoccUserAll()
})

const getVoccUserAll = async () => {
  let voccId = voccInfo.value.id

  await voccStore.fetchMyVoccUsers()
}

/**
 * 수정 버튼 인덱스 값에 따른 컴포넌트 변경
 * */
const changeComponent = (event, name, voccId = '', voccUserId = '', index = '') => {
  _voccUserId.value = voccUserId
  //typeof(event) == 'string'? currentComponent.value = event : currentComponent.value = event.target.name
  _voccId.value = voccId
  currentComponent.value = name
  currentId.value = index
}

const isEditing = (index) => {
  return parseInt(currentId.value) === index
}

const refreshVoccUser = () => {
  voccUsers.value = _.cloneDeep(voccUsers.value)
}

provide('changeComponent', changeComponent)
</script>

<style scoped>
/* .v-row {
  height: 100%;
}

.v-card {
  height: 100%;
} */

.list-table {
  border: 1px solid #49494e;
}

.list-table tr:nth-child(odd) {
  background: #2f2f32;
}

.list-table th {
  border-right: 1px solid #49494e;
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

@media (max-height: 800px) {
  .management-container {
    max-height: 724px;
    height: 724px;
    overflow-y: auto;
  }
}
</style>
