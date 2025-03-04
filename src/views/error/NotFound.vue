<template>
    <v-container class="justify-center bg-background">
        <v-row class="d-flex justify-center ">
            <v-col cols="12" class="d-flex flex-column align-center">

                <v-img :src="pageNotFound" width="80px"></v-img>

            </v-col>
            <v-col cols="12" class=" d-flex flex-column align-center text-center info-text">페이지를 찾을 수 없습니다</v-col>
            <v-col cols="12" class="text-center"><i-btn href="/" text="사이트로 이동하기" width="160"
                    class="text-decoration-none">

                </i-btn></v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import pageNotFound from '/images/error/page-not-found.png'
</script>

<style>
.notfound {
    font-size: 18rem;
    letter-spacing: 10px;
    margin: 0px;
    font-weight: 700;
    text-shadow: 2px 2px 0px #c9c9c9, -2px -2px 0px #c9c9c9;
}

.info-text{
    font-size: 2rem;
}
</style>