<template>
    <v-dialog :width="width" model-value="show">
        <v-card :color="color">
            <slot name="header">
                <!-- 닫기 버튼 -->
                <v-btn :color="closeIconColor" class="d-flex justify-end" variant="plain" append-icon="mdi-close"
                    @click="$emit('close')">
                </v-btn>
                <!-- 팝업 타이틀 -->
                <v-card-title v-if="title != ''" class="text-center font-weight-bold">
                    <slot name="title">{{ title }}</slot>
                </v-card-title>
            </slot>

            <!--팝업 내용 -->
            <v-card-text class="text-center font-weight-bold">
                <slot></slot>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <!-- 이벤트 버튼 -->
                <slot name="actions"> </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    color : {
        type : String,
        default : '#fff'
    },
    width : {
        type : [String, Number],
        default  : '350'
    },
    closeIconColor : {
        type : String,
        default : '#000'
    },
})

defineEmits(['close'])
</script>

<style></style>