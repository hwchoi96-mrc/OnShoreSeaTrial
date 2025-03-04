<template>
  <v-card title="UI Kit Design" class="card bg-card cardContainer h-100"> <!-- min-height="490" -->

    <v-card-text class="pa-0">
      <v-tabs v-model="tab" bg-color="" class="ml-2 color-container" slider-color="#4E83FF">
        <v-tab value="one">Field</v-tab>
        <v-tab value="two">Grid </v-tab>
        <v-tab value="three">Button</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="one" class="color-container">
          <div class="pa-3 ">

            <div>
              <div class="mb-2">Input Title</div>
              <v-text-field bg-color="#434348" placeholder="Input.." variant="solo" hide-details></v-text-field>
            </div>

            <div class="my-2">
              <div class="mb-2">Radio Button</div>
              <v-radio-group inline class="d-flex justify-between" hide-details>
                <v-radio label="button 01" value="one" color="#4E83FF"></v-radio>
                <v-radio label="button 02" value="two" color="#4E83FF"></v-radio>
                <v-radio label="button 03" value="three" color="#4E83FF"></v-radio>
                <v-radio label="button 04" value="four" color="#4E83FF"></v-radio>
              </v-radio-group>
            </div>

            <div>
              <div>Checkbox</div>
              <div class="d-flex d-inline-flex ga-1">
                <v-checkbox v-model="selected" label="Check 01" value="one" color="#4E83FF" hide-details></v-checkbox>
                <v-checkbox v-model="selected" label="Check 02" value="two" color="#4E83FF" hide-details></v-checkbox>
              </div>

            </div>
          </div>
        </v-window-item>
        <v-window-item value="two">
          <TableLayout></TableLayout>
        </v-window-item>

        <v-window-item value="three">
          <div class="pa-3">
            <div class="my-4">버튼</div>
            <div class="d-flex justify-space-between">
              <v-btn color="#4E83FF" class="mr-1" text="메인"></v-btn>

              <v-btn color="#000000" class="mr-1" text="서브"></v-btn>

              <v-btn color="#434348" class="mr-1" text="입력창"></v-btn>

              <v-btn color="#FEBD19" class="mr-1" text="경고"></v-btn>

              <v-btn color="#42D2A7" class="mr-1" text="성공"></v-btn>

              <v-btn color="#FD8100" class="mr-1" text="실패"></v-btn>
            </div>

            <div class="d-flex justify-space-between my-4">
              <v-btn color="#4E83FF" class="mr-1" text="메인" variant="outlined"></v-btn>

              <v-btn color="#000000" text="서브" variant="outlined"> </v-btn>

              <v-btn color="#434348" variant="outlined" class="mr-1" text="입력창"></v-btn>

              <v-btn color="#FEBD19" variant="outlined" class="mr-1" text="경고"></v-btn>

              <v-btn color="#42D2A7" variant="outlined" class="mr-1" text="성공"></v-btn>

              <v-btn color="#FD8100" variant="outlined" class="mr-1" text="실패"></v-btn>
            </div>

            <div class="d-flex justify-space-between my-4">
              <v-btn color="#4E83FF" class="mr-1" text="메인" rounded></v-btn>

              <v-btn color="#000000" text="서브" rounded> </v-btn>

              <v-btn color="#434348" class="mr-1" text="입력창" rounded></v-btn>

              <v-btn color="#FEBD19" class="mr-1" text="경고" rounded></v-btn>

              <v-btn color="#42D2A7" class="mr-1" text="성공" rounded></v-btn>

              <v-btn color="#FD8100" class="mr-1" text="실패" rounded></v-btn>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
// import PopupModal from '@/components/PopupModal.vue'
import TableLayout from '@/views/dashboard/part/TableLayout.vue'
import moment from 'moment'

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

const date = ref(moment.utc(new Date()).format('YYYY.MM.DD hh:mm'))

const updateTime = () => {
  const currentDate = new Date()
  date.value = moment.utc(currentDate).format('YYYY.MM.DD hh:mm')
}
</script>

<style scope>
.v-slide-group__container {
  font-size: 0.8em;
}

.v-tabs {
  border-bottom: 0.1px solid #585a61;
}

.v-tab {
  font-family: 'Pretendard';
}
</style>
