<template>
  <div class="div-btn">
    <button class="update-btn" @click.prevent="event">
      {{ props.value }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  value: string
  event: () => void
}>()
</script>

<style scoped>
.div-btn {
  display: flex;
}
.update-btn {
  margin-left: auto;
  margin-right: auto;
  padding: .5em 40px;
  font-size: 15px;
}
</style>