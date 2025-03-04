<template>
  <v-card class="card bg-card w-75 mx-auto ma-4">
    <v-tabs v-model="tab" bg-color="" class="ml-2" slider-color="#4E83FF" align-tabs="center">
      <v-tab value="one" class="mr-2">계정정보</v-tab>
      <v-tab value="two" class="ml-2">선사 관리자 등록 </v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="one">
          <v-container class="d-flex justify-center flex-column w-50">
            <v-row justify="center">
              <v-col class="text-left">아이디</v-col>
              <v-col>아이디</v-col>
            </v-row>

            <v-row>
              <v-col cols="3"> 비밀번호 </v-col>
              <v-col cols="9"><v-btn class="bg-btn">변경</v-btn></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">닉네임</v-col>
              <v-col cols="9">닉네임 <v-btn class="bg-btn ml-2">변경</v-btn></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">이메일</v-col>
              <v-col cols="9">이메일 <v-btn class="bg-btn ml-2">변경</v-btn></v-col>
            </v-row>
            <v-row>
              <v-col cols="3">활성화 상태</v-col>
              <v-col cols="9">
                <v-switch
                  class="justify-content"
                  color="#4E83FF"
                  :model-value="true"
                  readonly
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">계정 권한</v-col>
              <v-col cols="9">시스템 관리자</v-col>
            </v-row>
            <v-row>
              <v-col>test</v-col>
              <v-col>
                <v-switch
                  class="justify-content"
                  color="#4E83FF"
                  :model-value="true"
                  readonly
                  hide-details
                ></v-switch
              ></v-col>
            </v-row>
          </v-container>
          <!-- <v-table>
          <thead></thead>
          <tbody>
            <tr>
              <td>아이디</td>
              <td>아이디</td>
            </tr>
            <tr>
              <td>비밀번호</td>
              <td><v-btn class="bg-btn">변경</v-btn></td>
            </tr>
            <tr>
              <td>닉네임</td>
              <td>닉네임 <v-btn class="bg-btn">변경</v-btn></td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>이메일 <v-btn class="text-end bg-btn">변경</v-btn></td>
            </tr>
            <tr>
              <td>활성화 상태</td>
              <td>사용 가능</td>
            </tr>
            <tr>
              <td>계정 권한</td>
              <td>시스템 관리자</td>
            </tr>
          </tbody>
        </v-table> -->
        </v-window-item>

        <v-window-item value="two" class="text-center">
          <v-container>
            <v-row>
              <v-col cols="12" class="text-start pb-0">Input Title</v-col>
              <v-col cols="12">
                <v-text-field
                  bg-color="#434348"
                  placeholder="Input.."
                  variant="solo"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-start pb-0">Radio Button</v-col>
              <v-col cols="12">
                <v-radio-group inline class="d-flex justify-between" hide-details>
                  <v-radio label="button 01" value="one" color="#4E83FF"></v-radio>
                  <v-radio label="button 02" value="two" color="#4E83FF"></v-radio>
                  <v-radio label="button 03" value="three" color="#4E83FF"></v-radio>
                  <v-radio label="button 04" value="four" color="#4E83FF"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-start pb-0">Checkbox</v-col>
              <v-col cols="12" class="d-flex pt-0">
                <v-checkbox
                  class="d-flex"
                  v-model="selected"
                  label="Check 01"
                  value="one"
                  color="#4E83FF"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  class="d-flex"
                  v-model="selected"
                  label="Check 02"
                  value="two"
                  color="#4E83FF"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row no-gutters class="pt-1">
              <v-col class="text-left align-self-center">저장 시간 : {{ date }}</v-col>
              <v-col>
                <v-btn color="#5E616A" class="mr-1" text="초기화"></v-btn>
                <v-btn color="#4E83FF" class="ml-1" text="저장하기" @click="updateTime"></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>

        <v-window-item value="three" class="text-center">
          <v-container>
            <v-row>
              <v-col cols="12" class="text-start pb-0">Input Title</v-col>
              <v-col cols="12">
                <v-text-field
                  bg-color="#434348"
                  placeholder="Input.."
                  variant="solo"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-start pb-0">Radio Button</v-col>
              <v-col cols="12">
                <v-radio-group inline class="d-flex justify-between" hide-details>
                  <v-radio label="button 01" value="one" color="#4E83FF"></v-radio>
                  <v-radio label="button 02" value="two" color="#4E83FF"></v-radio>
                  <v-radio label="button 03" value="three" color="#4E83FF"></v-radio>
                  <v-radio label="button 04" value="four" color="#4E83FF"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-start pb-0">Checkbox</v-col>
              <v-col cols="12" class="d-flex pt-0">
                <v-checkbox
                  class="d-flex"
                  v-model="selected"
                  label="Check 01"
                  value="one"
                  color="#4E83FF"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  class="d-flex"
                  v-model="selected"
                  label="Check 02"
                  value="two"
                  color="#4E83FF"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col class="text-left align-self-center">저장 시간 : {{ date }}</v-col>
              <v-col>
                <v-btn color="#5E616A" class="mr-1" text="초기화"></v-btn>
                <v-btn color="#4E83FF" class="ml-1" text="저장하기" @click="updateTime"></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
const tab = ref(null)

const toggle = ref(['#4E83FF'])
</script>

<style></style>
