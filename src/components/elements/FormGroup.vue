<template>
  <div class="form-group">
    <label :for="props.name">{{ props.label }}:</label>
    <input
    class="form-control"
    type="number"
    :name="props.name"
    :value="digit"
    @input="handleChange"
    :disabled="isDisabled" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  label: string
  name: string
  digit: number
  isDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:digit', value: number): void
}>()

const handleChange = (event: Event): void => {
  const target: HTMLInputElement = event.target as HTMLInputElement
  const value: number = parseInt(target.value)
  emit('update:digit', value)
}
</script>

<style scoped>
.form-group {
  display: flex;
  margin: 4px 0;
}
.form-group label {
  flex: 1 1 auto;
}
.form-control {
  width: 50px;
}
</style>