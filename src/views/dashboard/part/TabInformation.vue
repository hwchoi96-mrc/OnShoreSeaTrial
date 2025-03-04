<template>
  <v-card title="Tabs" subtitle="탭" class="card bg-card px-2 pt-2" min-height="410">
    <v-tabs v-model="tab" bg-color="appBar" align-tabs="center">
      <v-tab value="one">Button</v-tab>
      <v-tab value="two">Radio </v-tab>
      <v-tab value="three">CheckBoxes</v-tab>
      <!-- <v-tab value="four">DropDown</v-tab> -->
      <v-tab value="five">Inputbox</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one" class="text-center">
          <v-dialog width="500" :scrim="scrim">
            <template v-slot:activator="{ props }">
              <div class="d-flex justify-space-between w-75 align-center my-6">
                <v-btn class="bg-primary" v-bind="props" text="팝업 버튼"></v-btn>
                <v-btn class="bg-secondary" v-bind="props" text="팝업 버튼"></v-btn>
                <v-btn class="bg-secondary-1" v-bind="props" text="팝업 버튼"></v-btn>
                <v-btn class="bg-secondary-2" v-bind="props" text="팝업 버튼"></v-btn>
              </div>
            </template>
            <template v-slot:default="{ isActive }">
              <!-- <PopupModal :isActive="isActive"></PopupModal> -->
            </template>
          </v-dialog>
        </v-window-item>

        <v-window-item value="two">
          <v-radio-group class="text-center d-flex flex-row">
            <v-radio label="항목1" value="one" class="w-100"></v-radio>
            <v-radio label="항목2" value="two" class="w-100"></v-radio>
            <v-radio label="항목3" value="three" class="w-100"></v-radio>
          </v-radio-group>
        </v-window-item>

        <v-window-item value="three">
          <v-checkbox v-model="selected" label="항목1" value="one" hide-details></v-checkbox>
          <v-checkbox v-model="selected" label="항목2" value="two" hide-details></v-checkbox>
          <v-checkbox v-model="selected" label="항목3" value="three"></v-checkbox>
        </v-window-item>
        <!-- <v-window-item value="four">
          <div class="text-center">
            <v-menu open-on-hover>
              <template v-slot:activator="{ props }">
                <v-btn class="bg-btn" v-bind="props"> 드롭다운 </v-btn>
              </template>

              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-window-item> -->
        <v-window-item value="five" class="w-100">
          <div class="w-100 d-flex flex-column justify-center">
            <v-text-field
              class="mt-4"
              hide-details="auto"
              label=""
              placeholder="이름을 입력하세요"
              type="text"
            ></v-text-field>
            <v-text-field
              class="mt-4"
              hide-details="auto"
              label=""
              placeholder="이메일을 입력하세요"
              type="email"
            ></v-text-field>
            <input />
          </div>
        </v-window-item>
      </v-window>

      <!-- <v-window-item v-for="n in tabItem.len" :key="n" :value="n">
          <n></n>
          {{ n }}
        </v-window-item> -->
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
// import PopupModal from '@/components/PopupModal.vue'

const tab = ref()

const tabItem = reactive([
  {
    itemTitle: 'Button',
    component: ''
  }
])

const items = reactive([
  { title: '메뉴1' },
  { title: '메뉴2' },
  { title: '메뉴3' },
  { title: '메뉴4' }
])

const inline = ref(true)

const scrim = ref(false)
const vertical = ref(true)
const selected = ref([])
</script>

<style scope>
.v-slide-group__container {
  font-size: 0.8em;
}
</style>
