<template>
  <v-text-field
    class="pa-0"
    :prepend-inner-icon="props.prependInnerIcon"
    :append-icon="props.appendIcon"
    :append-inner-icon="props.appendInnerIcon"
    :bg-color="props.bgColor"
    :color="props.color"
    :disabled="props.disabled"
    :hide-details="hideDetails"
    :model-value="modelValue"
    :variant="props.variant"
    :width="props.width"
    :height="props.height"
    :density="density"
    :placeholder="props.placeholder"
    :type="props.type"
    @input="$emit('update:modelValue', $event.target.value)"
    @click:append-inner="$emit('click:appendInner', $event)"
    :maxlength="props.maxlength"
    :rules="rules"
  >
  </v-text-field>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const input = ref()

const rule = {
  required: (value) => {
    return !!value || '필수 입력 항목입니다'
  },
  email: (value) => {
    const nullRemovePattern = ref(/\s/g)
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let trimData = value.replace(nullRemovePattern, '')
    return pattern.test(trimData) || '이메일 주소가 유효하지 않습니다.'
  },
  password: (value) => {
    // 최소 8자,  숫자 및 특수 문자 1개 포함:
    const nullRemovePattern = ref(/\s/g)
    const pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=<>])[a-zA-Z\d!@#$%^&*()_+=<>~?]{8,}$/
    let trimData = value.replace(nullRemovePattern, '')

    let result = pattern.test(trimData) || '영문,숫자,특수문자를 조합하여 8자 이상 입력해주세요'
    return result
  },
  counter: (value) => value.length <= props.maxChar || `${props.maxChar}글자 이하 입력하세요`,
  min: (value) =>
    !(parseInt(value) < parseInt(props.min)) || `${props.min}보다 큰 값으로 입력하세요`
}

let rules = [(v) => !!v || '']
onMounted(() => {
  rules = []
  if (props.required) rules.push(rule.required)
  if (props.maxChar) rules.push(rule.counter)
  if (props.email) rules.push(rule.email)

  if (props.password) rules.push(rule.password)
  if (props.newPassword) rules.push(rule.password)
  if (props.min) rules.push(rule.min)
  input.value = props.modelValue
})

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  prependInnerIcon: {
    type: String,
    default: ''
  },
  appendInnerIcon: {
    type: String,
    default: ''
  },
  appendIcon: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: '#434348'
  },
  color: {
    type: String,
    default: '#7B908A'
  },
  width: {
    type: [String, Number],
    default: '40px'
  },
  height: {
    type: [String, Number],
    default: '40px'
  },
  density: {
    type: String,
    default: 'compact'
  },
  disabled: {
    type: Boolean
  },
  type: {
    type: [String, Number]
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'solo-filled'
  },
  hideDetails: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: false
  },
  password: {
    type: Boolean,
    default: false
  },
  newPassword: {
    type: Boolean,
    default: false
  },
  maxChar: {
    type: [String, Number]
  },
  email: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: [String, Number]
  },
  min: {
    type: [String, Number]
  }
})
defineEmits(['update:modelValue', 'click:appendInner'])
</script>

<style scope>
.v-field__input {
  font-size: 14px;
}
</style>
