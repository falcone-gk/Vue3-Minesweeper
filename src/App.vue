<template>
  <div class="title">
    <h1>Buscaminas 💣</h1>
  </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}
</style>
