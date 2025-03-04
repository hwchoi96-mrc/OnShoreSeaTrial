<template>
  <v-card width="55%">
    <v-row>
      <v-col>
        <v-img
          cover
          src="https://img.freepik.com/free-photo/large-luxurious-cruise-ship-sailing-sea-sunny-day-ai-generative_123827-23857.jpg"
        ></v-img>
      </v-col>
      <v-col class="align-self-center">
        <!-- <v-img
          src="https://www.logodesign.net/logo-new/circles-with-text-modern-design-9390ld.png"
          :width="100"
        ></v-img> -->

        <v-form validate-on="submit lazy">
          <div class="mb-4">이메일</div>
          <v-text-field variant="solo" v-model="user.email"></v-text-field>
          <div class="mb-4">비밀번호</div>
          <v-text-field variant="solo" v-model="user.password"></v-text-field>
          <div class="mb-4">이름</div>
          <v-text-field variant="solo" v-model="user.userName"></v-text-field>
          <div class="mb-4">연락처</div>
          <v-text-field variant="solo" v-model="user.phone"></v-text-field>
          <v-btn
            type="회원가입"
            @click="signup"
            block
            class="signUpBtn mt-2"
            text="회원가입"
          ></v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref } from "vue";

const user = ref({
  email: "",
  userName: "",
  passowrd: "",
  phone: "",
});

const signup = () => {
  alert("test");
};
</script>

<style scoped>
.v-field--variant-outlined {
  border: 1px solid red;
}

.signUpBtn {
  background-color: #003366;
  color: #fff;
}
</style>
