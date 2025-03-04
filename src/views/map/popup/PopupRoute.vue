<template>
  <v-sheet
    class="pa-3 rounded-lg popupLayout pointer-cursor"
    ref="popupRoute"
    height="790"
    v-if="isRouteShow"
    width="900"
  >
    <!--  국가이미지, 선박명, 닫기 버튼 -->
    <v-sheet class="">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <div class="d-flex align-center ga-4">
            <div class="align-center boatName" style="line-height: 1">항로계획</div>
          </div>
        </div>
        <v-btn icon="mdi-close" width="" size="small" variant="text" @click="closePopup"></v-btn>
      </div>
    </v-sheet>
    <v-sheet color="#3C3C3F" class="px-3 py-3 d-flex rounded-lg">
      <v-row>
        <v-col cols="5">
          <v-table height="25">
            <colgroup>
              <col width="60%" />
              <col width="40%" />
            </colgroup>
            <tr>
              <th class="text-center">항로계획명</th>
              <th class="text-center">편집일자</th>
            </tr>
          </v-table>
          <v-table class="RMList" height="639">
            <colgroup>
              <col width="60%" />
              <col width="40%" />
            </colgroup>
            <tr
              v-for="(item, index) in routelist"
              v-if="routelist.length > 0"
              :key="item.routeid"
              :class="{ selected: selectedMIndex === index }"
              @click="[selectRowM(index), route_choice(item.routeid)]"
            >
              <td class="text-center">{{ item.routename }}</td>
              <td>{{ item.modifydate }}</td>
            </tr>
            <tr v-if="routelist.length === 0">
              <td colspan="2">항로계획 정보가 없습니다.</td>
            </tr>
          </v-table>
          <tr height="10"></tr>
          <button class="button1" @click="route_reset()">항로 추가</button>
          <button class="button1" @click="route_delete()">항로 삭제</button>
        </v-col>
        <v-col cols="7">
          <v-table height="200" width="480">
            <colgroup>
              <col width="22%" />
              <col width="22%" />
              <col width="22%" />
              <col width="22%" />
              <col width="12%" />
            </colgroup>
              <tr>
                <th class="text-center">항로계획명</th>
                <th colspan="4">
                  <input v-model="routeMaster.routename" placeholder="항로계획명을 입력하세요" />
                </th>
              </tr>
              <tr>
                <th class="text-center">편집자</th>
                <th>
                  <input v-model="routeMaster.makename" placeholder="편집자명을 입력하세요" />
                </th>
                <th class="text-center">편집일자</th>
                <th>
                  <p>{{ routeMaster.modifydate }}</p>
                </th>
                <th><button class="button1" @click="saveRouteM()">저장</button></th>
              </tr>
          </v-table>
          <v-table height="25">
            <!--<colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>-->
            <colgroup>
              <col width="20%" />
              <col width="30%" />
              <col width="30%" />
            </colgroup>
            <tr>
              <th class="text-center">순번</th>
              <!--<th class="text-center">이탈허용거리(NM)</th>-->
              <th class="text-center">위도</th>
              <th class="text-center">경도</th>
            </tr>
          </v-table>
          <v-table class="RDList" height="440" width="455">
            <!--<colgroup><col width="25%"><col width="25%"><col width="25%"><col width="25%"></colgroup>-->
            <colgroup>
              <col width="20%" />
              <col width="30%" />
              <col width="30%" />
            </colgroup>
            <tr
              v-for="(rd_item, index) in routeDetail"
              :key="rd_item.r_pointid"
              @click="selectRowD(index)"
              :class="{ selected: selectedDIndex === index }"
              v-if="routeDetail.length > 0"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <!--<td class="text-center"></td>-->
              <td class="text-center"><input class="text-center" v-model="rd_item.lat" /></td>
              <td class="text-center"><input class="text-center" v-model="rd_item.lon" /></td>
            </tr>
          </v-table>
          <tr height="10"></tr>
          <button class="button1" @click="addRow()">WP 추가</button>
          <button class="button1" @click="removeRow()">WP 삭제</button>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>
</template>

<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouteStore } from '@/stores/routeStore'
import { useToast } from '@/composables/useToast'
import emitter from '@/composables/eventbus'
import axios from 'axios'

const routeStore = useRouteStore()
const { routelist, routeMaster, routeDetail, r_choice, selectedMIndex, selectedDIndex } =
  storeToRefs(routeStore)

const { showResMsg } = useToast()

const props = defineProps({
  isRouteShow: {
    type: Boolean,
    defalut: false
  }
})

const emit = defineEmits(['closePopup'])

const closePopup = () => {
  route_reset()
  emit('closePopup')
  emitter.emit('draw_route_d3');
}

const selectRowM = (index) => {
  selectedMIndex.value = index
}

const route_choice = (id) => {
  routeStore.fetchRouteInfoById(id)
  routeStore.fetchRouteDetailInfoById(id)
  fetchRouteDetailInfoById()
}

const route_reset = () => {
  routeStore.resetroute()
}

const route_delete = () => {
  if (routeMaster.value.routeid === 0) {
    showResMsg('항로계획을 선택해주세요.')
  } else {
    routeStore.RouteMDelete(routeMaster.value.routeid)
    selectedMIndex.value = null
    selectedDIndex.value = null
  }
}

const saveRouteM = () => {
  routeStore.RouteMSave(
    routeMaster.value.routeid,
    routeMaster.value.routename,
    routeMaster.value.makename
  )
}

const selectRowD = (index) => {
  selectedDIndex.value = index
}

const fetchRouteDetailInfoById = (id) => {
  emitter.emit('draw_route_d1');
}

const addRow = () => {
  if (routeMaster.value.routeid === 0) {
    showResMsg('항로계획을 선택해주세요.')
  } else {
    let obj = { routeid: routeMaster.routeid, lon: '', lat: '', seq: 0 }
    if (selectedDIndex.value === null) {
      if (routeDetail.length == 0) {
        routeDetail.value = [obj]
      } else {
        routeDetail.value.push(obj)
      }
    } else {
      routeDetail.value.splice(selectedDIndex.value + 1, 0, obj)
    }
  }
}

const removeRow = () => {
  if (selectedDIndex.value === null) {
    showResMsg('삭제할 항로계획 순번을 선택해주세요.')
  } else {
    routeStore.routeDetail.splice(selectedDIndex.value, 1)
    selectedDIndex.value = null
  }
}
</script>

<style scoped>
.button1 {
  border-width: 1px;
  border-style: solid;
  border-color: white;
  padding:3px;
  margin-right: 5px;
}
.popupLayout {
  position: absolute;
  top: 35px;
  z-index: 999;
  left: 15px;
  height: calc(100% - 24px);
}

.RMList tr:hover:not(:first-child) {
  background: #7f7f7f;
}
.RMList tr.selected {
  background: #7f7f7f;
}

.RDList tr:hover:not(:first-child) {
  background: #7f7f7f;
}
.RDList tr.selected {
  background: #7f7f7f;
}

</style>
