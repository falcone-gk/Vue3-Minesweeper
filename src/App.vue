<template>
  <MineSweeper v-if="currentPage == 'game'"/>
  <FormApp v-if="currentPage=='settings'" />
</template>

<script setup lang="ts">
import FormApp from './components/FormApp.vue';
import MineSweeper from './components/MineSweeper.vue';
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const currentPage = computed(() => store.getters.getCurrentPage)

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
</style>
